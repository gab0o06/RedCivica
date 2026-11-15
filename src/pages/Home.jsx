import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { obtenerPropuestasConPasos } from "../services/propuestasService";
import { obtenerVotosUsuario, registrarVoto } from "../services/votosService";

export default function HomePage({
  filtroInicial = "Todos",
  mostrarHero = true,
  tituloSeccion = "Propuestas Activas en tu Barrio",
}) {
  const [propuestas, setPropuestas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState(filtroInicial);
  const [busqueda, setBusqueda] = useState("");
  const [votosUsuario, setVotosUsuario] = useState({});
  const [cargando, setCargando] = useState(true);
  const [votandoId, setVotandoId] = useState(null);
  const [mensajeError, setMensajeError] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setFiltroEstado(filtroInicial);
  }, [filtroInicial]);

  const cargarDatos = useCallback(async () => {
    try {
      const [listaPropuestas, mapaVotos] = await Promise.all([
        obtenerPropuestasConPasos(),
        obtenerVotosUsuario(user?.id),
      ]);
      setPropuestas(listaPropuestas);
      setVotosUsuario(mapaVotos);
    } catch (err) {
      setMensajeError("No se pudieron cargar las propuestas: " + err.message);
    } finally {
      setCargando(false);
    }
  }, [user?.id]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const manejarVoto = async (propuestaId) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (votosUsuario[propuestaId] || votandoId) return;

    setMensajeError("");
    setVotandoId(propuestaId);

    try {
      await registrarVoto(user.id, propuestaId);
      // Recargamos desde BD para reflejar el trigger automático si llegó a la meta
      await cargarDatos();
    } catch (err) {
      setMensajeError(err.message);
    } finally {
      setVotandoId(null);
    }
  };

  const propuestasFiltradas = propuestas.filter((p) => {
    const coincideEstado =
      filtroEstado === "Todos" || p.estado === filtroEstado;
    const coincideTexto =
      p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.barrio.toLowerCase().includes(busqueda.toLowerCase());
    return coincideEstado && coincideTexto;
  });

  const obrasLogradas = propuestas.filter(
    (p) => p.estado === "Completada",
  ).length;

  return (
    <div>
      {/* Hero Banner */}
      {mostrarHero && (
        <section className="bg-civica-hero border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
            <h1 className="text-3xl md:text-4xl font-bold text-civica-ink tracking-tight">
              ¡El poder de tu barrio en acción!
            </h1>
            <p className="mt-3 text-base md:text-lg text-slate-700 max-w-2xl leading-relaxed">
              La primera plataforma donde la organización vecinal se convierte
              en obras y soluciones. Vota, gestiona y desbloquea rutas de acción
              cívica.
            </p>

            <div className="mt-6 flex flex-wrap gap-3.5">
              <Link
                to="/propuestas/nueva"
                className="bg-civica-orange hover:bg-civica-orange-hover text-white font-semibold text-base px-5 py-3 rounded-lg transition-colors"
              >
                Proponer una Mejora
              </Link>
              <a
                href="#listado-propuestas"
                className="border-2 border-civica-sage text-civica-sage hover:bg-civica-sage-light font-semibold text-base px-5 py-2.5 rounded-lg transition-colors"
              >
                Ver Propuestas
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Buscador y Filtros por Estado */}
      <section
        id="listado-propuestas"
        className="max-w-6xl mx-auto px-4 sm:px-6 py-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="relative flex-1 max-w-md">
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar propuestas por sector o barrio..."
              className="w-full bg-white border border-slate-300 rounded-lg pl-4 pr-4 py-2.5 text-base text-civica-ink placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-civica-navy"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-medium text-slate-700 mr-1">
              Filtros:
            </span>
            {["Todos", "En Votación", "En Gestión", "Completada"].map(
              (estado) => (
                <button
                  key={estado}
                  type="button"
                  onClick={() => setFiltroEstado(estado)}
                  className={`px-3.5 py-1.5 rounded-lg text-base font-medium transition-colors cursor-pointer ${
                    filtroEstado === estado
                      ? "bg-civica-navy text-white"
                      : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {estado}
                </button>
              ),
            )}
          </div>
        </div>

        {mensajeError && (
          <div
            role="alert"
            className="mt-5 p-4 rounded-lg bg-red-50 border border-red-200 text-red-900 text-base"
          >
            {mensajeError}
          </div>
        )}

        {/* Listado de Propuestas */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 mb-5">
          <h2 className="text-2xl font-bold text-civica-ink">
            {tituloSeccion}
          </h2>

          {!mostrarHero && (
            <Link
              to="/propuestas/nueva"
              className="bg-civica-orange hover:bg-civica-orange-hover text-white font-semibold text-base px-4 py-2 rounded-lg transition-colors"
            >
              + Proponer una Mejora
            </Link>
          )}
        </div>

        {cargando ? (
          <p className="text-base text-slate-600 py-8">
            Cargando iniciativas vecinales...
          </p>
        ) : propuestasFiltradas.length === 0 ? (
          <p className="text-base text-slate-600 py-8">
            No hay propuestas que coincidan con el filtro seleccionado.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {propuestasFiltradas.map((prop) => {
              const porcentaje = Math.min(
                100,
                Math.round((prop.votos_actuales / prop.votos_meta) * 100),
              );
              const pasos = prop.pasos_ruta || [];
              const completados = pasos.filter(
                (p) => p.estado === "Completado",
              ).length;
              const yaVoto = Boolean(votosUsuario[prop.id]);

              return (
                <article
                  key={prop.id}
                  className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-civica-sage uppercase tracking-wide">
                      Sector: {prop.barrio}
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-civica-ink leading-snug">
                      {prop.titulo}
                    </h3>

                    {/* Badge único de estado */}
                    <div className="mt-3">
                      {prop.estado === "En Votación" && (
                        <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1 rounded-full text-base font-medium">
                          <span className="w-2.5 h-2.5 rounded-full bg-civica-sage"></span>
                          En Votación
                        </span>
                      )}
                      {prop.estado === "En Gestión" && (
                        <span className="inline-flex items-center gap-2 bg-sky-50 text-sky-950 border border-sky-200 px-3 py-1 rounded-full text-base font-medium">
                          <span className="w-2.5 h-2.5 rounded-full bg-civica-navy"></span>
                          En Gestión
                        </span>
                      )}
                      {prop.estado === "Completada" && (
                        <span className="inline-flex items-center gap-2 bg-slate-100 text-slate-800 border border-slate-300 px-3 py-1 rounded-full text-base font-medium">
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                          Completada
                        </span>
                      )}
                    </div>

                    {/* Contenido según estado */}
                    {prop.estado === "En Votación" ? (
                      <div className="mt-5">
                        <div className="w-full bg-slate-200 rounded-full h-6 overflow-hidden">
                          <div
                            className="bg-civica-orange h-full text-white text-sm font-bold flex items-center justify-end pr-2.5 transition-all duration-300"
                            style={{ width: `${porcentaje}%` }}
                          >
                            {porcentaje}%
                          </div>
                        </div>
                        <p className="mt-2.5 text-base text-slate-700 font-medium">
                          {prop.votos_actuales} de {prop.votos_meta} votos para
                          desbloquear la Ruta
                        </p>
                      </div>
                    ) : (
                      <div className="mt-5">
                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-civica-sage h-full transition-all duration-300"
                            style={{
                              width: `${pasos.length ? (completados / pasos.length) * 100 : 100}%`,
                            }}
                          />
                        </div>
                        <p className="mt-2.5 text-base font-semibold text-civica-ink">
                          Ruta Desbloqueada • {completados} de {pasos.length}{" "}
                          pasos completados
                        </p>

                        <ul className="mt-3 space-y-2">
                          {pasos.map((paso) => (
                            <li
                              key={paso.id}
                              className="flex items-center gap-2.5 text-base text-slate-800"
                            >
                              {paso.estado === "Completado" && (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-civica-sage text-white text-xs font-bold shrink-0">
                                  ✓
                                </span>
                              )}
                              {paso.estado === "En curso" && (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold shrink-0">
                                  ⏳
                                </span>
                              )}
                              {paso.estado === "Pendiente" && (
                                <span className="inline-block w-5 h-5 rounded border-2 border-slate-300 shrink-0" />
                              )}
                              <span>
                                {paso.titulo}{" "}
                                <span className="text-slate-600 font-medium">
                                  ({paso.estado})
                                </span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Acción principal de la tarjeta */}
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    {prop.estado === "En Votación" ? (
                      <button
                        type="button"
                        onClick={() => manejarVoto(prop.id)}
                        disabled={yaVoto || votandoId === prop.id}
                        className={`w-full font-semibold text-base py-3 px-4 rounded-lg transition-colors cursor-pointer ${
                          yaVoto
                            ? "bg-civica-sage text-white cursor-default"
                            : "bg-civica-navy hover:bg-civica-navy-hover disabled:opacity-60 text-white"
                        }`}
                      >
                        {votandoId === prop.id
                          ? "Registrando voto..."
                          : yaVoto
                            ? "✓ Voto registrado (1 Vecino = 1 Voto)"
                            : "👍 Votar (1 Vecino = 1 Voto)"}
                      </button>
                    ) : (
                      <Link
                        to={`/propuestas/${prop.id}`}
                        className="block w-full text-center border-2 border-civica-sage text-civica-sage hover:bg-civica-sage-light font-semibold text-base py-2.5 px-4 rounded-lg transition-colors"
                      >
                        Colaborar en la ruta de acción
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Estadísticas de la Comunidad */}
        <section className="mt-12 bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-civica-ink">
            Estadísticas de la Comunidad
          </h2>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center sm:text-left">
            <div>
              <p className="text-3xl font-bold text-civica-ink">
                {propuestas.length}
              </p>
              <p className="text-base text-slate-600">Propuestas registradas</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-civica-ink">860</p>
              <p className="text-base text-slate-600">Vecinos participando</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-civica-ink">
                {obrasLogradas}
              </p>
              <p className="text-base text-slate-600">Obras logradas</p>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
