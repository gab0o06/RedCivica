export function ProgressBar({
  porcentaje = 0,
  color = "orange",
  size = "md",
  mostrarTexto = false,
  className = "",
}) {
  const porcentajeClampeado = Math.min(
    100,
    Math.max(0, Math.round(porcentaje)),
  );

  const sizeClasses = {
    sm: "h-3",
    md: "h-4",
    lg: "h-6",
  };

  const colorClasses = {
    orange: "bg-civica-orange",
    sage: "bg-civica-sage",
  };

  const altura = sizeClasses[size] || sizeClasses.md;
  const relleno = colorClasses[color] || colorClasses.orange;

  return (
    <div
      className={`w-full bg-slate-200 rounded-full ${altura} overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={porcentajeClampeado}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`${relleno} h-full transition-all duration-300 ${
          mostrarTexto
            ? "text-white text-sm font-bold flex items-center justify-end pr-2.5"
            : ""
        }`}
        style={{ width: `${porcentajeClampeado}%` }}
      >
        {mostrarTexto && `${porcentajeClampeado}%`}
      </div>
    </div>
  );
}

export default ProgressBar;
