import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { logo_amazonia } from "../../../config";
import "./Header.css";

const Header = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) setUser(data.user);
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
  };


  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();

    if (location.pathname !== "/") {
      sessionStorage.setItem("scrollTarget", targetId);
      navigate("/");
    } else {
      scrollToSection(targetId);
    }
  };

  const scrollToSection = (targetId) => {
    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const targetId = sessionStorage.getItem("scrollTarget");
    if (targetId && location.pathname === "/") {
      scrollToSection(targetId);
      sessionStorage.removeItem("scrollTarget");
    }
  }, [location.pathname]);



  return (
    <header className="landing-header">
      <nav className="landing-nav">
        <div className="landing-nav-container">
          {/* === LOGO === */}
          <Link
            className="landing-logo"
            to="/"
          >
            <img className="landing-logo-icon" src={logo_amazonia} alt="Amazonia logo" />
            <span className="logo-text">
              Amazon<span className="highlight">News</span>
            </span>
          </Link>

          {/* === NAV LINKS === */}
          <div className={`landing-nav-links ${menuOpen ? "open" : ""}`}>
            <a href="#home" onClick={(e) => handleSmoothScroll(e, "home")}>
              Home
            </a>
            <a href="#categories" onClick={(e) => handleSmoothScroll(e, "categories")}>
              Secciones
            </a>
            <a href="#about" onClick={(e) => handleSmoothScroll(e, "about")}>
              Sobre nosotros
            </a>
            <a href="#contact" onClick={(e) => handleSmoothScroll(e, "contact")}>
              Contáctanos
            </a>
          </div>

          {/* === Desktop Buttons === */}
          <div className="landing-nav-buttons">
            <Link to="/panel-noticias" className="landing-btn explore">
              Explora noticias
            </Link>
            <Link to="/login" className="landing-btn join">
              Únete al equipo
            </Link>
          </div>

          {/* === Menu Toggle === */}
          <button
            className={`menu-toggle ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
