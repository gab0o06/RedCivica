import { supabase } from "../db/supabase";

export async function obtenerVotosUsuario(usuarioId) {
  if (!usuarioId) return {};

  const { data, error } = await supabase
    .from("votos")
    .select("propuesta_id")
    .eq("usuario_id", usuarioId);

  if (error) throw error;

  const mapaVotos = {};
  (data || []).forEach((voto) => {
    mapaVotos[voto.propuesta_id] = true;
  });
  return mapaVotos;
}

export async function registrarVoto(usuarioId, propuestaId) {
  const { error } = await supabase.from("votos").insert({
    usuario_id: usuarioId,
    propuesta_id: propuestaId,
  });

  if (error) {
    if (error.code === "23505") {
      throw new Error(
        "Ya emitiste tu voto en esta propuesta (1 vecino = 1 voto).",
      );
    }
    throw error;
  }
}
