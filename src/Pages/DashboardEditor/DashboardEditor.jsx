import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient.js";
import "./DashboardEditor.css";

const DashboardEditor = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

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
