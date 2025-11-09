import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext.jsx";

const ProtectedRoute = ({ requiredRole }) => {
  const { userAuth, userData, checkingAuth } = useAuth();

  if (checkingAuth) return <div>Cargando autenticación...</div>;

  // Si no hay usuario autenticado
  if (!userAuth){
    alert("Acceso denegado. Por favor, inicie sesión para continuar.");  
    return <Navigate to="/login" replace />;
  }

  // Si hay rol requerido y no coincide
  if (requiredRole && userData?.rol !== requiredRole) {
    alert("Acceso denegado. No tienes el rol necesario para acceder a esta página.");
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;