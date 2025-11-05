import React, { useState } from "react";
import "./CreateNewsPage.css";

const CreateNewsPage = () => {
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [category, setCategory] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("editing");
    const [mainImage, setMainImage] = useState(null);
    const [metaDescription, setMetaDescription] = useState("");
    const [slug, setSlug] = useState("");
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState("");

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) setMainImage(URL.createObjectURL(file));
    };

    const handleTagAdd = (e) => {
        if (e.key === "Enter" && newTag.trim() !== "") {
            setTags([...tags, newTag.trim()]);
            setNewTag("");
            e.preventDefault();
        }
    };

    const handleSubmit = () => {
        const newsData = {
            title,
            subtitle,
            category,
            content,
            status,
            mainImage,
            metaDescription,
            slug,
            tags,
        };
        console.log("📤 Enviando noticia:", newsData);
    };

    return (
        <div className="create-news-container">
            <div className="create-news-main">
                <div className="create-news-form">
                    <h1>Crear Nueva Noticia</h1>
                    <div className="current-link">
                        {/* //TODO hacer que sean Links para usar el react-router-dom */}
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
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Selecciona una categoría</option>
                        <option value="deportes">Deportes</option>
                        <option value="tecnología">Tecnología</option>
                        <option value="entretenimiento">Entretenimiento</option>
                        <option value="salud">Salud</option>
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
                    <label className="radio">
                        <input
                            type="radio"
                            checked={status === "editing"}
                            onChange={() => setStatus("editing")}
                        />
                        Edición
                    </label>
                    <label className="radio">
                        <input
                            type="radio"
                            checked={status === "done"}
                            onChange={() => setStatus("done")}
                        />
                        Terminado
                    </label>
                    <div className="sidebar-buttons">
                        <button className="primary" onClick={handleSubmit}>Guardar</button>
                    </div>
                </div>

                <div className="sidebar-box">
                    <h3>Etiquetas</h3>
                    <div className="tags">
                        {tags.map((tag, index) => (
                            <span key={index} className="tag">
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <input
                        className="tags-input"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={handleTagAdd}
                        placeholder="Añadir etiqueta y presionar Enter..."
                    />
                </div>
            </div>
        </div>
    );
};

export default CreateNewsPage;
