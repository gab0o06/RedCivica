import EstadoBadge from "./EstadoBadge";
import { ESTADOS_PASO } from "../constants/propuestas";

export function ChecklistRuta({
  pasos = [],
  user,
  procesandoPasoId = null,
  onSeleccionarArchivo,
  onReclamar,
  onLiberar,
  onCompletar,
}) {
  return (
    <section className="mt-8 space-y-4">
      <h2 className="text-xl font-bold text-civica-ink">
        Ruta de Acción Colaborativa (Checklist Vecinal)
      </h2>

      {pasos.map((paso) => {
        const esMio = Boolean(user && paso.asignado_a === user.id);
        const disponibleParaCompletar =
          paso.estado !== ESTADOS_PASO.COMPLETADO &&
          (esMio ||
            (paso.estado === ESTADOS_PASO.EN_CURSO && !paso.asignado_a));

        return (
          <div
            key={paso.id}
            className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-civica-ink">
                  {paso.titulo}
                </h3>
                {paso.perfiles?.nombre && (
                  <p className="mt-1 text-base text-slate-600">
                    Responsable:{" "}
                    <strong className="text-civica-ink">
                      {paso.perfiles.nombre}
                    </strong>
                  </p>
                )}
              </div>

              {/* Estado individual del paso con componente reutilizable */}
              <EstadoBadge estado={paso.estado} tipo="paso" />
            </div>

            {/* Evidencia ya subida */}
            {paso.evidencia_url && (
              <div className="mt-4 pt-3 border-t border-slate-100">
                <a
                  href={paso.evidencia_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-base font-semibold text-civica-navy hover:underline"
                >
                  📎 Ver evidencia adjunta (Foto / Documento)
                </a>
              </div>
            )}

            {/* Controles de acción */}
            {paso.estado !== ESTADOS_PASO.COMPLETADO && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                {!paso.asignado_a && paso.estado === ESTADOS_PASO.PENDIENTE && (
                  <button
                    type="button"
                    onClick={() => onReclamar(paso.id)}
                    disabled={procesandoPasoId === paso.id}
                    className="bg-civica-navy hover:bg-civica-navy-hover disabled:opacity-60 text-white font-semibold text-base px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    {procesandoPasoId === paso.id
                      ? "Asignando..."
                      : "✋ Reclamar este paso"}
                  </button>
                )}

                {disponibleParaCompletar && (
                  <div className="space-y-3">
                    <label className="block text-base font-medium text-slate-700">
                      Adjunta fotografía o comprobante PDF (máx. 5 MB):
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        onChange={(e) =>
                          onSeleccionarArchivo(
                            paso.id,
                            e.target.files?.[0] || null,
                          )
                        }
                        className="mt-1.5 block w-full text-base text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-base file:font-semibold file:bg-slate-100 file:text-civica-ink hover:file:bg-slate-200"
                      />
                    </label>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => onCompletar(paso.id)}
                        disabled={procesandoPasoId === paso.id}
                        className="bg-civica-sage hover:opacity-90 disabled:opacity-60 text-white font-semibold text-base px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                      >
                        {procesandoPasoId === paso.id
                          ? "Subiendo evidencia..."
                          : "✓ Subir evidencia y completar paso"}
                      </button>

                      {esMio && (
                        <button
                          type="button"
                          onClick={() => onLiberar(paso.id)}
                          disabled={procesandoPasoId === paso.id}
                          className="border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium text-base px-4 py-2.5 rounded-lg cursor-pointer"
                        >
                          Liberar paso
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}

export default ChecklistRuta;
