// DetalleSolicitudPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Box, Typography, Button, TextField, MenuItem,
  Select, FormControl, InputLabel, Snackbar, Alert
} from "@mui/material";
import {
  CloudDownload as CloudDownloadIcon,
  Description as DescriptionIcon,
  EditNote as EditNoteIcon,
  CheckBox as CheckBoxIcon
} from "@mui/icons-material";
import { getSolicitudById, updateSolicitud, uploadArchivosSolicitud } from "../services/index.js";
import CartelInformacionSocio from "../components/CartelInformacionSocio.jsx";

const ESTADOS = [
  { value: "Recibido", label: "Recibido" },
  { value: "EnAnalisis", label: "En Análisis" },
  { value: "Observado", label: "Observado" },
  { value: "Aprobado", label: "Aprobado" },
  { value: "Rechazado", label: "Rechazado" },
];

// Componente local para las tarjetas de información, con estilo unificado
const InfoCard = ({ icon, title, children }) => (
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
      <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
        {title}
      </Typography>
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

  const loadSolicitud = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSolicitudById(id);
      const detalle = data?.solicitud || data;

      const socio = {
        nombres: detalle.afiliadoCompleto?.nombres || "",
        apellidos: detalle.afiliadoCompleto?.apellidos || "",
        genero: detalle.afiliadoCompleto?.genero || "No disponible",
        nro_afiliado: detalle.afiliadoCompleto?.dni || "No disponible",
        rol: detalle.afiliadoCompleto?.rol || "No especificado",
        fecha_nacimiento: detalle.afiliadoCompleto?.fecha_nacimiento,
      };

      setSolicitud({ ...detalle, socio });
      setNuevoEstado(detalle?.estado || detalle?.accion?.estadoActual || "EnAnalisis");
      setMotivo(detalle?.accion?.motivoActual || "");
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: err.message || "No se pudo cargar la solicitud", severity: "error" });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadSolicitud(); }, [loadSolicitud]);

  const handleGuardarCambios = async () => {
    try {
      await updateSolicitud(id, { estado: nuevoEstado, motivo });
      await loadSolicitud();
      setSnackbar({ open: true, message: "Solicitud actualizada correctamente", severity: "success" });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: err.message || "No se pudo actualizar la solicitud", severity: "error" });
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
        
        <CartelInformacionSocio socio={solicitud.socio} />

        <InfoCard icon={<DescriptionIcon sx={{ fontSize: 70 }} color="action" />} title="Detalles de la Solicitud">
          <Typography variant="body1"><strong>Fecha:</strong> {solicitud.detalles?.fecha ?? "—"}</Typography>
          <Typography variant="body1"><strong>Monto:</strong> {solicitud.detalles?.monto ?? "—"}</Typography>
          <Typography variant="body1"><strong>Proveedor:</strong> {solicitud.detalles?.proveedor ?? "—"}</Typography>
        </InfoCard>

        <InfoCard icon={<EditNoteIcon sx={{ fontSize: 70 }} color="action" />} title="Descripción">
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.4 }}>{solicitud.descripcion?.texto ?? "Sin descripción disponible"}</Typography>
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

        <InfoCard icon={<CheckBoxIcon sx={{ fontSize: 70 }} color="action" />} title="Acción">
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
    </Box>
  );
}
