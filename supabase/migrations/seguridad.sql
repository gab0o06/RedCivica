-- 04_endurecimiento_seguridad.sql
-- Ejecutar en el SQL Editor de Supabase DESPUES de tus triggers y políticas actuales.
-- Es re-ejecutable. Aplicar junto con el cambio de signUp en AuthContext.jsx.
-- Nota: auth.uid() es NULL cuando se ejecuta desde el SQL Editor (seed y reset de demo
-- siguen funcionando); las reglas solo aplican a usuarios de la app.

-- =========================================================
-- 1. PERFILES: se crean por trigger y el rol no se puede cambiar
-- =========================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfiles (id, nombre, barrio, rol)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data->>'nombre'), ''), 'Vecino'),
    coalesce(nullif(trim(new.raw_user_meta_data->>'barrio'), ''), 'Sin sector'),
    'vecino'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- El cliente ya no inserta perfiles
drop policy if exists "Usuario crea su perfil" on public.perfiles;

drop policy if exists "Usuario edita su perfil" on public.perfiles;
create policy "Usuario edita su perfil" on public.perfiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create or replace function public.proteger_rol()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if auth.uid() is not null and new.rol is distinct from old.rol then
    raise exception 'No puedes cambiar tu rol';
  end if;
  return new;
end;
$$;

drop trigger if exists proteger_rol_perfil on public.perfiles;
create trigger proteger_rol_perfil
  before update on public.perfiles
  for each row execute function public.proteger_rol();

-- =========================================================
-- 2. PROPUESTAS: el servidor fija estado, votos y creador
-- =========================================================
create or replace function public.forzar_valores_propuesta()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if auth.uid() is not null then
    new.creador_id := auth.uid();
    new.estado := 'En Votación';
    new.votos_actuales := 0;
    new.votos_meta := 200;
  end if;
  return new;
end;
$$;

drop trigger if exists forzar_valores_propuesta on public.propuestas;
create trigger forzar_valores_propuesta
  before insert on public.propuestas
  for each row execute function public.forzar_valores_propuesta();

-- =========================================================
-- 3. VOTOS: privados y solo en propuestas "En Votación"
-- =========================================================
drop policy if exists "Lectura publica votos" on public.votos;
drop policy if exists "Ver mis votos" on public.votos;
create policy "Ver mis votos" on public.votos
  for select using (auth.uid() = usuario_id);

drop policy if exists "Vecino emite su propio voto" on public.votos;
create policy "Vecino emite su propio voto" on public.votos
  for insert with check (
    auth.uid() = usuario_id
    and exists (
      select 1 from public.propuestas p
      where p.id = propuesta_id and p.estado = 'En Votación'
    )
  );

create or replace function public.procesar_nuevo_voto()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  total int;
  meta int;
begin
  update public.propuestas
  set votos_actuales = votos_actuales + 1
  where id = new.propuesta_id and estado = 'En Votación'
  returning votos_actuales, votos_meta into total, meta;

  if not found then
    raise exception 'Esta propuesta ya no está en votación';
  end if;

  if total >= meta then
    update public.propuestas set estado = 'En Gestión' where id = new.propuesta_id;

    insert into public.pasos_ruta (propuesta_id, orden, titulo, estado)
    values
      (new.propuesta_id, 1, '1. Reunir firmas y respaldo fotográfico del sector', 'Pendiente'),
      (new.propuesta_id, 2, '2. Ingresar solicitud formal por ventanilla digital', 'Pendiente'),
      (new.propuesta_id, 3, '3. Verificar inspección técnica y cierre de obra', 'Pendiente');
  end if;

  return new;
end;
$$;

-- =========================================================
-- 4. PASOS DE LA RUTA: transiciones válidas y dueño del paso
-- =========================================================
create unique index if not exists pasos_unico_orden
  on public.pasos_ruta (propuesta_id, orden);

drop policy if exists "Vecino reclama o actualiza pasos" on public.pasos_ruta;
create policy "Vecino reclama o actualiza pasos" on public.pasos_ruta
  for update
  using (auth.uid() is not null and (asignado_a is null or asignado_a = auth.uid()))
  with check (asignado_a is null or asignado_a = auth.uid());

create or replace function public.proteger_paso()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if auth.uid() is null then
    return new;  -- SQL Editor / mantenimiento
  end if;

  if new.propuesta_id <> old.propuesta_id
     or new.orden <> old.orden
     or new.titulo <> old.titulo then
    raise exception 'No se puede modificar la definición del paso';
  end if;

  if old.estado = 'Pendiente' and new.estado = 'En curso' then
    if old.asignado_a is not null or new.asignado_a is distinct from auth.uid() then
      raise exception 'No puedes reclamar este paso';
    end if;

  elsif old.estado = 'En curso' and new.estado = 'Pendiente' then
    if old.asignado_a is distinct from auth.uid() or new.asignado_a is not null then
      raise exception 'Solo el responsable puede liberar el paso';
    end if;

  elsif old.estado = 'En curso' and new.estado = 'Completado' then
    if old.asignado_a is distinct from auth.uid()
       or new.asignado_a is distinct from auth.uid() then
      raise exception 'Solo el responsable puede completar el paso';
    end if;
    if new.evidencia_url is null
       or new.evidencia_url not like '%/storage/v1/object/public/evidencias/%' then
      raise exception 'Falta una evidencia válida';
    end if;

  else
    raise exception 'Transición de estado no permitida';
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists proteger_paso on public.pasos_ruta;
create trigger proteger_paso
  before update on public.pasos_ruta
  for each row execute function public.proteger_paso();

create or replace function public.verificar_completitud_ruta()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  pendientes int;
begin
  select count(*) into pendientes
  from public.pasos_ruta
  where propuesta_id = new.propuesta_id and estado <> 'Completado';

  if pendientes = 0 then
    update public.propuestas
    set estado = 'Completada'
    where id = new.propuesta_id and estado = 'En Gestión';
  end if;

  return new;
end;
$$;

-- =========================================================
-- 5. STORAGE: límites a nivel de bucket (no dependen del cliente)
-- =========================================================
update storage.buckets
set file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
where id = 'evidencias';