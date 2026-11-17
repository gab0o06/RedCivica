-- reiniciar_demo.sql
-- Deja la demo lista para presentar. Ejecutar en el SQL Editor de Supabase
--
-- Resultado:
--   La Tola (1111...): En Votación, 199/200, sin votos ni pasos  -> el voto 200 dispara la ruta.
--   Feria   (2222...): En Gestión, 2 de 5 pasos, paso 3 en curso con un responsable.

delete from public.propuestas where titulo = 'PRUEBA';

delete from public.votos      where propuesta_id = '11111111-1111-1111-1111-111111111111';
delete from public.pasos_ruta where propuesta_id = '11111111-1111-1111-1111-111111111111';
update public.propuestas
set votos_actuales = 199, estado = 'En Votación'
where id = '11111111-1111-1111-1111-111111111111';

update public.pasos_ruta
set estado = 'Completado', asignado_a = null, evidencia_url = null, updated_at = now()
where propuesta_id = '22222222-2222-2222-2222-222222222222' and orden in (1, 2);

update public.pasos_ruta
set estado = 'Pendiente', asignado_a = null, evidencia_url = null, updated_at = now()
where propuesta_id = '22222222-2222-2222-2222-222222222222' and orden in (4, 5);

update public.pasos_ruta
set estado = 'En curso', asignado_a = 'e58acd84-7b4d-437c-b769-c4736490c13d', evidencia_url = null, updated_at = now()
where propuesta_id = '22222222-2222-2222-2222-222222222222' and orden = 3;

update public.propuestas
set estado = 'En Gestión', votos_actuales = 200
where id = '22222222-2222-2222-2222-222222222222';

-- ===== Verificación =====
select titulo, estado, votos_actuales, votos_meta
from public.propuestas
where id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');

select orden, estado, asignado_a
from public.pasos_ruta
where propuesta_id = '22222222-2222-2222-2222-222222222222'
order by orden;