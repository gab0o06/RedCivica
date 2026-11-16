import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import { ESTADOS_PROPUESTA } from "./constants/propuestas";

const HomePage = lazy(() => import("./pages/Home"));
const PropuestaDetallePage = lazy(() => import("./pages/PropuestaDetalle"));
const CrearPropuestaPage = lazy(() => import("./pages/CrearPropuesta"));
const Auth = lazy(() => import("./pages/Auth"));

function PantallaCarga() {
  return (
    <div className="flex justify-center items-center py-24 text-base text-slate-600">
      <div className="flex items-center gap-3">
        <span className="w-5 h-5 rounded-full border-2 border-civica-navy border-t-transparent animate-spin" />
        <span>Cargando contenido...</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-civica-bg text-civica-ink">
          <Navbar />

          <main className="flex-1">
            <Suspense fallback={<PantallaCarga />}>
              <Routes>
                {/* Portada completa */}
                <Route path="/" element={<HomePage key="inicio" />} />

                {/* Vista directa de votación ciudadana */}
                <Route
                  path="/propuestas"
                  element={
                    <HomePage
                      key="votacion"
                      mostrarHero={false}
                      filtroInicial={ESTADOS_PROPUESTA.EN_VOTACION}
                      tituloSeccion="Propuestas Vecinales en Votación"
                    />
                  }
                />

                {/* Vista directa de checklists colaborativos */}
                <Route
                  path="/rutas"
                  element={
                    <HomePage
                      key="rutas"
                      mostrarHero={false}
                      filtroInicial={ESTADOS_PROPUESTA.EN_GESTION}
                      tituloSeccion="Rutas de Acción Desbloqueadas"
                    />
                  }
                />

                {/* Detalle de propuesta y checklist */}
                <Route
                  path="/propuestas/:id"
                  element={<PropuestaDetallePage />}
                />

                {/* Autenticación */}
                <Route path="/auth" element={<Auth />} />

                {/* Rutas protegidas */}
                <Route
                  path="/propuestas/nueva"
                  element={
                    <ProtectedRoute>
                      <CrearPropuestaPage />
                    </ProtectedRoute>
                  }
                />

                {/* Redirección por defecto */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
