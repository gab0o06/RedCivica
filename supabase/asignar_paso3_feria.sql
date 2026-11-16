-- Asignación del Paso 3 de la Feria de Microemprendedores a un perfil de usuario
-- Ejecutar en el SQL Editor de Supabase (donde auth.uid() es NULL y se ejecuta con permisos de mantenimiento)

UPDATE public.pasos_ruta
SET 
  asignado_a = 'e58acd84-7b4d-437c-b769-c4736490c13d', -- Perfil registrado ("prueba")
  estado = 'En curso',
  updated_at = now()
WHERE orden = 3
  AND propuesta_id = '22222222-2222-2222-2222-222222222222';

-- Verificación del cambio:
SELECT 
  p.titulo AS propuesta,
  pr.orden,
  pr.titulo AS paso,
  pr.estado,
  pr.asignado_a,
  perf.nombre AS responsable
FROM public.pasos_ruta pr
JOIN public.propuestas p ON p.id = pr.propuesta_id
LEFT JOIN public.perfiles perf ON perf.id = pr.asignado_a
WHERE pr.orden = 3 AND p.id = '22222222-2222-2222-2222-222222222222';
