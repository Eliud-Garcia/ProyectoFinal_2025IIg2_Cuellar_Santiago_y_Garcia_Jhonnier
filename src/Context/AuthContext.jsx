import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userAuth, setUserAuth] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [userData, setUserData] = useState(null);
    const [accessDenied, setAccessDenied] = useState(false);

    useEffect(() => {
        const getUserAndCategories = async () => {
            // Obtener usuario autenticado
            const { data, error } = await supabase.auth.getUser();
            if (error) console.error("Error al obtener usuario:", error.message);
            const authUser = data?.user || null;
            setUserAuth(authUser);

            // Si no hay usuario autenticado, finalizar
            if (!authUser) {
                setCheckingAuth(false);
                accessDenied(true);
                return;
            }

            // Obtener datos del usuario desde tu tabla
            const currentUserData = await getUser(authUser.id);
            setUserData(currentUserData);

            //mostrar datos del usuario en consola
            console.log("User Data en AuthContext:", currentUserData);

            
            if (!currentUserData) {
                console.log("Acceso denegado:");
                setAccessDenied(true);
            }
            
            setCheckingAuth(false);
        };

        getUserAndCategories();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserAuth(session?.user || null);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    const getUser = async (authId) => {
        try {
            const { data, error } = await supabase
                .from("Usuario")
                .select("id_usuario, rol")
                .eq("id_user_autenticacion", authId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("❌ Error al obtener usuario:", error.message);
            return null;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                userAuth,
                userData,
                checkingAuth,
                accessDenied,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
