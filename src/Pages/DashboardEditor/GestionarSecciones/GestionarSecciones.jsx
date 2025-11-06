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
    <div className="gestion-container">
      <div className="header-secciones">
        <h1>Gestión de Secciones</h1>
      </div>

      <div className="tabla">
        <div className="tabla-header">
          <span>ICONO</span>
          <span>NOMBRE</span>
          <span>DESCRIPCIÓN</span>
          <span>ESTADO</span>
          <span>ACCIONES</span>
        </div>

        {secciones.map((s) => (
          <div className="tabla-row" key={s.id_seccion}>
            <div className="celda" data-label="ICONO">
              <img src={s.url_image} alt={s.nombre} className="icono" />
            </div>
            <div className="celda nombre" data-label="NOMBRE">{s.nombre}</div>
            <div className="celda descripcion" data-label="DESCRIPCIÓN">{s.descripcion}</div>

            <div className="celda estado" data-label="ESTADO">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={s.estado === 1}
                  onChange={() => toggleEstado(s.id_seccion, s.estado)}
                />
                <span className="slider"></span>
              </label>
              <span className={s.estado === 1 ? "activo" : "inactivo"}>
                {s.estado === 1 ? "Activo" : "Inactivo"}
              </span>
            </div>

            <div className="celda acciones" data-label="ACCIONES">
              <button
                className="btn editar"
                onClick={() => navigate(`/dashboard-editor/editar/${s.id_seccion}`)}
              >
                ✏️
              </button>
              <button className="btn eliminar" onClick={() => handleDelete(s)}>
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
