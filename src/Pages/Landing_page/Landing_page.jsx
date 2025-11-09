import React, { useEffect, useState } from 'react';
import './Landing_page.css';
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient.js'
import {logo_amazonia} from "../../../config.js"


const Landing_page = () => {
  // Estados para el formulario de contacto
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [secciones, setSecciones] = useState([]);

  useEffect(() => {
    const obtenerSecciones = async () => {
      const { data, error } = await supabase.from('Seccion').select('*');
      if (data) {
        console.log(data);
        setSecciones(data);
      } else {
        console.error(error);
        return;
      }
    }
    obtenerSecciones()
  }, [])

  // Función para manejar el scroll suave a secciones
  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Función para manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    // Simular envío del formulario
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      // Resetear el estado después de 3 segundos
      setTimeout(() => {
        setSubmitStatus('');
      }, 3000);
    }, 1000);
  };

  return (
    <div className="landing-wrapper">
      {/* Sección Hero */}
      <section className="landing-hero" id="home">
        <div className="landing-hero-container">
          <h1>Bienvenido a las noticias de la Universidad de la Amazonia</h1>
          <p>Descubre ideas, eventos, noticias y muchos mas ...</p>
          <div className="landing-hero-buttons">
            <Link
              to="/panel-noticias"
              className="landing-btn-primary"
              // onClick={(e) => handleSmoothScroll(e, 'categories')}
            >
              Lee las noticias mas recientes
            </Link>
            <Link
              to="/panel-noticias"
              className="landing-btn-secondary"
            >
              Quiero contar una historia
            </Link>
          </div>
        </div>
      </section>

      {/* Sección de Categorías */}
      <section className="landing-categories" id="categories">
        <div className="landing-categories-container">
          <h2 className="landing-section-title">Explora las noticias por categoria</h2>
          <div className="landing-categories-grid">
            {
              secciones.map(seccion => {
                return (
                  <Link to={`/seccion/${seccion.nombre_id}`} className="landing-category-item">
                    <h3>{seccion.nombre}</h3>
                    <p>{seccion.descripcion}</p>
                  </Link>
                );
              })

            }
          </div>
        </div>
      </section>

      {/* Banner Destacado */}
      <section className="landing-featured-banner">
        <div className="landing-banner-container">
          <div className="landing-banner-tag">La red de noticias de la universidad de la Amazonia</div>
          <h2>Lee la mas exclusiva y recientes noticas de la Universidad de la Amazonia, quedate al tanto del todo.</h2>
          <Link to="/panel-noticias" className="landing-btn-banner">Leer noticias</Link>
        </div>
      </section>

      {/* Sección Sobre nosotros */}
      <section className="landing-all-in-one" id="about">
        <div className="landing-all-in-one-container">
          <h2 className="landing-section-title">Somos un grupo independiente de noticias locales</h2>
          <div className='landing-section-p'>Te mantenemos informados de todo lo nuevo en la universidad de la Amazonia</div>
          <div className="landing-topics-grid">
            <div className="landing-topic-group">
              <h3>Investigaciones</h3>
              <div className="landing-topic-links">
                <Link to="/panel-noticias" className="landing-topic-link">
                  <span className="landing-topic-tag">Nuevas</span> Investigaciones
                </Link>
                <Link to="/panel-noticias" className="landing-topic-link">
                  <span className="landing-topic-tag">Mejores</span> Revistas
                </Link>
                <Link to="/panel-noticias" className="landing-topic-link">
                  <span className="landing-topic-tag">Innovaciones</span> Tecnologicas
                </Link>
              </div>
            </div>
            <div className="landing-topic-group">
              <h3>Bienestar Universitario</h3>
              <div className="landing-topic-links">
                <Link to="/panel-noticias" className="landing-topic-link">
                  <span className="landing-topic-tag">Eventos</span> Deportivos
                </Link>
                <Link to="/panel-noticias" className="landing-topic-link">
                  <span className="landing-topic-tag">Sesiones</span> de salud
                </Link>
                <Link to="/panel-noticias" className="landing-topic-link">
                  <span className="landing-topic-tag">Grupos</span> deportivos
                </Link>
              </div>
            </div>
            <div className="landing-topic-group">
              <h3>Politicas institucionales</h3>
              <div className="landing-topic-links">
                <Link to="/panel-noticias" className="landing-topic-link">
                  <span className="landing-topic-tag">Decisiones</span> oficiales del Rector
                </Link>
                <Link to="/panel-noticias" className="landing-topic-link">
                  <span className="landing-topic-tag">Actualizacion</span> de Politicas
                </Link>
                <Link to="/panel-noticias" className="landing-topic-link">
                  <span className="landing-topic-tag">Nuevos</span> Acuerdos
                </Link>
              </div>
            </div>
            <div className="landing-topic-group">
              <h3>Encuentros culturales</h3>
              <div className="landing-topic-links">
                <Link to="/panel-noticias" className="landing-topic-link">
                  <span className="landing-topic-tag">Noches</span> de cine
                </Link>
                <Link to="/panel-noticias" className="landing-topic-link">
                  <span className="landing-topic-tag">Rumba</span> Terapia
                </Link>
                <Link to="/panel-noticias" className="landing-topic-link">
                  <span className="landing-topic-tag">Integracion</span> comunal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Promocional */}
      <section className="landing-promo-banner">
        <div className="landing-promo-container">
          <h2>Unete a nuestro equipo de noticias y haz parte de las historias</h2>
          <p>Contribuye haciendo tus propias noticias y comparte ideas con la comunidad</p>
          <Link
            to="/login"
            className="landing-btn-promo"
          >
            El reportero soy yo!
          </Link>
        </div>
      </section>

      {/* Sección de Contacto */}
      <section className="landing-contact" id="contact">
        <div className="landing-contact-container">
          <h2>Contactanos</h2>
          <p>Comunicanos algun suceso que quieras del que hablemos en nuestras noticias</p>
          <form className="landing-contact-form" onSubmit={handleSubmit}>
            <div className="landing-form-group">
              <label htmlFor="contact-name">Nombre</label>
              <input
                type="text"
                id="contact-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="landing-form-group">
              <label htmlFor="contact-email">Correo</label>
              <input
                type="email"
                id="contact-email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="landing-form-group">
              <label htmlFor="contact-subject">Asunto</label>
              <input
                type="text"
                id="contact-subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="landing-form-group">
              <label htmlFor="contact-message">Mensaje</label>
              <textarea
                id="contact-message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="landing-btn-primary"
              disabled={isSubmitting || submitStatus === 'success'}
              
            >
              {isSubmitting ? 'Sending...' : submitStatus === 'success' ? 'Mensaje enviado!' : 'Enviar Mensaje'}
            </button>
          </form>
        </div>
      </section>      
    </div>
  );
};

export default Landing_page;
