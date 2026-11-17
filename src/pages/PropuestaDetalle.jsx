import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  obtenerPropuestaDetalle,
  reclamarPaso,
  liberarPaso,
  completarPasoConEvidencia,
} from "../services/rutasService";
import EstadoBadge from "../components/EstadoBadge";
import ProgressBar from "../components/ProgressBar";
import ChecklistRuta from "../components/ChecklistRuta";
import { ESTADOS_PASO } from "../constants/propuestas";
import { calcularPorcentajeProgreso } from "../utils/progreso";

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
    let activa = true;

    async function fetchDetalle() {
      try {
        const data = await obtenerPropuestaDetalle(id);
        if (activa) {
          setPropuesta(data);
        }
      } catch (err) {
        if (activa) {
          setError("No se pudo cargar la propuesta: " + err.message);
        }
      } finally {
        if (activa) {
          setCargando(false);
        }
      }
    }

    fetchDetalle();

    return () => {
      activa = false;
    };
  }, [id]);

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
  const completados = pasos.filter(
    (p) => p.estado === ESTADOS_PASO.COMPLETADO,
  ).length;
  const porcentajeProgreso = pasos.length
    ? calcularPorcentajeProgreso(completados, pasos.length)
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

          <EstadoBadge
            estado={propuesta.estado}
            tipo="propuesta"
            varianteDetalle
          />
        </div>

        <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-civica-ink">
          {propuesta.titulo}
        </h1>
        <p className="mt-3 text-base text-slate-700 leading-relaxed">
          {propuesta.descripcion}
        </p>

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
            <ProgressBar
              porcentaje={porcentajeProgreso}
              color="sage"
              size="md"
            />
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

      <ChecklistRuta
        pasos={pasos}
        user={user}
        procesandoPasoId={procesandoPasoId}
        onSeleccionarArchivo={(pasoId, archivo) =>
          setArchivosPorPaso((prev) => ({ ...prev, [pasoId]: archivo }))
        }
        onReclamar={handleReclamar}
        onLiberar={handleLiberar}
        onCompletar={handleCompletar}
      />
    </div>
  );
}
