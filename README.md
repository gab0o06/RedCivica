<div align="center">
  <img src="./public/logo.jpeg" alt="Logo Red Cívica" width="115" />
  <h1>🏙️ Red Cívica</h1>
  <p><strong>Donde la organización vecinal se convierte en obras y soluciones.</strong></p>
  <p>Plataforma web <em>mobile-first</em> de participación ciudadana y tecnología cívica (CivicTech) desarrollada para los barrios de Quito, Ecuador, alineada con el <strong>ODS 10 (Meta 10.2: Inclusión social, económica y política)</strong>.</p>

  <p>
    <a href="https://redcivica.netlify.app"><img src="https://img.shields.io/badge/Demo_en_vivo-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Demo en vivo" /></a>
    <img src="https://img.shields.io/badge/React_19-Vite_8-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
    <img src="https://img.shields.io/badge/Supabase-PostgreSQL_RLS-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/ODS_10.2-Inclusión_Cívica-DD1367?style=for-the-badge" alt="ODS 10.2" />
  </p>
</div>

> **🏆 EagleDev 2026 · Categoría Contemporáneo · Nivel Universidades**  
> **Equipo:** Team Error404 (Lukas Bustamante, Mateo Hidalgo, Sheldon López) · **IES:** Universidad de Las Américas (UDLA) · **Tutor:** Santiago Solórzano  
> **Documentación:** [Declaración de uso de IA](docs/declaracionIA.md) · [Pruebas de seguridad](docs/pruebasSeguridad.md) · [Arquitectura](#stack-y-arquitectura) · [Base de datos](#base-de-datos-y-almacenamiento)

---

## 📋 Contenido

- [📋 Contenido](#-contenido)
- [🎯 Problema y ODS](#-problema-y-ods)
- [✨ Características Principales](#-características-principales)
- [🔄 Flujo de Usuario ("De la queja a la obra")](#-flujo-de-usuario-de-la-queja-a-la-obra)
- [📱 Capturas y Demo en Movimiento](#-capturas-y-demo-en-movimiento)
  - [Flujo de Activación Automática ("La Compuerta" a los 200 votos)](#flujo-de-activación-automática-la-compuerta-a-los-200-votos)
  - [Vistas Principales (Mobile-First)](#vistas-principales-mobile-first)
- [💼 Modelo de Negocio e Impacto Territorial](#-modelo-de-negocio-e-impacto-territorial)
- [🛠️ Stack y Arquitectura](#️-stack-y-arquitectura)

---

<a id="problema-y-ods"></a>
## 🎯 Problema y ODS

Los barrios de Quito saben exactamente qué necesitan (luminarias, bacheo, seguridad, mantenimiento de espacios públicos), pero muchas veces sus reclamos mueren en chats de WhatsApp o son rechazados en ventanillas municipales por errores de forma y falta de guía técnica. Pagan el costo las comunidades con menos recursos y menor acceso a asesoría.

**Red Cívica** conecta dos mundos hoy separados: la **organización vecinal** y la **gestión municipal**. El proyecto se alinea directamente con el **ODS 10 (Reducción de las desigualdades), Meta 10.2**: promover la inclusión social, económica y política de todas las personas.

---

<a id="características-principales"></a>
## ✨ Características Principales

- **Democracia Barrial (`1 Vecino = 1 Voto`):** El voto único está garantizado a nivel de motor de base de datos mediante una restricción `UNIQUE (usuario_id, propuesta_id)` y bloqueo de votos fuera de fase.
- **La Compuerta (Triggers Automáticos):** Transiciones de estado (`En Votación` → `En Gestión` → `Completada`) gobernadas íntegramente por triggers en PostgreSQL al alcanzar la meta de 200 votos.
- **Ruta de Acción Colaborativa:** Al desbloquearse la gestión, se genera una guía de 3 pasos redactados en lenguaje sencillo de barrio. Los vecinos reclaman pasos de forma atómica (evitando colisiones de concurrencia) y suben evidencia verificable (fotos o PDFs de hasta 5 MB).
- **Progreso Calculado en Tiempo Real:** El porcentaje de avance se computa dinámicamente a partir de los pasos completados, evitando inconsistencias de estado.
- **Perfil Barrial Automatizado:** Cada vecino se registra asociado a su sector; el perfil se crea automáticamente mediante un trigger (`SECURITY DEFINER`) al registrarse.
- **Exploración y Diseño Mobile-First:** Filtros por estado, búsqueda por barrio o palabra clave, tipografía legible y alto contraste pensado para uso desde el celular en territorio.

---

<a id="flujo-de-usuario-de-la-queja-a-la-obra"></a>
## 🔄 Flujo de Usuario ("De la queja a la obra")

1. **Registro Barrial:** El vecino crea su cuenta vinculada a su sector de Quito.
2. **Propuesta:** Publica una mejora para su barrio (nace en estado `En Votación`).
3. **Votación:** Los vecinos respaldan la iniciativa (`1 vecino = 1 voto`). Al llegar a **200 votos**, un trigger cambia el estado a `En Gestión` y desbloquea la **Ruta de Acción**.
4. **Ejecución Colaborativa:** Los vecinos reclaman pasos disponibles, realizan la gestión correspondiente y adjuntan evidencia verificable.
5. **Obra Completada:** Cuando todos los pasos cuentan con evidencia válida y están marcados como completados, la propuesta pasa automáticamente a `Completada`.

---

<a id="capturas-y-demo-en-movimiento"></a>
## 📱 Capturas y Demo en Movimiento

### Flujo de Activación Automática ("La Compuerta" a los 200 votos)

<div align="center">
  <img src="./assets/demo-compuerta.gif" width="280" alt="Demo del trigger automático al alcanzar 200 votos y desbloqueo de ruta de acción" />
  <p><em>Transición automática de <code>En Votación</code> a <code>En Gestión</code> mediante trigger en PostgreSQL y reclamo de paso colaborativo.</em></p>
</div>

### Vistas Principales (Mobile-First)

| Exploración y Filtros | Votación (1 Vecino = 1 Voto) | Ruta de Acción y Evidencia |
| :---: | :---: | :---: |
| <img src="./assets/screen-home.jpeg" width="230" alt="Feed de propuestas" /> | <img src="./assets/screen-voto.jpeg" width="230" alt="Detalle de propuesta y votación" /> | <img src="./assets/screen-ruta.jpeg" width="230" alt="Ruta de acción colaborativa" /> |

---

<a id="modelo-de-negocio-e-impacto-territorial"></a>
## 💼 Modelo de Negocio e Impacto Territorial

Red Cívica opera bajo un modelo híbrido **Freemium + B2B** diseñado para garantizar acceso universal al ciudadano y sostenibilidad financiera a mediano plazo:

| Segmento | Plan | Propuesta de Valor |
| :--- | :--- | :--- |
| **Ciudadanos** | **Gratuito ($0)** | Proponer mejoras, votar y colaborar en rutas de acción sin barreras económicas. |
| **Dirigentes y Comités** | **Premium ($5,99/mes o $59,90/año)** | Guías legales detalladas y plantillas de oficios listas para ingresar (ahorro frente a asesorías externas de $15–$40). |
| **Municipios y ONG** | **Licencias B2B** | Analítica territorial y trazabilidad de necesidades priorizadas por sector. |

- **Validación Financiera (Proyección a 12 meses):** Costo operativo fijo estimado de ~$272,50 a $322,50/mes, punto de equilibrio en **59 comités suscritos** y flujo de caja positivo a partir del **mes 9**.
- **Piloto Territorial:** Inversión semilla proyectada de $3.700 USD para un piloto inicial de 12 meses en **3 barrios de Quito (La Tola, Mariscal y La Floresta)**, escalable a 12 sectores.

---

<a id="stack-y-arquitectura"></a>
## 🛠️ Stack y Arquitectura

| Capa | Tecnología |
| :--- | :--- |
| **Frontend** | [React 19](https://react.dev/) + [Vite 8](https://vite.dev/) |
| **Estilos** | [Tailwind CSS v4](https://tailwindcss.com/) (Mobile-First) |
| **Enrutamiento** | [React Router DOM v7](https://reactrouter.com/) (Code-splitting con `React.lazy`) |
| **Backend (BaaS)** | [Supabase](https://supabase.com/) (Auth, PostgreSQL con RLS y Triggers, Storage) |
| **Despliegue** | [Netlify](https://www.netlify.com/) (Rewrites SPA en `netlify.toml`) |
| **Calidad** | ESLint 10 (React Hooks, React Compiler, Fast Refresh) y `node --test` |

Las vistas nunca consultan directamente a Supabase: toda comunicación pasa por una **capa de servicios desacoplada**. Las reglas críticas de negocio y seguridad viven en **PostgreSQL**, aplicando una arquitectura **Zero-Trust** en el cliente.

```mermaid
flowchart TB
    subgraph Cliente["Frontend (React 19 + Vite 8 + Tailwind CSS v4)"]
        UI["Páginas UI<br/>(Home, PropuestaDetalle, CrearPropuesta, Auth)"]
        Ctx["AuthContext y useAuth<br/>(sesión y perfil barrial)"]
        Srv["Capa de servicios<br/>(propuestas, votos, rutas)"]
        UI --> Ctx
        UI --> Srv
    end

    Netlify["Netlify<br/>(rewrites SPA en netlify.