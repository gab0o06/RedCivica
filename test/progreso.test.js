import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calcularPorcentajeProgreso } from "../src/utils/progreso.js";

describe("calcularPorcentajeProgreso", () => {
  it("calcula correctamente el porcentaje exacto", () => {
    assert.equal(calcularPorcentajeProgreso(50, 100), 50);
    assert.equal(calcularPorcentajeProgreso(100, 200), 50);
    assert.equal(calcularPorcentajeProgreso(200, 200), 100);
  });

  it("redondea adecuadamente al entero más cercano", () => {
    // 1 / 3 = 33.333% -> 33
    assert.equal(calcularPorcentajeProgreso(1, 3), 33);
    // 2 / 3 = 66.666% -> 67
    assert.equal(calcularPorcentajeProgreso(2, 3), 67);
  });

  it("clampea al 100% cuando los valores superan la meta", () => {
    assert.equal(calcularPorcentajeProgreso(250, 200), 100);
    assert.equal(calcularPorcentajeProgreso(500, 100), 100);
  });

  it("retorna 0 para valores iniciales o cero", () => {
    assert.equal(calcularPorcentajeProgreso(0, 200), 0);
    assert.equal(calcularPorcentajeProgreso(0, 0), 0);
  });

  it("maneja con seguridad valores negativos o inválidos", () => {
    assert.equal(calcularPorcentajeProgreso(-10, 100), 0);
    assert.equal(calcularPorcentajeProgreso(10, -50), 0);
    assert.equal(calcularPorcentajeProgreso(null, 100), 0);
    assert.equal(calcularPorcentajeProgreso(undefined, 100), 0);
    assert.equal(calcularPorcentajeProgreso("10", "100"), 0);
    assert.equal(calcularPorcentajeProgreso(NaN, 100), 0);
    assert.equal(calcularPorcentajeProgreso(50, NaN), 0);
  });
});
