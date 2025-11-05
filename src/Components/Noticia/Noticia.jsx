import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient.js';
import './Noticia.css';

const Noticia = () => {
  // Obtener parámetros de la URL
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados principales
  const [noticia, setNoticia] = useState(null);
  const [noticiasRelacionadas, setNoticiasRelacionadas] = useState([]);
  const [noticiasSeccion, setNoticiasSeccion] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardado, setGuardado] = useState(false);
  const [progresoLectura, setProgresoLectura] = useState(0);
  const [comentarioTexto, setComentarioTexto] = useState('');
  const [enviandoComentario, setEnviandoComentario] = useState(false);

  // Referencias para la tabla de contenidos
  const seccionesRef = useRef([]);

  // Categorías con información
  const categorias = {
    'Tecnología': { icono: '💻', gradiente: 'linear-gradient(135deg, #667eea, #764ba2)' },
    'Deportes': { icono: '⚽', gradiente: 'linear-gradient(135deg, #4CAF50, #81C784)' },
    'Política': { icono: '🏛️', gradiente: 'linear-gradient(135deg, #FF9800, #FFB74D)' },
    'Cultura': { icono: '🎭', gradiente: 'linear-gradient(135deg, #f44336, #EF5350)' },
    'Negocios': { icono: '💼', gradiente: 'linear-gradient(135deg, #9C27B0, #BA68C8)' },
    'Ciencia': { icono: '🔬', gradiente: 'linear-gradient(135deg, #00BCD4, #4DD0E1)' }
  };

  // Obtener información de la categoría
  const obtenerInfoCategoria = (categoria) => {
    return categorias[categoria] || categorias['Tecnología'];
  };

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return 'Fecha no disponible';
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Función para calcular tiempo de lectura
  const calcularTiempoLectura = (contenido) => {
    if (!contenido) return '1 min';
    const palabras = contenido.split(/\s+/).length;
    const minutos = Math.ceil(palabras / 200); // 200 palabras por minuto
    return `${minutos} min de lectura`;
  };

  // Función para obtener iniciales del autor
  const obtenerInicialesAutor = (nombre) => {
    if (!nombre) return 'AN';
    const partes = nombre.split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  };

  // Función para calcular tiempo relativo
  const calcularTiempoRelativo = (fecha) => {
    if (!fecha) return 'Fecha desconocida';
    
    const ahora = new Date();
    const fechaComentario = new Date(fecha);
    const diferenciaMs = ahora - fechaComentario;
    const diferenciaHoras = Math.floor(diferenciaMs / (1000 * 60 * 60));
    const diferenciaDias = Math.floor(diferenciaHoras / 24);
    
    if (diferenciaHoras < 1) {
      return 'Hace menos de 1 hora';
    } else if (diferenciaHoras === 1) {
      return 'Hace 1 hora';
    } else if (diferenciaHoras < 24) {
      return `Hace ${diferenciaHoras} horas`;
    } else if (diferenciaDias === 1) {
      return 'Hace 1 día';
    } else {
      return `Hace ${diferenciaDias} días`;
    }
  };

  // Obtener noticia individual
  useEffect(() => {
    const obtenerNoticia = async () => {
      try {
        setCargando(true);

        // Obtener la noticia por ID
        const { data: noticiaData, error } = await supabase
          .from('Noticia')
          .select('*')
          .eq('id_noticia', id)
          .single();

        let noticiaObtenida = null;

        if (error) {
          console.error('Error al obtener noticia:', error);
          // Intentar con otro campo si existe
          const { data: noticiaAlt, error: error2 } = await supabase
            .from('Noticia')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error2) {
            console.error('Error al obtener noticia alternativa:', error2);
          } else {
            noticiaObtenida = noticiaAlt;
            setNoticia(noticiaAlt);
          }
        } else {
          noticiaObtenida = noticiaData;
          setNoticia(noticiaData);
        }

        // Obtener noticias relacionadas (misma categoría)
        if (noticiaObtenida?.categoria) {
          const { data: relacionadas } = await supabase
            .from('Noticia')
            .select('*')
            .ilike('categoria', noticiaObtenida.categoria)
            .neq('id_noticia', noticiaObtenida.id_noticia || id)
            .order('fecha_creacion', { ascending: false })
            .limit(3);

          setNoticiasRelacionadas(relacionadas || []);

          // Obtener más noticias de la misma sección
          const { data: seccion } = await supabase
            .from('Noticia')
            .select('*')
            .ilike('categoria', noticiaObtenida.categoria)
            .neq('id_noticia', noticiaObtenida.id_noticia || id)
            .order('fecha_creacion', { ascending: false })
            .limit(3);

          setNoticiasSeccion(seccion || []);
        }

        // Obtener comentarios (si existe tabla de comentarios)
        // Por ahora, usaremos comentarios simulados
        setComentarios([
          {
            id: 1,
            autor: 'Dr. José García',
            iniciales: 'JG',
            fecha: new Date(Date.now() - 2 * 60 * 60 * 1000),
            texto: 'Excelente artículo. Como médico, puedo confirmar que estos avances son realmente prometedores.',
            likes: 12
          },
          {
            id: 2,
            autor: 'Laura Mendoza',
            iniciales: 'LM',
            fecha: new Date(Date.now() - 4 * 60 * 60 * 1000),
            texto: 'Me parece fascinante, pero también me preocupa el aspecto ético.',
            likes: 8
          },
          {
            id: 3,
            autor: 'Roberto Sánchez',
            iniciales: 'RS',
            fecha: new Date(Date.now() - 6 * 60 * 60 * 1000),
            texto: '¿Cuándo estará disponible esta tecnología para hospitales públicos?',
            likes: 15
          }
        ]);

      } catch (error) {
        console.error('Error al obtener noticia:', error);
      } finally {
        setCargando(false);
      }
    };

    if (id) {
      obtenerNoticia();
    }
  }, [id]);

  // Actualizar barra de progreso al hacer scroll
  useEffect(() => {
    const actualizarProgreso = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgresoLectura(Math.min(scrollPercent, 100));
    };

    window.addEventListener('scroll', actualizarProgreso);
    return () => window.removeEventListener('scroll', actualizarProgreso);
  }, []);

  // Extraer encabezados del contenido para la tabla de contenidos
  useEffect(() => {
    if (noticia?.contenido) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(noticia.contenido, 'text/html');
      const headings = doc.querySelectorAll('h2, h3');
      
      const secciones = Array.from(headings).map((heading, index) => {
        const id = heading.id || `seccion-${index}`;
        if (!heading.id) heading.id = id;
        return {
          id,
          texto: heading.textContent,
          nivel: heading.tagName.toLowerCase()
        };
      });

      seccionesRef.current = secciones;
    }
  }, [noticia]);

  // Manejar compartir en redes sociales
  const manejarCompartir = (redSocial) => {
    const url = encodeURIComponent(window.location.href);
    const titulo = encodeURIComponent(noticia?.titulo || '');
    
    let shareUrl = '';
    switch(redSocial) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${titulo}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${titulo} ${url}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${titulo}&body=Te recomiendo leer este artículo: ${url}`;
        break;
      default:
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  // Manejar guardar noticia
  const manejarGuardar = () => {
    setGuardado(!guardado);
    // Aquí puedes implementar la lógica para guardar en favoritos
  };

  // Manejar enviar comentario
  const manejarEnviarComentario = async (e) => {
    e.preventDefault();
    if (!comentarioTexto.trim()) return;

    setEnviandoComentario(true);

    // Simular envío de comentario
    setTimeout(() => {
      const nuevoComentario = {
        id: comentarios.length + 1,
        autor: 'Tú',
        iniciales: 'TU',
        fecha: new Date(),
        texto: comentarioTexto,
        likes: 0
      };

      setComentarios([nuevoComentario, ...comentarios]);
      setComentarioTexto('');
      setEnviandoComentario(false);
    }, 1000);
  };

  // Manejar like en comentario
  const manejarLikeComentario = (comentarioId) => {
    setComentarios(comentarios.map(comentario => {
      if (comentario.id === comentarioId) {
        return { ...comentario, likes: comentario.likes + 1 };
      }
      return comentario;
    }));
  };

  // Manejar suscripción al newsletter
  const manejarNewsletter = (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    if (email) {
      alert(`¡Gracias por suscribirte con ${email}!`);
      e.target.reset();
    }
  };

  // Scroll suave a sección
  const scrollASeccion = (seccionId) => {
    const elemento = document.getElementById(seccionId);
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (cargando) {
    return (
      <div className="noticia-cargando">
        <div className="cargando-spinner"></div>
        <p>Cargando noticia...</p>
      </div>
    );
  }

  if (!noticia) {
    return (
      <div className="noticia-no-encontrada">
        <h2>Noticia no encontrada</h2>
        <p>La noticia que buscas no existe o ha sido eliminada.</p>
        <Link to="/" className="boton-volver">Volver al inicio</Link>
      </div>
    );
  }

  const infoCategoria = obtenerInfoCategoria(noticia.categoria);

  return (
    <div className="noticia">
      {/* Barra de progreso */}
      <div 
        className="barra-progreso" 
        style={{ width: `${progresoLectura}%` }}
      ></div>

      {/* Navegación */}
      <nav className="barra-navegacion">
        <div className="contenedor-navegacion">
          <Link to="/" className="logo">
            <div className="logo-icono">N</div>
            <span>NewsPortal</span>
          </Link>
          <ul className="menu-navegacion">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/noticias">Noticias</Link></li>
            <li><Link to={`/secciones/${noticia.categoria}`}>{noticia.categoria}</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
          <button className="boton-menu-movil">☰</button>
        </div>
      </nav>

      {/* Botones de compartir */}
      <div className="botones-compartir">
        <button
          className="boton-compartir facebook"
          onClick={() => manejarCompartir('facebook')}
          title="Compartir en Facebook"
        >
          f
        </button>
        <button
          className="boton-compartir twitter"
          onClick={() => manejarCompartir('twitter')}
          title="Compartir en Twitter"
        >
          🐦
        </button>
        <button
          className="boton-compartir linkedin"
          onClick={() => manejarCompartir('linkedin')}
          title="Compartir en LinkedIn"
        >
          in
        </button>
        <button
          className="boton-compartir whatsapp"
          onClick={() => manejarCompartir('whatsapp')}
          title="Compartir en WhatsApp"
        >
          📱
        </button>
        <button
          className="boton-compartir email"
          onClick={() => manejarCompartir('email')}
          title="Enviar por email"
        >
          📧
        </button>
      </div>

      {/* Sección Hero */}
      <section 
        className="seccion-hero"
        style={{ background: infoCategoria.gradiente }}
      >
        <div className="imagen-hero">
          {noticia.imagen_principal ? (
            <img 
              src={noticia.imagen_principal} 
              alt={noticia.titulo}
              className="imagen-hero-real"
            />
          ) : (
            <span className="emoji-hero">{infoCategoria.icono}</span>
          )}
        </div>
        <div className="overlay-hero">
          <div className="contenido-hero">
            <span className="categoria-hero">{noticia.categoria || 'General'}</span>
            <h1 className="titulo-hero">{noticia.titulo || 'Sin título'}</h1>
            <p className="subtitulo-hero">
              {noticia.extracto || noticia.contenido?.substring(0, 200) || 'Sin descripción disponible'}
            </p>
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <div className="contenedor-principal">
        {/* Contenido del Artículo */}
        <main className="contenido-articulo">
          {/* Meta del Artículo */}
          <div className="meta-articulo">
            <div className="info-autor">
              <div 
                className="avatar-autor"
                style={{ background: infoCategoria.gradiente }}
              >
                {obtenerInicialesAutor(noticia.nombre_autor || 'Anónimo')}
              </div>
              <div className="detalles-autor">
                <h3 className="nombre-autor">{noticia.nombre_autor || 'Anónimo'}</h3>
                <p className="cargo-autor">Especialista en {noticia.categoria || 'General'}</p>
              </div>
            </div>
            <div className="estadisticas-articulo">
              <div className="item-estadistica">
                <span>📅</span>
                <span>{formatearFecha(noticia.fecha_creacion)}</span>
              </div>
              <div className="item-estadistica">
                <span>🕒</span>
                <span>{calcularTiempoLectura(noticia.contenido)}</span>
              </div>
              <div className="item-estadistica">
                <span>👁️</span>
                <span>{noticia.vistas || noticia.numero_vistas || 0} vistas</span>
              </div>
            </div>
            <div className="acciones-articulo">
              <button 
                className="boton-accion"
                onClick={() => window.print()}
              >
                <span>🖨️</span>
                Imprimir
              </button>
              <button 
                className={`boton-accion ${guardado ? 'guardado' : ''}`}
                onClick={manejarGuardar}
              >
                <span>🔖</span>
                {guardado ? 'Guardado' : 'Guardar'}
              </button>
            </div>
          </div>

          {/* Cuerpo del Artículo */}
          <div 
            className="cuerpo-articulo"
            dangerouslySetInnerHTML={{ __html: noticia.contenido || '<p>Contenido no disponible</p>' }}
          ></div>

          {/* Biografía del Autor */}
          <div className="biografia-autor">
            <div className="header-biografia">
              <div 
                className="avatar-biografia"
                style={{ background: infoCategoria.gradiente }}
              >
                {obtenerInicialesAutor(noticia.nombre_autor || 'Anónimo')}
              </div>
              <div className="info-biografia">
                <h3 className="nombre-biografia">{noticia.nombre_autor || 'Anónimo'}</h3>
                <p className="cargo-biografia">Especialista en {noticia.categoria || 'General'}</p>
              </div>
            </div>
            <p className="descripcion-biografia">
              {noticia.biografia_autor || `Especialista con amplia experiencia en ${noticia.categoria || 'su área de expertise'}.`}
            </p>
            <div className="social-biografia">
              <a href="#" className="icono-social" target="_blank" rel="noopener noreferrer">🐦</a>
              <a href="#" className="icono-social" target="_blank" rel="noopener noreferrer">in</a>
              <a href="#" className="icono-social" target="_blank" rel="noopener noreferrer">📧</a>
            </div>
          </div>

          {/* Artículos Relacionados */}
          {noticiasRelacionadas.length > 0 && (
            <section className="articulos-relacionados">
              <h2 className="titulo-relacionados">Artículos Relacionados</h2>
              <div className="grid-relacionados">
                {noticiasRelacionadas.map((relacionada, indice) => {
                  const gradientes = [
                    'linear-gradient(135deg, #667eea, #764ba2)',
                    'linear-gradient(135deg, #4CAF50, #81C784)',
                    'linear-gradient(135deg, #FF9800, #FFB74D)'
                  ];
                  const gradiente = gradientes[indice % gradientes.length];

                  return (
                    <article 
                      key={relacionada.id_noticia || relacionada.id || indice}
                      className="tarjeta-relacionada"
                      onClick={() => navigate(`/noticia/${relacionada.id_noticia || relacionada.id}`)}
                    >
                      <div 
                        className="imagen-relacionada"
                        style={{ background: gradiente }}
                      >
                        {relacionada.imagen_principal ? (
                          <img 
                            src={relacionada.imagen_principal} 
                            alt={relacionada.titulo}
                            className="imagen-relacionada-real"
                          />
                        ) : (
                          <span className="emoji-relacionada">{infoCategoria.icono}</span>
                        )}
                      </div>
                      <div className="contenido-relacionada">
                        <h3 className="titulo-relacionada">{relacionada.titulo || 'Sin título'}</h3>
                        <p className="extracto-relacionada">
                          {relacionada.extracto || relacionada.contenido?.substring(0, 100) || 'Sin descripción'}
                        </p>
                        <div className="meta-relacionada">
                          <span>{relacionada.nombre_autor || 'Anónimo'}</span>
                          <span>{calcularTiempoLectura(relacionada.contenido)}</span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {/* Sección de Comentarios */}
          <section className="seccion-comentarios">
            <h2 className="titulo-comentarios">Comentarios ({comentarios.length})</h2>
            <form className="formulario-comentario" onSubmit={manejarEnviarComentario}>
              <textarea
                className="textarea-comentario"
                placeholder="Comparte tu opinión sobre este artículo..."
                value={comentarioTexto}
                onChange={(e) => setComentarioTexto(e.target.value)}
                required
              ></textarea>
              <button 
                type="submit" 
                className="boton-enviar-comentario"
                disabled={enviandoComentario}
              >
                {enviandoComentario ? 'Enviando...' : 'Publicar Comentario'}
              </button>
            </form>
            <div className="lista-comentarios">
              {comentarios.map((comentario) => (
                <div key={comentario.id} className="comentario">
                  <div className="header-comentario">
                    <div 
                      className="avatar-comentario"
                      style={{ background: infoCategoria.gradiente }}
                    >
                      {comentario.iniciales}
                    </div>
                    <div className="info-comentario">
                      <h4 className="nombre-comentario">{comentario.autor}</h4>
                      <span className="fecha-comentario">
                        {calcularTiempoRelativo(comentario.fecha)}
                      </span>
                    </div>
                  </div>
                  <p className="texto-comentario">{comentario.texto}</p>
                  <div className="acciones-comentario">
                    <button 
                      className="boton-like"
                      onClick={() => manejarLikeComentario(comentario.id)}
                    >
                      👍 {comentario.likes}
                    </button>
                    <button className="boton-responder">Responder</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Barra Lateral */}
        <aside className="barra-lateral">
          {/* Tabla de Contenidos */}
          {seccionesRef.current.length > 0 && (
            <div className="widget-lateral">
              <h3 className="titulo-widget">Tabla de Contenidos</h3>
              <ul className="lista-toc">
                {seccionesRef.current.map((seccion) => (
                  <li key={seccion.id} className="item-toc">
                    <button
                      className="enlace-toc"
                      onClick={() => scrollASeccion(seccion.id)}
                    >
                      {seccion.texto}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Más de la Sección */}
          {noticiasSeccion.length > 0 && (
            <div className="widget-lateral">
              <h3 className="titulo-widget">Más de {noticia.categoria}</h3>
              <div className="mas-articulos">
                {noticiasSeccion.map((art, indice) => {
                  const gradientes = [
                    'linear-gradient(135deg, #667eea, #764ba2)',
                    'linear-gradient(135deg, #4CAF50, #81C784)',
                    'linear-gradient(135deg, #FF9800, #FFB74D)'
                  ];
                  const gradiente = gradientes[indice % gradientes.length];

                  return (
                    <div
                      key={art.id_noticia || art.id || indice}
                      className="articulo-mini"
                      onClick={() => navigate(`/noticia/${art.id_noticia || art.id}`)}
                    >
                      <div 
                        className="miniatura-articulo"
                        style={{ background: gradiente }}
                      >
                        {art.imagen_principal ? (
                          <img 
                            src={art.imagen_principal} 
                            alt={art.titulo}
                            className="miniatura-imagen"
                          />
                        ) : (
                          <span className="emoji-miniatura">{infoCategoria.icono}</span>
                        )}
                      </div>
                      <div className="contenido-mini">
                        <h4 className="titulo-mini">{art.titulo || 'Sin título'}</h4>
                        <p className="meta-mini">
                          {calcularTiempoRelativo(art.fecha_creacion)} • {calcularTiempoLectura(art.contenido)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Newsletter */}
          <div className="widget-lateral">
            <h3 className="titulo-widget">Newsletter {noticia.categoria}</h3>
            <p className="descripcion-newsletter">
              Recibe las últimas noticias directamente en tu email.
            </p>
            <form className="formulario-newsletter" onSubmit={manejarNewsletter}>
              <input
                type="email"
                placeholder="tu@email.com"
                className="input-newsletter"
                required
              />
              <button type="submit" className="boton-newsletter">
                Suscribirse
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Noticia;
