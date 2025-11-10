import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient.js";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  CircularProgress,
  Box,
  Button,
  Dialog, // Componentes para el Modal de confirmación
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack, // Para manejar layouts responsivos fácilmente
  Grid, // Para el layout de la tarjeta en móvil
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

// Colores basados en el tema Verde Agua de otros componentes
const PRIMARY_COLOR = "#00A896";
const SECONDARY_COLOR = "#008170";
const ERROR_COLOR = "#e74c3c";

const GestionarNoticias = () => {
  const navigate = useNavigate(); // Inicializar useNavigate
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedIdToDelete, setSelectedIdToDelete] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  // 🔹 Cargar noticias desde Supabase
  const fetchNoticias = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });
    const { data, error } = await supabase
      .from("Noticia")
      .select("id_noticia, titulo, subtitulo, image_url, estado, created_at")
      .in('estado', ['terminado', 'publicada', "desactivada",'borrador']) // las que estan en edicion no se traen
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error cargando noticias:", error);
      setMessage({ text: `❌ Error al cargar noticias: ${error.message}`, type: "error" });
    } else {
      setNoticias(data);
    }
    setLoading(false);
  };

  // 🔹 Abrir diálogo de eliminación
  const handleDeleteClick = (id) => {
    setSelectedIdToDelete(id);
    setOpenConfirm(true);
  };

  // 🔹 Confirmar y ejecutar eliminación
  const confirmDelete = async () => {
    setOpenConfirm(false);
    setMessage({ text: "", type: "" });
    if (!selectedIdToDelete) return;

    try {
      setLoading(true);
      const { error } = await supabase.from("Noticia").delete().eq("id_noticia", selectedIdToDelete);
      
      if (error) throw error;
      
      setMessage({ text: "✅ Noticia eliminada correctamente.", type: "success" });
      fetchNoticias(); // Refrescar la lista
      
    } catch (error) {
      console.error("Error al eliminar:", error);
      setMessage({ text: `❌ Error al eliminar la noticia: ${error.message}`, type: "error" });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNoticias();
  }, []);

  // Función para navegación
  const handleEdit = (id) => {
    navigate(`/dashboard-editor/editar-noticia/${id}`);
  };

  const handleCreateNew = () => {
    navigate(`/dashboard-editor/crear-noticia`);
  };
  
  // Función para manejar el cierre del diálogo
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setSelectedIdToDelete(null);
  };

  // Componente para renderizar la tarjeta en móvil
  const MobileCard = ({ noticia }) => (
    <Paper 
      elevation={3} 
      sx={{ p: 2, mb: 2, borderRadius: 3, borderLeft: `5px solid ${PRIMARY_COLOR}` }}
    >
      <Stack spacing={1}>
        {/* Título y Sección */}
        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: PRIMARY_COLOR }}>
          {noticia.titulo}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sección: {noticia.Seccion?.nombre || 'N/A'}
        </Typography>
        
        {/* Imagen y Subtítulo */}
        <Stack direction="row" spacing={2} alignItems="center">
          {noticia.image_url ? (
            <img
              src={noticia.image_url}
              alt={noticia.titulo}
              style={{ width: 80, height: 50, objectFit: "cover", borderRadius: 6 }}
            />
          ) : null}
          <Box>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 'bold' }}>
                {noticia.subtitulo}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                ID: {noticia.id_noticia} | Estado: {noticia.estado}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Creado: {new Date(noticia.created_at).toLocaleDateString("es-CO", { day: "numeric", month: "short" })}
            </Typography>
          </Box>
        </Stack>

        {/* Acciones */}
        <Box sx={{ pt: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <IconButton size="small" color="primary" onClick={() => handleEdit(noticia.id_noticia)}>
            <EditIcon fontSize="small" />
          </IconButton>
          
        </Box>
      </Stack>
    </Paper>
  );

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


  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, margin: '0 auto' }}>
      <Typography 
        variant="h4" 
        fontWeight="bold" 
        mb={3} 
        sx={{ color: PRIMARY_COLOR, borderBottom: '2px solid #eee', pb: 1 }}
      >
        📰 Gestión de Contenido
      </Typography>
      
      <StatusMessage text={message.text} type={message.type} />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
          <CircularProgress sx={{ color: PRIMARY_COLOR }} />
        </Box>
      ) : (
        <Box>
            {/* VISTA DE ESCRITORIO (sm y más grande) */}
            <TableContainer 
              component={Paper} 
              sx={{ borderRadius: 3, overflowX: "auto", display: { xs: 'none', sm: 'block' }, boxShadow: 5 }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: PRIMARY_COLOR }}>
                    {/* ID y Subtítulo ocultos en móvil */}
                    <TableCell sx={{ color: 'white' }}><b>Título</b></TableCell>
                    <TableCell sx={{ color: 'white', display: { xs: 'none', md: 'table-cell' } }}><b>Sección</b></TableCell>
                    <TableCell sx={{ color: 'white', width: '80px' }}><b>Imagen</b></TableCell>
                    <TableCell sx={{ color: 'white', width: '100px' }}><b>Estado</b></TableCell>
                    <TableCell sx={{ color: 'white', width: '100px', display: { xs: 'none', lg: 'table-cell' } }}><b>Creado</b></TableCell>
                    <TableCell sx={{ color: 'white', width: '120px', textAlign: 'center' }}><b>Acciones</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {noticias.map((noticia) => (
                    <TableRow key={noticia.id_noticia} hover>
                      <TableCell sx={{ maxWidth: 250 }}>
                          <Typography fontWeight="bold">{noticia.titulo}</Typography>
                          <Typography variant="caption" color="text.secondary">{noticia.subtitulo}</Typography>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                        {noticia.Seccion?.nombre || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {noticia.image_url ? (
                          <img
                            src={noticia.image_url}
                            alt={noticia.titulo}
                            style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 6 }}
                          />
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                          <Box sx={{ 
                              p: 0.5, 
                              borderRadius: 1, 
                              textAlign: 'center', 
                              backgroundColor: noticia.estado === 'publicada' ? '#e0f7fa' : '#ffebee', 
                              color: noticia.estado === 'publicada' ? PRIMARY_COLOR : ERROR_COLOR,
                              fontWeight: 'bold',
                              fontSize: '0.8rem'
                          }}>
                              {noticia.estado}
                          </Box>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                        {new Date(noticia.created_at).toLocaleDateString("es-CO", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                            <IconButton color="primary" size="small" onClick={() => handleEdit(noticia.id_noticia)}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                            
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* VISTA MÓVIL (xs) */}
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                {noticias.map((noticia) => (
                    <MobileCard key={noticia.id_noticia} noticia={noticia} />
                ))}
            </Box>
        </Box>
      )}

      {/* MODAL DE CONFIRMACIÓN */}
      <Dialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ '& .MuiPaper-root': { borderRadius: 3 } }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ color: ERROR_COLOR, fontWeight: 'bold' }}>
          {"Confirmar Eliminación"}
        </DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            ¿Está seguro de que desea eliminar permanentemente esta noticia? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button onClick={handleCloseConfirm} variant="outlined" sx={{ color: SECONDARY_COLOR, borderColor: SECONDARY_COLOR }}>
            Cancelar
          </Button>
          <Button 
            onClick={confirmDelete} 
            variant="contained" 
            sx={{ backgroundColor: ERROR_COLOR, '&:hover': { backgroundColor: '#c0392b' } }}
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GestionarNoticias;