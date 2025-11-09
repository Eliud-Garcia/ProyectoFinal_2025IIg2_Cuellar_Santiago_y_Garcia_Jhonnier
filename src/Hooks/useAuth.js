import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';

export const useAuth = (requiredRole = null) => {
  const [userAuth, setUserAuth] = useState(null);
  const [userData, setUserData] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const validateUser = async () => {
      // Obtener usuario autenticado
      const { data, error } = await supabase.auth.getUser();
      if (error) console.error("Error al obtener usuario:", error.message);
      
      const authUser = data?.user || null;
      setUserAuth(authUser);

      // Si no hay usuario autenticado, finalizar
      if (!authUser) {
        setCheckingAuth(false);
        setAccessDenied(true);
        return;
      }

      // Obtener datos del usuario desde tu tabla
      const currentUser = await getUser(authUser.id);
      setUserData(currentUser);

      // Validar rol si se especifica uno requerido
      if (requiredRole) {
        if (!currentUser || currentUser.rol !== requiredRole) {        
          setAccessDenied(true);
        }
      }

      setCheckingAuth(false);
    };

    validateUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserAuth(session?.user || null);
      
      // Si cambia el estado de autenticación, revalidar
      if (session?.user) {
        getUser(session.user.id).then(user => {
          setUserData(user);
          if (requiredRole && user?.rol !== requiredRole) {
            setAccessDenied(true);
          } else {
            setAccessDenied(false);
          }
        });
      } else {
        setUserData(null);
        setAccessDenied(true);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [requiredRole]);

  // Obtener datos del usuario desde tabla Usuario
  const getUser = async (authId) => {
    try {
      const { data, error } = await supabase
        .from("Usuario")
        .select("id_usuario, rol") // Agrega más campos si necesitas
        .eq("id_user_autenticacion", authId)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("❌ Error al obtener usuario:", error.message);
      return null;
    }
  };

  return {
    userAuth,
    userData,
    checkingAuth,
    accessDenied,
    isAuthenticated: !!userAuth && !!userData,
    hasRole: (role) => userData?.rol === role
  };
};