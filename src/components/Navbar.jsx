import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { user, perfil, signOut } = useAuth();
  const navigate = useNavigate();

  const handleCerrarSesion = async () => {
    await signOut();
    setMenuAbierto(false);
    navigate("/");
  };

  const claseEnlace = ({ isActive }) =>
    `text-base font-medium transition-colors py-1 border-b-2 ${
      isActive
        ? "text-civica-navy border-civica-navy font-semibold"
        : "text-slate-700 border-transparent hover:text-civica-navy"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between"
        aria-label="Navegación principal"
      >
        {/* Izquierda: Marca + Enlaces principales */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            onClick={() => setMenuAbierto(false)}
            className="flex items-center gap-2.5 text-civica-ink font-bold text-xl tracking-tight"
          >
            {/* Ícono SVG liviano de comunidad */}
            <span className="w-9 h-9 rounded-lg bg-civica-navy flex items-center justify-center text-white shrink-0">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 10.5L12 3l9 7.5" />
                <path d="M5 9.5V19a1 1 0 001 1h12a1 1 0 001-1V9.5" />
                <path d="M9 20v-6h6v6" />
              </svg>
            </span>
            <span>Red Cívica</span>
          </Link>

          {/* Enlaces en escritorio */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" end className={claseEnlace}>
              Inicio
            </NavLink>
            <NavLink to="/propuestas" className={claseEnlace}>
              Propuestas
            </NavLink>
            <NavLink to="/rutas" className={claseEnlace}>
              Rutas
            </NavLink>
          </div>
        </div>

        {/* Derecha: Estado de sesión en escritorio */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <div className="text-right">
                <p className="text-base font-semibold text-civica-ink leading-tight">
                  {perfil?.nombre || user.email?.split("@")[0]}
                </p>
                {perfil?.barrio && (
                  <p className="text-sm text-civica-sage font-medium">
                    Sector: {perfil.barrio}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleCerrarSesion}
                className="border-2 border-slate-300 hover:border-slate-400 text-slate-800 font-semibold text-base px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Salir
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="bg-civica-orange hover:bg-civica-orange-hover text-white font-semibold text-base px-5 py-2.5 rounded-lg transition-colors"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>

        {/* Botón hamburguesa en móvil */}
        <button
          type="button"
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="md:hidden p-2 rounded-lg text-civica-ink hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-civica-navy"
          aria-expanded={menuAbierto}
          aria-label="Abrir menú de navegación"
        >
          {menuAbierto ? (
            <svg
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* Menú desplegable en móvil */}
      {menuAbierto && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-5 space-y-3 shadow-md">
          <div className="flex flex-col space-y-2">
            <NavLink
              to="/"
              end
              onClick={() => setMenuAbierto(false)}
              className="block py-2.5 px-3 rounded-lg text-base font-medium text-civica-ink hover:bg-slate-100"
            >
              Inicio
            </NavLink>
            <NavLink
              to="/propuestas"
              onClick={() => setMenuAbierto(false)}
              className="block py-2.5 px-3 rounded-lg text-base font-medium text-civica-ink hover:bg-slate-100"
            >
              Propuestas
            </NavLink>
            <NavLink
              to="/rutas"
              onClick={() => setMenuAbierto(false)}
              className="block py-2.5 px-3 rounded-lg text-base font-medium text-civica-ink hover:bg-slate-100"
            >
              Rutas
            </NavLink>
          </div>

          <div className="pt-3 border-t border-slate-200">
            {user ? (
              <div className="space-y-3">
                <div className="px-3">
                  <p className="text-base font-semibold text-civica-ink">
                    {perfil?.nombre || user.email}
                  </p>
                  {perfil?.barrio && (
                    <p className="text-base text-civica-sage">
                      Sector: {perfil.barrio}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleCerrarSesion}
                  className="w-full border-2 border-slate-300 text-slate-800 font-semibold text-base py-2.5 rounded-lg"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMenuAbierto(false)}
                className="block w-full text-center bg-civica-orange hover:bg-civica-orange-hover text-white font-semibold text-base py-3 rounded-lg"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
