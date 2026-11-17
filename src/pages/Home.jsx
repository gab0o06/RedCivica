import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { obtenerPropuestasConPasos } from "../services/propuestasService";
import { obtenerVotosUsuario, registrarVoto } from "../services/votosService";
import HeroBanner from "../components/HeroBanner";
import PropuestaCard from "../components/PropuestaCard";
import { ESTADOS_PROPUESTA, FILTROS_ESTADO } from "../constants/propuestas";

const OPCIONES_FILTRO = [
  FILTROS_ESTADO.TODOS,
  FILTROS_ESTADO.EN_VOTACION,
  FILTROS_ESTADO.EN_GESTION,
  FILTROS_ESTADO.COMPLETADA,
];

export default function HomePage({
  filtroInicial = FILTROS_ESTADO.TODOS,
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
  }, [user]);

  useEffect(() => {
    let activa = true;

    async function fetchData() {
      try {
        const [listaPropuestas, mapaVotos] = await Promise.all([
          obtenerPropuestasConPasos(),
          obtenerVotosUsuario(user?.id),
        ]);
        if (activa) {
          setPropuestas(listaPropuestas);
          setVotosUsuario(mapaVotos);
        }
      } catch (err) {
        if (activa) {
          setMensajeError(
            "No se pudieron cargar las propuestas: " + err.message,
          );
        }
      } finally {
        if (activa) {
          setCargando(false);
        }
      }
    }

    fetchData();

    return () => {
      activa = false;
    };
  }, [user]);

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
      await cargarDatos();
    } catch (err) {
      setMensajeError(err.message);
    } finally {
      setVotandoId(null);
    }
  };

  const propuestasFiltradas = propuestas.filter((p) => {
    const coincideEstado =
      filtroEstado === FILTROS_ESTADO.TODOS || p.estado === filtroEstado;
    const coincideTexto =
      p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.barrio.toLowerCase().includes(busqueda.toLowerCase());
    return coincideEstado && coincideTexto;
  });

  const obrasLogradas = propuestas.filter(
    (p) => p.estado === ESTADOS_PROPUESTA.COMPLETADA,
  ).length;

  return (
    <div>
      {mostrarHero && <HeroBanner />}

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
            {OPCIONES_FILTRO.map((estado) => (
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
            ))}
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
            {propuestasFiltradas.map((prop) => (
              <PropuestaCard
                key={prop.id}
                propuesta={prop}
                yaVoto={Boolean(votosUsuario[prop.id])}
                estaVotando={votandoId === prop.id}
                onVotar={manejarVoto}
              />
            ))}
          </div>
        )}

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
