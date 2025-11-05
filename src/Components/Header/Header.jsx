import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient.js";
import "./Header.css";

const Header = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Verificar si hay usuario logueado
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUser(data.user);
      }
    };
    getUser();

    // Escuchar cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <header className="header">
      <div className="nav-container">
        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <span className="logo-icon">A</span>
            <span className="logo-text">Amazonnews</span>
          </Link>
        </div>

        {/* Menú principal */}
        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/">Home</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        {/* Botones */}
        <div className="nav-buttons">
          <Link to="/explore" className="btn explore">
            Explore News
          </Link>

          {user ? (
            <>
              <span className="username">👋 {user.email.split("@")[0]}</span>
              <button onClick={handleLogout} className="btn logout">
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link to="/login" className="btn join">
              Iniciar sesión
            </Link>
          )}
        </div>

        {/* Menú móvil */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          ☰
        </button>
      </div>
    </header>
  );
};

export default Header;
