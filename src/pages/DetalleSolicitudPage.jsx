import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Snackbar,
  Alert,
  Avatar
} from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const ESTADOS = [
  { value: "Recibido", label: "Recibido" },
  { value: "EnAnalisis", label: "En Análisis" },
  { value: "Observado", label: "Observado" },
  { value: "Aprobado", label: "Aprobado" },
  { value: "Rechazado", label: "Rechazado" },
];

export default function DetalleSolicitudPage() {
  const { id } = useParams();
  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [motivo, setMotivo] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    console.log('Intentando cargar solicitud con ID:', id);
    console.log('URL completa:', `http://localhost:3000/filtro-solicitudes/${id}`);
    
    fetch(`http://localhost:3000/filtro-solicitudes/${id}`)
      .then(res => {
        console.log('Respuesta del servidor:', res.status, res.statusText);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Datos recibidos del backend:', data);
        setSolicitud(data);
        setNuevoEstado(data.estado || "EnAnalisis");
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar la solicitud:', error);
        setLoading(false);
      });
  }, [id]);

  const handleGuardarCambios = async () => {
    try {
      const res = await fetch(`http://localhost:3000/filtro-solicitudes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estado: nuevoEstado,
          motivo: motivo
        })
      });
      if (!res.ok) throw new Error("Error al actualizar la solicitud");
      const data = await res.json();
      setSolicitud(data);
      setSnackbar({ open: true, message: "Solicitud actualizada correctamente", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "No se pudo actualizar la solicitud", severity: "error" });
    }
  };

  if (loading) return <Typography>Cargando...</Typography>;
  if (!solicitud) return <Typography>No se encontró la solicitud</Typography>;

  // Función para obtener el label del estado
  const getEstadoLabel = (estado) => {
    const estadoObj = ESTADOS.find(e => e.value === estado);
    return estadoObj ? estadoObj.label : estado;
  };

  return (
    <Box sx={{ 
      p: 3, 
      backgroundColor: "#f5f5f5", 
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
    }}>
      {/* Título Principal */}
      <Typography 
        variant="h4" 
        sx={{ 
          textAlign: "center", 
          mb: 4, 
          color: "#1976d2",
          fontWeight: "bold",
          fontSize: "2.5rem"
        }}
      >
        {solicitud.tipo || "Reintegro por Medicación Oncológica"} - <span style={{ color: "#666" }}>{getEstadoLabel(solicitud.estado)}</span>
      </Typography>

      {/* Grid 2x2 */}
      <Grid container spacing={3} sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Tarjeta 1: Datos */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 3, 
              height: "100%", 
              backgroundColor: "white",
              borderRadius: 2,
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: "#1976d2", mr: 2, width: 40, height: 40 }}>
                <PersonIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                Datos
              </Typography>
            </Box>
            <Box sx={{ pl: 6 }}>
              <Typography sx={{ mb: 1.5, fontSize: "1rem" }}>
                <strong>Afiliado:</strong> {solicitud.afiliado?.nombre || solicitud.afiliadoNombre || "Sin datos"}
              </Typography>
              <Typography sx={{ mb: 1.5, fontSize: "1rem" }}>
                <strong>Edad:</strong> {solicitud.edad || solicitud.afiliado?.edad || "Sin datos"} años
              </Typography>
              <Typography sx={{ mb: 1.5, fontSize: "1rem" }}>
                <strong>Género:</strong> {solicitud.genero || solicitud.afiliado?.genero || "Sin datos"}
              </Typography>
              <Typography sx={{ mb: 1.5, fontSize: "1rem" }}>
                <strong>Nro Afiliado:</strong> {solicitud.nroAfiliado || solicitud.afiliado?.nroAfiliado || "Sin datos"}
              </Typography>
              <Typography sx={{ fontSize: "1rem" }}>
                <strong>Miembro:</strong> {solicitud.miembro || solicitud.afiliado?.parentesco || "Sin datos"}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Tarjeta 2: Detalles */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 3, 
              height: "100%", 
              backgroundColor: "white",
              borderRadius: 2,
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: "#4caf50", mr: 2, width: 40, height: 40 }}>
                <DescriptionIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                Detalles
              </Typography>
            </Box>
            <Box sx={{ pl: 6 }}>
              <Typography sx={{ mb: 1.5, fontSize: "1rem" }}>
                <strong>Fecha:</strong> {solicitud.detalles?.fecha || solicitud.fecha || "Sin datos"}
              </Typography>
              <Typography sx={{ mb: 1.5, fontSize: "1rem" }}>
                <strong>Monto:</strong> {solicitud.monto || solicitud.detalles?.monto || "Sin datos"}
              </Typography>
              <Typography sx={{ fontSize: "1rem" }}>
                <strong>Proveedor:</strong> {solicitud.proveedor || solicitud.detalles?.proveedor || "Sin datos"}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Tarjeta 3: Descripción */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 3, 
              height: "100%", 
              backgroundColor: "white",
              borderRadius: 2,
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: "#ff9800", mr: 2, width: 40, height: 40 }}>
                <EditNoteIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                Descripción
              </Typography>
            </Box>
            <Box sx={{ pl: 6 }}>
              <Typography sx={{ mb: 2, fontSize: "1rem", lineHeight: 1.6 }}>
                {solicitud.descripcion || "Adjunta facturas de la medicación oncológica que mi médico me indicó."}
              </Typography>
              {/* Archivos adjuntos */}
              {solicitud.archivos && solicitud.archivos.length > 0 ? (
                solicitud.archivos.map((archivo, index) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography sx={{ mr: 1, fontSize: "0.9rem" }}>{archivo.nombre || `Archivo ${index + 1}.pdf`}</Typography>
                    <IconButton size="small" color="primary">
                      <CloudDownloadIcon />
                    </IconButton>
                  </Box>
                ))
              ) : (
                <>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography sx={{ mr: 1, fontSize: "0.9rem" }}>Factura.pdf</Typography>
                    <IconButton size="small" color="primary">
                      <CloudDownloadIcon />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ mr: 1, fontSize: "0.9rem" }}>Receta.pdf</Typography>
                    <IconButton size="small" color="primary">
                      <CloudDownloadIcon />
                    </IconButton>
                  </Box>
                </>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Tarjeta 4: Acción */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 3, 
              height: "100%", 
              backgroundColor: "white",
              borderRadius: 2,
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: "#9c27b0", mr: 2, width: 40, height: 40 }}>
                <CheckBoxIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                Acción
              </Typography>
            </Box>
            <Box sx={{ pl: 6 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="estado-label">Cambiar Estado</InputLabel>
                <Select
                  labelId="estado-label"
                  value={nuevoEstado}
                  label="Cambiar Estado"
                  onChange={e => setNuevoEstado(e.target.value)}
                >
                  {ESTADOS.map(e => (
                    <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Ingresar motivo"
                multiline
                minRows={2}
                fullWidth
                value={motivo}
                onChange={e => setMotivo(e.target.value)}
                placeholder="Ingrese el motivo del cambio de estado..."
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Botón Confirmar Cambios */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button 
          variant="contained" 
          size="large" 
          onClick={handleGuardarCambios}
          sx={{
            backgroundColor: "#1976d2",
            color: "white",
            px: 4,
            py: 1.5,
            fontSize: "1.1rem",
            fontWeight: "bold",
            borderRadius: 2,
            boxShadow: "0 4px 8px rgba(25, 118, 210, 0.3)",
            "&:hover": {
              backgroundColor: "#1565c0",
              boxShadow: "0 6px 12px rgba(25, 118, 210, 0.4)"
            }
          }}
        >
          Confirmar Cambios
        </Button>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}