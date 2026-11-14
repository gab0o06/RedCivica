import { Link, useParams } from "react-router-dom";

export default function PropuestaDetallePage() {
  const { id } = useParams();
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link to="/" className="text-civica-navy font-semibold hover:underline">
        ← Volver al inicio
      </Link>
      <h1 className="text-2xl font-bold mt-4">
        Detalle de Ruta de Acción (Propuesta #{id})
      </h1>
      <p className="mt-2 text-slate-600">
        Aquí irá el checklist interactivo y la subida de evidencias.
      </p>
    </div>
  );
}
