-- datosDemo.sql
-- Datos de ejemplo para la demo. Se puede ejecutar más de una vez sin duplicar datos.
-- Para volver al estado inicial de la demo usa supabase/demo/reiniciar_demo.sql.

insert into public.propuestas
  (id, titulo, descripcion, barrio, categoria, estado, votos_actuales, votos_meta)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'Instalación de luminarias y bacheo en calle José Antepara (La Tola)',
    'Reposición de 6 luminarias LED apagadas y bacheo asfáltico en el tramo escolar.',
    'La Tola',
    'Infraestructura',
    'En Votación',
    199,
    200
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Feria de Microemprendedores en el Parque El Ejido',
    'Autorización municipal de espacio público para 25 emprendedores barriales los fines de semana.',
    'Mariscal / El Ejido',
    'Eventos',
    'En Gestión',
    200,
    200
  )
on conflict (id) do nothing;

insert into public.pasos_ruta (propuesta_id, orden, titulo, estado)
select v.propuesta_id::uuid, v.orden, v.titulo, v.estado
from (values
  ('22222222-2222-2222-2222-222222222222', 1, '1. Solicitar permiso municipal', 'Completado'),
  ('22222222-2222-2222-2222-222222222222', 2, '2. Diseñar croquis de puestos', 'Completado'),
  ('22222222-2222-2222-2222-222222222222', 3, '3. Planificar logística de la feria', 'En curso'),
  ('22222222-2222-2222-2222-222222222222', 4, '4. Coordinar limpieza comunitaria', 'Pendiente'),
  ('22222222-2222-2222-2222-222222222222', 5, '5. Convocar a vecinos y difusión', 'Pendiente')
) as v(propuesta_id, orden, titulo, estado)
where not exists (
  select 1 from public.pasos_ruta
  where propuesta_id = '22222222-2222-2222-2222-222222222222'::uuid
);
