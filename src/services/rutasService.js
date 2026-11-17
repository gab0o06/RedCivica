import { supabase } from "../db/supabase";
import { ESTADOS_PASO } from "../constants/propuestas";

const TIPOS_PERMITIDOS = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];
const TAMANO_MAXIMO_BYTES = 5 * 1024 * 1024; // 5 MB

export async function obtenerPropuestaDetalle(propuestaId) {
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
        evidencia_url,
        perfiles:asignado_a ( nombre )
      )
    `,
    )
    .eq("id", propuestaId)
    .single();

  if (error) throw error;

  return {
    ...data,
    pasos_ruta: (data.pasos_ruta || []).sort((a, b) => a.orden - b.orden),
  };
}

export async function reclamarPaso(pasoId, usuarioId) {
  const { data, error } = await supabase
    .from("pasos_ruta")
    .update({
      asignado_a: usuarioId,
      estado: ESTADOS_PASO.EN_CURSO,
      updated_at: new Date().toISOString(),
    })
    .eq("id", pasoId)
    .is("asignado_a", null)
    .eq("estado", ESTADOS_PASO.PENDIENTE)
    .select();

  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error(
      "Otro vecino acaba de reclamar este paso. Actualiza la vista.",
    );
  }
  return data[0];
}

export async function liberarPaso(pasoId, usuarioId) {
  const { data, error } = await supabase
    .from("pasos_ruta")
    .update({
      asignado_a: null,
      estado: ESTADOS_PASO.PENDIENTE,
      updated_at: new Date().toISOString(),
    })
    .eq("id", pasoId)
    .eq("asignado_a", usuarioId)
    .eq("estado", ESTADOS_PASO.EN_CURSO)
    .select("id");

  if (error) throw error;
  if (!data?.length) {
    throw new Error("No se pudo liberar el paso: ya no eres su responsable.");
  }
}

export async function completarPasoConEvidencia(pasoId, usuarioId, archivo) {
  if (!archivo) {
    throw new Error(
      "Debes adjuntar una fotografía o documento PDF como respaldo.",
    );
  }
  if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
    throw new Error(
      "Formato no válido. Solo se permiten imágenes (JPG, PNG, WEBP) o PDF.",
    );
  }
  if (archivo.size > TAMANO_MAXIMO_BYTES) {
    throw new Error("El archivo supera el límite de 5 MB.");
  }

  const nombreLimpio = archivo.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const rutaArchivo = `${pasoId}/${Date.now()}_${nombreLimpio}`;

  const { error: uploadError } = await supabase.storage
    .from("evidencias")
    .upload(rutaArchivo, archivo);

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from("evidencias")
    .getPublicUrl(rutaArchivo);

  const { data: filas, error: updateError } = await supabase
    .from("pasos_ruta")
    .update({
      estado: ESTADOS_PASO.COMPLETADO,
      asignado_a: usuarioId,
      evidencia_url: urlData.publicUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", pasoId)
    .eq("asignado_a", usuarioId)
    .eq("estado", ESTADOS_PASO.EN_CURSO)
    .select("id");

  if (updateError) throw updateError;
  if (!filas?.length) {
    throw new Error(
      "No se pudo completar el paso: ya no eres su responsable o cambió de estado.",
    );
  }
}
