import { useState, useEffect, useRef } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import "./EditarNoticia.css"; // Usaremos un CSS similar o el mismo que Mis_noticias/CrearNoticia
import { supabase } from "../../../supabaseClient.js";

const EditarNoticia = () => {
  const { id } = useParams(); // 👈 Obtener el ID de la noticia de la URL

  // Estados del formulario
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState(""); // Contiene id_seccion
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("borrador"); // 'borrador', 'terminada', 'publicado'
  const [mainImage, setMainImage] = useState(null); // URL de la imagen (preview o existente)
  const [imageFile, setImageFile] = useState(null); // Archivo de imagen para subir
  const [existingImageUrl, setExistingImageUrl] = useState(null); // URL original en DB

  // Estados de datos auxiliares
  const [categories, setCategories] = useState([]);
  const [userData, setUserData] = useState(null);
  const [noticiaData, setNoticiaData] = useState(null);

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [cargandoNoticia, setCargandoNoticia] = useState(true);
  const [userAuth, setUserAuth] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  // Referencia para el input de archivo (para resetearlo)
  const fileInputRef = useRef(null);

  // --- Funciones de Utilidad (Reutilizadas de CrearNoticia) ---

  const getUser = async (authId) => {
    try {
      const { data, error } = await supabase
        .from("Usuario")
        .select("id_usuario, rol")
        .eq("id_user_autenticacion", authId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("❌ Error al obtener usuario:", error.message);
      return null;
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("Seccion")
        .select("id_seccion, nombre, descripcion")
        .order("nombre", { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error al obtener categorías:", error.message);
      return [];
    }
  };

  const uploadNewsImage = async (file) => {
    if (!userData || !userData.id_usuario) {
      return { success: false, error: "No se pudo obtener el ID del usuario." };
    }

    try {
      const fileExt = file.name.split(".").pop();
      // Nombre de archivo único, similar al de CrearNoticia
      const fileName = `${userData.id_usuario}/${Math.random().toString(36).substring(2)}${Date.now()}.${fileExt}`;
      const filePath = fileName;

      // 1. Subir el archivo
      const { error: uploadError } = await supabase.storage
        .from("Imagenes_noticias") // Usar el mismo bucket que en CrearNoticia
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) throw new Error(uploadError.message);

      // 2. Obtener URL firmada por 1 año
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from("Imagenes_noticias")
        .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 año en segundos

      if (signedUrlError) throw new Error(signedUrlError.message);

      return {
        success: true,
        publicUrl: signedUrlData.signedUrl,
        filePath
      };
    } catch (error) {
      console.error("Error subiendo imagen:", error.message);
      return { success: false, error: error.message };
    }
  };

  // Manejar carga y vista previa de imagen (reutilizado)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no debe superar los 5MB");
      return;
    }
    setMainImage(URL.createObjectURL(file));
    setImageFile(file);
  };

  const handleRemoveImage = () => {
    setMainImage(null);
    setImageFile(null); // Asegúrate de que no intente subir un archivo nulo
    setExistingImageUrl(null); // Limpia la URL de la DB
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  
  // --- Efectos de Carga de Datos ---

  // 1. Cargar Usuario, Auth y Categorías
  useEffect(() => {
    const getUserAndCategories = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) console.error("Error al obtener usuario:", error.message);
      const authUser = data?.user || null;
      setUserAuth(authUser);

      if (!authUser) {
        setCheckingAuth(false);
        return;
      }

      const currentUserData = await getUser(authUser.id);
      setUserData(currentUserData);

      const secciones = await fetchCategories();
      setCategories(secciones);

      setCheckingAuth(false);
    };

    getUserAndCategories();

    // No es necesario el listener onAuthStateChange aquí a menos que esperemos cambios en la misma página
  }, []);

  // 2. Cargar Noticia para edición
  useEffect(() => {
    const fetchNoticia = async () => {
      if (!id || checkingAuth) return;
      
      setCargandoNoticia(true);

      try {
        const { data, error } = await supabase
          .from("Noticia")
          .select("*") 
          .eq("id_noticia", id) // Asumimos 'id_noticia' es la clave
          .single();

        if (error) throw error;
        if (!data) {
          alert("Noticia no encontrada o permisos insuficientes.");
          return;
        }

        // Cargar estados del formulario
        setNoticiaData(data);
        setTitle(data.titulo || "");
        setSubtitle(data.subtitulo || "");
        setCategory(data.id_categoria || "");
        setContent(data.contenido || "");
        setStatus(data.estado || "borrador"); 
        setMainImage(data.image_url || null); // URL para preview
        setExistingImageUrl(data.image_url || null); // URL original
        
      } catch (error) {
        console.error("Error al cargar la noticia:", error.message);
        alert(`Error al cargar la noticia: ${error.message}`);
      } finally {
        setCargandoNoticia(false);
      }
    };
    
    // Solo carga la noticia si el ID existe y la autenticación terminó
    if (id && !checkingAuth) {
        fetchNoticia();
    }
  }, [id, checkingAuth]);


  // --- Función de Actualización ---
  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("El título es obligatorio");
      return;
    }

    if (!userData?.id_usuario) {
      alert("No se pudo obtener la información del usuario");
      return;
    }
    
    // Si el usuario autenticado no es el creador, no debería poder guardar (control de seguridad básico)
    if (noticiaData?.id_usuario_creador !== userData.id_usuario) {
        alert("Acceso denegado: No eres el creador de esta noticia.");
        return;
    }

    setLoading(true);

    try {
      // 1. Manejo de la Imagen
      let imageUrl = existingImageUrl; // Empieza con la URL que ya estaba en la DB

      if (imageFile) {
        // Se subió un NUEVO archivo
        const uploadResult = await uploadNewsImage(imageFile);
        if (!uploadResult.success) {
          throw new Error(uploadResult.error);
        }
        imageUrl = uploadResult.publicUrl;
        // NOTA: Para ser completo, deberías implementar aquí la lógica para borrar la imagen anterior del Storage.
      } else if (!mainImage && existingImageUrl) {
         // La imagen fue ELIMINADA por el usuario (mainImage es null y había una URL)
         imageUrl = null;
         // NOTA: Implementar aquí la lógica para borrar la imagen anterior del Storage.
      }


      // 2. Actualizar noticia
      const { error } = await supabase
        .from("Noticia")
        .update({
            titulo: title.trim(),
            subtitulo: subtitle.trim(),
            contenido: content.trim(),
            estado: status,
            image_url: imageUrl,
            id_categoria: category || null,
        })
        .eq('id_noticia', id);

      if (error) throw error;

      alert("✅ Noticia actualizada con éxito!");
      // Opcional: Redirigir a Mis Noticias
      // navigate('/dashboard_reportero/mis-noticias');
    } catch (error) {
      console.error("❌ Error al actualizar:", error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Renderizado Condicional ---

  if (checkingAuth || cargandoNoticia) {
    return (
      <div className="cargando-pagina">
        <p>Cargando datos de usuario y noticia...</p>
      </div>
    );
  }

  if (!userAuth) {
    return <Navigate to="/login" replace />;
  }

  if (noticiaData && noticiaData.id_usuario_creador !== userData.id_usuario) {
       // Si el usuario no es el creador de la noticia
       return (
            <div className="acceso-denegado">
                <h2>🚫 Acceso Denegado</h2>
                <p>Solo el creador de esta noticia puede editarla.</p>
                <Link to="/dashboard_reportero/mis-noticias">Volver a mis noticias</Link>
            </div>
        );
  }
  
  if (!noticiaData && id) {
       // Noticia no encontrada
       return (
            <div className="noticia-no-encontrada">
                <h2>Noticia No Encontrada</h2>
                <p>El ID de noticia proporcionado no existe.</p>
                <Link to="/dashboard_reportero/mis-noticias">Volver a mis noticias</Link>
            </div>
        );
  }


  return (
    <div className="create-news-container">
      <div className="create-news-main">
        <div className="create-news-form">
          <h1 className="title-editing">Editar Noticia: {noticiaData?.titulo || 'Cargando...'}</h1>

          <label>Título *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Escribe un título llamativo..."
          />

          <label>Subtítulo</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Añade un subtítulo descriptivo..."
          />

          <label>Categoría</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat.id_seccion} value={cat.id_seccion}>
                {cat.nombre}
              </option>
            ))}
          </select>

          <label>Imagen Principal</label>
          <div className="image-upload">
            {mainImage ? (
              <div className="image-preview">
                <img src={mainImage} alt="preview" />
                <button
                  type="button"
                  className="remove-image"
                  onClick={handleRemoveImage}
                >
                  ×
                </button>
              </div>
            ) : (
              <label htmlFor="mainImageInput" className="upload-placeholder">
                <p>📷 Arrastra una imagen aquí o haz clic para seleccionar</p>
                <p className="subtext">PNG, JPG, WEBP hasta 5MB</p>
              </label>
            )}

            <input
              type="file"
              id="mainImageInput"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleImageUpload}
              ref={fileInputRef} // Asignar la referencia
              hidden
            />
          </div>

          <label>Contenido del Artículo *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe el contenido aquí..."
            rows="15"
          ></textarea>
        </div>
      </div>

      <div className="create-news-sidebar">
        <div className="sidebar-box">
          <h3>Estado de la Noticia</h3>

          <label className={`radio-option ${status === "borrador" ? "active" : ""}`}>
            <input
              type="radio"
              checked={status === "borrador"}
              onChange={() => setStatus("borrador")}
            />
            <div className="radio-texts">
              <span className="option-title">Borrador</span>
              <span className="option-subtitle">Edición en progreso</span>
            </div>
          </label>

          <label className={`radio-option ${status === "terminada" ? "active" : ""}`}>
            <input
              type="radio"
              checked={status === "terminada"}
              onChange={() => setStatus("terminada")}
            />
            <div className="radio-texts">
              <span className="option-title">Terminado</span>
              <span className="option-subtitle">Listo para revisión</span>
            </div>
          </label>
          
          

          <div className="sidebar-buttons">
            <button
              className="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Actualizar Noticia"}
            </button>
            
            {/* Opcional: Botón de Publicar/Despublicar directo */}
            {status !== 'publicado' && (
                <button
                    className="secondary publish-button"
                    onClick={() => { setStatus('terminada'); handleSubmit(); }} // Guarda y marca como terminado
                    disabled={loading}
                >
                    Guardar y Enviar a Revisión
                </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarNoticia;