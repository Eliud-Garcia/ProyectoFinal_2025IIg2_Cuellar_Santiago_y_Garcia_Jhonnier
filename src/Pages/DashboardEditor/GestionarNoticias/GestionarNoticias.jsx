import React, { useEffect, useState } from "react";
import {supabase} from "../../../supabaseClient.js";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const GestionarNoticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar noticias desde Supabase
  const fetchNoticias = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("Noticia").select("*");
    if (error) console.error("Error cargando noticias:", error);
    else setNoticias(data);
    setLoading(false);
  };

  // 🔹 Eliminar noticia
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta noticia?")) return;
    const { error } = await supabase.from("noticia").delete().eq("id_noticia", id);
    if (error) console.error("Error al eliminar:", error);
    else fetchNoticias();
  };

  useEffect(() => {
    fetchNoticias();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        📰 Gestionar Noticias
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Título</b></TableCell>
                <TableCell><b>Subtítulo</b></TableCell>
                <TableCell><b>Imagen</b></TableCell>
                <TableCell><b>Estado</b></TableCell>
                <TableCell><b>Creado</b></TableCell>
                <TableCell><b>Acciones</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {noticias.map((noticia) => (
                <TableRow key={noticia.id_noticia}>
                  <TableCell>{noticia.id_noticia}</TableCell>
                  <TableCell sx={{ maxWidth: 180, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {noticia.titulo}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {noticia.subtitulo}
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
                  <TableCell>{noticia.estado}</TableCell>
                  <TableCell>
                    {new Date(noticia.created_at).toLocaleDateString("es-CO", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(noticia.id_noticia)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Botón agregar noticia */}
      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button variant="contained" color="success">
          ➕ Nueva Noticia
        </Button>
      </Box>
    </Box>
  );
};

export default GestionarNoticias;
