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

  useEffect(() => {
    const fetchSeccion = async () => {
      const { data, error } = await supabase
        .from("Seccion")
        .select("*")
        .eq("id_seccion", id)
        .single();

      if (error) {
        console.error("Error al cargar sección:", error.message);
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

    try {
      setUploading(true);

      // Nombre único para evitar colisiones
      const fileName = `${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("Imagenes_secciones")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data: publicUrlData } = supabase.storage
        .from("Imagenes_secciones")
        .getPublicUrl(fileName);

      const imageUrl = publicUrlData.publicUrl;

      setSeccion((prev) => ({ ...prev, url_image: imageUrl }));
      setPreviewUrl(imageUrl);
    } catch (error) {
      alert("Error al subir la imagen: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // 🔹 Guardar cambios
  const handleSave = async () => {
    const { error } = await supabase
      .from("Seccion")
      .update({
        nombre: seccion.nombre,
        descripcion: seccion.descripcion,
        url_image: seccion.url_image,
      })
      .eq("id_seccion", id);

    if (error) {
      alert("❌ Error al actualizar: " + error.message);
    } else {
      alert("✅ Sección actualizada correctamente");
      navigate("/dashboard-editor/listado-secciones");
    }
  };

  if (loading) return <p>Cargando sección...</p>;
  if (!seccion) return <p>No se encontró la sección.</p>;

  return (
    <div className="editar-seccion-container">
      <h2>Editar Sección</h2>
      <div className="form-editar-seccion">
        <label>Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={seccion.nombre || ""}
          onChange={handleChange}
        />

        <label>Descripción:</label>
        <textarea
          name="descripcion"
          value={seccion.descripcion || ""}
          onChange={handleChange}
        />

        <label>Imagen:</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        {uploading ? (
          <p className="subiendo">Subiendo imagen...</p>
        ) : previewUrl ? (
          <div className="preview">
            <img src={previewUrl} alt="Vista previa" />
          </div>
        ) : null}

        <div className="acciones">
          <button onClick={handleSave} className="btn-guardar">
            Guardar Cambios
          </button>
          <button
            onClick={() => navigate("/dashboard-editor/listado-secciones")}
            className="btn-cancelar"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarSeccion;
