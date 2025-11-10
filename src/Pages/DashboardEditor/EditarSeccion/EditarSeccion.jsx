import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../../supabaseClient.js";
import "./EditarSeccion.css";

const EditarSeccion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [seccion, setSeccion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  // Estado para mensajes de éxito/error
  const [message, setMessage] = useState({ text: "", type: "" }); 

  useEffect(() => {
    const fetchSeccion = async () => {
      // Limpiar mensajes al cargar
      setMessage({ text: "", type: "" }); 
      
      const { data, error } = await supabase
        .from("Seccion")
        .select("*")
        .eq("id_seccion", id)
        .single();

      if (error) {
        console.error("Error al cargar sección:", error.message);
        setMessage({ text: "Error al cargar la sección.", type: "error" });
      } else {
        setSeccion(data);
        setPreviewUrl(data.url_image);
      }
      setLoading(false);
    };

    fetchSeccion();
  }, [id]);

  const handleChange = (e) => {
    setSeccion({ ...seccion, [e.target.name]: e.target.value });
  };

  // 🔹 Subir imagen al bucket de Supabase
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setMessage({ text: "", type: "" }); // Limpiar mensaje anterior

    try {
      setUploading(true);

      // Nombre único para asegurar un nombre simple en la raíz del bucket
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`; 

      const { error: uploadError } = await supabase.storage
        .from("Imagenes_secciones")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // MODIFICACIÓN: Obtener URL FIRMADA (como requiere tu configuración de Supabase)
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from("Imagenes_secciones")
        // 31536000 segundos = 1 año de expiración
        .createSignedUrl(fileName, 31536000); 

      if (signedUrlError) throw signedUrlError;

      if (!signedUrlData || !signedUrlData.signedUrl) {
           throw new Error("No se pudo obtener la URL firmada.");
      }
      
      const imageUrl = signedUrlData.signedUrl;

      setSeccion((prev) => ({ ...prev, url_image: imageUrl }));
      setPreviewUrl(imageUrl);
      setMessage({ text: "✅ Imagen subida y URL firmada obtenida.", type: "success" });
      
    } catch (error) {
        console.error("Error al subir la imagen:", error.message);
        // Usamos un mensaje que orienta al usuario si el error es de permisos.
        const errorMessage = error.message.includes("RLS") 
            ? "Error de permisos (RLS) al subir o firmar la URL de la imagen. Revise sus políticas de Supabase."
            : "Error al subir la imagen: " + error.message;

        setMessage({ text: errorMessage, type: "error" });
    } finally {
      setUploading(false);
    }
  };

  // 🔹 Guardar cambios
  const handleSave = async () => {
    setMessage({ text: "", type: "" }); // Limpiar mensaje anterior
    
    // Verificación de datos
    if (!seccion.nombre || !seccion.descripcion || !seccion.url_image) {
        setMessage({ text: "Faltan datos obligatorios.", type: "error" });
        return;
    }

    try {
        setLoading(true); // Usamos loading para deshabilitar botones
        const { error } = await supabase
          .from("Seccion")
          .update({
            nombre: seccion.nombre,
            descripcion: seccion.descripcion,
            url_image: seccion.url_image,
          })
          .eq("id_seccion", id);

        if (error) throw error;
        
        setMessage({ text: "✅ Sección actualizada correctamente.", type: "success" });
        // Navegar después de un breve retraso para que el usuario vea el mensaje
        setTimeout(() => {
            navigate("/dashboard-editor/listado-secciones");
        }, 1500);

    } catch (error) {
        console.error("Error al actualizar:", error.message);
        setMessage({ text: "❌ Error al actualizar: " + error.message, type: "error" });
    } finally {
        setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard-editor/listado-secciones");
  }


  if (loading && !seccion) return <p className="loading-message">Cargando sección...</p>;
  if (!seccion) return <p className="error-message">No se encontró la sección.</p>;

  return (
    <div className="editar-seccion-container">
      <h2>Editar Sección: {seccion.nombre}</h2>
      
      {message.text && (
          <div className={`message message-${message.type}`}>
              {message.text}
          </div>
      )}

      <div className="form-editar-seccion">
        <label>Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={seccion.nombre || ""}
          onChange={handleChange}
          disabled={loading || uploading}
        />

        <label>Descripción:</label>
        <textarea
          name="descripcion"
          value={seccion.descripcion || ""}
          onChange={handleChange}
          disabled={loading || uploading}
        />

        <label>Imagen:</label>
        <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            disabled={loading || uploading}
        />

        {uploading ? (
          <p className="uploading-message">Subiendo imagen...</p>
        ) : previewUrl ? (
          <div className="preview">
            <img src={previewUrl} alt="Vista previa" />
          </div>
        ) : null}

        <div className="acciones">
          <button 
            onClick={handleSave} 
            className="btn-guardar"
            disabled={loading || uploading}
          >
            Guardar Cambios
          </button>
          <button
            onClick={handleCancel}
            className="btn-cancelar"
            disabled={loading || uploading}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarSeccion;