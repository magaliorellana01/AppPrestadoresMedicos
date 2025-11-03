// DetalleSolicitudPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Box, Typography, Button, TextField, MenuItem,
  Select, FormControl, InputLabel, Snackbar, Alert, IconButton
} from "@mui/material";
import {
  CloudDownload as CloudDownloadIcon,
  Description as DescriptionIcon,
  EditNote as EditNoteIcon,
  CheckBox as CheckBoxIcon,
  History as HistoryIcon
} from "@mui/icons-material";
import { getSolicitudById, updateSolicitud, uploadArchivosSolicitud, getHistorialDeSolicitud } from "../services/index.js";
import CartelInformacionSocio from "../components/CartelInformacionSocio.jsx";
import HistorialCambiosModal from "../components/HistorialCambiosModal.jsx";

const ESTADOS = [
  { value: "Recibido", label: "Recibido" },
  { value: "En Análisis", label: "En Análisis" },
  { value: "Observado", label: "Observado" },
  { value: "Aprobado", label: "Aprobado" },
  { value: "Rechazado", label: "Rechazado" },
];

const InfoCard = ({ icon, title, children, action }) => (
  <Box
    display="flex"
    flexDirection={{ xs: "column", sm: "column", md: "row" }}
    alignItems={{ xs: "flex-start", sm: "flex-start", md: "center" }}
    gap={2}
    p={{ xs: 2, sm: 2, md: 3 }}
    sx={{
      width: "100%",
      maxWidth: 400,
      border: "1px solid",
      borderColor: "border.main",
      borderRadius: 2,
      backgroundColor: "background.default",
      boxSizing: "border-box",
      height: "100%",
      transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: 6,
      },
      position: 'relative',
    }}
  >
    <Box
      sx={{
        width: { xs: '100%', md: 100 },
        alignSelf: { xs: "center", sm: "center", md: "flex-start" },
        textAlign: 'center',
        flexShrink: 0,
        pt: { md: 3 },
      }}
    >
      {icon}
    </Box>
    <Box display="grid" gap={0.5} sx={{ width: "100%", textAlign: { xs: 'center', md: 'left'} }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
          {title}
        </Typography>
        {action}
      </Box>
      {children}
    </Box>
  </Box>
);

export default function DetalleSolicitudPage() {
  const { id } = useParams();
  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [motivo, setMotivo] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [archivoFactura, setArchivoFactura] = useState(null);
  const [archivoReceta, setArchivoReceta] = useState(null);
  const [isHistorialModalOpen, setHistorialModalOpen] = useState(false);
  const [historial, setHistorial] = useState([]);

  const loadHistorial = useCallback(async () => {
    try {
      const historialData = await getHistorialDeSolicitud(id);
      setHistorial(historialData);
    } catch (err) {
      console.error("Error al cargar el historial", err);
    }
  }, [id]);

  const loadSolicitud = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSolicitudById(id);
      const detalle = data?.solicitud || data;

      const socio = {
        nombres: detalle.afiliadoCompleto?.nombres || "",
        apellidos: detalle.afiliadoCompleto?.apellidos || "",
        genero: detalle.afiliadoCompleto?.genero || "No disponible",
        dni: detalle.afiliadoCompleto?.dni || "No disponible",
        rol: detalle.afiliadoCompleto?.rol || "No especificado",
        fecha_nacimiento: detalle.afiliadoCompleto?.fecha_nacimiento,
      };

      setSolicitud({ ...detalle, socio });
      setNuevoEstado(detalle?.estado || detalle?.accion?.estadoActual || "EnAnalisis");
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: err.message || "No se pudo cargar la solicitud", severity: "error" });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { 
    loadSolicitud();
    loadHistorial();
  }, [loadSolicitud, loadHistorial]);

  const handleGuardarCambios = async () => {
    try {
      await updateSolicitud(id, { estado: nuevoEstado, motivo });
      await loadSolicitud();
      await loadHistorial();
      setSnackbar({ open: true, message: "Solicitud actualizada correctamente", severity: "success" });
      setMotivo("");
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: err.response?.data?.message || err.message || "No se pudo actualizar la solicitud", severity: "error" });
    }
  };

  const handleSubirArchivos = async () => {
    if (!archivoFactura && !archivoReceta) return;
    const formData = new FormData();
    if (archivoFactura) formData.append("factura", archivoFactura);
    if (archivoReceta) formData.append("receta", archivoReceta);

    try {
      await uploadArchivosSolicitud(id, formData);
      setSnackbar({ open: true, message: "Archivos subidos correctamente", severity: "success" });
      setArchivoFactura(null);
      setArchivoReceta(null);
      loadSolicitud();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: err.message || "No se pudieron subir los archivos", severity: "error" });
    }
  };

  if (loading) return <Typography>Cargando...</Typography>;
  if (!solicitud) return <Typography>No se encontró la solicitud</Typography>;

  const getEstadoLabel = () => {
    const e = ESTADOS.find(x => x.value === (solicitud.estado || nuevoEstado));
    return solicitud.estadoDisplay || e?.label || solicitud.estado || nuevoEstado;
  };

  const archivosFromDescripcion = () => {
    const adj = solicitud.descripcion?.adjuntos || [];
    return Array.isArray(adj) ? adj : [];
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f7fa", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 4, color: "#1976d2", fontWeight: "bold" }}>
        {solicitud.titulo || solicitud.tipo} - {getEstadoLabel()}
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, maxWidth: 1100, mb: 5, width: "100%", justifyItems: 'center' }}>
        
        {/* MODIFICACIÓN AQUÍ */}
        <Box sx={{
            width: "100%",
            maxWidth: 400,
            height: "100%",
            borderRadius: 2, // Para que la sombra se vea bien en los bordes
            transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: 6,
            },
          }}>
          <CartelInformacionSocio socio={solicitud.socio} />
        </Box>

        <InfoCard icon={<DescriptionIcon sx={{ fontSize: 70 }} color="action" />} title="Detalles de la Solicitud">
          <Typography variant="body1"><strong>Fecha:</strong> {solicitud.detalles?.fecha ?? "—"}</Typography>
          <Typography variant="body1"><strong>Monto:</strong> {solicitud.detalles?.monto ?? "—"}</Typography>
          <Typography variant="body1"><strong>Proveedor:</strong> {solicitud.detalles?.proveedor ?? "—"}</Typography>
        </InfoCard>

        <InfoCard icon={<EditNoteIcon sx={{ fontSize: 70 }} color="action" />} title="Archivos adjuntos">
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.4 }}>
            Adjunto la documentación indicada por el profesional.
          </Typography>
          {archivosFromDescripcion().map((a, idx) => (
            <Box key={idx} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <a href={`http://localhost:3000/${a.path}`} target="_blank" rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "#1976d2", fontSize: "0.85rem" }}>{a.nombreArchivo}</a>
              <CloudDownloadIcon sx={{ fontSize: 16, color: "#6c757d", ml: 1 }} />
            </Box>
          ))}
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" component="label" size="small" sx={{ mr: 2 }}>Subir Factura
              <input type="file" hidden onChange={e => setArchivoFactura(e.target.files[0])} />
            </Button>
            {archivoFactura && <Typography variant="caption" sx={{ display: "inline" }}>{archivoFactura.name}</Typography>}
          </Box>
          <Box sx={{ mt: 1 }}>
            <Button variant="outlined" component="label" size="small" sx={{ mr: 2 }}>Subir Receta
              <input type="file" hidden onChange={e => setArchivoReceta(e.target.files[0])} />
            </Button>
            {archivoReceta && <Typography variant="caption" sx={{ display: "inline" }}>{archivoReceta.name}</Typography>}
          </Box>
          <Button variant="contained" size="small" sx={{ mt: 2, alignSelf: { xs: 'center', md: 'flex-start'} }} onClick={handleSubirArchivos}>Subir Archivos</Button>
        </InfoCard>

                <InfoCard 
          icon={<CheckBoxIcon sx={{ fontSize: 70 }} color="action" />} 
          title="Acción"
          action={
            <IconButton onClick={() => setHistorialModalOpen(true)} color="primary">
              <HistoryIcon />
            </IconButton>
          }
        >
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="estado-label">Cambiar Estado</InputLabel>
            <Select
              labelId="estado-label"
              value={nuevoEstado}
              label="Cambiar Estado"
              onChange={e => setNuevoEstado(e.target.value)}
            >
              {ESTADOS.map(e => <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField
            label="Ingresar motivo"
            multiline
            minRows={2}
            fullWidth
            value={motivo}
            onChange={e => setMotivo(e.target.value)}
          />
        </InfoCard>

      </Box>

      <Button variant="contained" size="large" onClick={handleGuardarCambios}
        sx={{ backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#115293" }, px: 4, py: 1, textTransform: "none", fontSize: "1rem", borderRadius: 2, boxShadow: "none" }}>
        Confirmar Cambios
      </Button>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>{snackbar.message}</Alert>
      </Snackbar>

      <HistorialCambiosModal 
        open={isHistorialModalOpen} 
        onClose={() => setHistorialModalOpen(false)} 
        historial={historial} 
      />
    </Box>
  );
}