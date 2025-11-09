import React, { useState, useEffect } from 'react';
import './Login.css';
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient.js';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  // Estados para el formulario
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const navigate = useNavigate();
  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setIsLoading(true);

    // login de usuario
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setIsLoading(false);
      return;
    }

    // Usuario autenticado correctamente
    const user = data.user;
    if (!user) {
      alert("Error: no se pudo obtener el usuario autenticado.");
      setIsLoading(false);
      return;
    }

    // Consultar el rol del usuario desde la tabla Usuario
    const { data: userData, error: userError } = await supabase
      .from("Usuario")
      .select("rol")
      .eq("id_user_autenticacion", user.id)
      .single();

    if (userError || !userData) {
      console.error("Error al obtener datos del usuario:", userError?.message);
      alert("No se pudo obtener la información del usuario.");
      setIsLoading(false);
      return;
    }

    const userRole = userData.rol?.toLowerCase();
    alert(`Inicio de sesión exitoso (${userRole})`);

    // 🔀 Redirigir según el rol
    // Aceptar variantes en inglés/español y comparar en minúsculas
    if (userRole === "reporter" || userRole === "reportero") {
      navigate("/dashboard-reportero");
    } else if (userRole === "editor" || userRole === "editor") {
      navigate("/dashboard-editor");
    } else {
      alert("Rol no reconocido. Contacta al administrador.");
    }

    setIsLoading(false);
  };

  // // Función para alternar visibilidad de contraseña
  // const togglePasswordVisibility = () => {
  //   setShowPassword(!showPassword);
  // };

  // Función para manejar el enlace de "Olvidé mi contraseña"
  const handleForgotPassword = (e) => {
    e.preventDefault();
    console.log('Abriendo modal de recuperación de contraseña...');
    // Aquí podrías abrir un modal o redirigir
  };

  // Auto-focus en el campo de email al cargar el componente
  useEffect(() => {
    const emailInput = document.getElementById('login-email');
    if (emailInput) {
      emailInput.focus();
    }
  }, []);


  return (
    <div className="">

      {/* Contenedor principal del login */}
      <div className="login-container">
        {/* Lado derecho - Formulario */}
        <div className="login-form-side">
          {/* Logo */}
          <div className="login-logo-section">
            <Link to="/" className="login-logo">
              {/* <img className="login-logo-icon" src="" /> */}
              <span>Amazonnews</span>
            </Link>
          </div>

          {/* Encabezado del formulario */}
          <div className="login-form-header">
            <h2 className="login-form-title">Iniciar Sesión</h2>
            <p className="login-form-subtitle">Accede a tu cuenta para continuar</p>
          </div>

          {/* Mensajes de éxito/error */}
          {message.type && (
            <div className={`login-message ${message.type}`}>
              {message.text}
            </div>
          )}

          {/* Formulario de login */}
          <form className="login-form" onSubmit={handleSubmit}>
            {/* Campo de email */}
            <div className="login-form-group">
              <label htmlFor="login-email" className="login-form-label">
                Correo Electrónico
              </label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">📧</span>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  className="login-form-input"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Campo de contraseña */}
            <div className="login-form-group">
              <label htmlFor="login-password" className="login-form-label">
                Contraseña
              </label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  name="password"
                  className="login-form-input"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Opciones del formulario */}
            <div className="login-form-options">
              <div className="login-checkbox-wrapper">
                <input
                  type="checkbox"
                  id="login-remember"
                  name="remember"
                  className="login-checkbox-input"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="login-remember" className="login-checkbox-label">
                  Recordarme
                </label>
              </div>
              <a
                href="#"
                className="login-forgot-link"
                onClick={handleForgotPassword}
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Botón de login */}
            <button
              type="submit"
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
              onClick={handleSubmit}
            >
              <div className="login-button-content">
                <div className={`login-loading-spinner ${isLoading ? '' : 'hidden'}`}></div>
                <span>{isLoading ? 'Iniciando sesión...' : 'Entrar'}</span>
              </div>
            </button>
          </form>

          {/* Divisor */}
          <div className="login-divider">
            <span>o</span>
          </div>

          {/* Enlace de registro */}
          <div className="login-signup-link">
            <span>¿No tienes cuenta?
              <Link to="/register" >Regístrate</Link></span>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;