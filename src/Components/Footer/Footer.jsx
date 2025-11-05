import React from 'react'
import './Footer.css'
const Footer = () => {
    return (
        <footer className="landing-footer">
            <div className="landing-footer-container">
                <div className="landing-footer-section">
                    <h3>Amazonews</h3>
                    <p>La plataforma oficial de noticias de la Universidad de la Amazonia, que conecta a nuestra comunidad académica a través de historias que importan.</p>
                    <div className="landing-social-icons">
                        <a href="#" className="landing-social-icon" target="_blank" rel="noopener noreferrer">
                            f
                        </a>
                        <a href="#" className="landing-social-icon" target="_blank" rel="noopener noreferrer">
                            📷
                        </a>
                        <a href="#" className="landing-social-icon" target="_blank" rel="noopener noreferrer">
                            ▶
                        </a>
                    </div>
                </div>
                <div className="landing-footer-section">
                    <h3>Accesos directos</h3>
                    <p><a href="#about">Sobre nosotros</a></p>
                    <p><a href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')}>Contactanos</a></p>
                    <p><a href="#">Politica de privacidad</a></p>
                    <p><a href="#">Terminos y condiciones</a></p>
                </div>
                <div className="landing-footer-section">
                    <h3>Universidad</h3>
                    <p>Universidad de la Amazonia</p>
                    <p>Cl 5b #1179, Florencia, Caquetá, Colombia.</p>
                    <p>Florencia, Caquetá, Colombia</p>
                    <p>Phone: +57 3105863364</p>
                </div>
            </div>
            <div className="landing-footer-bottom">
                <p>© 2025 Amazonews – Universidad de la Amazonia</p>
            </div>
        </footer>
    )
}

export default Footer