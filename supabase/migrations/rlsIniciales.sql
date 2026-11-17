-- rlsIniciales.sql
-- VERSION INICIAL (antes de la auditoría de seguridad).
-- Solo para instalar una base NUEVA, en este orden: tablas.sql -> rlsIniciales.sql -> seguridad.sql.
-- NO ejecutar sobre la base actual: restauraría las funciones y políticas vulnerables
-- que seguridad.sql reemplaza (votos públicos, perfiles con rol
-- editable, pasos modificables por cualquier usuario).

create or replace function public.procesar_nuevo_voto()
returns trigger as $$
declare
  total_votos int;
  meta_votos int;
  estado_actual text;
begin
  update public.propuestas
  set votos_actuales = votos_actuales + 1
  where id = new.propuesta_id
  returning votos_actuales, votos_meta, estado
  into total_votos, meta_votos, estado_actual;

  if total_votos >= meta_votos and estado_actual = 'En Votación' then
    update public.propuestas
    set estado = 'En Gestión'
    where id = new.propuesta_id;

    insert into public.pasos_ruta (propuesta_id, orden, titulo, estado)
    values
      (new.propuesta_id, 1, '1. Reunir firmas y respaldo fotográfico del sector', 'Pendiente'),
      (new.propuesta_id, 2, '2. Ingresar solicitud formal por ventanilla digital', 'Pendiente'),
      (new.propuesta_id, 3, '3. Verificar inspección técnica y cierre de obra', 'Pendiente');
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_voto_inserted
  after insert on public.votos
  for each row execute function public.procesar_nuevo_voto();

create or replace function public.verificar_completitud_ruta()
returns trigger as $$
declare
  pasos_pendientes int;
begin
  select count(*) into pasos_pendientes
  from public.pasos_ruta
  where propuesta_id = new.propuesta_id and estado <> 'Completado';

  if pasos_pendientes = 0 then
    update public.propuestas
    set estado = 'Completada'
    where id = new.propuesta_id;
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_paso_updated
  after update of estado on public.pasos_ruta
  for each row execute function public.verificar_completitud_ruta();

alter table public.perfiles enable row level security;
alter table public.propuestas enable row level security;
alter table public.votos enable row level security;
alter table public.pasos_ruta enable row level security;

create policy "Lectura publica perfiles" on public.perfiles for select using (true);
create policy "Usuario crea su perfil" on public.perfiles for insert with check (auth.uid() = id);
create policy "Usuario edita su perfil" on public.perfiles for update using (auth.uid() = id);

create policy "Lectura publica propuestas" on public.propuestas for select using (true);
create policy "Vecinos crean propuestas" on public.propuestas for insert with check (auth.role() = 'authenticated');

create policy "Lectura publica votos" on public.votos for select using (true);
create policy "Vecino emite su propio voto" on public.votos for insert with check (auth.uid() = usuario_id);

create policy "Lectura publica pasos" on public.pasos_ruta for select using (true);
create policy "Vecino reclama o actualiza pasos" on public.pasos_ruta for update using (auth.role() = 'authenticated');

create policy "Vecinos autenticados suben evidencias"
on storage.objects for insert
to authenticated
with check (bucket_id = 'evidencias');

create policy "Lectura publica de evidencias"
on storage.objects for select
to public
using (bucket_id = 'evidencias');