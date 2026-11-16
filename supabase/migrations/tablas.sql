-- 01_tablas.sql  (esquema en snake_case, el que usa el frontend y los triggers)
-- Verifica contra tu base real antes de subirlo al repo.

create table if not exists public.perfiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  barrio text not null,
  rol text not null default 'vecino' check (rol in ('vecino', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.propuestas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text not null,
  barrio text not null,
  categoria text not null default 'Infraestructura',
  estado text not null default 'En Votación'
    check (estado in ('En Votación', 'En Gestión', 'Completada')),
  votos_actuales int not null default 0 check (votos_actuales >= 0),
  votos_meta int not null default 200 check (votos_meta > 0),
  creador_id uuid references public.perfiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.votos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  propuesta_id uuid not null references public.propuestas(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint voto_unico_usuario unique (usuario_id, propuesta_id)
);

create table if not exists public.pasos_ruta (
  id uuid primary key default gen_random_uuid(),
  propuesta_id uuid not null references public.propuestas(id) on delete cascade,
  orden int not null,
  titulo text not null,
  estado text not null default 'Pendiente'
    check (estado in ('Pendiente', 'En curso', 'Completado')),
  asignado_a uuid references public.perfiles(id) on delete set null,
  evidencia_url text,
  updated_at timestamptz not null default now()
);

create index if not exists idx_votos_propuesta on public.votos(propuesta_id);
create index if not exists idx_pasos_propuesta on public.pasos_ruta(propuesta_id);
