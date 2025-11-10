import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../../supabaseClient.js";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import ArticleIcon from "@mui/icons-material/Article";

// Colores basados en el tema Verde Agua
const PRIMARY_COLOR = "#00A896";
const SECONDARY_COLOR = "#008170";
const ERROR_COLOR = "#e74c3c";



const EditarNoticia = () => {
  // id_noticia se obtiene de la URL, como en `/dashboard-editor/editar-noticia/:id`

  // Función para obtener el estilo del estado
const getStatusStyles = (estado) => {
  switch (estado) {
    case 'publicada':
      return { color: PRIMARY_COLOR, background: '#e0f7fa', label: 'PUBLICADA' };
    case 'desactivada':
      return { color: ERROR_COLOR, background: '#ffebee', label: 'DESACTIVADA' };
    case 'terminada':
      return { color: '#f39c12', background: '#fff3e0', label: 'PENDIENTE DE REVISIÓN' };
    case 'borrador':
    default:
      return { color: '#546e7a', background: '#eceff1', label: 'EN EDICIÓN' };
  }
};

  const { id } = useParams(); 
  
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // 🔹 Cargar noticia específica
  const fetchNoticia = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      // Nota: No tenemos la tabla Categoria, solo incluimos las columnas principales.
      const { data, error } = await supabase
        .from("Noticia")
        .select(`
            *
        `)
        .eq("id_noticia", id)
        .single();

      if (error) throw error;

      setNoticia(data);
    } catch (error) {
      console.error("Error cargando noticia:", error);
      setMessage({ text: `❌ Error al cargar noticia: ${error.message}`, type: "error" });
      setNoticia(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cambiar estado de la noticia
  const handleStatusChange = async (newStatus) => {
    if (!noticia || isUpdating) return;

    setMessage({ text: "", type: "" });
    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from("Noticia")
        .update({ estado: newStatus })
        .eq("id_noticia", id);

      if (error) throw error;

      // Actualizar el estado local y mostrar mensaje de éxito
      setNoticia((prev) => ({ ...prev, estado: newStatus }));
      setMessage({ text: `✅ Noticia cambiada a "${newStatus}" correctamente.`, type: "success" });

    } catch (error) {
      console.error("Error al actualizar estado:", error);
      setMessage({ text: `❌ Error al actualizar el estado: ${error.message}`, type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchNoticia();
  }, [id]);

  // Componente para mostrar mensajes (éxito/error)
  const StatusMessage = ({ text, type }) => {
    if (!text) return null;
    return (
        <Box 
            sx={{
                p: 2, 
                mb: 3, 
                borderRadius: 2,
                fontWeight: 'bold',
                textAlign: 'center',
                backgroundColor: type === 'success' ? '#E8F8F5' : '#FEF5F5',
                color: type === 'success' ? PRIMARY_COLOR : ERROR_COLOR,
                border: `1px solid ${type === 'success' ? PRIMARY_COLOR : ERROR_COLOR}`,
            }}
        >
            {text}
        </Box>
    );
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: PRIMARY_COLOR }} />
      </Box>
    );
  }

  if (!noticia) {
    return (
      <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 800, margin: '0 auto' }}>
        <StatusMessage text={message.text || "No se pudo encontrar la noticia."} type="error" />
      </Box>
    );
  }

  const currentStatusStyles = getStatusStyles(noticia.estado);
  const isPublicado = noticia.estado === 'Publicado';

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1000, margin: '0 auto' }}>
      <Typography 
        variant="h4" 
        fontWeight="bold" 
        mb={3} 
        sx={{ color: PRIMARY_COLOR, borderBottom: '2px solid #eee', pb: 1 }}
      >
        <ArticleIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> Revisar Noticia
      </Typography>

      <StatusMessage text={message.text} type={message.type} />

      <Paper elevation={5} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, mb: 4 }}>
        
        {/* Encabezado y Estado */}
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} mb={3}>
            <Typography variant="h5" fontWeight="600">
                {noticia.titulo}
            </Typography>
            <Box sx={{ 
                p: 0.8, 
                borderRadius: 2, 
                textAlign: 'center', 
                backgroundColor: currentStatusStyles.background, 
                color: currentStatusStyles.color,
                fontWeight: 'bold',
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                mt: { xs: 1, sm: 0 }
            }}>
                ESTADO ACTUAL: {currentStatusStyles.label}
            </Box>
        </Stack>

        <Typography variant="subtitle1" color="text.secondary" fontStyle="italic" mb={2}>
            {noticia.subtitulo}
        </Typography>
        
        <Divider sx={{ mb: 3 }} />

        {/* Metadatos */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 4 }} mb={3}>
            <Typography variant="body2">
                <b>Sección:</b> {noticia.Seccion?.nombre || 'N/A'}
            </Typography>
            <Typography variant="body2">
                <b>ID Noticia:</b> {noticia.id_noticia}
            </Typography>
            <Typography variant="body2">
                <b>Creado:</b> {new Date(noticia.created_at).toLocaleDateString()}
            </Typography>
        </Stack>

        {/* Imagen de Contenido (Vista Previa) */}
        {noticia.image_url && (
            <Box mb={3} display="flex" justifyContent="center">
                <img 
                    src={noticia.image_url} 
                    alt="Imagen principal" 
                    style={{ 
                        maxWidth: '100%', 
                        maxHeight: '300px', 
                        objectFit: 'cover', 
                        borderRadius: '12px',
                        border: `1px solid #eee`
                    }} 
                />
            </Box>
        )}

        {/* Contenido (Solo las primeras líneas) */}
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, maxHeight: '400px', overflowY: 'auto', p: 2, border: '1px solid #f0f0f0', borderRadius: 2 }}>
            <Typography component="span" fontWeight="bold" color={SECONDARY_COLOR}>Contenido: </Typography>
            {noticia.contenido}
        </Typography>

      </Paper>

      {/* Botones de Acción para el Editor */}
      <Typography variant="h6" fontWeight="bold" mt={4} mb={2} color={SECONDARY_COLOR}>
          Acciones de Edición
      </Typography>
      
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
        
        {/* Botón PUBLICAR */}
        <Button
          variant="contained"
          size="large"
          startIcon={<CheckCircleIcon />}
          onClick={() => handleStatusChange("publicada")}
          disabled={isUpdating || isPublicado} // Deshabilitar si ya está publicado
          sx={{
            backgroundColor: PRIMARY_COLOR,
            '&:hover': { backgroundColor: SECONDARY_COLOR },
            borderRadius: 2,
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          {isUpdating && noticia.estado !== "Publicado" ? 'Publicando...' : 'Publicar Noticia'}
        </Button>

        {/* Botón DESACTIVAR */}
        <Button
          variant="outlined"
          size="large"
          startIcon={<BlockIcon />}
          onClick={() => handleStatusChange("desactivada")}
          disabled={isUpdating || noticia.estado === 'Desactivado'} // Deshabilitar si ya está desactivado
          sx={{
            color: ERROR_COLOR,
            borderColor: ERROR_COLOR,
            '&:hover': { 
                backgroundColor: 'rgba(231, 76, 60, 0.08)',
                borderColor: ERROR_COLOR
            },
            borderRadius: 2,
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          {isUpdating && noticia.estado !== "Desactivado" ? 'Desactivando...' : 'Desactivar Noticia'}
        </Button>

         {/* Botón no aceptada */}
        <Button
          variant="outlined"
          size="large"
          startIcon={<BlockIcon />}
          onClick={() => handleStatusChange("terminada")}
          disabled={isUpdating || noticia.estado === 'desactivada'} // Deshabilitar si ya está desactivado
          sx={{
            color: ERROR_COLOR,
            borderColor: ERROR_COLOR,
            '&:hover': { 
                backgroundColor: 'rgba(231, 76, 60, 0.08)',
                borderColor: ERROR_COLOR
            },
            borderRadius: 2,
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          {isUpdating && noticia.estado !== "Desactivado" ? 'Desactivando...' : 'Rechazar noticia'}
        </Button>
      </Stack>

      {/* Indicador de carga general */}
      {isUpdating && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <CircularProgress size={24} sx={{ color: PRIMARY_COLOR }} />
        </Box>
      )}

    </Box>
  );
};

export default EditarNoticia;