import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SocialMedias from "../SocialMedia/SocialMedias";

const Footer = () => {
  return (
    <footer className="bg-dark text-light mt-auto pt-5 pb-3">
      <div className="container">
        <div className="row gy-4">
          {/* Columna 1 */}
          <div className="col-md-4">
            <h5 className="fw-bold">Amazonews</h5>
            <p className="small">
              La plataforma oficial de noticias de la Universidad de la Amazonia,
              que conecta a nuestra comunidad académica a través de historias que importan.
            </p>
            <div className="d-flex gap-3 mt-3">
              <SocialMedias color="white" size="30"/>
            </div>
          </div>

          {/* Columna 2 */}
          <div className="col-md-4">
            <h5 className="fw-bold">Accesos directos</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#about" className="text-light text-decoration-none">
                  Sobre nosotros
                </a>
              </li>
              <li>
                <a href="#contact" className="text-light text-decoration-none">
                  Contáctanos
                </a>
              </li>
              <li>
                <a href="#" className="text-light text-decoration-none">
                  Política de privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-light text-decoration-none">
                  Términos y condiciones
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3 */}
          <div className="col-md-4">
            <h5 className="fw-bold">Universidad</h5>
            <p className="small mb-1">Universidad de la Amazonia</p>
            <p className="small mb-1">Cl 5b #1179, Florencia, Caquetá, Colombia.</p>
            <p className="small mb-1">Florencia, Caquetá, Colombia</p>
            <p className="small mb-0">📞 +57 3105863364</p>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="text-center small">
          © 2025 <strong>Amazonews</strong> – Universidad de la Amazonia
        </div>
      </div>
    </footer>
  );
};

export default Footer;
