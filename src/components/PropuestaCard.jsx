import { Link } from "react-router-dom";
import EstadoBadge from "./EstadoBadge";
import ProgressBar from "./ProgressBar";
import { ESTADOS_PROPUESTA, ESTADOS_PASO } from "../constants/propuestas";
import { calcularPorcentajeProgreso } from "../utils/progreso";

export function PropuestaCard({
  propuesta,
  yaVoto = false,
  estaVotando = false,
  onVotar,
}) {
  const porcentaje = calcularPorcentajeProgreso(
    propuesta.votos_actuales,
    propuesta.votos_meta,
  );
  const pasos = propuesta.pasos_ruta || [];
  const completados = pasos.filter(
    (p) => p.estado === ESTADOS_PASO.COMPLETADO,
  ).length;
  const porcentajePasos = pasos.length
    ? calcularPorcentajeProgreso(completados, pasos.length)
    : 100;

  return (
    <article className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
      <div>
        <p className="text-sm font-semibold text-civica-sage uppercase tracking-wide">
          Sector: {propuesta.barrio}
        </p>
        <h3 className="mt-1 text-xl font-bold text-civica-ink leading-snug">
          {propuesta.titulo}
        </h3>

        {/* Badge único de estado */}
        <div className="mt-3">
          <EstadoBadge estado={propuesta.estado} />
        </div>

        {/* Contenido según estado */}
        {propuesta.estado === ESTADOS_PROPUESTA.EN_VOTACION ? (
          <div className="mt-5">
            <ProgressBar
              porcentaje={porcentaje}
              color="orange"
              size="lg"
              mostrarTexto
            />
            <p className="mt-2.5 text-base text-slate-700 font-medium">
              {propuesta.votos_actuales} de {propuesta.votos_meta} votos para
              desbloquear la Ruta
            </p>
          </div>
        ) : (
          <div className="mt-5">
            <ProgressBar
              porcentaje={porcentajePasos}
              color="sage"
              size="sm"
            />
            <p className="mt-2.5 text-base font-semibold text-civica-ink">
              Ruta Desbloqueada • {completados} de {pasos.length} pasos
              completados
            </p>

            <ul className="mt-3 space-y-2">
              {pasos.map((paso) => (
                <li
                  key={paso.id}
                  className="flex items-center gap-2.5 text-base text-slate-800"
                >
                  {paso.estado === ESTADOS_PASO.COMPLETADO && (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-civica-sage text-white text-xs font-bold shrink-0">
                      ✓
                    </span>
                  )}
                  {paso.estado === ESTADOS_PASO.EN_CURSO && (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold shrink-0">
                      ⏳
                    </span>
                  )}
                  {paso.estado === ESTADOS_PASO.PENDIENTE && (
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
        {propuesta.estado === ESTADOS_PROPUESTA.EN_VOTACION ? (
          <button
            type="button"
            onClick={() => onVotar && onVotar(propuesta.id)}
            disabled={yaVoto || estaVotando}
            className={`w-full font-semibold text-base py-3 px-4 rounded-lg transition-colors cursor-pointer ${
              yaVoto
                ? "bg-civica-sage text-white cursor-default"
                : "bg-civica-navy hover:bg-civica-navy-hover disabled:opacity-60 text-white"
            }`}
          >
            {estaVotando
              ? "Registrando voto..."
              : yaVoto
                ? "✓ Voto registrado (1 Vecino = 1 Voto)"
                : "👍 Votar (1 Vecino = 1 Voto)"}
          </button>
        ) : (
          <Link
            to={`/propuestas/${propuesta.id}`}
            className="block w-full text-center border-2 border-civica-sage text-civica-sage hover:bg-civica-sage-light font-semibold text-base py-2.5 px-4 rounded-lg transition-colors"
          >
            Colaborar en la ruta de acción
          </Link>
        )}
      </div>
    </article>
  );
}

export default PropuestaCard;
