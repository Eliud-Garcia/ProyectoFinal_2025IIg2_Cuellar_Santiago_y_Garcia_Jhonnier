import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import "./Dashboard_reportero.css";
import { supabase } from '../../supabaseClient.js';

const Dashboard_reportero = () => {

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
            to="/dashboard-reportero/mis-noticias"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            <span className="icon">📝</span>
            <span>Mis Noticias</span>
          </NavLink>

          <NavLink
            to="/dashboard-reportero/crear-noticia"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            <span className="icon">➕</span>
            <span>Crear Noticia</span>
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

export default Dashboard_reportero;
