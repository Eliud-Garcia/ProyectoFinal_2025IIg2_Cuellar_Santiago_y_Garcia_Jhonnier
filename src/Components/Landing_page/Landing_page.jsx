import React, { useEffect, useState } from 'react';
import './Landing_page.css';
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient.js'

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
      {/* Navegación */}
      <nav className="landing-nav">
        <div className="landing-nav-container">
          <a href="#" className="landing-logo" onClick={(e) => handleSmoothScroll(e, 'home')}>
            <img className="landing-logo-icon" src="/logo_amazo.png" />
            <span>Amazonews</span>
          </a>
          <div className="landing-nav-links">
            <a href="#home" onClick={(e) => handleSmoothScroll(e, 'home')}>Home</a>
            <a href="#categories" onClick={(e) => handleSmoothScroll(e, 'categories')}>Secciones</a>
            <a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')}>Sobre nosotros</a>
            <a href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')}>Contactanos</a>
          </div>
          <div className="landing-nav-buttons">
            <a
              href="#categories"
              className="landing-btn-explore"
              onClick={(e) => handleSmoothScroll(e, 'categories')}
            >
              Explora todas las noticias
            </a>
            <Link to="/login" className="landing-btn-join">
              Se parte de nuestro equipo
            </Link>
            {/* <a 
              href="#contact" 
              className="landing-btn-join"
              onClick={(e) => handleSmoothScroll(e, 'contact')}
            >
              Se parte de nuestro equipo
            </a> */}
          </div>
        </div>
      </nav>

      {/* Sección Hero */}
      <section className="landing-hero" id="home">
        <div className="landing-hero-container">
          <h1>Bienvenido a las noticias de la Universidad de la Amazonia</h1>
          <p>Descubre ideas, eventos, noticias y muchos mas ...</p>
          <div className="landing-hero-buttons">
            <a
              href="#categories"
              className="landing-btn-primary"
              onClick={(e) => handleSmoothScroll(e, 'categories')}
            >
              Lee las noticias mas recientes
            </a>
            <a
              href="#contact"
              className="landing-btn-secondary"
              onClick={(e) => handleSmoothScroll(e, 'contact')}
            >
              Quiero contar una historia
            </a>
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
                { console.log(seccion); }
                return (
                  <div className="landing-category-item">
                    {/* <span className="landing-icon">📚</span> */}
                    <h3>{seccion.nombre}</h3>
                    <p>{seccion.descripcion}</p>
                  </div>
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
          <a href="#" className="landing-btn-banner">Leer noticias</a>
        </div>
      </section>

      {/* Sección All-in-One */}
      <section className="landing-all-in-one" id="about">
        <div className="landing-all-in-one-container">
          <h2 className="landing-section-title">Somos un grupo independiente de noticias locales</h2>
          <div className='landing-section-p'>Te mantenemos informados de todo lo nuevo en la universidad de la Amazonia</div>
          <div className="landing-topics-grid">
            <div className="landing-topic-group">
              <h3>Investigaciones</h3>
              <div className="landing-topic-links">
                <a href="#" className="landing-topic-link">
                  <span className="landing-topic-tag">Nuevas</span> Investigaciones
                </a>
                <a href="#" className="landing-topic-link">
                  <span className="landing-topic-tag">Mejores</span> Revistas
                </a>
                <a href="#" className="landing-topic-link">
                  <span className="landing-topic-tag">Innovaciones</span> Tecnologicas
                </a>
              </div>
            </div>
            <div className="landing-topic-group">
              <h3>Bienestar Universitario</h3>
              <div className="landing-topic-links">
                <a href="#" className="landing-topic-link">
                  <span className="landing-topic-tag">Eventos</span> Deportivos
                </a>
                <a href="#" className="landing-topic-link">
                  <span className="landing-topic-tag">Sesiones</span> de salud
                </a>
                <a href="#" className="landing-topic-link">
                  <span className="landing-topic-tag">Grupos</span> deportivos
                </a>
              </div>
            </div>
            <div className="landing-topic-group">
              <h3>Politicas institucionales</h3>
              <div className="landing-topic-links">
                <a href="#" className="landing-topic-link">
                  <span className="landing-topic-tag">Decisiones</span> oficiales del Rector
                </a>
                <a href="#" className="landing-topic-link">
                  <span className="landing-topic-tag">Actualizacion</span> de Politicas
                </a>
                <a href="#" className="landing-topic-link">
                  <span className="landing-topic-tag">Nuevos</span> Acuerdos
                </a>
              </div>
            </div>
            <div className="landing-topic-group">
              <h3>Encuentros culturales</h3>
              <div className="landing-topic-links">
                <a href="#" className="landing-topic-link">
                  <span className="landing-topic-tag">Noches</span> de cine
                </a>
                <a href="#" className="landing-topic-link">
                  <span className="landing-topic-tag">Rumba</span> Terapia
                </a>
                <a href="#" className="landing-topic-link">
                  <span className="landing-topic-tag">Integracion</span> comunal
                </a>
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
          <a
            href="#contact"
            className="landing-btn-promo"
            onClick={(e) => handleSmoothScroll(e, 'contact')}
          >
            El reportero soy yo!
          </a>
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
              {isSubmitting ? 'Sending...' : submitStatus === 'success' ? 'Message Sent!' : 'Enviar Mensaje'}
            </button>
          </form>
        </div>
      </section>      
    </div>
  );
};

export default Landing_page;
