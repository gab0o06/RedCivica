# Declaración de uso de IA generativa (EagleDev 2026, Art. 12)

- **Equipo:** Team Error404
- **IES:** Universidad de Las Américas (UDLA) · **Nivel:** Universidades · **Categoría:** Contemporáneo
- **Tutor:** Santiago Solorzano

## Herramientas usadas

| Herramienta | Para qué se usó |
| :--- | :--- |
| **Google Gemini** | Generar estilos con Tailwind CSS, resolución de redirecciones SPA en Netlify, generación del logo de *Red Cívica* y apoyo en la redacción de documentación. |
| **Claude (Anthropic)** | Revisión de calidad del código y de la estructura del proyecto, Auditoría de seguridad de las políticas RLS y de Storage, propuesta de *triggers* y políticas de endurecimiento en PostgreSQL (`supabase/migrations/seguridad.sql`), diseño de los casos de prueba y redacción del registro de resultados (`docs/pruebasSeguridad.md`) a partir de los resultados reales obtenidos por el equipo. |

## Qué partes del proyecto tuvieron apoyo de IA

- **Seguridad en Supabase:** auditados con IA y endurecidos, y el equipo los revisó y probó.
- **Documentación y entregables técnicos:** estructura del `README.md` y registro de pruebas.
- **Identidad visual y diseño de interfaz:** generación del logo de la aplicación y apoyo en las propuestas iniciales del diseño de las pantallas.
- **Estrategia y requerimientos:** apoyo en la redacción del enfoque de presentación a financiadores y de la lista de requerimientos funcionales y no funcionales.

## Cómo se verificó lo generado

- La auditoría de seguridad detectó fallos reales en la versión inicial: era posible escalar el rol a administrador, completar pasos de otros vecinos y manipular el estado y los votos de una propuesta al crearla. El equipo aplicó las correcciones y verificó cada una con pruebas documentadas.
- Se ejecutaron 11 pruebas funcionales y de seguridad (escalada de privilegios, manipulación de propuestas, voto duplicado, aislamiento de votos entre usuarios, pasos ajenos, evidencia inválida, validación de archivos, estados automáticos y registro de usuarios), con evidencia en `docs/pruebasSeguridad.md`.

## Otros recursos de terceros

React, Vite, Tailwind CSS, `@supabase/supabase-js` y `react-router-dom`, utilizados conforme a sus respectivas licencias de código abierto.

---

**Fecha:** 17 de noviembre de 2026
**Firmas:** Lukas Bustamante · Mateo Hidalgo · Sheldon López
