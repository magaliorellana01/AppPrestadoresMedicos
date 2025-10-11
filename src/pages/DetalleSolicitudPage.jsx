// DetalleSolicitudPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Grow,
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadSolicitud = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/filtro-solicitudes/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const detalle = data?.solicitud ? data.solicitud : data;
      setSolicitud(detalle);
      setNuevoEstado(detalle?.estado || detalle?.accion?.estadoActual || "EnAnalisis");
      setMotivo(detalle?.accion?.motivoActual || "");
    } catch (err) {
      console.error("Error cargando solicitud:", err);
      setSnackbar({ open: true, message: "No se pudo cargar la solicitud", severity: "error" });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadSolicitud();
  }, [loadSolicitud]);

  const handleGuardarCambios = async () => {
    try {
      const res = await fetch(`http://localhost:3000/filtro-solicitudes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado, motivo }),
      });
      if (!res.ok) throw new Error("Error al actualizar la solicitud");
      await loadSolicitud();
      setSnackbar({ open: true, message: "Solicitud actualizada correctamente", severity: "success" });
    } catch (err) {
      console.error("Error actualizando:", err);
      setSnackbar({ open: true, message: "No se pudo actualizar la solicitud", severity: "error" });
    }
  };

  if (loading) return <Typography>Cargando...</Typography>;
  if (!solicitud) return <Typography>No se encontró la solicitud</Typography>;

  const getEstadoLabel = () => {
    if (solicitud.estadoDisplay) return solicitud.estadoDisplay;
    const e = ESTADOS.find((x) => x.value === (solicitud.estado || nuevoEstado));
    return e ? e.label : solicitud.estado || nuevoEstado;
  };

  const archivosFromDescripcion = () => {
    const adj = solicitud.descripcion?.adjuntos || [];
    return Array.isArray(adj) ? adj : [];
  };

  // Tarjetas
  const tarjetas = [
    {
      icon: <PersonIcon sx={{ color: "white", fontSize: 22 }} />,
      titulo: "Datos",
      contenido: (
        <>
          <Typography sx={{ mb: 1 }}><strong>Afiliado:</strong> {solicitud.datos?.afiliado ?? "—"}</Typography>
          <Typography sx={{ mb: 1 }}><strong>Edad:</strong> {solicitud.datos?.edad ?? "—"}</Typography>
          <Typography sx={{ mb: 1 }}><strong>Género:</strong> {solicitud.datos?.genero ?? "—"}</Typography>
          <Typography sx={{ mb: 1 }}><strong>Nro Afiliado:</strong> {solicitud.datos?.nroAfiliado ?? "—"}</Typography>
          <Typography><strong>Miembro:</strong> {solicitud.datos?.tipoMiembro ?? "—"}</Typography>
        </>
      ),
    },
    {
      icon: <DescriptionIcon sx={{ color: "white", fontSize: 22 }} />,
      titulo: "Detalles",
      contenido: (
        <>
          <Typography sx={{ mb: 1 }}><strong>Fecha:</strong> {solicitud.detalles?.fecha ?? "—"}</Typography>
          <Typography sx={{ mb: 1 }}><strong>Monto:</strong> {solicitud.detalles?.monto ?? "—"}</Typography>
          <Typography><strong>Proveedor:</strong> {solicitud.detalles?.proveedor ?? "—"}</Typography>
        </>
      ),
    },
    {
      icon: <EditNoteIcon sx={{ color: "white", fontSize: 22 }} />,
      titulo: "Descripción",
      contenido: (
        <>
          <Typography sx={{ mb: 2, lineHeight: 1.4 }}>{solicitud.descripcion?.texto ?? "Sin descripción disponible"}</Typography>
          {archivosFromDescripcion().map((a, idx) => {
            const nombre = typeof a === "string" ? a : a.nombreArchivo ?? a.nombre ?? a.filename ?? "adjunto.pdf";
            return (
              <Box key={idx} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography sx={{ mr: 1, fontSize: "0.85rem", color: "#495057" }}>{nombre}</Typography>
                <CloudDownloadIcon sx={{ fontSize: 16, color: "#6c757d" }} />
              </Box>
            );
          })}
        </>
      ),
    },
    {
      icon: <CheckBoxIcon sx={{ color: "white", fontSize: 22 }} />,
      titulo: "Acción",
      contenido: (
        <>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="estado-label">Cambiar Estado</InputLabel>
            <Select
              labelId="estado-label"
              value={nuevoEstado}
              label="Cambiar Estado"
              onChange={(e) => setNuevoEstado(e.target.value)}
              sx={{ fontSize: "0.9rem" }}
            >
              {ESTADOS.map((e) => (
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
            onChange={(e) => setMotivo(e.target.value)}
            sx={{ fontSize: "0.9rem" }}
          />
        </>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f7fa", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 4, color: "#1976d2", fontWeight: "bold" }}>
        {solicitud.titulo || solicitud.tipo} - {getEstadoLabel()}
      </Typography>

      {/* GRID 2x2 con separación extra entre filas */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
          rowGap: 6, // aumenta separación entre filas
          columnGap: 4,
          maxWidth: 1000,
          mb: 5,
          width: "100%",
          alignItems: "stretch",
          justifyContent: "center",
        }}
      >
        {tarjetas.map((tarjeta, idx) => (
          <Grow in={true} style={{ transformOrigin: '0 0 0' }} timeout={300 + idx * 150} key={idx}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                border: "1px solid #dee2e6",
                backgroundColor: "#fff",
                borderRadius: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box sx={{ width: 40, height: 40, backgroundColor: "#6c757d", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", mr: 2 }}>
                  {tarjeta.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#495057" }}>
                  {tarjeta.titulo}
                </Typography>
              </Box>
              <Box sx={{ pl: 6, flexGrow: 1 }}>{tarjeta.contenido}</Box>
            </Paper>
          </Grow>
        ))}
      </Box>

      <Button
        variant="contained"
        size="large"
        onClick={handleGuardarCambios}
        sx={{
          backgroundColor: "#1976d2",
          "&:hover": { backgroundColor: "#115293" },
          px: 4,
          py: 1,
          textTransform: "none",
          fontSize: "1rem",
          borderRadius: 2,
          boxShadow: "none",
          mt: 5, // <-- Esto separa el botón de las tarjetas
        }}
      >
        Confirmar Cambios
      </Button>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
