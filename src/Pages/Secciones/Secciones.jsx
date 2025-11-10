import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient.js';
import './Secciones.css';

const Secciones = () => {
  // Obtener parámetros de la URL
  const { nombre } = useParams();

  // Estados principales
  const [seccionActual, setSeccionActual] = useState(null);
  const [noticias, setNoticias] = useState([]);
  const [seccionesRelacionadas, setSeccionesRelacionadas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Función para calcular tiempo relativo
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

  // Función para calcular tiempo de lectura (estimado)
  const calcularTiempoLectura = (contenido) => {
    if (!contenido) return '1 min';
    const palabras = contenido.split(/\s+/).length;
    const minutos = Math.ceil(palabras / 200); // 200 palabras por minuto
    return `${minutos} min`;
  };

  // Obtener nombre de autor (iniciales)
  const obtenerInicialesAutor = (nombre) => {
    if (!nombre) return 'AN';
    const partes = nombre.split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  };

  // Obtener datos de la sección y noticias
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setCargando(true);

        // Obtener la sección actual
        const { data: seccionData, error: errorSeccion } = await supabase
          .from('Seccion')
          .select('*')
          .eq('nombre_id', nombre)
          .single();

        if (errorSeccion) {
          console.error('Error al obtener sección:', errorSeccion);
          setCargando(false);
          return;
        }

        setSeccionActual(seccionData);

        // Obtener noticias de la sección que estén publicadas
        const { data: noticiasData, error: errorNoticias } = await supabase
          .from('Noticia')
          .select(`
            *,
            Seccion:Seccion (
              nombre,
              nombre_id
            ),
            Usuario:Usuario!Noticia_id_usuario_creador_fkey(
              nombre_completo
            )
          `)
          .eq('id_categoria', seccionData.id_seccion)
          .eq('estado', 'publicada')
          .order('created_at', { ascending: false });

        if (errorNoticias) {
          console.error('Error al obtener noticias:', errorNoticias);
        } else {
          setNoticias(noticiasData || []);
        }

        // Obtener otras secciones (excluyendo la actual, solo activas)
        const { data: seccionesData, error: errorSecciones } = await supabase
          .from('Seccion')
          .select('*')
          .neq('id_seccion', seccionData.id_seccion)
          .eq('estado', 1)
          .limit(5)
          .order('nombre', { ascending: true });

        if (errorSecciones) {
          console.error('Error al obtener secciones relacionadas:', errorSecciones);
        } else {
          setSeccionesRelacionadas(seccionesData || []);
        }

      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        setCargando(false);
      }
    };

    if (nombre) {
      obtenerDatos();
    }
  }, [nombre]);

  if (cargando) {
    return (
      <div className="secciones-cargando">
        <div className="cargando-spinner"></div>
        <p>Cargando sección...</p>
      </div>
    );
  }

  if (!seccionActual) {
    return (
      <div className="secciones-cargando">
        <p>Sección no encontrada</p>
      </div>
    );
  }

  return (
    <div className="secciones">
      {/* Header de Sección */}
      <section className="header-categoria">
        <div className="contenedor-header-categoria">
          <div className="info-categoria">
            {seccionActual.url_image ? (
              <div className="icono-categoria">
                <img 
                  src={seccionActual.url_image} 
                  alt={seccionActual.nombre}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              </div>
            ) : (
              <div className="icono-categoria">
                📰
              </div>
            )}
            <div className="detalles-categoria">
              <h1 className="titulo-categoria">{seccionActual.nombre}</h1>
              <p className="descripcion-categoria">{seccionActual.descripcion || 'Noticias de esta sección'}</p>
              <p className="descripcion-categoria">{noticias.length} artículos encontrados</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <div className="contenido-principal">
        {/* Sección de Artículos */}
        <main className="seccion-articulos">
          {noticias.length === 0 ? (
            <div className="sin-articulos">
              <p>No se encontraron noticias en esta sección.</p>
            </div>
          ) : (
            <div className="grid-articulos">
              {noticias.map((noticia) => (
                <Link
                  key={noticia.id_noticia}
                  to={`/noticia/${noticia.id_noticia}`}
                  className="tarjeta-articulo"
                >
                  <div className="imagen-articulo">
                    {noticia.image_url ? (
                      <img
                        src={noticia.image_url}
                        alt={noticia.titulo}
                        className="imagen-articulo-real"
                      />
                    ) : (
                      <span className="emoji-articulo">📰</span>
                    )}
                  </div>
                  <div className="contenido-articulo">
                    <div className="meta-articulo">
                      <span className="categoria-articulo">
                        {noticia.Seccion?.nombre || seccionActual.nombre}
                      </span>
                      <span className="fecha-articulo">
                        <span>🕒</span>
                        {calcularTiempoRelativo(noticia.created_at || noticia.fecha_creacion)}
                      </span>
                    </div>
                    <h3 className="titulo-articulo">{noticia.titulo || 'Sin título'}</h3>
                    <p className="extracto-articulo">
                      {noticia.extracto || noticia.contenido?.substring(0, 150) || 'Sin descripción disponible'}
                    </p>
                    <div className="pie-articulo">
                      <div className="autor-articulo">
                        <div className="avatar-autor">
                          {obtenerInicialesAutor(noticia.Usuario.nombre_completo || 'Anónimo')}
                        </div>
                        <div className="info-autor">
                          <div className="nombre-autor">
                            {noticia.Usuario.nombre_completo || 'Anónimo'}
                          </div>
                        </div>
                      </div>
                      <div className="tiempo-lectura">
                        <span>📖</span>
                        {calcularTiempoLectura(noticia.contenido)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>

        {/* Barra Lateral - Otras Secciones */}
        <aside className="barra-lateral">
          <div className="widget-lateral">
            <h3 className="titulo-widget">Otras Secciones</h3>
            <div className="categorias-relacionadas">
              {seccionesRelacionadas.map((seccion) => (
                <Link
                  key={seccion.id_seccion}
                  to={`/seccion/${seccion.nombre_id}`}
                  className="enlace-categoria"
                >
                  {seccion.url_image ? (
                    <div className="icono-enlace-categoria">
                      <img 
                        src={seccion.url_image} 
                        alt={seccion.nombre}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                      />
                    </div>
                  ) : (
                    <div className="icono-enlace-categoria">
                      📰
                    </div>
                  )}
                  <div className="info-enlace-categoria">
                    <h4>{seccion.nombre}</h4>
                    <p>{seccion.descripcion || 'Ver noticias'}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Secciones;
