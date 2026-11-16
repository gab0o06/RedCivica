import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [errorPerfil, setErrorPerfil] = useState(null);
  const [loading, setLoading] = useState(
    () => Boolean(import.meta.env.VITE_SUPABASE_URL),
  );

  const cargarPerfil = async (userId) => {
    if (!userId) {
      setPerfil(null);
      setErrorPerfil(null);
      return;
    }

    const { data, error } = await supabase
      .from("perfiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error al cargar perfil vecinal:", error.message);
      setErrorPerfil(
        "No se pudo cargar la información de tu perfil de barrio.",
      );
      setPerfil(null);
      return;
    }

    setErrorPerfil(null);
    setPerfil(data ?? null);
  };

  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL) {
      return;
    }

    supabase.auth
      .getSession()
      .then(async ({ data: { session } }) => {
        const usuarioActual = session?.user ?? null;
        setUser(usuarioActual);
        await cargarPerfil(usuarioActual?.id);
      })
      .catch((err) => {
        console.error("Error al obtener sesión de autenticación:", err);
      })
      .finally(() => {
        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const usuarioActual = session?.user ?? null;
      setUser(usuarioActual);
      await cargarPerfil(usuarioActual?.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signUp = async ({ email, password, nombre, barrio }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;

    if (data.user) {
      const { error: perfilError } = await supabase.from("perfiles").insert({
        id: data.user.id,
        nombre,
        barrio,
        rol: "vecino",
      });
      if (perfilError) throw perfilError;
      await cargarPerfil(data.user.id);
    }

    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPerfil(null);
    setErrorPerfil(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, perfil, errorPerfil, loading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
