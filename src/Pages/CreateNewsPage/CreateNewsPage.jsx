import { useState, useEffect } from "react";
import {Link, Navigate} from "react-router-dom";

import "./CreateNewsPage.css";
import { supabase } from "../../supabaseClient.js";

const CreateNewsPage = () => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("editing");
  const [mainImage, setMainImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // 👈 usuario actual
  const [checkingAuth, setCheckingAuth] = useState(true); // 👈 control de carga

  // ======================
  // Verificar sesión activa
  // ======================
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) console.error("Error al obtener usuario:", error.message);
      setUser(data?.user || null);
      setCheckingAuth(false);
    };

    getUser();

    // Escuchar cambios en el estado de sesión
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // ======================
  // Subida de imagen
  // ======================
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(URL.createObjectURL(file)); // Vista previa
      setImageFile(file); // Guardamos el archivo real
    }
  };

  // ======================
  // Añadir etiquetas
  // ======================
  const handleTagAdd = (e) => {
    if (e.key === "Enter" && newTag.trim() !== "") {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
      e.preventDefault();
    }
  };

  // ======================
  // Guardar noticia en Supabase
  // ======================
  const handleSubmit = async () => {
    if (!user) {
      alert("Debes iniciar sesión para guardar una noticia.");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;

      // 1️⃣ Subir imagen al bucket "Imagenes_noticias"
      if (imageFile) {
        const filePath = `noticias/${Date.now()}-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("Imagenes_noticias")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        // Obtener URL pública
        const { data: urlData } = supabase.storage
          .from("Imagenes_noticias")
          .getPublicUrl(filePath);
        imageUrl = urlData.publicUrl;
      }

      // 2️⃣ Insertar los datos en la tabla "Noticia"
      const { data, error } = await supabase.from("Noticia").insert([
        {
          titulo: title,
          subtitulo: subtitle,
          contenido: content,
          estado: status === "editing" ? "borrador" : "terminado",
          image_url: imageUrl,
          id_usuario_creador: user.id, // 👈 usuario logueado
          id_categoria: category ? parseInt(category) : null,
        },
      ]);

      if (error) throw error;

      alert("✅ Noticia guardada con éxito");
      console.log("📤 Noticia enviada:", data);
    } catch (error) {
      console.error("❌ Error al guardar:", error.message);
      alert("Hubo un error al guardar la noticia.");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // Renderizado
  // ======================
  if (checkingAuth) {
    return <p className="loading-text">Verificando sesión...</p>;
  }

  if (!user) {
    return (
      <div className="forbidden-container">
        <h2>🚫 Opción prohibida</h2>
        <p>Debes iniciar sesión para crear una noticia.</p>
        <Link 
            to="/login"
            className="login-link"
        >
        Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="create-news-container">
      <div className="create-news-main">
        <div className="create-news-form">
          <h1>Crear Nueva Noticia</h1>
          <div className="current-link">
            
            <a href="#">Mis Noticias / </a>
            <p className="breadcrumb">Crear Nueva</p>
          </div>

          <label>Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Escribe un título llamativo para tu noticia..."
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
            <option value="1">Deportes</option>
            <option value="2">Tecnología</option>
            <option value="3">Entretenimiento</option>
            <option value="4">Salud</option>
          </select>

          <label>Imagen Principal</label>
          <div className="image-upload">
            {mainImage ? (
              <img src={mainImage} alt="preview" />
            ) : (
              <label htmlFor="mainImageInput" className="upload-placeholder">
                <p>Arrastra una imagen aquí o haz clic para seleccionar</p>
                <p className="subtext">PNG, JPG hasta 5MB</p>
              </label>
            )}
            <input
              type="file"
              id="mainImageInput"
              accept="image/*"
              onChange={handleImageUpload}
              hidden
            />
          </div>

          <label>Contenido del Artículo</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe el contenido aquí..."
            rows="8"
          ></textarea>
        </div>
      </div>

      <div className="create-news-sidebar">
        <div className="sidebar-box">
          <h3>Estado</h3>

          <label className={`radio-option ${status === "editing" ? "active" : ""}`}>
            <input
              type="radio"
              checked={status === "editing"}
              onChange={() => setStatus("editing")}
            />
            <div className="radio-texts">
              <span className="option-title">Edición</span>
              <span className="option-subtitle">Borrador en progreso</span>
            </div>
          </label>

          <label className={`radio-option ${status === "done" ? "active" : ""}`}>
            <input
              type="radio"
              checked={status === "done"}
              onChange={() => setStatus("done")}
            />
            <div className="radio-texts">
              <span className="option-title">Terminado</span>
              <span className="option-subtitle">Listo para revisión</span>
            </div>
          </label>

          <div className="sidebar-buttons">
            <button className="primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNewsPage;
