export const ESTADOS_PROPUESTA = Object.freeze({
  EN_VOTACION: "En Votación",
  EN_GESTION: "En Gestión",
  COMPLETADA: "Completada",
});

export const ESTADOS_PASO = Object.freeze({
  PENDIENTE: "Pendiente",
  EN_CURSO: "En curso",
  COMPLETADO: "Completado",
});

export const FILTROS_ESTADO = Object.freeze({
  TODOS: "Todos",
  EN_VOTACION: ESTADOS_PROPUESTA.EN_VOTACION,
  EN_GESTION: ESTADOS_PROPUESTA.EN_GESTION,
  COMPLETADA: ESTADOS_PROPUESTA.COMPLETADA,
});

export const CATEGORIAS_PROPUESTA = [
  "Infraestructura",
  "Seguridad",
  "Eventos",
  "Movilidad",
];
