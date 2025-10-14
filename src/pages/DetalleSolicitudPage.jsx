// DetalleSolicitudPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Box, Typography, Paper, Button, TextField, MenuItem,
  Select, FormControl, InputLabel, Snackbar, Alert, Grow
} from "@mui/material";
import {
  CloudDownload as CloudDownloadIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  EditNote as EditNoteIcon,
  CheckBox as CheckBoxIcon
} from "@mui/icons-material";
import { getSolicitudById, updateSolicitud, uploadArchivosSolicitud } from "../services/index.js";

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
  const [archivoFactura, setArchivoFactura] = useState(null);
  const [archivoReceta, setArchivoReceta] = useState(null);

  // 🔹 Cargar solicitud
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

  // 🔹 Guardar cambios
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

  // 🔹 Subir archivos
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

  function calcularEdad(fechaNacimiento) {
    if (!fechaNacimiento) return "—";
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad;
  }

  const getEstadoLabel = () => {
    const e = ESTADOS.find(x => x.value === (solicitud.estado || nuevoEstado));
    return solicitud.estadoDisplay || e?.label || solicitud.estado || nuevoEstado;
  };

  const archivosFromDescripcion = () => {
    const adj = solicitud.descripcion?.adjuntos || [];
    return Array.isArray(adj) ? adj : [];
  };

  // 🔹 Tarjetas
  const tarjetas = [
    {
      icon: <PersonIcon sx={{ color: "white", fontSize: 22 }} />,
      titulo: "Datos del Afiliado",
      contenido: (
        <>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Afiliado:</strong>{" "}
            {`${solicitud.socio?.nombres ?? ""} ${solicitud.socio?.apellidos ?? ""}`.trim() || "—"}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Edad:</strong> {calcularEdad(solicitud.socio?.fecha_nacimiento)} años
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Género:</strong> {solicitud.socio?.genero ?? "—"}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Nro Afiliado:</strong> {solicitud.socio?.nro_afiliado ?? "—"}
          </Typography>
          <Typography variant="body1">
            <strong>Miembro:</strong> {solicitud.socio?.rol ?? "—"}
          </Typography>
        </>
      ),
    },
    {
      icon: <DescriptionIcon sx={{ color: "white", fontSize: 22 }} />,
      titulo: "Detalles de la Solicitud",
      contenido: (
        <>
          <Typography sx={{ mb: 1 }}><strong>Fecha:</strong> {solicitud.detalles?.fecha ?? "—"}</Typography>
          <Typography sx={{ mb: 1 }}><strong>Monto:</strong> {solicitud.detalles?.monto ?? "—"}</Typography>
          <Typography><strong>Proveedor:</strong> {solicitud.detalles?.proveedor ?? "—"}</Typography>
        </>
      )
    },
    {
      icon: <EditNoteIcon sx={{ color: "white", fontSize: 22 }} />,
      titulo: "Descripción",
      contenido: (
        <>
          <Typography sx={{ mb: 2, lineHeight: 1.4 }}>{solicitud.descripcion?.texto ?? "Sin descripción disponible"}</Typography>
          {archivosFromDescripcion().map((a, idx) => (
            <Box key={idx} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <a href={`http://localhost:3000/${a.path}`} target="_blank" rel="noopener noreferrer"
                 style={{ textDecoration: "none", color: "#1976d2", fontSize: "0.85rem" }}>{a.nombreArchivo}</a>
              <CloudDownloadIcon sx={{ fontSize: 16, color: "#6c757d", ml: 1 }} />
            </Box>
          ))}
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" component="label" sx={{ mr: 2 }}>Subir Factura
              <input type="file" hidden onChange={e => setArchivoFactura(e.target.files[0])} />
            </Button>
            {archivoFactura && <Typography sx={{ display: "inline", ml: 1 }}>{archivoFactura.name}</Typography>}
          </Box>
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" component="label" sx={{ mr: 2 }}>Subir Receta / Adicional
              <input type="file" hidden onChange={e => setArchivoReceta(e.target.files[0])} />
            </Button>
            {archivoReceta && <Typography sx={{ display: "inline", ml: 1 }}>{archivoReceta.name}</Typography>}
          </Box>
          <Button variant="contained" size="small" sx={{ mt: 2 }} onClick={handleSubirArchivos}>Subir Archivos</Button>
        </>
      )
    },
    {
      icon: <CheckBoxIcon sx={{ color: "white", fontSize: 22 }} />,
      titulo: "Acción",
      contenido: (
        <>
          {/* InputLabel separado para que no se superponga */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="estado-label">Cambiar Estado</InputLabel>
            <Select
              labelId="estado-label"
              value={nuevoEstado}
              label="Cambiar Estado"
              onChange={e => setNuevoEstado(e.target.value)}
              sx={{ fontSize: "0.9rem" }}
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
            sx={{ fontSize: "0.9rem" }}
          />
        </>
      )
    }
  ];

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f7fa", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 4, color: "#1976d2", fontWeight: "bold" }}>
        {solicitud.titulo || solicitud.tipo} - {getEstadoLabel()}
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, maxWidth: 1000, mb: 5, width: "100%" }}>
        {tarjetas.map((tarjeta, idx) => (
          <Grow in key={idx} style={{ transformOrigin: "0 0 0" }} timeout={300 + idx * 150}>
            <Paper elevation={0} sx={{
              p: 2.5, border: "1px solid #dee2e6", backgroundColor: "#fff", borderRadius: 2,
              display: "flex", flexDirection: "column", transition: "all 0.25s ease",
              "&:hover": { transform: "translateY(-3px)", boxShadow: "0px 4px 20px rgba(0,0,0,0.1)" }
            }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box sx={{ width: 40, height: 40, backgroundColor: "#6c757d", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", mr: 2 }}>
                  {tarjeta.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#495057" }}>{tarjeta.titulo}</Typography>
              </Box>
              <Box sx={{ pl: 6, flexGrow: 1 }}>{tarjeta.contenido}</Box>
            </Paper>
          </Grow>
        ))}
      </Box>

      <Button variant="contained" size="large" onClick={handleGuardarCambios}
        sx={{ backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#115293" }, px: 4, py: 1, textTransform: "none", fontSize: "1rem", borderRadius: 2, boxShadow: "none", mt: 5 }}>
        Confirmar Cambios
      </Button>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}