# Red Cívica 🏙️

> **Plataforma de Organización y Acción Vecinal en Barrios de Quito**  
> Convierte las necesidades de la comunidad en obras y soluciones tangibles mediante votación democrática, desbloqueo de rutas de gestión ciudadana y checklists colaborativos con evidencia fotográfica y documental.

---

## 📋 Tabla de Contenidos

1. [Descripción General](#-descripción-general)
2. [Características Principales](#-características-principales)
3. [Stack Tecnológico](#-stack-tecnológico)
4. [Estructura del Proyecto](#-estructura-del-proyecto)
5. [Instalación y Configuración](#-instalación-y-configuración)
6. [Variables de Entorno](#-variables-de-entorno)
7. [Base de Datos y Almacenamiento (Supabase)](#-base-de-datos-y-almacenamiento-supabase)
8. [Flujo de Usuario](#-flujo-de-usuario)
9. [Buenas Prácticas y Criterios de Mantenibilidad](#-buenas-prácticas-y-criterios-de-mantenibilidad)

---

## 🌟 Descripción General

**Red Cívica** es una plataforma web desarrollada para fomentar la participación ciudadana en los barrios de Quito (como La Tola, La Floresta, Mariscal/El Ejido, Chimbacalle, Quitumbe, Carcelén, Cotocollao y San Roque). 

Permite que cualquier vecino proponga una mejora comunitaria en áreas como Infraestructura, Seguridad, Movilidad o Eventos. Cuando la comunidad apoya la causa alcanzando la meta de firmas/votos (*"1 Vecino = 1 Voto"*), la propuesta pasa de **En Votación** a **En Gestión**, desbloqueando una **Ruta de Acción Colaborativa**. Mediante un checklist público, los vecinos pueden autoasignarse tareas, ejecutar gestiones ante las autoridades y subir evidencia verificable (fotos o PDFs) hasta que la obra sea **Completada**.

---

## ✨ Características Principales

- **Democracia Barrial (1 Vecino = 1 Voto):** Control de votaciones para evitar duplicidad de votos por usuario.
- **Transición Dinámica de Estados:**
  - `En Votación`: Fase inicial para reunir el apoyo comunitario necesario.
  - `En Gestión`: Ruta de acción desbloqueada con checklist de pasos secuenciales o paralelos.
  - `Completada`: Obra o trámite finalizado con registro histórico y evidencia pública.
- **Ruta de Acción Colaborativa (Checklist Vecinal):**
  - Reclamo atómico de pasos para evitar colisiones entre vecinos.
  - Posibilidad de liberar pasos asignados si el voluntario no puede completarlos.
  - Carga de evidencias fotográficas o comprobantes PDF (máx. 5 MB) almacenados en Supabase Storage.
- **Filtrado y Búsqueda en Tiempo Real:** Filtros por estado de propuesta y búsqueda por nombre de barrio o palabras clave del proyecto.
- **Autenticación con Perfil Barrial:** Registro seguro asociando a cada vecino a su sector de residencia.

---

## 🛠️ Stack Tecnológico

- **Frontend:** [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Enrutamiento:** [React Router DOM v7](https://reactrouter.com/)
- **Backend as a Service:** [Supabase](https://supabase.com/)
  - Autenticación (Supabase Auth)
  - Base de Datos Relacional (PostgreSQL)
  - Almacenamiento de Archivos (Supabase Storage)
- **Calidad de Código y Linting:** ESLint 10 con reglas de React Compiler, React Hooks y Fast Refresh.

---

## 📁 Estructura del Proyecto

El proyecto sigue una arquitectura modular orientada a componentes desacoplados, separación de lógica de negocio y constantes centralizadas:

```text
├── public/                 # Favicon y assets públicos
├── src/
│   ├── assets/             # Imágenes e ilustraciones (hero, logos)
│   ├── components/         # Componentes UI modulares y reutilizables
│   │   ├── ChecklistRuta.jsx    # Checklist de tareas vecinales y subida de evidencia
│   │   ├── EstadoBadge.jsx      # Badges visuales de estado (propuestas y pasos)
│   │   ├── HeroBanner.jsx       # Banner principal de bienvenida y llamada a la acción
│   │   ├── Navbar.jsx           # Barra de navegación principal y estado de sesión
│   │   ├── ProgressBar.jsx      # Barra de progreso configurable (porcentaje, color, tamaño)
│   │   ├── PropuestaCard.jsx    # Tarjeta de resumen de propuesta vecinal
│   │   └── ProtectedRoute.jsx   # Envoltorio para rutas que exigen autenticación
│   ├── constants/          # Constantes y enumeraciones del dominio
│   │   ├── barrios.js           # Lista oficial de barrios de Quito
│   │   ├── index.js             # Punto de exportación unificado
│   │   └── propuestas.js        # Estados (Propuesta, Paso), categorías y filtros
│   ├── context/            # Contextos globales de React
│   │   ├── authContext.js       # Definición atómica del contexto de autenticación
│   │   └── AuthContext.jsx      # Proveedor (AuthProvider) con lógica de sesión
│   ├── hooks/              # Custom hooks reutilizables
│   │   └── useAuth.js           # Hook para consumir el contexto de autenticación
│   ├── lib/                # Configuración de clientes externos
│   │   └── supabase.js          # Inicialización del cliente Supabase
│   ├── pages/              # Páginas / Vistas principales
│   │   ├── Auth.jsx             # Inicio de sesión y registro de vecinos
│   │   ├── CrearPropuesta.jsx   # Formulario para proponer una nueva mejora
│   │   ├── Home.jsx             # Listado principal, filtros y métricas comunitarias
│   │   └── PropuestaDetalle.jsx # Vista detallada y gestión de la ruta de acción
│   ├── services/           # Capa de acceso a datos y llamadas a Supabase
│   │   ├── propuestasService.js # Consultas y creación de iniciativas
│   │   ├── rutasService.js      # Gestión de pasos de la ruta y subida de evidencias
│   │   └── votosService.js      # Registro y consulta de votos por vecino
│   ├── App.jsx             # Enrutador principal de la aplicación
│   ├── main.jsx            # Punto de entrada de la aplicación React
│   └── index.css           # Configuración de Tailwind CSS
├── .env.example            # Plantilla de variables de entorno requeridas
├── eslint.config.js        # Configuración de ESLint
├── package.json            # Dependencias y scripts del proyecto
└── vite.config.js          # Configuración del empaquetador Vite
```

---

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio y navegar a la carpeta:
```bash
git clone <url-del-repositorio>
cd EagleDev
```

### 2. Instalar dependencias:
```bash
# Con pnpm (recomendado)
pnpm install

# O con npm
npm install
```

### 3. Configurar variables de entorno:
Copia el archivo de plantilla `.env.example` a `.env`:
```bash
cp .env.example .env
```
Edita `.env` e introduce las credenciales de tu proyecto de Supabase.

### 4. Ejecutar en entorno de desarrollo:
```bash
npm run dev
```
Abre tu navegador en `http://localhost:5173`.

### 5. Compilar para producción:
```bash
npm run build
```

### 6. Ejecutar el linter:
```bash
npm run lint
```

---

## 🔐 Variables de Entorno

El archivo `.env` requiere las siguientes claves públicas:

| Variable | Descripción |
|---|---|
| `VITE_SUPABASE_URL` | URL de la API del proyecto en Supabase (ej. `https://xxxx.supabase.co`) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Llave anónima / pública (`anon` / `publishable`) de Supabase |

---

## 🗄️ Base de Datos y Almacenamiento (Supabase)

El backend opera sobre PostgreSQL en Supabase con las siguientes entidades:

1. **`perfiles`**: Información del vecino autenticado.
   - `id` (UUID, PK referencia a `auth.users`)
   - `nombre` (TEXT)
   - `barrio` (TEXT)
   - `rol` (TEXT, default: `'vecino'`)
   - `created_at` (TIMESTAMPTZ)

2. **`propuestas`**: Iniciativas presentadas por la comunidad.
   - `id` (BIGINT / UUID, PK)
   - `titulo` (TEXT)
   - `descripcion` (TEXT)
   - `barrio` (TEXT)
   - `categoria` (TEXT: Infraestructura, Seguridad, Eventos, Movilidad)
   - `creador_id` (UUID, FK a `perfiles.id`)
   - `votos_actuales` (INT, default: 0)
   - `votos_meta` (INT, default: 200)
   - `estado` (TEXT: `'En Votación'`, `'En Gestión'`, `'Completada'`)
   - `created_at` (TIMESTAMPTZ)

3. **`pasos_ruta`**: Tareas que componen la ruta de acción.
   - `id` (BIGINT / UUID, PK)
   - `propuesta_id` (FK a `propuestas.id`)
   - `orden` (INT)
   - `titulo` (TEXT)
   - `estado` (TEXT: `'Pendiente'`, `'En curso'`, `'Completado'`)
   - `asignado_a` (UUID, FK nullable a `perfiles.id`)
   - `evidencia_url` (TEXT nullable)
   - `updated_at` (TIMESTAMPTZ)

4. **`votos_propuestas`**: Registro único de votos.
   - `usuario_id` (UUID)
   - `propuesta_id` (BIGINT / UUID)
   - PK compuesta `(usuario_id, propuesta_id)`

5. **Storage Bucket `evidencias`**:
   - Bucket público para almacenar comprobantes fotográficos o PDFs asociados a cada paso completado.

---

## 🔄 Flujo de Usuario

```
[ Registro / Login ]
         │
         ▼
[ Explora Propuestas de su Barrio ]
         │
    ┌────┴──────────────────────────────┐
    ▼                                   ▼
[ Crear Propuesta ]            [ Votar Propuesta ]
    │                                   │
    │ (Inicia en "En Votación")         ▼
    │                          ¿Alcanzó los 200 votos?
    │                                   │ Sí
    │                                   ▼
    │                        [ Desbloqueo de Ruta ]
    │                       (Estado: "En Gestión")
    │                                   │
    └───────────────────────────────────┤
                                        ▼
                            [ Checklist Colaborativo ]
                              1. Reclamar paso
                              2. Ejecutar gestión
                              3. Subir foto/PDF de evidencia
                              4. Paso Completado
                                        │
                                        ▼
                             [ Obra Completada ]
```

---

## 🧼 Buenas Prácticas y Criterios de Mantenibilidad

- **Desacoplamiento de Componentes:** Cada elemento de interfaz (`PropuestaCard`, `ChecklistRuta`, `ProgressBar`, `EstadoBadge`, `HeroBanner`) cuenta con su propio archivo, simplificando pruebas y modificaciones individuales.
- **Tipos y Constantes Centralizadas:** Las cadenas de estados (`ESTADOS_PROPUESTA`, `ESTADOS_PASO`), filtros y barrios se encuentran tipificadas en `src/constants/`, eliminando riesgos por errores tipográficos (*typos*).
- **Separación de Custom Hooks y Contextos:** `useAuth` se aloja en su propio archivo dentro de `src/hooks/useAuth.js` y el contexto atómico en `src/context/authContext.js`, garantizando compatibilidad con React Fast Refresh y las directivas de React Compiler.
- **Cero Warnings de Linter:** El código cumple al 100% las directivas de ESLint (`npm run lint`), evitando cascadas de re-renderizado en efectos y preservando la memoización óptima del compilador de React.
