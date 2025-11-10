import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient.js";
import "./GestionarSecciones.css";
import { useNavigate } from "react-router-dom";

const GestionarSecciones = () => {
  const navigate = useNavigate();
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar las secciones desde Supabase
  const fetchSecciones = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("Seccion").select("*");
    if (error) {
      console.error("Error al cargar secciones:", error.message);
    } else {
      setSecciones(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSecciones();
  }, []);

  // 🔹 Cambiar el estado (0 = inactivo, 1 = activo)
  const toggleEstado = async (id_seccion, estadoActual) => {
    const nuevoEstado = estadoActual === 1 ? 0 : 1;

    const { error } = await supabase
      .from("Seccion")
      .update({ estado: nuevoEstado })
      .eq("id_seccion", id_seccion);

    if (error) {
      alert("Error al actualizar el estado: " + error.message);
    } else {
      setSecciones((prev) =>
        prev.map((s) =>
          s.id_seccion === id_seccion ? { ...s, estado: nuevoEstado } : s
        )
      );
    }
  };

  // 🔹 Eliminar sección (y su imagen del bucket si existe)
  const handleDelete = async (s) => {
    const confirmacion = window.confirm(
      `¿Seguro que deseas eliminar la sección "${s.nombre}"?`
    );
    if (!confirmacion) return;

    try {
      // 1️⃣ Si tiene una imagen, la eliminamos del bucket
      if (s.url_image) {
        const nombreArchivo = s.url_image.split("/").pop();
        const { error: errorImg } = await supabase.storage
          .from("Imagenes_secciones")
          .remove([nombreArchivo]);

        if (errorImg) {
          console.warn("Error al eliminar imagen del bucket:", errorImg.message);
        }
      }

      // 2️⃣ Eliminar la fila de la base de datos
      const { error } = await supabase
        .from("Seccion")
        .delete()
        .eq("id_seccion", s.id_seccion);

      if (error) {
        alert("Error al eliminar la sección: " + error.message);
        return;
      }

      // 3️⃣ Actualizar la lista localmente
      setSecciones((prev) =>
        prev.filter((sec) => sec.id_seccion !== s.id_seccion)
      );

      alert("✅ Sección eliminada correctamente");
    } catch (err) {
      console.error("Error al eliminar sección:", err);
      alert("Ocurrió un error al eliminar la sección.");
    }
  };

  if (loading) return <p>Cargando secciones...</p>;

  return (
    <div className="secc-gestion-container">
      <div className="secc-header">
        <h1>Gestión de Secciones</h1>
        <button 
          className="secc-btn-crear"
          onClick={() => navigate(`/dashboard-editor/crear-seccion`)}
        >
          ➕ Crear Sección
        </button>
      </div>

      <div className="secc-tabla">
        {/* Encabezado de la tabla (solo visible en escritorio) */}
        <div className="secc-tabla-header">
          <span>ICONO</span>
          <span>NOMBRE</span>
          <span>DESCRIPCIÓN</span>
          <span>ESTADO</span>
          <span>ACCIONES</span>
        </div>

        {/* Filas de la tabla */}
        {secciones.map((s) => (
          <div className="secc-tabla-row" key={s.id_seccion}>
            
            <div className="secc-celda secc-icono" data-label="ICONO">
              <img src={s.url_image} alt={s.nombre} className="secc-img" />
            </div>

            <div className="secc-celda secc-nombre" data-label="NOMBRE">
                <span className="secc-label-mobile">NOMBRE:</span>
                <p>{s.nombre}</p>
            </div>
            
            <div className="secc-celda secc-descripcion" data-label="DESCRIPCIÓN">
                <span className="secc-label-mobile">DESCRIPCIÓN:</span>
                <p>{s.descripcion}</p>
            </div>

            <div className="secc-celda secc-estado" data-label="ESTADO">
              <span className="secc-label-mobile">ESTADO:</span>
              <label className="secc-switch">
                <input
                  type="checkbox"
                  checked={s.estado === 1}
                  onChange={() => toggleEstado(s.id_seccion, s.estado)}
                />
                <span className="secc-slider"></span>
              </label>
              <span className={s.estado === 1 ? "secc-tag-activo" : "secc-tag-inactivo"}>
                {s.estado === 1 ? "Activo" : "Inactivo"}
              </span>
            </div>

            <div className="secc-celda secc-acciones" data-label="ACCIONES">
              <button
                className="secc-btn secc-editar"
                title="Editar"
                onClick={() => navigate(`/dashboard-editor/editar-seccion/${s.id_seccion}`)}
              >
                ✏️
              </button>
              <button className="secc-btn secc-eliminar" title="Eliminar" onClick={() => handleDelete(s)}>
                🗑️
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default GestionarSecciones;