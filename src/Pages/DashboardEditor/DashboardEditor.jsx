import React from "react";
import { Outlet, NavLink } from "react-router-dom";

import { supabase } from '../../supabaseClient.js';

const DashboardEditor = () => {

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <h2 className="logo">📰 Dashboard</h2>

        <nav className="menu">

          <NavLink
            to="/dashboard-editor/listado-noticias"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            <span className="icon">📝</span>
            <span>Gestionar Noticias</span>
          </NavLink>

          <NavLink
            to="/dashboard-editor/listado-secciones"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            <span className="icon">➕</span>
            <span>Gestionar Secciones</span>
          </NavLink>

          <button className="menu-item logout" onClick={handleLogout}>
            <span className="icon">🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </nav>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardEditor;
