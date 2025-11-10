import React from "react";
import { Link } from "react-router-dom";
import "./AccessDenied.css";

const AccessDenied = () => {

  // SVG de Puerta o Barrera (Diseño Minimalista)
  const BarrierSVG = () => (
    <svg 
      className="ar-icon-barrier" 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="10" y="20" width="80" height="60" rx="10" fill="#E74C3C" opacity="0.1"/>
      {/* Marco de la barrera (Rojo) */}
      <rect x="15" y="25" width="70" height="50" rx="8" stroke="#E74C3C" strokeWidth="3" fill="none"/>
      {/* Líneas diagonales de No Acceso (Amarillo/Negro) */}
      <line x1="25" y1="35" x2="75" y2="75" stroke="#E74C3C" strokeWidth="4" strokeLinecap="round"/>
      <line x1="75" y1="35" x2="25" y2="75" stroke="#E74C3C" strokeWidth="4" strokeLinecap="round"/>
      {/* Icono de Candado Cerrado (Blanco) */}
      <path d="M50 40C50 34.4772 45.5228 30 40 30H60C65.5228 30 70 34.4772 70 40V50H30V40C30 34.4772 34.4772 30 40 30H60C65.5228 30 70 34.4772 70 40" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="30" y="50" width="40" height="20" rx="3" fill="#FFFFFF"/>
    </svg>
  );

  return (
    <div className="ar-page">
      <div className="ar-box">
        
        {/* Ilustración Moderna */}
        <BarrierSVG />

        <h1 className="ar-title">Acceso Restringido</h1>
        <h2 className="ar-code">Error 403</h2>
        
        <p className="ar-message">
          Lo sentimos, no tienes las credenciales o el rol necesario para visualizar este contenido. 
          Por favor, inicia sesión con una cuenta autorizada.
        </p>

        <div className="ar-links">
          <Link to="/" className="ar-btn ar-home">
            Ir a la Página Principal
          </Link>
          <Link to="/login" className="ar-btn ar-login">
            Cambiar de Cuenta
          </Link>
        </div>
        
        <p className="ar-help-text">
            Si crees que esto es un error, contacta con el soporte técnico.
        </p>
      </div>
    </div>
  );
};

export default AccessDenied;