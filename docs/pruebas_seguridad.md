# Matriz de Pruebas de Seguridad y Validación (MVP) 🛡️

Esta matriz documenta las pruebas funcionales, de seguridad, control de acceso (RLS), concurrencia y validación implementadas en la plataforma **Red Cívica**. Sirve como evidencia formal de aseguramiento de calidad y mitigación de riesgos para el MVP.

---

## 📊 Tabla de Evidencias de Pruebas

| ID | Área / Módulo | Caso de Prueba | Vector de Riesgo / Vulnerabilidad | Control / Mecanismo de Mitigación | Resultado Esperado | Estado |
|---|---|---|---|---|---|:---:|
| **SEC-01** | **Votación Vecinal** | Intento de voto duplicado con el mismo usuario | Alteración de resultados por votos múltiples (*Sybil attack* simple). | Clave primaria compuesta `(usuario_id, propuesta_id)` en tabla `votos_propuestas` y bloqueo visual reactivo `yaVoto`. | Error de violación de clave única en BD si se evade la UI; se previene voto doble (1 Vecino = 1 Voto). | **PASADO** |
| **SEC-02** | **Votación Vecinal** | Intento de votación por usuario no autenticado | Votos anónimos no verificables de personas ajenas a la comunidad. | Verificación de sesión previa con `useAuth`. Redirección automática a `/auth` preservando ruta de retorno. | El visitante no autenticado es redirigido a `/auth` antes de emitir cualquier mutación. | **PASADO** |
| **SEC-03** | **Checklist / Rutas** | Dos vecinos reclaman el mismo paso al mismo tiempo (*Race condition*) | Sobrescritura de asignación y conflicto entre vecinos que gestionan la misma tarea. | Consulta atómica de actualización: `.update({ asignado_a: userId }).eq("id", pasoId).is("asignado_a", null)`. | Solo el primer reclamo se confirma; el segundo recibe error: *"Otro vecino acaba de reclamar este paso"*. | **PASADO** |
| **SEC-04** | **Checklist / Rutas** | Liberación de paso por un usuario no asignado | Un usuario malicioso intenta desasignar a otro vecino de su tarea. | Consulta condicionada: `.update({ asignado_a: null }).eq("id", pasoId).eq("asignado_a", usuarioId)`. | No surte efecto si el solicitante no es el dueño asignado de dicho paso. | **PASADO** |
| **SEC-05** | **Almacenamiento (Storage)** | Subida de archivos con extensiones ejecutables o peligrosas (`.exe`, `.sh`, `.html`) | Carga de malware, ejecución remota de código (RCE) o Cross-Site Scripting (XSS) almacenado. | Validación estricta de `MIME type` en frontend (`image/jpeg`, `image/png`, `image/webp`, `application/pdf`) y sanitización de nombre. | Rechazo inmediato con mensaje descriptivo si el archivo no coincide con los formatos permitidos. | **PASADO** |
| **SEC-06** | **Almacenamiento (Storage)** | Intento de subida de archivos de gran tamaño (> 5 MB) | Denegación de servicio (DoS) por agotamiento de almacenamiento o ancho de banda. | Validación de tamaño `archivo.size > TAMANO_MAXIMO_BYTES` (5 MB) antes de la llamada de red a Supabase. | Rechazo inmediato: *"El archivo supera el límite de 5 MB"*. | **PASADO** |
| **SEC-07** | **Almacenamiento (Storage)** | Detección y manejo de archivos huérfanos | Falla en BD tras subida exitosa a Storage que deja recursos sin referenciar en el bucket. | Manejo de excepción tras `uploadError` y notificación explícita de archivo huérfano con nombre limpio y ruta. | Se informa el fallo de sincronización indicando que el archivo quedó huérfano para trazabilidad del MVP. | **PASADO** |
| **SEC-08** | **Autenticación** | Falla de red o consulta en `cargarPerfil` | Pantalla en blanco o usuario autenticado sin estado ni notificación de error. | Captura de `error` en `AuthContext` y almacenamiento en `errorPerfil` para notificación visual. | Manejo controlado de excepción sin romper el ciclo de vida de React. | **PASADO** |
| **SEC-09** | **Rutas Protegidas** | Acceso directo por URL a `/propuestas/nueva` sin sesión | Creación de propuestas anónimas o sin creador válido (`creador_id` nulo). | `ProtectedRoute` intercepta el renderizado y redirige a `/auth` con estado `from: location`. | El acceso no autorizado es bloqueado en el cliente antes de montar el formulario. | **PASADO** |
| **SEC-10** | **Cálculo de Progreso** | Inyección de valores anómalos o división por cero en barras de porcentaje | Caída del renderizado de la UI por `NaN%` o desbordamiento visual `> 100%`. | Función pura `calcularPorcentajeProgreso` con validación de tipos, redondeo y clampeado estricto `[0, 100]`. | Cobertura automatizada al 100% en `test/progreso.test.js` con paso exitoso de todas las pruebas. | **PASADO** |
| **SEC-11** | **Autenticación (Sign Up)** | Intento de suplantación o manipulación de perfil en el registro | Inserción directa de roles elevados o datos manipulados desde el cliente hacia `perfiles`. | `signUp` delega la creación al trigger `handle_new_user()` vía `options.data`; la política RLS impide `INSERT` directo desde el cliente. | Perfil creado de manera segura con rol 'vecino' inalterable. | **PASADO** |
| **SEC-12** | **Checklist / Rutas** | Intento de completar o subir evidencia a un paso por un usuario ajeno | Un vecino marca como completado un paso asignado a otra persona o en estado incorrecto. | Cláusula estricta `.eq("id", pasoId).eq("asignado_a", usuarioId).eq("estado", "En curso")` en frontend y trigger `proteger_paso` en BD. | El formulario de evidencia solo se muestra al responsable asignado; peticiones ilegítimas son bloqueadas en frontend y rechazadas en BD. | **PASADO** |

---

## 🧪 Pruebas Unitarias Automatizadas

Las pruebas de cálculo de progreso y casos frontera se ejecutan nativamente con Node.js Test Runner:

```bash
npm test
```

### Salida de Ejecución:
```text
▶ calcularPorcentajeProgreso
  ✔ calcula correctamente el porcentaje exacto (0.65ms)
  ✔ redondea adecuadamente al entero más cercano (0.17ms)
  ✔ clampea al 100% cuando los valores superan la meta (0.11ms)
  ✔ retorna 0 para valores iniciales o cero (0.84ms)
  ✔ maneja con seguridad valores negativos o inválidos (0.15ms)
✔ calcularPorcentajeProgreso (2.89ms)

ℹ tests 5
ℹ suites 1
ℹ pass 5
ℹ fail 0
```
