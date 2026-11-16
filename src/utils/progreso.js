/**
 * Calcula el porcentaje de progreso como un entero clampeado entre 0 y 100.
 *
 * @param {number} valorActual - Cantidad actual (votos actuales, pasos completados)
 * @param {number} meta - Meta u objetivo total (votos meta, total de pasos)
 * @returns {number} Entero entre 0 y 100
 */
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
