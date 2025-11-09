import React, { useState, useEffect} from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient.js";
import { useAuth } from '../../Hooks/useAuth.js';
import AccessDenied from "../../Components/AccessDenied/AccessDenied.jsx";
import "./Dashboard_reportero.css";

const Dashboard_reportero = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  //pa validar que sea del rol reporter
  const { userData, checkingAuth, accessDenied } = useAuth('reporter');

  
  if (checkingAuth) return <div>Cargando...</div>;
  if( accessDenied ) return <AccessDenied />;
  if (userData && (userData.rol !== "reporter")) return <AccessDenied />;
  

  return (
    <div className="reporter-dashboard-page">
      {/* Botón menú para móviles - Siempre visible en móviles */}
      <button
        className="reporter-menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
      >
        <span className="reporter-menu-icon">{sidebarOpen ? "✕" : "☰"}</span>
      </button>

      {/* Sidebar */}
      <aside className={`reporter-sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2 className="reporter-logo">
          <span className="reporter-logo-icon">
            📰 Panel del reportero

          </span>
        </h2>

        <nav className="reporter-menu">
          <NavLink
            to="/dashboard-reportero/mis-noticias"
            className={({ isActive }) =>
              `reporter-menu-item ${isActive ? "active" : ""}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <span className="reporter-icon">📝</span>
            <span>Mis Noticias</span>
          </NavLink>

          <NavLink
            to="/dashboard-reportero/crear-noticia"
            className={({ isActive }) =>
              `reporter-menu-item ${isActive ? "active" : ""}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <span className="reporter-icon">➕</span>
            <span>Crear Noticia</span>
          </NavLink>

          <button className="reporter-menu-item reporter-logout" onClick={handleLogout}>
            <span className="reporter-icon">🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="reporter-content">
        <div className="reporter-content-header">
          <h1>Bienvend@ {userData.nombre_completo}</h1>
          {/* Puedes añadir más elementos al encabezado si lo deseas */}
        </div>
        <div className="reporter-content-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard_reportero;