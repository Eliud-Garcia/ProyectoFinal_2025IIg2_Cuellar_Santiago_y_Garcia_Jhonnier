import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient.js";
import "./DashboardEditor.css";
import AccessDenied from "../../Components/AccessDenied/AccessDenied.jsx";
import { useAuth } from '../../Hooks/useAuth.js';

const DashboardEditor = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  //pa validar que sea del rol editor
    const { userData, checkingAuth, accessDenied } = useAuth('editor');
  
    if (checkingAuth) return <div>Cargando...</div>;
    if( accessDenied ) return <AccessDenied />;
    if (userData && (userData.rol !== "editor")) return <AccessDenied />;

  return (
    <div className={`dashboard-container ${menuOpen ? "menu-open" : ""}`}>
      {/* Header para móvil */}
      <header className="dashboard-header">
        <div className="logo">
          📰 <span>Amazon</span>News
          
        </div>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </header>

      {/* Sidebar */}
      <aside className="sidebar">
        <nav className="menu">
          <NavLink
            to="/dashboard-editor/listado-noticias"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            <span className="icon">📝</span>
            <span>Noticias</span>
          </NavLink>

          <NavLink
            to="/dashboard-editor/listado-secciones"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            <span className="icon">📂</span>
            <span>Secciones</span>
          </NavLink>

          <button className="menu-item logout" onClick={handleLogout}>
            <span className="icon">🚪</span>
            <span>Salir</span>
          </button>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardEditor;
