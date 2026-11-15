import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { crearPropuesta } from "../services/propuestasService";

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

const CATEGORIAS = ["Infraestructura", "Seguridad", "Eventos", "Movilidad"];

export default function CrearPropuesta() {
  const { user, perfil } = useAuth();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [barrio, setBarrio] = useState(perfil?.barrio || BARRIOS_QUITO[0]);
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const [descripcion, setDescripcion] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim() || !descripcion.trim()) {
      setError("Completa el título y la descripción de la necesidad barrial.");
      return;
    }

    setError("");
    setEnviando(true);

    try {
      await crearPropuesta({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        barrio,
        categoria,
        creadorId: user.id,
      });
      navigate("/");
    } catch (err) {
      setError("No se pudo publicar la propuesta: " + err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to="/"
        className="text-base font-semibold text-civica-navy hover:underline"
      >
        ← Volver a propuestas
      </Link>

      <div className="mt-4 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-civica-ink">
          Proponer una Mejora Barrial
        </h1>
        <p className="mt-1.5 text-base text-slate-600">
          Describe el problema o proyecto comunitario. Al reunir el apoyo de tus
          vecinos, se desbloqueará la guía oficial para gestionarlo.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-4 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-900 text-base"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="titulo"
              className="block text-base font-semibold text-civica-ink mb-1"
            >
              Título de la propuesta
            </label>
            <input
              id="titulo"
              type="text"
              required
              maxLength={120}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej. Reparación de luminarias en el parque central"
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-base text-civica-ink focus:outline-none focus:ring-2 focus:ring-civica-navy"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="barrio"
                className="block text-base font-semibold text-civica-ink mb-1"
              >
                Barrio o sector
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

            <div>
              <label
                htmlFor="categoria"
                className="block text-base font-semibold text-civica-ink mb-1"
              >
                Categoría
              </label>
              <select
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-base text-civica-ink focus:outline-none focus:ring-2 focus:ring-civica-navy"
              >
                {CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="descripcion"
              className="block text-base font-semibold text-civica-ink mb-1"
            >
              Detalle y ubicación exacta
            </label>
            <textarea
              id="descripcion"
              rows={4}
              required
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Indica las calles de referencia, qué se necesita y cómo beneficia al sector..."
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-base text-civica-ink focus:outline-none focus:ring-2 focus:ring-civica-navy"
            />
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={enviando}
              className="bg-civica-orange hover:bg-civica-orange-hover disabled:opacity-60 text-white font-semibold text-base px-6 py-3 rounded-lg transition-colors cursor-pointer"
            >
              {enviando ? "Publicando..." : "Publicar para votación vecinal"}
            </button>
            <Link
              to="/"
              className="border-2 border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-base px-5 py-2.5 rounded-lg transition-colors"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
