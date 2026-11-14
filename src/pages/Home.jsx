import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const PROPUESTAS_DEMO = [
  {
    id: "1",
    titulo:
      "Instalación de luminarias y bacheo en calle José Antepara (La Tola)",
    barrio: "La Tola",
    estado: "En Votación",
    votosActuales: 150,
    votosMeta: 200,
    pasos: [],
  },
  {
    id: "2",
    titulo: "Feria de Microemprendedores en el Parque El Ejido",
    barrio: "Mariscal / El Ejido",
    estado: "En Gestión",
    votosActuales: 200,
    votosMeta: 200,
    pasos: [
      { id: 1, texto: "1. Solicitar permiso municipal", estado: "Completado" },
      { id: 2, texto: "2. Diseñar croquis de puestos", estado: "Completado" },
      {
        id: 3,
        texto: "3. Planificar logística de la feria",
        estado: "En curso",
      },
      {
        id: 4,
        texto: "4. Coordinar limpieza comunitaria",
        estado: "Pendiente",
      },
      { id: 5, texto: "5. Convocar a vecinos y difusión", estado: "Pendiente" },
    ],
  },
];

export default function HomePage({ filtroInicial = "Todos" }) {
  const [propuestas, setPropuestas] = useState(PROPUESTAS_DEMO);
  const [filtroEstado, setFiltroEstado] = useState(filtroInicial);
  const [busqueda, setBusqueda] = useState("");
  const [votosUsuario, setVotosUsuario] = useState({});

  useEffect(() => {
    setFiltroEstado(filtroInicial);
  }, [filtroInicial]);

  const manejarVoto = (id) => {
    if (votosUsuario[id]) return;

    setVotosUsuario((prev) => ({ ...prev, [id]: true }));
    setPropuestas((prev) =>
      prev.map((prop) => {
        if (prop.id !== id) return prop;
        const nuevosVotos = prop.votosActuales + 1;
        const desbloqueada = nuevosVotos >= prop.votosMeta;
        return {
          ...prop,
          votosActuales: nuevosVotos,
          estado: desbloqueada ? "En Gestión" : prop.estado,
        };
      }),
    );
  };

  const propuestasFiltradas = propuestas.filter((p) => {
    const coincideEstado =
      filtroEstado === "Todos" || p.estado === filtroEstado;
    const coincideTexto =
      p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.barrio.toLowerCase().includes(busqueda.toLowerCase());
    return coincideEstado && coincideTexto;
  });

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-civica-hero border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <h1 className="text-3xl md:text-4xl font-bold text-civica-ink tracking-tight">
            ¡El poder de tu barrio en acción!
          </h1>
          <p className="mt-3 text-base md:text-lg text-slate-700 max-w-2xl leading-relaxed">
            La primera plataforma donde la organización vecinal se convierte en
            obras y soluciones. Vota, gestiona y desbloquea rutas de acción
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

      {/* Buscador y Filtros por Estado[cite: 9] */}
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

        {/* Listado de Propuestas[cite: 9] */}
        <h2 className="text-2xl font-bold text-civica-ink mt-6 mb-5">
          Propuestas Activas en tu Barrio
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {propuestasFiltradas.map((prop) => {
            const porcentaje = Math.min(
              100,
              Math.round((prop.votosActuales / prop.votosMeta) * 100),
            );
            const completados = prop.pasos.filter(
              (p) => p.estado === "Completado",
            ).length;

            return (
              <article
                key={prop.id}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-xl font-bold text-civica-ink leading-snug">
                      {prop.titulo}
                    </h3>
                  </div>

                  {/* Badge único de estado[cite: 9] */}
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

                  {/* Contenido según estado: Barra de Votos vs Checklist[cite: 9] */}
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
                        {prop.votosActuales} de {prop.votosMeta} votos para
                        desbloquear la Ruta
                      </p>
                    </div>
                  ) : (
                    <div className="mt-5">
                      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-civica-sage h-full transition-all duration-300"
                          style={{
                            width: `${prop.pasos.length ? (completados / prop.pasos.length) * 100 : 100}%`,
                          }}
                        />
                      </div>
                      <p className="mt-2.5 text-base font-semibold text-civica-ink">
                        Ruta Desbloqueada • {completados} de {prop.pasos.length}{" "}
                        pasos completados
                      </p>

                      <ul className="mt-3 space-y-2">
                        {prop.pasos.map((paso) => (
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
                              {paso.texto}{" "}
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

                {/* Acción principal de la tarjeta[cite: 9] */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  {prop.estado === "En Votación" ? (
                    <button
                      type="button"
                      onClick={() => manejarVoto(prop.id)}
                      disabled={votosUsuario[prop.id]}
                      className={`w-full font-semibold text-base py-3 px-4 rounded-lg transition-colors cursor-pointer ${
                        votosUsuario[prop.id]
                          ? "bg-civica-sage text-white cursor-default"
                          : "bg-civica-navy hover:bg-civica-navy-hover text-white"
                      }`}
                    >
                      {votosUsuario[prop.id]
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

        {/* Estadísticas de la Comunidad[cite: 9] */}
        <section className="mt-12 bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-civica-ink">
            Estadísticas de la Comunidad
          </h2>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center sm:text-left">
            <div>
              <p className="text-3xl font-bold text-civica-ink">12</p>
              <p className="text-base text-slate-600">Propuestas activas</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-civica-ink">860</p>
              <p className="text-base text-slate-600">Vecinos participando</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-civica-ink">4</p>
              <p className="text-base text-slate-600">Obras logradas</p>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
