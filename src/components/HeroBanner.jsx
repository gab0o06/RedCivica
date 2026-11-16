import { Link } from "react-router-dom";

export function HeroBanner({
  titulo = "¡El poder de tu barrio en acción!",
  descripcion = "La primera plataforma donde la organización vecinal se convierte en obras y soluciones. Vota, gestiona y desbloquea rutas de acción cívica.",
}) {
  return (
    <section className="bg-civica-hero border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <h1 className="text-3xl md:text-4xl font-bold text-civica-ink tracking-tight">
          {titulo}
        </h1>
        <p className="mt-3 text-base md:text-lg text-slate-700 max-w-2xl leading-relaxed">
          {descripcion}
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
  );
}

export default HeroBanner;
