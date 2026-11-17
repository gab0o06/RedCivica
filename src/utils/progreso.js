export function calcularPorcentajeProgreso(valorActual, meta) {
  if (typeof valorActual !== "number" || typeof meta !== "number") {
    return 0;
  }
  if (isNaN(valorActual) || isNaN(meta) || meta <= 0 || valorActual <= 0) {
    return 0;
  }
  const porcentaje = Math.round((valorActual / meta) * 100);
  return Math.min(100, Math.max(0, porcentaje));
}
