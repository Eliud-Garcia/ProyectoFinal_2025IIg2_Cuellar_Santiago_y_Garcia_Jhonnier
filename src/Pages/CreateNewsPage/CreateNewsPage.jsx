import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import "./CreateNewsPage.css";
import { supabase } from "../../supabaseClient.js";
import AccessDenied from "../../Components/AccessDenied/AccessDenied.jsx";


const CreateNewsPage = () => {
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [category, setCategory] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("editing");
    const [mainImage, setMainImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userAuth, setUserAuth] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [categories, setCategories] = useState([]);
    const [userData, setUserData] = useState(null);
    const [accessDenied, setAccessDenied] = useState(false);


    useEffect(() => {
        const getUserAndCategories = async () => {
            // Obtener usuario autenticado
            const { data, error } = await supabase.auth.getUser();
            if (error) console.error("Error al obtener usuario:", error.message);
            const authUser = data?.user || null;
            setUserAuth(authUser);

            // Si no hay usuario autenticado, finalizar
            if (!authUser) {
                setCheckingAuth(false);
                return;
            }

            // Obtener datos del usuario desde tu tabla
            const currentUserData = await getUser(authUser.id);
            setUserData(currentUserData);

            // Validar rol
            if (!currentUserData || currentUserData.rol !== "reporter") {
                console.warn("Acceso denegado: el usuario no es reportero");
                setAccessDenied(true);
            }

            // Obtener categorías
            const secciones = await fetchCategories();
            setCategories(secciones);

            setCheckingAuth(false);
        };

        getUserAndCategories();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserAuth(session?.user || null);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    // Obtener datos del usuario desde tabla Usuario
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

    // Obtener categorías (secciones)
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

    // Subir imagen al bucket
    const uploadNewsImage = async (file) => {
        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("Imagenes_noticias")
                .upload(filePath, file, { cacheControl: "3600", upsert: false });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from("Imagenes_noticias")
                .getPublicUrl(filePath);

            return { success: true, publicUrl, filePath };
        } catch (error) {
            console.error("Error subiendo imagen:", error);
            return { success: false, error: error.message };
        }
    };

    // Manejar carga y vista previa de imagen
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
        setImageFile(null);
        const fileInput = document.getElementById("mainImageInput");
        if (fileInput) fileInput.value = "";
    };

    // Guardar noticia
    const handleSubmit = async () => {
        if (!title.trim()) {
            alert("El título es obligatorio");
            return;
        }

        if (!userData?.id_usuario) {
            alert("No se pudo obtener la información del usuario");
            return;
        }

        setLoading(true);

        try {
            // Subir imagen si existe
            let imageUrl = null;
            if (imageFile) {
                const uploadResult = await uploadNewsImage(imageFile);
                if (!uploadResult.success) throw new Error(uploadResult.error);
                imageUrl = uploadResult.publicUrl;
            }

            // Insertar noticia
            const { data, error } = await supabase
                .from("Noticia")
                .insert([
                    {
                        id_usuario_creador: userData.id_usuario,
                        titulo: title.trim(),
                        subtitulo: subtitle.trim(),
                        contenido: content.trim(),
                        estado: status === "editing" ? "borrador" : "terminado",
                        image_url: imageUrl,
                        id_categoria: category || null,
                    },
                ])
                .select();

            if (error) throw error;

            alert("✅ Noticia guardada con éxito");
            resetForm();
        } catch (error) {
            console.error("❌ Error al guardar:", error.message);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Limpiar formulario
    const resetForm = () => {
        setTitle("");
        setSubtitle("");
        setCategory("");
        setContent("");
        setMainImage(null);
        setImageFile(null);
        setStatus("editing");
    };

    // 🔹 Renderizado condicional
    if (checkingAuth) return <p className="loading-text">Verificando sesión...</p>;
    if (!userAuth || accessDenied) return <AccessDenied />;

    return (
        <div className="create-news-container">
            {/* ---------- Formulario principal ---------- */}
            <div className="create-news-main">
                <div className="create-news-form">
                    <h1>Crear Nueva Noticia</h1>

                    <div className="current-link">
                        <Link
                            to="/dashboard-reportero"
                        >
                            Dashboard Reportero /
                        </Link>
                        
                        <p className="breadcrumb">Crear Nueva</p>
                    </div>

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
                            hidden
                        />
                    </div>

                    <label>Contenido del Artículo *</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Escribe el contenido aquí..."
                        rows="8"
                    ></textarea>
                </div>
            </div>

            {/* ---------- Barra lateral ---------- */}
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
                        <button
                            className="primary"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Guardando..." : "Guardar Noticia"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateNewsPage;
