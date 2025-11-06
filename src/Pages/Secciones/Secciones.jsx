import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient.js';
import './Secciones.css';

const Secciones = () => {
  // Obtener parámetros de la URL
  const { categoria } = useParams();
  const navigate = useNavigate();

  // Estados principales
  const [noticias, setNoticias] = useState([]);
  const [noticiasFiltradas, setNoticiasFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroActivo, setFiltroActivo] = useState('recientes');
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalNoticias, setTotalNoticias] = useState(0);
  const [categoriasRelacionadas, setCategoriasRelacionadas] = useState([]);
  const [tagsPopulares, setTagsPopulares] = useState([]);
  const noticiasPorPagina = 6;

  // Categorías disponibles con información
  const categorias = {
    'Tecnología': {
      nombre: 'Tecnología',
      icono: '💻',
      descripcion: 'Las últimas noticias sobre innovación, gadgets y avances tecnológicos',
      gradiente: 'linear-gradient(135deg, #667eea, #764ba2)'
    },
    'Deportes': {
      nombre: 'Deportes',
      icono: '⚽',
      descripcion: 'Resultados, análisis y noticias deportivas',
      gradiente: 'linear-gradient(135deg, #4CAF50, #81C784)'
    },
    'Política': {
      nombre: 'Política',
      icono: '🏛️',
      descripcion: 'Análisis político y noticias gubernamentales',
      gradiente: 'linear-gradient(135deg, #FF9800, #FFB74D)'
    },
    'Cultura': {
      nombre: 'Cultura',
      icono: '🎭',
      descripcion: 'Arte, entretenimiento y eventos culturales',
      gradiente: 'linear-gradient(135deg, #f44336, #EF5350)'
    },
    'Negocios': {
      nombre: 'Negocios',
      icono: '💼',
      descripcion: 'Noticias empresariales y económicas',
      gradiente: 'linear-gradient(135deg, #9C27B0, #BA68C8)'
    },
    'Ciencia': {
      nombre: 'Ciencia',
      icono: '🔬',
      descripcion: 'Descubrimientos científicos y avances de investigación',
      gradiente: 'linear-gradient(135deg, #00BCD4, #4DD0E1)'
    }
  };

  // Obtener información de la categoría actual
  const categoriaActual = categorias['Tecnología'];

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

  // Obtener noticias de la categoría
  useEffect(() => {
    const obtenerNoticias = async () => {
      try {
        setCargando(true);

        // Obtener noticias de la categoría
        let query = supabase
          .from('Noticia')
          .select(`
            *,
            id_categoria:Seccion!Noticia_id_categoria_fkey(
              nombre
            )
          `)
          .eq('id_categoria.nombre', 'Deportes');

        const { data: noticiasData, error } = await query;

        if (error) {
          console.error('Error al obtener noticias:', error);
        } else {
          setNoticias(noticiasData || []);
          setTotalNoticias(noticiasData?.length || 0);
        }

        // Obtener conteo de noticias por categoría para las relacionadas
        const conteoCategorias = await Promise.all(
          Object.keys(categorias).map(async (cat) => {
            const { count } = await supabase
              .from('Noticia')
              .select('*', { count: 'exact', head: true })
              .ilike('categoria', cat);
            return { ...categorias[cat], cantidad: count || 0 };
          })
        );

        // Ordenar por cantidad y excluir la categoría actual
        const relacionadas = conteoCategorias
          .filter(cat => cat.nombre !== categoriaActual.nombre)
          .sort((a, b) => b.cantidad - a.cantidad)
          .slice(0, 4);

        setCategoriasRelacionadas(relacionadas);

        // Tags populares (simulado - puedes obtenerlos de una tabla de tags si existe)
        const tags = ['Inteligencia Artificial', 'Smartphones', 'Blockchain', 'Realidad Virtual',
          '5G', 'Ciberseguridad', 'IoT', 'Machine Learning', 'Cloud Computing', 'Startups'];
        setTagsPopulares(tags);

      } catch (error) {
        console.error('Error al obtener noticias:', error);
      } finally {
        setCargando(false);
      }
    };

    if (categoriaActual) {
      obtenerNoticias();
      setPaginaActual(1); // Resetear página al cambiar categoría
    }
  }, [categoria]);

  // Aplicar filtros
  useEffect(() => {
    let noticiasFilt = [...noticias];

    switch (filtroActivo) {
      case 'recientes':
        // Ya están ordenadas por fecha de creación descendente
        break;
      case 'leidas':
        // Ordenar por vistas (si existe el campo) o mantener orden por fecha
        noticiasFilt.sort((a, b) => {
          const vistasA = a.vistas || a.numero_vistas || 0;
          const vistasB = b.vistas || b.numero_vistas || 0;
          return vistasB - vistasA;
        });
        break;
      case 'destacadas':
        // Filtrar por destacadas (si existe el campo) o mantener todas
        noticiasFilt = noticiasFilt.filter(n => n.destacada || n.es_destacada || true);
        break;
      case 'semana':
        // Filtrar noticias de la última semana
        const unaSemanaAtras = new Date();
        unaSemanaAtras.setDate(unaSemanaAtras.getDate() - 7);
        noticiasFilt = noticiasFilt.filter(n => {
          const fechaNoticia = new Date(n.fecha_creacion || n.fecha);
          return fechaNoticia >= unaSemanaAtras;
        });
        break;
      default:
        break;
    }

    setNoticiasFiltradas(noticiasFilt);
  }, [noticias, filtroActivo]);

  // Calcular noticias de la página actual
  const indiceInicial = (paginaActual - 1) * noticiasPorPagina;
  const indiceFinal = indiceInicial + noticiasPorPagina;
  const noticiasPagina = noticiasFiltradas.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(noticiasFiltradas.length / noticiasPorPagina);

  // Manejar cambio de filtro
  const manejarFiltro = (filtro) => {
    setFiltroActivo(filtro);
    setPaginaActual(1); // Resetear a primera página
  };

  // Manejar cambio de página
  const cambiarPagina = (pagina) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaActual(pagina);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Manejar suscripción a categoría
  const manejarSuscripcion = () => {
    alert(`¡Te has suscrito a ${categoriaActual.nombre}!`);
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

  // Generar números de página para paginación
  const generarNumerosPagina = () => {
    const numeros = [];
    const mostrarPaginas = 5; // Mostrar 5 números a la vez

    if (totalPaginas <= mostrarPaginas) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPaginas; i++) {
        numeros.push(i);
      }
    } else {
      // Lógica para mostrar páginas con elipsis
      if (paginaActual <= 3) {
        // Mostrar primeras páginas
        for (let i = 1; i <= 4; i++) {
          numeros.push(i);
        }
        numeros.push('...');
        numeros.push(totalPaginas);
      } else if (paginaActual >= totalPaginas - 2) {
        // Mostrar últimas páginas
        numeros.push(1);
        numeros.push('...');
        for (let i = totalPaginas - 3; i <= totalPaginas; i++) {
          numeros.push(i);
        }
      } else {
        // Mostrar páginas alrededor de la actual
        numeros.push(1);
        numeros.push('...');
        for (let i = paginaActual - 1; i <= paginaActual + 1; i++) {
          numeros.push(i);
        }
        numeros.push('...');
        numeros.push(totalPaginas);
      }
    }

    return numeros;
  };

  if (cargando) {
    return (
      <div className="secciones-cargando">
        <div className="cargando-spinner"></div>
        <p>Cargando noticias de {categoriaActual.nombre}...</p>
      </div>
    );
  }

  let noticiasFiltradas2=noticiasPagina.filter(noticia =>{
    return noticia.estado==="publicada";
  });

  console.log(noticiasFiltradas2);

  return (
    <div className="secciones">
      {/* Breadcrumb */}
      <section className="breadcrumb">
        <div className="contenedor-breadcrumb">
          <nav className="breadcrumb-nav">
            <Link to="/">Inicio</Link>
            <span className="separador-breadcrumb">›</span>
            <span className="breadcrumb-actual">{categoriaActual.nombre}</span>
          </nav>
        </div>
      </section>

      {/* Header de Categoría */}
      <section
        className="header-categoria"
        style={{ background: categoriaActual.gradiente }}
      >
        <div className="contenedor-header-categoria">
          <div className="info-categoria">
            <div className="icono-categoria">
              {categoriaActual.icono}
            </div>
            <div className="detalles-categoria">
              <h1 className="titulo-categoria">{categoriaActual.nombre}</h1>
              <p className="descripcion-categoria">{categoriaActual.descripcion}</p>
            </div>
          </div>
          <div className="estadisticas-categoria">
            <div className="item-estadistica">
              <span>📊</span>
              <span>{totalNoticias} artículos encontrados</span>
            </div>
            <button className="boton-suscribirse" onClick={manejarSuscripcion}>
              <span>🔔</span>
              <span>Suscribirse a {categoriaActual.nombre}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <div className="contenido-principal">
        {/* Sección de Artículos */}
        <main className="seccion-articulos">
          
          {/* Grid de Artículos */}
          {noticiasPagina.length === 0 ? (
            <div className="sin-articulos">
              <p>No se encontraron noticias en esta categoría.</p>
            </div>
          ) : (
            <>
              <div className="grid-articulos">
                {noticiasFiltradas2.map((noticia) => {
                  return (
                    <article key={noticia.id_noticia} className="tarjeta-articulo">
                      <div
                        className="imagen-articulo"
                      >
                        {noticia.image_url ? (
                          <img
                            src={noticia.image_url}
                            alt={noticia.titulo}
                            className="imagen-articulo-real"
                          />
                        ) : (
                          <span className="emoji-articulo">
                            {categoriaActual.icono}
                          </span>
                        )}
                      </div>
                      <div className="contenido-articulo">
                        <div className="meta-articulo">
                          <span className="categoria-articulo">{noticia.categoria || categoriaActual.nombre}</span>
                          <span className="fecha-articulo">
                            <span>🕒</span>
                            {calcularTiempoRelativo(noticia.fecha_creacion)}
                          </span>
                        </div>
                        <h3 className="titulo-articulo">{noticia.titulo || 'Sin título'}</h3>
                        <p className="extracto-articulo">
                          {noticia.extracto || noticia.contenido?.substring(0, 150) || 'Sin descripción disponible'}
                        </p>
                        <div className="pie-articulo">
                          <div className="autor-articulo">
                            <div className="avatar-autor">
                              {obtenerInicialesAutor(noticia.nombre_autor || 'Anónimo')}
                            </div>
                            <div className="info-autor">
                              <div className="nombre-autor">
                                {noticia.nombre_autor || 'Anónimo'}
                              </div>
                            </div>
                          </div>
                          <div className="tiempo-lectura">
                            <span>📖</span>
                            {calcularTiempoLectura(noticia.contenido)}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Paginación */}
              {totalPaginas > 1 && (
                <nav className="paginacion">
                  <button
                    className={`boton-paginacion ${paginaActual === 1 ? 'deshabilitado' : ''}`}
                    onClick={() => cambiarPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                  >
                    ‹
                  </button>
                  {generarNumerosPagina().map((numero, indice) => {
                    if (numero === '...') {
                      return (
                        <span key={`elipsis-${indice}`} className="boton-paginacion deshabilitado">
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={numero}
                        className={`boton-paginacion ${paginaActual === numero ? 'activo' : ''}`}
                        onClick={() => cambiarPagina(numero)}
                      >
                        {numero}
                      </button>
                    );
                  })}
                  <button
                    className={`boton-paginacion ${paginaActual === totalPaginas ? 'deshabilitado' : ''}`}
                    onClick={() => cambiarPagina(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                  >
                    ›
                  </button>
                </nav>
              )}
            </>
          )}
        </main>

        {/* Barra Lateral */}
        <aside className="barra-lateral">
          {/* Categorías Relacionadas */}
          <div className="widget-lateral">
            <h3 className="titulo-widget">Categorías Relacionadas</h3>
            <div className="categorias-relacionadas">
              {categoriasRelacionadas.map((cat, indice) => (
                <Link
                  key={cat.nombre}
                  to={`/secciones/${cat.nombre}`}
                  className="enlace-categoria"
                >
                  <div
                    className="icono-enlace-categoria"
                    style={{ background: cat.gradiente }}
                  >
                    {cat.icono}
                  </div>
                  <div className="info-enlace-categoria">
                    <h4>{cat.nombre}</h4>
                    <p>{cat.cantidad} artículos</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Tags Populares */}
          <div className="widget-lateral">
            <h3 className="titulo-widget">Etiquetas Populares</h3>
            <div className="tags-populares">
              {tagsPopulares.map((tag, indice) => (
                <a
                  key={indice}
                  href="#"
                  className="tag"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Filtrando por tag:', tag);
                  }}
                >
                  {tag}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="widget-lateral">
            <h3 className="titulo-widget">Newsletter {categoriaActual.nombre}</h3>
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

export default Secciones;
