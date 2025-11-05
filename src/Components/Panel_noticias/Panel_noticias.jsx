import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient.js';
import './Panel_noticias.css';

const Panel_noticias = () => {
  // Estados para las noticias
  const [noticias, setNoticias] = useState([]);
  const [noticiaPrincipal, setNoticiaPrincipal] = useState(null);
  const [noticiasRecientes, setNoticiasRecientes] = useState([]);
  const [noticiasTendencia, setNoticiasTendencia] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  // Categorías disponibles
  const categorias = [
    { nombre: 'Tecnología', icono: '💻', descripcion: 'Últimas innovaciones y avances tecnológicos' },
    { nombre: 'Deportes', icono: '⚽', descripcion: 'Resultados, análisis y noticias deportivas' },
    { nombre: 'Política', icono: '🏛️', descripcion: 'Análisis político y noticias gubernamentales' },
    { nombre: 'Cultura', icono: '🎭', descripcion: 'Arte, entretenimiento y eventos culturales' },
  ];

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return 'Fecha no disponible';
    
    const fechaObj = new Date(fecha);
    const opciones = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return fechaObj.toLocaleDateString('es-ES', opciones);
  };

  // Función para formatear fecha corta (para las tarjetas)
  const formatearFechaCorta = (fecha) => {
    if (!fecha) return '';
    
    const fechaObj = new Date(fecha);
    const mes = fechaObj.toLocaleDateString('es-ES', { month: 'short' });
    const dia = fechaObj.getDate();
    return `${dia} ${mes}`;
  };

  // Función para calcular tiempo relativo (para tendencias)
  const calcularTiempoRelativo = (fecha) => {
    if (!fecha) return 'Fecha desconocida';
    
    const ahora = new Date();
    const fechaNoticia = new Date(fecha);
    const diferenciaMs = ahora - fechaNoticia;
    const diferenciaHoras = Math.floor(diferenciaMs / (1000 * 60 * 60));
    
    if (diferenciaHoras < 1) {
      return 'Hace menos de 1 hora';
    } else if (diferenciaHoras === 1) {
      return 'Hace 1 hora';
    } else {
      return `Hace ${diferenciaHoras} horas`;
    }
  };

  // Obtener todas las noticias publicadas
  useEffect(() => {
    const obtenerNoticias = async () => {
      try {
        setCargando(true);
        
        // Obtener noticias con estado 'publicada' o 'aprobada' (ajustar según tu esquema)
        const { data: noticiasData, error } = await supabase
          .from('Noticia')
          .select('*')
          .eq('estado', 'publicada') // Ajustar según el estado de tus noticias publicadas
          .order('fecha_creacion', { ascending: false })
          .limit(20); // Limitar a 20 noticias más recientes

        if (error) {
          console.error('Error al obtener noticias:', error);
          // Si no hay campo 'estado', intentar obtener todas
          const { data: todasLasNoticias, error: error2 } = await supabase
            .from('Noticia')
            .select('*')
            .order('fecha_creacion', { ascending: false })
            .limit(20);
          
          if (error2) {
            console.error('Error al obtener todas las noticias:', error2);
          } else {
            setNoticias(todasLasNoticias || []);
          }
        } else {
          setNoticias(noticiasData || []);
        }
      } catch (error) {
        console.error('Error al obtener noticias:', error);
      } finally {
        setCargando(false);
      }
    };

    obtenerNoticias();
  }, []);

  // Separar noticia principal y recientes
  useEffect(() => {
    if (noticias.length > 0) {
      // La primera noticia es la principal (más reciente)
      setNoticiaPrincipal(noticias[0]);
      
      // Las siguientes 4 son las recientes
      setNoticiasRecientes(noticias.slice(1, 5));
      
      // Las siguientes 4 son las tendencias
      setNoticiasTendencia(noticias.slice(1, 5));
    }
  }, [noticias]);

  // Filtrar noticias por búsqueda
  const noticiasFiltradas = noticias.filter(noticia => {
    if (!terminoBusqueda) return true;
    const busqueda = terminoBusqueda.toLowerCase();
    return (
      noticia.titulo?.toLowerCase().includes(busqueda) ||
      noticia.extracto?.toLowerCase().includes(busqueda) ||
      noticia.categoria?.toLowerCase().includes(busqueda)
    );
  });

  // Manejar búsqueda
  const manejarBusqueda = () => {
    if (terminoBusqueda.trim()) {
      // Aquí puedes implementar navegación a una página de resultados
      console.log('Buscando:', terminoBusqueda);
    }
  };

  // Obtener gradiente de color según categoría
  const obtenerGradienteCategoria = (categoria, indice) => {
    const gradientes = [
      'linear-gradient(135deg, #667eea, #764ba2)', // Tecnología
      'linear-gradient(135deg, #4CAF50, #81C784)', // Deportes
      'linear-gradient(135deg, #FF9800, #FFB74D)', // Política
      'linear-gradient(135deg, #f44336, #EF5350)', // Cultura
    ];
    
    const indiceCategoria = categorias.findIndex(cat => cat.nombre === categoria);
    return indiceCategoria >= 0 ? gradientes[indiceCategoria] : gradientes[indice % gradientes.length];
  };

  if (cargando) {
    return (
      <div className="panel-cargando">
        <div className="cargando-spinner"></div>
        <p>Cargando noticias...</p>
      </div>
    );
  }

  return (
    <div className="panel-noticias">
      {/* Navegación */}
      <nav className="barra-navegacion">
        <div className="contenedor-navegacion">
          <a href="#" className="logo">
            <div className="logo-icono">
              N
            </div>
            <span>NewsPortal</span>
          </a>
          <ul className="menu-navegacion">
            <li><a href="#noticias">Noticias</a></li>
            <li><a href="#secciones">Secciones</a></li>
            <li><a href="#acerca">Acerca de</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
          <div className="contenedor-busqueda">
            <input
              type="text"
              className="input-busqueda"
              placeholder="Buscar noticias..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && manejarBusqueda()}
            />
            <button className="boton-buscar" onClick={manejarBusqueda}>
              Buscar
            </button>
          </div>
          <button className="boton-menu-movil">☰</button>
        </div>
      </nav>

      {/* Sección Hero - Noticia Principal */}
      {noticiaPrincipal && (
        <section className="seccion-hero">
          <div className="contenedor-hero">
            <div className="contenido-hero">
              <div className="meta-hero">
                <span 
                  className="etiqueta-categoria"
                  style={{ background: obtenerGradienteCategoria(noticiaPrincipal.categoria, 0) }}
                >
                  {noticiaPrincipal.categoria || 'General'}
                </span>
                <span className="etiqueta-fecha">
                  {formatearFecha(noticiaPrincipal.fecha_creacion)}
                </span>
              </div>
              <h1 className="titulo-hero">{noticiaPrincipal.titulo || 'Sin título'}</h1>
              <p className="extracto-hero">
                {noticiaPrincipal.extracto || noticiaPrincipal.contenido?.substring(0, 200) || 'Sin descripción disponible'}
              </p>
              <a href="#" className="boton-leer-mas">Leer Más</a>
            </div>
            <div 
              className="imagen-hero"
              style={{ background: obtenerGradienteCategoria(noticiaPrincipal.categoria, 0) }}
            >
              {noticiaPrincipal.imagen_principal ? (
                <img 
                  src={noticiaPrincipal.imagen_principal} 
                  alt={noticiaPrincipal.titulo}
                  className="imagen-hero-real"
                />
              ) : (
                <span className="emoji-hero">
                  {categorias.find(cat => cat.nombre === noticiaPrincipal.categoria)?.icono || '📰'}
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Contenido Principal */}
      <div className="contenido-principal">
        {/* Noticias Recientes */}
        <section className="noticias-recientes">
          <h2 className="titulo-seccion">Noticias Más Recientes</h2>
          {noticiasFiltradas.length === 0 ? (
            <div className="sin-noticias">
              <p>No se encontraron noticias.</p>
            </div>
          ) : (
            <div className="grid-noticias">
              {noticiasFiltradas.slice(0, 8).map((noticia, indice) => (
                <article key={noticia.id_noticia || noticia.id || indice} className="tarjeta-noticia">
                  <div 
                    className="imagen-noticia"
                    style={{ background: obtenerGradienteCategoria(noticia.categoria, indice) }}
                  >
                    {noticia.imagen_principal ? (
                      <img 
                        src={noticia.imagen_principal} 
                        alt={noticia.titulo}
                        className="imagen-noticia-real"
                      />
                    ) : (
                      <span className="emoji-noticia">
                        {categorias.find(cat => cat.nombre === noticia.categoria)?.icono || '📰'}
                      </span>
                    )}
                  </div>
                  <div className="contenido-tarjeta">
                    <div className="meta-tarjeta">
                      <span className="categoria-tarjeta">{noticia.categoria || 'General'}</span>
                      <span className="fecha-tarjeta">
                        {formatearFechaCorta(noticia.fecha_creacion)}
                      </span>
                    </div>
                    <h3 className="titulo-tarjeta">{noticia.titulo || 'Sin título'}</h3>
                    <p className="extracto-tarjeta">
                      {noticia.extracto || noticia.contenido?.substring(0, 100) || 'Sin descripción'}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Barra Lateral */}
        <aside className="barra-lateral">
          {/* Widget de Tendencias */}
          <div className="widget">
            <h3 className="titulo-widget">Tendencias</h3>
            {noticiasTendencia.length > 0 ? (
              noticiasTendencia.map((noticia, indice) => (
                <div key={noticia.id_noticia || noticia.id || indice} className="item-tendencia">
                  <div 
                    className="numero-tendencia"
                    style={{ background: obtenerGradienteCategoria(noticia.categoria, indice) }}
                  >
                    {indice + 1}
                  </div>
                  <div className="contenido-tendencia">
                    <h4 className="titulo-tendencia">{noticia.titulo || 'Sin título'}</h4>
                    <p className="meta-tendencia">
                      {calcularTiempoRelativo(noticia.fecha_creacion)} • {noticia.categoria || 'General'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="sin-tendencias">No hay tendencias disponibles</p>
            )}
          </div>

          {/* Espacio Publicitario */}
          <div className="widget">
            <div className="espacio-publicitario">
              <p>Espacio Publicitario</p>
              <p>300 x 250</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Categorías Destacadas */}
      <section className="seccion-categorias">
        <div className="contenedor-categorias">
          <h2 className="titulo-seccion">Categorías Destacadas</h2>
          <div className="grid-categorias">
            {categorias.map((categoria, indice) => {
              const gradiente = obtenerGradienteCategoria(categoria.nombre, indice);
              return (
                <div 
                  key={categoria.nombre} 
                  className="tarjeta-categoria"
                  onClick={() => {
                    // Filtrar por categoría
                    setTerminoBusqueda(categoria.nombre);
                  }}
                >
                  <div 
                    className="icono-categoria"
                    style={{ background: gradiente }}
                  >
                    {categoria.icono}
                  </div>
                  <h3 className="titulo-categoria">{categoria.nombre}</h3>
                  <p className="descripcion-categoria">{categoria.descripcion}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pie de Página */}
      <footer className="pie-pagina">
        <div className="contenedor-pie">
          <div className="seccion-pie">
            <h4 className="titulo-pie">NewsPortal</h4>
            <p>Tu fuente confiable de noticias actualizadas las 24 horas del día.</p>
            <div className="iconos-sociales">
              <a href="#" className="icono-social" target="_blank" rel="noopener noreferrer">f</a>
              <a href="#" className="icono-social" target="_blank" rel="noopener noreferrer">📷</a>
              <a href="#" className="icono-social" target="_blank" rel="noopener noreferrer">🐦</a>
              <a href="#" className="icono-social" target="_blank" rel="noopener noreferrer">▶</a>
            </div>
          </div>
          <div className="seccion-pie">
            <h4 className="titulo-pie">Secciones</h4>
            <ul className="lista-pie">
              <li><a href="#">Noticias Nacionales</a></li>
              <li><a href="#">Noticias Internacionales</a></li>
              <li><a href="#">Deportes</a></li>
              <li><a href="#">Tecnología</a></li>
              <li><a href="#">Cultura</a></li>
            </ul>
          </div>
          <div className="seccion-pie">
            <h4 className="titulo-pie">Empresa</h4>
            <ul className="lista-pie">
              <li><a href="#">Acerca de Nosotros</a></li>
              <li><a href="#">Contacto</a></li>
              <li><a href="#">Política de Privacidad</a></li>
              <li><a href="#">Términos de Uso</a></li>
              <li><a href="#">Publicidad</a></li>
            </ul>
          </div>
          <div className="seccion-pie">
            <h4 className="titulo-pie">Contacto</h4>
            <ul className="lista-pie">
              <li>📧 info@newsportal.com</li>
              <li>📞 +1 (555) 123-4567</li>
              <li>📍 123 News Street, Ciudad</li>
              <li>🕒 Lunes - Viernes: 9:00 - 18:00</li>
            </ul>
          </div>
        </div>
        <div className="pie-inferior">
          <p>© 2025 NewsPortal. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Panel_noticias;
