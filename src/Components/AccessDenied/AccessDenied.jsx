import React from "react";
import { Link } from "react-router-dom";
import "./AccessDenied.css";

const AccessDenied = () => {
  return (
    <div className="access-denied">
      <div className="denied-box">
        <h1>🚫 Acceso Denegado</h1>
        <p>No tienes permisos para acceder a esta página.</p>

        <div className="denied-links">
          <Link to="/" className="btn home">
            Ir al inicio
          </Link>
          <Link to="/login" className="btn login">
            Iniciar sesión
          </Link>
          <Link to="/register" className="btn register">
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
