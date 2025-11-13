import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { 
  Box, Typography, Button, TextField, Snackbar, Alert, IconButton
} from "@mui/material";
import {
  Description as DescriptionIcon,
  EditNote as EditNoteIcon,
  CheckBox as CheckBoxIcon,
  History as HistoryIcon
} from "@mui/icons-material";
import { getSolicitudById, updateSolicitud } from "../services/index.js";
import CartelInformacionSocio from "../components/CartelInformacionSocio.jsx";
import HistorialCambiosModal from "../components/HistorialCambiosModal.jsx";

const ESTADOS = [
  { value: "Recibido", label: "Recibido" },
  { value: "En Análisis", label: "En Análisis" },
  { value: "Observado", label: "Observado" },
  { value: "Aprobado", label: "Aprobado" },
  { value: "Rechazado", label: "Rechazado" },
];

const estadoConfig = {
  'Recibido': { label: 'Recibido', color: '#777777', backgroundColor: '#F0F0F0' },
  'En Análisis': { label: 'En Análisis', color: '#2563EB', backgroundColor: '#B5D6FF' },
  'Observado': { label: 'Observado', color: '#EAB308', backgroundColor: '#FFEDB6' },
  'Aprobado': { label: 'Aprobado', color: '#4BAE72', backgroundColor: '#D1FFCE' },
  'Rechazado': { label: 'Rechazado', color: '#DC2626', backgroundColor: '#FFCECE' },
};

const ActionButton = ({ children, color, backgroundColor, isActive, ...props }) => (
  <Button
    variant={isActive ? "contained" : "outlined"}
    fullWidth
    sx={{
      color: color,
      backgroundColor: isActive ? backgroundColor : 'transparent',
      borderColor: backgroundColor,
      '&:hover': {
        backgroundColor: isActive ? backgroundColor : 'transparent',
        opacity: isActive ? 0.9 : 1,
      },
    }}
    {...props}>
    {children}
  </Button>
);

const InfoCard = ({ icon, title, children, action }) => (
  <Box
    display="flex"
    flexDirection={{ xs: "column", sm: "column", md: "row" }}
    alignItems={{ xs: "flex-start", sm: "flex-start", md: "center" }}
    gap={2}
    p={{ xs: 2, sm: 2, md: 3 }}
    sx={{
      width: "100%",
      maxWidth: { xs: '100%', md: 400 },
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
        {action && action}
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

  const [isHistorialModalOpen, setHistorialModalOpen] = useState(false);
  const [historial, setHistorial] = useState([]);

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
      setHistorial(detalle.historial || []);
      setNuevoEstado(detalle?.estado || detalle?.accion?.estadoActual || "EnAnalisis");
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: err.response?.data?.message || err.message || "No se pudo cargar la solicitud", severity: "error" });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { 
    loadSolicitud();
  }, [loadSolicitud]);

  const handleEstadoToggle = (estadoSeleccionado) => {
    // Si el estado seleccionado ya es el activo, lo deseleccionamos volviendo al original.
    if (nuevoEstado === estadoSeleccionado) {
      setNuevoEstado(solicitud.estado);
    } else {
      setNuevoEstado(estadoSeleccionado);
    }
  };

  const handleAbandonarSolicitud = async () => {
    try {
      await updateSolicitud(id, { estado: 'Recibido', motivo: 'Solicitud abandonada por el prestador', prestadorAsignado: null });
      await loadSolicitud();
      setSnackbar({ open: true, message: "Solicitud abandonada correctamente", severity: "success" });
      setMotivo("");
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: err.response?.data?.message || err.message || "No se pudo abandonar la solicitud", severity: "error" });
    }
  };

  const handleGuardarCambios = async () => {
    try {
      await updateSolicitud(id, { estado: nuevoEstado, motivo });
      await loadSolicitud();
      setSnackbar({ open: true, message: "Solicitud actualizada correctamente", severity: "success" });
      setMotivo("");
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: err.response?.data?.message || err.message || "No se pudo actualizar la solicitud", severity: "error" });
    }
  };



  if (loading) return <Typography>Cargando...</Typography>;
  if (!solicitud) return <Typography>No se encontró la solicitud</Typography>;

  const getEstadoLabel = () => {
    const e = ESTADOS.find(x => x.value === (solicitud.estado || nuevoEstado));
    return solicitud.estadoDisplay || e?.label || solicitud.estado || nuevoEstado;
  };



  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, backgroundColor: "#f5f7fa", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h4" color="primary" sx={{ textAlign: "center", mb: 4, fontWeight: "bold", fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }, wordBreak: 'break-word', px: { xs: 1, sm: 0 } }}>
        {solicitud.titulo || solicitud.tipo} - {getEstadoLabel()}
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, maxWidth: { xs: '100%', md: 1100 }, mb: 5, width: "100%", justifyItems: 'center', px: { xs: 1, sm: 0 } }}>
        
        {/* MODIFICACIÓN AQUÍ */}
        <Box sx={{
            width: "100%",
            maxWidth: { xs: '100%', md: 400 },
            height: "100%",
            borderRadius: 2,
            transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: 6,
            },
          }}>
          <CartelInformacionSocio socio={solicitud.socio} />
        </Box>

        <InfoCard icon={<DescriptionIcon sx={{ fontSize: 70 }} color="action" />} title="Detalles de la solicitud">
          <Typography variant="body1"><strong>Fecha:</strong> {solicitud.detalles?.fecha ?? "—"}</Typography>
          <Typography variant="body1"><strong>Monto:</strong> {solicitud.detalles?.monto ?? "—"}</Typography>
          <Typography variant="body1"><strong>Proveedor:</strong> {solicitud.detalles?.proveedor ?? "—"}</Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            {[
              { label: 'Descargar Factura', download: 'Factura.pdf' },
              { label: 'Descargar Receta', download: 'Receta.pdf' }
            ].map(btn => (
              <Button
                key={btn.label}
                variant="outlined"
                size="small"
                component="a"
                href="/sample.pdf"
                download={btn.download}
                sx={{ fontSize: '0.7rem', whiteSpace: 'nowrap' }}
              >
                {btn.label}
              </Button>
            ))}
          </Box>
        </InfoCard>

        <InfoCard icon={<EditNoteIcon sx={{ fontSize: 70 }} color="action" />} title="Comentarios del prestador">
        {solicitud.comentariosPrestador?.length > 0 ? (
            solicitud.comentariosPrestador.map((c) => (
              <Box key={c._id} sx={{ border: "1px solid", borderColor: "border.main", borderRadius: 2, p: 1, mb: 1 }}>
                <Typography variant="body1">{c.comentario}</Typography>
                <Typography variant="caption" color="text.secondary">{c.prestador}</Typography>
                <Typography variant="caption" color="text.secondary" ml={1}>{dayjs(c.fecha).format('DD/MM/YYYY HH:mm')}</Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body1">No hay comentarios del prestador</Typography>
          )}
        </InfoCard>
        <InfoCard icon={<EditNoteIcon sx={{ fontSize: 70 }} color="action" />} title="Comentarios del afiliado">
          {solicitud.comentariosSocio?.length > 0 ? (
            solicitud.comentariosSocio.map((c) => (
              <Box key={c._id} sx={{ border: "1px solid", borderColor: "border.main", borderRadius: 2, p: 1, mb: 1 }}>
                <Typography variant="body1">{c.comentario}</Typography>
                <Typography variant="caption" color="text.secondary" ml={1}>{dayjs(c.fecha).format('DD/MM/YYYY HH:mm')}</Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body1">No hay comentarios del afiliado</Typography>
          )}
        </InfoCard>

        <InfoCard icon={<HistoryIcon sx={{ fontSize: 70 }} color="action" />} title="Historial de cambios">
        </InfoCard>

                <InfoCard 
          icon={<CheckBoxIcon sx={{ fontSize: 70 }} color="action" />} 
          title="Cambiar estado de solicitud"
          action={
            <IconButton onClick={() => setHistorialModalOpen(true)} color="primary">
              <HistoryIcon />
            </IconButton>
          }
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', mb: 2 }}>
            {solicitud.estado === 'Recibido' && (
              <ActionButton
                onClick={() => handleEstadoToggle('En Análisis')}
                isActive={nuevoEstado === 'En Análisis'}
                {...estadoConfig['En Análisis']}
              >
                Analizar
              </ActionButton>
            )}
            {solicitud.estado === 'En Análisis' && (
              <ActionButton
                onClick={() => handleEstadoToggle('Observado')}
                isActive={nuevoEstado === 'Observado'}
                {...estadoConfig['Observado']}
              >
                Observar
              </ActionButton>
            )}
            {solicitud.estado === 'Observado' && (
              <>
                <ActionButton
                  onClick={() => handleEstadoToggle('Aprobado')}
                  isActive={nuevoEstado === 'Aprobado'}
                  {...estadoConfig['Aprobado']}
                >
                  Aceptar
                </ActionButton>
                <ActionButton
                  onClick={() => handleEstadoToggle('Rechazado')}
                  isActive={nuevoEstado === 'Rechazado'}
                  {...estadoConfig['Rechazado']}
                >
                  Rechazar
                </ActionButton>
              </>
            )}
             {solicitud.estado !== 'Recibido' && solicitud.estado !== 'Aprobado' && solicitud.estado !== 'Rechazado' && (
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 1,
                  backgroundColor: '#DC2626',
                  '&:hover': {
                    backgroundColor: '#B91C1C',
                  },
                }}
                onClick={handleAbandonarSolicitud}
              >
                Abandonar Solicitud
              </Button>
            )}
          </Box>
          
          <TextField
            label="Ingresar motivo"
            multiline
            minRows={2}
            fullWidth
            disabled={solicitud.estado === 'Aprobado' || solicitud.estado === 'Rechazado'}
            value={
              solicitud.estado === 'Aprobado' || solicitud.estado === 'Rechazado'
                ? `El estado actual es ${solicitud.estado}.`
                : motivo
            }
            onChange={e => setMotivo(e.target.value)}
          />
        </InfoCard>

      </Box>

      <Button variant="contained" size="large" onClick={handleGuardarCambios}
        sx={{ backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#115293" }, px: { xs: 2, sm: 4 }, py: 1, textTransform: "none", fontSize: { xs: '0.875rem', sm: '1rem' }, borderRadius: 2, boxShadow: "none", width: { xs: '90%', sm: 'auto' }, maxWidth: { xs: '100%', sm: 'none' } }}>
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