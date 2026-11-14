import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/Home";
import PropuestaDetallePage from "./pages/PropuestaDetalle";
import CrearPropuestaPage from "./pages/CrearPropuesta";
import AuthPage from "./pages/Auth";

export default function App() {
  return (
    // <AuthProvider>
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-civica-bg text-civica-ink">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/propuestas" element={<HomePage />} />
            <Route
              path="/rutas"
              element={<HomePage filtroInicial="En Gestión" />}
            />

            <Route path="/propuestas/:id" element={<PropuestaDetallePage />} />

            <Route path="/auth" element={<AuthPage />} />

            <Route
              path="/propuestas/nueva"
              element={
                <ProtectedRoute>
                  <CrearPropuestaPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
    // </AuthProvider>
  );
}
