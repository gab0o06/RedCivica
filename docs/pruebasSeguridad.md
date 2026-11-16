# Pruebas de seguridad y validación: Red Cívica

- **Fecha:** 15 de noviembre de 2026
- **Entorno:** `localhost` (Vite dev) y versión desplegada, conectados al proyecto Supabase de producción
- **Cuentas:** A (`00e98286-…`, rol vecino), B (`a74d3648-…`) y "prueba" (`e58acd84-…`)
- **Método:** llamadas directas al cliente de Supabase desde la consola del navegador, con sesión de usuario normal (sin `service_role`), más pruebas de flujo desde la interfaz

## Resultados

| # | Prueba | Esperado | Resultado real | Estado |
|---|---|---|---|---|
| 1 | Un vecino intenta subirse el rol a `admin` | Error "No puedes cambiar tu rol" | HTTP 400, código `P0001`, mensaje "No puedes cambiar tu rol" | ✅ |
| 2 | Crear propuesta forzando `estado: "Completada"`, `votos_actuales: 500`, `votos_meta: 1` | El servidor ignora esos valores | Se creó con `estado: "En Votación"`, `votos_actuales: 0`, `votos_meta: 200` y `creador_id` igual al usuario autenticado | ✅ |
| 3 | Voto doble en la misma propuesta | Segundo voto rechazado (`23505`) | La cuenta A ya tenía un voto en la propuesta de prueba. Dos intentos adicionales fueron rechazados con HTTP 409, código `23505`, "duplicate key value violates unique constraint voto_unico_por_usuario" | ✅ |
| 4 | Votar una propuesta que está "En Gestión" (Feria de Microemprendedores) | Rechazo por política RLS | HTTP 403, código `42501`, "new row violates row-level security policy for table votos" | ✅ |
| 5 | Leer votos de otros usuarios | Solo se ven los propios | La tabla `votos` contiene 4 filas (consulta desde el SQL Editor, con votos de A, B y "prueba"). La cuenta A, consultando `votos` desde la aplicación, recibió solo sus 2 votos, sin los de B ni los de "prueba" | ✅ |
| 6 | La cuenta A intenta completar el paso 4 de la Feria, asignado a la cuenta B | Rechazo | HTTP 200 con arreglo vacío: 0 filas modificadas, la política RLS no deja ver ni modificar el paso ajeno | ✅ |
| 7 | La cuenta A, responsable de un paso, lo completa con una URL externa como evidencia | Error "Falta una evidencia válida" | HTTP 400, código `P0001`, mensaje "Falta una evidencia válida" | ✅ |
| 8 | Subir archivo `.exe` y archivo de más de 5 MB al bucket `evidencias` | Rechazo por tipo y tamaño | `.exe`: HTTP 400, `InvalidMimeType` (415). PDF de 6 MB: HTTP 400, `EntityTooLarge` (413) | ✅ |
| 9 | Alcanzar el umbral de votos en La Tola (199 → 200) | La propuesta pasa a "En Gestión" y se crean 3 pasos | Tras el voto 200 existen los 3 pasos de la ruta (consulta a `pasos_ruta`), creados por el trigger | ✅ |
| 10 | Completar todos los pasos de una ruta | La propuesta pasa a "Completada" | En la Feria de Microemprendedores, con los 5 pasos completados (3 con evidencia subida desde la interfaz por distintos usuarios), la propuesta aparece como "Obra / Trámite Completado", progreso 5 de 5 (100 %) | ✅ |
| 11 | Registro de un usuario nuevo | Perfil creado automáticamente con rol `vecino` | Perfil creado con rol `vecino` en la tabla `perfiles` | ✅ |

## Notas
- **Prueba 3:** la restricción única es de la base de datos (`voto_unico_por_usuario`), no del frontend.
- **Prueba 5:** la comparación entre el SQL Editor (ve todo) y la sesión de usuario (ve solo lo propio) demuestra que la política RLS filtra los votos ajenos.
- **Prueba 4:** además del intento sobre la Feria, un intento sobre La Tola (ya "En Gestión" tras alcanzar la meta) también fue rechazado con `42501`.
- **Prueba 6:** el paso 4 estaba asignado a la cuenta B. El resultado vacío significa que la base de datos no permitió a la cuenta A tocar esa fila.
- **Prueba 7:** el mensaje demuestra que las validaciones previas del trigger (el paso estaba "En curso" y era de la cuenta A) se cumplieron y solo falló la de la evidencia.
- **Prueba 8:** la restricción se aplica en el bucket, por lo que no depende de la validación del navegador.
- **Prueba 10:** el cambio a "Completada" lo hace un trigger de la base de datos, no el frontend.

## Limitaciones conocidas
- El voto no valida que el usuario pertenezca al sector de la propuesta. Mejora prevista: sectores validados y verificación por un administrador.
- Los perfiles (nombre y barrio) son de lectura pública, porque la ruta muestra al responsable de cada paso.
- Las evidencias se almacenan en un bucket de lectura pública.