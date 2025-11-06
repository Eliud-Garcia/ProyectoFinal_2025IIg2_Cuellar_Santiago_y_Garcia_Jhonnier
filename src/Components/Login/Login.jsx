import React, { useState, useEffect } from 'react';
import './Login.css';
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient.js';
import { useNavigate} from 'react-router-dom';
import {logo_amazonia} from "../../../config.js"


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

    // Ocultar mensajes previos
    setMessage({ type: '', text: '' });
    console.log(logo_amazonia);

    // Mostrar estado de carga
    setIsLoading(true);

    //login de usuario
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    if (error) {
      alert(error.message)
      setIsLoading(false);
      return
    }
    alert('Inicio de sesión exitoso')

    navigate('/dashboard_reportero')

  };

  // Función para alternar visibilidad de contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Función para manejar el enlace de "Olvidé mi contraseña"
  const handleForgotPassword = (e) => {
    e.preventDefault();
    console.log('Abriendo modal de recuperación de contraseña...');
    // Aquí podrías abrir un modal o redirigir
  };

  // Función para manejar el enlace de registro
  const handleSignup = (e) => {
    e.preventDefault();
    console.log('Redirigiendo a la página de registro...');
    // Aquí podrías redirigir a la página de registro
    // navigate('/register');
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
              <img className="login-logo-icon" src={logo_amazonia}/>
              <span>NewsPortal</span>
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