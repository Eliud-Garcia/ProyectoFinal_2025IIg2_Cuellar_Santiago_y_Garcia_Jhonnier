import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Route, Routes, Outlet } from 'react-router-dom';
import './Dashboard_reportero.css';
import { supabase } from '../../supabaseClient.js';


const Dashboard_reportero = () => {
  // Estados del componente
  const [barraLateralAbierta, setBarraLateralAbierta] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [mostrarModalCerrarSesion, setMostrarModalCerrarSesion] = useState(false);
  const [notificacion, setNotificacion] = useState(null);
  const [itemNavegacionActivo, setItemNavegacionActivo] = useState('dashboard');
  const [usuario, setUsuario] = useState([]);
  const [noticias, setNoticia] = useState([]);
  const [estadisticas, setEstadisticas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerUsuario = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      console.log('Usuario actual:', user)

      if (user) {
        const { data: usuarioData, error: usuarioError } = await supabase
          .from('Usuario')
          .select('*')
          .eq('id_user_autenticacion', user.id)
          .single();

        if (usuarioError) {
          setError(error.message)
          console.error('Error al traer noticias:', error)
        } else {
          setUsuario(usuarioData);
          //console.log(usuarioData);
        }
      }
    }

    obtenerUsuario()
  }, [])

  // Función para alternar la barra lateral en móviles
  const alternarBarraLateral = () => {
    setBarraLateralAbierta(!barraLateralAbierta);
  };

  // Función para mostrar notificaciones
  const mostrarNotificacion = (mensaje) => {
    setNotificacion(mensaje);
    setTimeout(() => {
      setNotificacion(null);
    }, 3000);
  };

  // Función para manejar la búsqueda
  const manejarBusqueda = (e) => {
    const valor = e.target.value;
    setTerminoBusqueda(valor);
    if (valor.length > 2) {
      console.log('Buscando:', valor);
    }
  };

  // Función para mostrar notificaciones
  const mostrarNotificaciones = () => {
    mostrarNotificacion('Tienes 3 notificaciones nuevas');
  };

  // Función para alternar menú de perfil
  const alternarMenuPerfil = () => {
    mostrarNotificacion('Menú de perfil disponible próximamente');
  };

  // Función para crear nueva noticia
  const crearNoticia = () => {
    mostrarNotificacion('Redirigiendo al editor de noticias...');
    // Aquí podrías navegar a la ruta de creación
    // navigate('/crear-noticia');
  };

  // Función para editar noticia
  const editarNoticia = (id) => {
    mostrarNotificacion(`Editando noticia ${id}...`);
    console.log('Editando noticia:', id);
    // navigate(`/editar-noticia/${id}`);
  };

  // Función para ver noticia
  const verNoticia = (id) => {
    mostrarNotificacion(`Viendo noticia ${id}...`);
    console.log('Viendo noticia:', id);
    // navigate(`/noticia/${id}`);
  };

  // Función para ver borradores
  const verBorradores = () => {
    mostrarNotificacion('Mostrando borradores...');
    console.log('Viendo borradores');
    // navigate('/borradores');
  };

  // Función para ver estadísticas
  const verEstadisticas = () => {
    mostrarNotificacion('Cargando estadísticas detalladas...');
    console.log('Viendo estadísticas');
    // navigate('/estadisticas');
  };

  // Función para ver perfil
  const verPerfil = () => {
    mostrarNotificacion('Abriendo perfil de usuario...');
    console.log('Viendo perfil');
    // navigate('/perfil');
  };

  // Función para ver ayuda
  const verAyuda = () => {
    mostrarNotificacion('Abriendo centro de ayuda...');
    console.log('Viendo ayuda');
    // navigate('/ayuda');
  };

  // Función para manejar cierre de sesión
  const manejarCerrarSesion = () => {
    setMostrarModalCerrarSesion(true);
  };

  // Función para confirmar cierre de sesión
  const confirmarCerrarSesion = () => {
    setMostrarModalCerrarSesion(false);
    mostrarNotificacion('Cerrando sesión...');
    console.log('Usuario cerró sesión');
    const cerrarSesion = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error al cerrar sesión:', error.message);
      } else {
        console.log('Sesión cerrada');
      }
      navigate('/login');
    };
    cerrarSesion()

  };

  // Función para obtener el nombre de la clase de categoría
  const obtenerClaseCategoria = (categoria) => {
    const categorias = {
      politica: 'badge-categoria-politica',
      tecnologia: 'badge-categoria-tecnologia',
      deportes: 'badge-categoria-deportes',
      economia: 'badge-categoria-economia'
    };
    return categorias[categoria] || 'badge-categoria';
  };

  // Función para obtener el nombre de la clase de estado
  const obtenerClaseEstado = (estado) => {
    const estados = {
      edicion: 'badge-estado-edicion',
      terminado: 'badge-estado-terminado',
      publicado: 'badge-estado-publicado'
    };
    return estados[estado] || 'badge-estado';
  };

  // Función para obtener el texto del estado
  const obtenerTextoEstado = (estado) => {
    const estados = {
      edicion: 'Edición',
      terminado: 'Terminado',
      publicado: 'Publicado'
    };
    return estados[estado] || estado;
  };

  // Función para obtener el texto de la categoría
  const obtenerTextoCategoria = (categoria) => {
    const categorias = {
      politica: 'Política',
      tecnologia: 'Tecnología',
      deportes: 'Deportes',
      economia: 'Economía'
    };
    return categorias[categoria] || categoria;
  };

  // Efecto para manejar el tamaño de la ventana en móviles
  useEffect(() => {
    const manejarResize = () => {
      if (window.innerWidth > 1024) {
        setBarraLateralAbierta(false);
      }
    };

    window.addEventListener('resize', manejarResize);
    return () => window.removeEventListener('resize', manejarResize);
  }, []);

  // Filtrar noticias según el término de búsqueda
  const noticiasFiltradas = noticias.filter(noticia =>
    noticia.titulo.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    noticia.extracto.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  return (
    <div className="dashboard-reportero-contenedor">
      <div className="dashboard-layout">
        {/* Barra Lateral */}
        <nav className={`barra-lateral ${barraLateralAbierta ? 'abierta' : ''}`}>
          <div className="cabecera-barra-lateral">
            <Link to="/" className="logo-dashboard">
              <div className="icono-logo">📰</div>
              <span>NewsPortal</span>
            </Link>
          </div>

          <div className="navegacion-barra-lateral">
            <button
              className={`item-navegacion ${itemNavegacionActivo === 'mis-noticias' ? 'activo' : ''}`}
              onClick={() => {
                setItemNavegacionActivo('mis-noticias');
                navigate("/dashboard_reportero/mis-noticias")
              }}
            >
              <span className="icono-navegacion">📝</span>
              <span>Mis Noticias</span>
            </button>

            <button
              className={`item-navegacion ${itemNavegacionActivo === 'crear-noticia' ? 'activo' : ''}`}
              onClick={() => {
                navigate('/dashboard_reportero/crear-noticia');
              }}
            >
              <span className="icono-navegacion">➕</span>
              <span>Crear Noticia</span>
            </button>

            {/* <button
              className={`item-navegacion ${itemNavegacionActivo === 'perfil' ? 'activo' : ''}`}
              onClick={() => {
                navigate('/dashboard_reportero/perfil')
              }}
            >
              <span className="icono-navegacion">👤</span>
              <span>Perfil</span>
            </button> */}

            <button
              className="item-navegacion"
              onClick={manejarCerrarSesion}
            >
              <span className="icono-navegacion">🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </nav>

        {/* Contenido Principal */}
        <div className="contenido-principal">
          {/* Navegación Superior */}
          {/* <header className="navegacion-superior">
            <button
              className="boton-menu-movil"
              onClick={alternarBarraLateral}
              aria-label="Alternar menú"
            >
              ☰
            </button>
            <div className="acciones-navegacion">
              <button
                className="boton-notificaciones"
                onClick={mostrarNotificaciones}
                aria-label="Notificaciones"
              >
                🔔
                <div className="badge-notificacion"></div>
              </button>

              <div className="desplegable-perfil">
                <button
                  className="boton-perfil"
                  onClick={alternarMenuPerfil}
                  aria-label="Menú de perfil"
                >
                  <div className="avatar-perfil">{usuario.iniciales}</div>
                  <div className="informacion-perfil">
                    <div className="nombre-perfil">{usuario.nombre_completo}</div>
                    <div className="rol-perfil">{usuario.rol}</div>
                  </div>
                  <span>▼</span>
                </button>
              </div>
            </div>
          </header> */}
          <Outlet />
        </div>
      </div>

      {/* Mensaje de Notificación */}
      {notificacion && (
        <div className="mensaje-notificacion">
          {notificacion}
        </div>
      )}

      {/* Modal de Confirmación de Cerrar Sesión */}
      {mostrarModalCerrarSesion && (
        <div className="modal-confirmacion">
          <div className="contenido-modal">
            <h3 className="titulo-modal">Cerrar Sesión</h3>
            <p className="texto-modal">
              ¿Estás seguro de que quieres cerrar sesión?
            </p>
            <div className="botones-modal">
              <button
                className="boton-modal boton-modal-cancelar"
                onClick={() => setMostrarModalCerrarSesion(false)}
              >
                Cancelar
              </button>
              <button
                className="boton-modal boton-modal-confirmar"
                onClick={confirmarCerrarSesion}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard_reportero;
