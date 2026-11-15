import { supabase } from "../lib/supabase";

export async function obtenerPropuestasConPasos() {
  const { data, error } = await supabase
    .from("propuestas")
    .select(
      `
      *,
      pasos_ruta (
        id,
        orden,
        titulo,
        estado,
        asignado_a,
        evidencia_url
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((prop) => ({
    ...prop,
    pasos_ruta: (prop.pasos_ruta || []).sort((a, b) => a.orden - b.orden),
  }));
}

export async function crearPropuesta({
  titulo,
  descripcion,
  barrio,
  categoria,
  creadorId,
}) {
  const { data, error } = await supabase
    .from("propuestas")
    .insert({
      titulo,
      descripcion,
      barrio,
      categoria,
      creador_id: creadorId,
      votos_meta: 200,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
