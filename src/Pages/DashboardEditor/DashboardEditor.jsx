import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient.js";
import { useAuth } from '../../Hooks/useAuth.js';
import AccessDenied from "../../Components/AccessDenied/AccessDenied.jsx";

import "./DashboardEditor.css"; 

const DashboardEditor = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  
  const { userData, checkingAuth, accessDenied } = useAuth('editor'); // Usando useAuth sin parámetro
  
  // Lógica de seguridad dentro del componente (redundante si usas ProtectedRoute, pero seguro)
  if (checkingAuth) return <div>Cargando...</div>;
  if( accessDenied ) return <AccessDenied />;
  // **Validación de rol 'editor'**
  if (userData && (userData.rol !== "editor")) return <AccessDenied />;
  

  return (
    <div className="editor-dashboard-page">
      {/* Botón menú para móviles */}
      <button
        className="editor-menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
      >
        <span className="editor-menu-icon">{sidebarOpen ? "✕" : "☰"}</span>
      </button>

      {/* Sidebar */}
      <aside className={`editor-sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2 className="editor-logo">
          <span className="editor-logo-icon">
            ⭐ Panel del Editor
          </span>
        </h2>

        <nav className="editor-menu">
          <NavLink
            // Rutas ajustadas para el editor
            to="/dashboard-editor/listado-noticias"
            className={({ isActive }) =>
              `editor-menu-item ${isActive ? "active" : ""}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <span className="editor-icon">👀</span>
            <span>gestionar noticias</span>
          </NavLink>

          <NavLink
            to="/dashboard-editor/listado-secciones"
            className={({ isActive }) =>
              `editor-menu-item ${isActive ? "active" : ""}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <span className="editor-icon">✅</span>
            <span>gestionar secciones</span>
          </NavLink>

          <button className="editor-menu-item editor-logout" onClick={handleLogout}>
            <span className="editor-icon">🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="editor-content">
        <div className="editor-content-header">
          <h1>Bienvenid@ {userData.nombre_completo}</h1> 
        </div>
        <div className="editor-content-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardEditor;