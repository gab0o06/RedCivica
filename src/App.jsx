import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/Home";
import PropuestaDetallePage from "./pages/PropuestaDetalle";
import CrearPropuestaPage from "./pages/CrearPropuesta";
import Auth from "./pages/Auth";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-civica-bg text-civica-ink">
          <Navbar />

          <main className="flex-1">
            <Routes>
              {/* Portada completa */}
              <Route path="/" element={<HomePage />} />

              {/* Vista directa de votación ciudadana */}
              <Route
                path="/propuestas"
                element={
                  <HomePage
                    mostrarHero={false}
                    filtroInicial="En Votación"
                    tituloSeccion="Propuestas Vecinales en Votación"
                  />
                }
              />

              {/* Vista directa de checklists colaborativos */}
              <Route
                path="/rutas"
                element={
                  <HomePage
                    mostrarHero={false}
                    filtroInicial="En Gestión"
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
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
