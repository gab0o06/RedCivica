import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  obtenerPropuestaDetalle,
  reclamarPaso,
  liberarPaso,
  completarPasoConEvidencia,
} from "../services/rutasService";

export default function PropuestaDetalle() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [propuesta, setPropuesta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [procesandoPasoId, setProcesandoPasoId] = useState(null);
  const [archivosPorPaso, setArchivosPorPaso] = useState({});
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  const cargarDetalle = useCallback(async () => {
    try {
      const data = await obtenerPropuestaDetalle(id);
      setPropuesta(data);
    } catch (err) {
      setError("No se pudo cargar la propuesta: " + err.message);
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    cargarDetalle();
  }, [cargarDetalle]);

  const handleReclamar = async (pasoId) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setError("");
    setMensajeExito("");
    setProcesandoPasoId(pasoId);

    try {
      await reclamarPaso(pasoId, user.id);
      setMensajeExito(
        "Paso asignado a tu cuenta. Sube la evidencia cuando lo completes.",
      );
      await cargarDetalle();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesandoPasoId(null);
    }
  };

  const handleLiberar = async (pasoId) => {
    setError("");
    setMensajeExito("");
    setProcesandoPasoId(pasoId);

    try {
      await liberarPaso(pasoId, user.id);
      setMensajeExito("Paso liberado para que otro vecino pueda tomarlo.");
      await cargarDetalle();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesandoPasoId(null);
    }
  };

  const handleCompletar = async (pasoId) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    const archivo = archivosPorPaso[pasoId];
    setError("");
    setMensajeExito("");
    setProcesandoPasoId(pasoId);

    try {
      await completarPasoConEvidencia(pasoId, user.id, archivo);
      setMensajeExito("Evidencia subida y paso marcado como completado.");
      setArchivosPorPaso((prev) => ({ ...prev, [pasoId]: null }));
      await cargarDetalle();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesandoPasoId(null);
    }
  };

  if (cargando) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-base text-slate-600">
        Cargando Ruta de Acción...
      </div>
    );
  }

  if (!propuesta) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-base text-red-800">
          No se encontró la propuesta solicitada.
        </p>
        <Link
          to="/"
          className="mt-4 inline-block text-civica-navy font-semibold hover:underline"
        >
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  const pasos = propuesta.pasos_ruta || [];
  const completados = pasos.filter((p) => p.estado === "Completado").length;
  const porcentajeProgreso = pasos.length
    ? Math.round((completados / pasos.length) * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to="/"
        className="text-base font-semibold text-civica-navy hover:underline"
      >
        ← Volver a propuestas
      </Link>

      {/* Cabecera de la Propuesta */}
      <section className="mt-4 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-semibold text-civica-sage uppercase tracking-wide">
            Sector: {propuesta.barrio} • {propuesta.categoria}
          </span>

          {propuesta.estado === "Completada" ? (
            <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-950 border border-emerald-300 px-3.5 py-1 rounded-full text-base font-semibold">
              ✓ Obra / Trámite Completado
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 bg-sky-50 text-sky-950 border border-sky-200 px-3.5 py-1 rounded-full text-base font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-civica-navy"></span>
              {propuesta.estado}
            </span>
          )}
        </div>

        <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-civica-ink">
          {propuesta.titulo}
        </h1>
        <p className="mt-3 text-base text-slate-700 leading-relaxed">
          {propuesta.descripcion}
        </p>

        {/* Barra de progreso general de la Ruta */}
        {pasos.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-base font-semibold text-civica-ink">
                Progreso de ejecución: {completados} de {pasos.length} pasos
                completados
              </span>
              <span className="text-base font-bold text-civica-sage">
                {porcentajeProgreso}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-civica-sage h-full transition-all duration-300"
                style={{ width: `${porcentajeProgreso}%` }}
              />
            </div>
          </div>
        )}
      </section>

      {error && (
        <div
          role="alert"
          className="mt-5 p-4 rounded-lg bg-red-50 border border-red-200 text-red-900 text-base"
        >
          {error}
        </div>
      )}

      {mensajeExito && (
        <div
          role="status"
          className="mt-5 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 text-base font-medium"
        >
          {mensajeExito}
        </div>
      )}

      {/* Checklist Colaborativo */}
      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-bold text-civica-ink">
          Ruta de Acción Colaborativa (Checklist Vecinal)
        </h2>

        {pasos.map((paso) => {
          const esMio = user && paso.asignado_a === user.id;
          const disponibleParaCompletar =
            paso.estado !== "Completado" &&
            (esMio || (paso.estado === "En curso" && !paso.asignado_a));

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

                {/* Estado individual del paso */}
                {paso.estado === "Completado" && (
                  <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1 rounded-full text-base font-semibold">
                    ✓ Completado
                  </span>
                )}
                {paso.estado === "En curso" && (
                  <span className="bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full text-base font-semibold">
                    ⏳ En curso
                  </span>
                )}
                {paso.estado === "Pendiente" && (
                  <span className="bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1 rounded-full text-base font-medium">
                    Pendiente
                  </span>
                )}
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
              {paso.estado !== "Completado" && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  {!paso.asignado_a && paso.estado === "Pendiente" && (
                    <button
                      type="button"
                      onClick={() => handleReclamar(paso.id)}
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
                            setArchivosPorPaso((prev) => ({
                              ...prev,
                              [paso.id]: e.target.files?.[0] || null,
                            }))
                          }
                          className="mt-1.5 block w-full text-base text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-base file:font-semibold file:bg-slate-100 file:text-civica-ink hover:file:bg-slate-200"
                        />
                      </label>

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => handleCompletar(paso.id)}
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
                            onClick={() => handleLiberar(paso.id)}
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
    </div>
  );
}
