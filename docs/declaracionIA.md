# Declaración de uso de IA generativa (EagleDev 2026, Art. 12)

- **Equipo:** Team Error404
- **IES:** Universidad de Las Américas (UDLA) · **Nivel:** Universidades · **Categoría:** Contemporáneo
- **Tutor:** Santiago Solorzano

## Herramientas usadas

| Herramienta | Para qué se usó |
| :--- | :--- |
| **Google Gemini** | Generación de componentes UI en React + Tailwind CSS, generación del logo de *Red Cívica*, generación de los diagramas en Mermaid y apoyo en la redacción de documentación. |
| **Claude (Anthropic)** | Recomendación de estructura de carpetas, revisión de calidad del código, guía de requerimientos, auditoría de seguridad de las políticas RLS y de Storage, propuesta de *triggers* y políticas de endurecimiento en PostgreSQL (`supabase/migrations/04_endurecimiento_seguridad.sql`), redacción del registro de resultados (`docs/pruebasSeguridad.md`) a partir de los resultados reales obtenidos por el equipo. |

## Qué partes del proyecto tuvieron apoyo de IA

- **Esquema SQL y seguridad en Supabase:** *triggers* de transición automática de estados y políticas de *Row Level Security* (RLS) y Storage. Posteriormente fueron auditados con IA y endurecidos, y el equipo los revisó y probó.
- **Componentes y servicios frontend:** estructura base de vistas (`HomePage`, `PropuestaDetallePage`, `CrearPropuestaPage`, `Auth`), contexto de autenticación (`AuthContext`) y capa de servicios (`propuestasService`, `votosService`, `rutasService`), y su refactorización en componentes reutilizables y constantes.
- **Documentación y entregables técnicos:** estructura del `README.md`, diagramas de arquitectura y modelo de datos, registro de pruebas y esta declaración.
- **Identidad visual y diseño de interfaz:** generación del logo de la aplicación.
- **Estrategia y requerimientos:** apoyo en la redacción de la lista de requerimientos funcionales y no funcionales.

## Qué partes son obra propia del equipo

- **Conceptualización y enfoque cívico:** identificación de la brecha burocrática barrial, alineación con la Meta 10.2 de los ODS y diseño del flujo central *"1 Vecino = 1 Voto → Desbloqueo de Ruta de Acción Colaborativa"*.
- **Diseño funcional y contexto local:** definición de criterios de accesibilidad (alto contraste y tipografía legible), escenarios reales de Quito (La Tola, Parque El Ejido) y reglas de negocio para votación única y asignación de tareas.
- **Integración, despliegue y validación:** configuración de Supabase (Auth, PostgreSQL, Storage), despliegue en producción en Netlify (`netlify.toml`), ejecución de las pruebas de seguridad con múltiples cuentas y verificación integral de cada módulo.

## Cómo se verificó lo generado

- Todo el código fue leído, comprendido, ejecutado y depurado por los integrantes del equipo.
- La auditoría de seguridad detectó fallos reales en la versión inicial generada con IA: era posible escalar el rol a administrador, completar pasos de otros vecinos y manipular el estado y los votos de una propuesta al crearla. El equipo aplicó las correcciones y verificó cada una con pruebas documentadas.
- Se ejecutaron 11 pruebas funcionales y de seguridad (escalada de privilegios, manipulación de propuestas, voto duplicado, aislamiento de votos entre usuarios, pasos ajenos, evidencia inválida, validación de archivos, estados automáticos y registro de usuarios), con evidencia en `docs/pruebasSeguridad.md`.

## Otros recursos de terceros

React, Vite, Tailwind CSS, `@supabase/supabase-js` y `react-router-dom`, utilizados conforme a sus respectivas licencias de código abierto.

---

**Fecha:** 15 de noviembre de 2026
**Firmas:** Lukas Bustamante · Mateo Hidalgo · Sheldon López