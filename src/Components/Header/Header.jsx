import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient.js";
import "./Header.css";

const Header = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) setUser(data.user);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

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
          <Link to="/" onClick={() => setMenuOpen(false)}>inicio</Link>
          {/* <Link to="/categories" onClick={() => setMenuOpen(false)}>categorias</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link> */}

          {/* Opciones de sesión visibles en móvil */}
          <div className="mobile-auth">
            {user ? (
              <>
                <span className="username">👋 {user.email.split("@")[0]}</span>
                <button onClick={handleLogout} className="btn logout">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link to="/login" className="btn join" onClick={() => setMenuOpen(false)}>
                Iniciar sesión
              </Link>
            )}
          </div>
        </nav>

        {/* Botones desktop */}
        <div className="nav-buttons">
          <Link to="/panel-noticias" className="btn explore">
            explorar noticias
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

        {/* Botón menú móvil */}
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
