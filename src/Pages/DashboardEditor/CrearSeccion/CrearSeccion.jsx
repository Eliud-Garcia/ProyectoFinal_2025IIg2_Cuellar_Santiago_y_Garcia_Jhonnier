import React, { useState } from 'react';
import { supabase } from '../../../supabaseClient.js';
import { useNavigate } from 'react-router-dom';
import './CrearSeccion.css';

const CrearSeccion = () => {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imagenFile, setImagenFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Maneja la selección del archivo de imagen y crea el preview
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagenFile(file);
            // Crea una URL temporal para la vista previa
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setImagenFile(null);
            setPreviewUrl('');
        }
    };

    // Función principal para crear la sección
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (!nombre || !descripcion || !imagenFile) {
            setMessage({ text: 'Por favor, complete todos los campos y suba una imagen.', type: 'error' });
            return;
        }

        setLoading(true);
        let url_image = '';
        let filePathForCleanup = ''; 

        try {
            // 1. Preparar el nombre de archivo único
            const fileExt = imagenFile.name.split('.').pop();
            const fileName = `${crypto.randomUUID()}.${fileExt}`;
            filePathForCleanup = fileName; 

            // 2. Subir la imagen a Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('Imagenes_secciones')
                .upload(filePathForCleanup, imagenFile);

            if (uploadError) throw uploadError;

            // 3. MODIFICADO: Obtener la URL FIRMADA de la imagen (válida por 1 año)
            // Usamos createSignedUrl en lugar de getPublicUrl para obtener el token.
            const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                .from('Imagenes_secciones')
                // 31536000 segundos = 1 año. Ajusta esto según necesites.
                .createSignedUrl(filePathForCleanup, 31536000); 
            
            if (signedUrlError) throw signedUrlError;

            // VERIFICACIÓN CRUCIAL: Aseguramos que la URL firmada se haya generado correctamente
            if (!signedUrlData || !signedUrlData.signedUrl) {
                 throw new Error("No se pudo obtener la URL firmada.");
            }

            url_image = signedUrlData.signedUrl;

            // 4. Insertar la nueva sección en la tabla 'Seccion'
            const { error: insertError } = await supabase
                .from('Seccion')
                .insert([
                    {
                        nombre: nombre,
                        descripcion: descripcion,
                        url_image: url_image,
                        estado: 1, // Por defecto activa
                    },
                ]);

            if (insertError) throw insertError;

            setMessage({ text: '✅ Sección creada exitosamente.', type: 'success' });
            
            // Limpiar formulario y navegar
            setTimeout(() => {
                navigate('/dashboard-editor/gestionar-secciones');
            }, 1500);

        } catch (error) {
            console.error('Error al crear sección:', error);
            // Si falla la inserción, intentar eliminar la imagen del storage (buena práctica)
            if (filePathForCleanup) {
                 // Usamos el path exacto para la limpieza
                 supabase.storage.from('Imagenes_secciones').remove([filePathForCleanup]);
            }
            // Muestra un mensaje de error general, ya que el problema de URL debería estar resuelto.
            setMessage({ text: `❌ Error: ${error.message || 'Error desconocido al crear la sección.'}`, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/dashboard-editor/gestionar-secciones');
    };

    return (
        <div className="secc-form-container">
            <h2>Crear Nueva Sección</h2>
            
            <form onSubmit={handleSubmit} className="secc-form">
                
                {message.text && (
                    <div className={`secc-message secc-message-${message.type}`}>
                        {message.text}
                    </div>
                )}

                <div className="secc-form-group">
                    <label htmlFor="nombre">Nombre de la Sección</label>
                    <input
                        id="nombre"
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej: Deportes, Tecnología, Política"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="secc-form-group">
                    <label htmlFor="descripcion">Descripción</label>
                    <textarea
                        id="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Breve descripción de los temas que cubre esta sección."
                        required
                        disabled={loading}
                    ></textarea>
                </div>
                
                <div className="secc-form-group secc-file-group">
                    <label htmlFor="imagen">Imagen / Icono (Máx. 5MB)</label>
                    <input
                        id="imagen"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={loading}
                    />
                    
                    {previewUrl && (
                        <div className="secc-preview">
                            <img src={previewUrl} alt="Vista previa del icono" />
                            <p>Vista Previa</p>
                        </div>
                    )}
                </div>

                <div className="secc-acciones">
                    <button
                        type="button"
                        className="secc-btn secc-btn-cancelar"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="secc-btn secc-btn-guardar"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Crear Sección'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CrearSeccion;