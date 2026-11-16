import { ESTADOS_PROPUESTA, ESTADOS_PASO } from "../constants/propuestas";

export function EstadoBadge({
  estado,
  tipo = "propuesta",
  varianteDetalle = false,
}) {
  if (tipo === "paso" || Object.values(ESTADOS_PASO).includes(estado)) {
    switch (estado) {
      case ESTADOS_PASO.COMPLETADO:
        return (
          <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1 rounded-full text-base font-semibold">
            ✓ {ESTADOS_PASO.COMPLETADO}
          </span>
        );
      case ESTADOS_PASO.EN_CURSO:
        return (
          <span className="bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full text-base font-semibold">
            ⏳ {ESTADOS_PASO.EN_CURSO}
          </span>
        );
      case ESTADOS_PASO.PENDIENTE:
      default:
        return (
          <span className="bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1 rounded-full text-base font-medium">
            {ESTADOS_PASO.PENDIENTE}
          </span>
        );
    }
  }

  if (varianteDetalle && estado === ESTADOS_PROPUESTA.COMPLETADA) {
    return (
      <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-950 border border-emerald-300 px-3.5 py-1 rounded-full text-base font-semibold">
        ✓ Obra / Trámite Completado
      </span>
    );
  }

  switch (estado) {
    case ESTADOS_PROPUESTA.EN_VOTACION:
      return (
        <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1 rounded-full text-base font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-civica-sage" />
          {ESTADOS_PROPUESTA.EN_VOTACION}
        </span>
      );
    case ESTADOS_PROPUESTA.EN_GESTION:
      return (
        <span className="inline-flex items-center gap-2 bg-sky-50 text-sky-950 border border-sky-200 px-3 py-1 rounded-full text-base font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-civica-navy" />
          {ESTADOS_PROPUESTA.EN_GESTION}
        </span>
      );
    case ESTADOS_PROPUESTA.COMPLETADA:
      return (
        <span className="inline-flex items-center gap-2 bg-slate-100 text-slate-800 border border-slate-300 px-3 py-1 rounded-full text-base font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
          {ESTADOS_PROPUESTA.COMPLETADA}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-2 bg-sky-50 text-sky-950 border border-sky-200 px-3.5 py-1 rounded-full text-base font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-civica-navy" />
          {estado}
        </span>
      );
  }
}

export default EstadoBadge;
