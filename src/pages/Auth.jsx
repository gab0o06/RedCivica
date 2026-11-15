import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const BARRIOS_QUITO = [
  "La Tola",
  "Mariscal / El Ejido",
  "La Floresta",
  "Chimbacalle",
  "Quitumbe",
  "Carcelén",
  "Cotocollao",
  "San Roque",
];

export default function AuthPage() {
  const [esRegistro, setEsRegistro] = useState(false);
  const [nombre, setNombre] = useState("");
  const [barrio, setBarrio] = useState(BARRIOS_QUITO[0]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destino = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      if (esRegistro) {
        if (!nombre.trim()) {
          throw new Error(
            "Ingresa tu nombre completo para identificarte en tu barrio.",
          );
        }
        await signUp({ email, password, nombre: nombre.trim(), barrio });
      } else {
        await signIn(email, password);
      }
      navigate(destino, { replace: true });
    } catch (err) {
      setError(
        err.message === "Invalid login credentials"
          ? "Correo o contraseña incorrectos."
          : err.message || "Ocurrió un error al autenticar.",
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-civica-ink">
          {esRegistro ? "Únete a tu comunidad" : "Iniciar Sesión"}
        </h1>
        <p className="mt-1.5 text-base text-slate-600">
          {esRegistro
            ? "Valida tu sector para votar y gestionar mejoras barriales."
            : "Ingresa con tu cuenta vecinal para participar."}
        </p>

        {error && (
          <div
            role="alert"
            className="mt-4 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-900 text-base"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {esRegistro && (
            <>
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-base font-semibold text-civica-ink mb-1"
                >
                  Nombre y apellido
                </label>
                <input
                  id="nombre"
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Carmen Andrade"
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-base text-civica-ink focus:outline-none focus:ring-2 focus:ring-civica-navy"
                />
              </div>

              <div>
                <label
                  htmlFor="barrio"
                  className="block text-base font-semibold text-civica-ink mb-1"
                >
                  Barrio o sector de residencia
                </label>
                <select
                  id="barrio"
                  value={barrio}
                  onChange={(e) => setBarrio(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-base text-civica-ink focus:outline-none focus:ring-2 focus:ring-civica-navy"
                >
                  {BARRIOS_QUITO.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-base font-semibold text-civica-ink mb-1"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vecino@ejemplo.com"
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-base text-civica-ink focus:outline-none focus:ring-2 focus:ring-civica-navy"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-base font-semibold text-civica-ink mb-1"
            >
              Contraseña (mínimo 6 caracteres)
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-base text-civica-ink focus:outline-none focus:ring-2 focus:ring-civica-navy"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-civica-navy hover:bg-civica-navy-hover disabled:opacity-60 text-white font-semibold text-base py-3 rounded-lg transition-colors cursor-pointer"
          >
            {cargando
              ? "Procesando..."
              : esRegistro
                ? "Crear cuenta vecinal"
                : "Entrar a Red Cívica"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-200 text-center">
          <button
            type="button"
            onClick={() => {
              setEsRegistro(!esRegistro);
              setError("");
            }}
            className="text-base font-semibold text-civica-orange hover:underline cursor-pointer"
          >
            {esRegistro
              ? "¿Ya tienes cuenta? Inicia sesión aquí"
              : "¿Primera vez en Red Cívica? Regístrate con tu barrio"}
          </button>
        </div>
      </div>
    </div>
  );
}
