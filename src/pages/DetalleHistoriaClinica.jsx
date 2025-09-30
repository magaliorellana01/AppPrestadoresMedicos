import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  CircularProgress,
} from "@mui/material";
import CartelInformacionSocio from "../components/CartelInformacionSocio";
import { useState, useEffect, useCallback } from "react";
import { getHistoriaClinicaByID } from "../services";

//Reemplazar este valor con el ID real del usuario logueado.
const getUsuarioActualId = () => "68db391a5f344ed4ec49f3e7";

export default function DetalleDeHistoriaClinica() {
  const { id } = useParams();

  const [historiaClinicaData, setHistoriaClinicaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filtro, setFiltro] = useState("todas");

  const fetchHistoriaClinica = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHistoriaClinicaByID(id);
      setHistoriaClinicaData(data);
    } catch (err) {
      console.error("Error al cargar la Historia Clínica:", err);
      setError(err.message || "Error desconocido al cargar la historia clínica.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchHistoriaClinica();
  }, [fetchHistoriaClinica]);

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !historiaClinicaData) {
    return (
      <Box p={4}>
        <Typography variant="h5" color="error">
          Historia clínica no encontrada
        </Typography>
        {error && <Typography variant="body1" color="textSecondary">{error}</Typography>}
      </Box>
    );
  }

  const socio = historiaClinicaData.socio;
  const notasBackend = historiaClinicaData.notas || [];

  const usuarioActualId = getUsuarioActualId();

  const notasFiltradas =
    filtro === "mias"
      ? notasBackend.filter((n) => n.prestador?._id === usuarioActualId)
      : notasBackend;

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", px: 2, py: 4 }}>
      <Typography
        variant="body2"
        sx={{ mb: 2, cursor: "pointer", color: "primary.main" }}
        onClick={() => window.history.back()}
      >
        ← Volver a Lista de Afiliados
      </Typography>

      {/* Título */}
      <Typography variant="h4" sx={{ mb: 3 }}>
        Historia clínica de {socio.nombres} {socio.apellidos}
      </Typography>

      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        <Box sx={{ flex: 2, minWidth: 300 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Notas
          </Typography>

          <RadioGroup row value={filtro} onChange={(e) => setFiltro(e.target.value)} sx={{ mb: 2 }}>
            <FormControlLabel value="todas" control={<Radio />} label="Ver todas las notas" />
            <FormControlLabel value="mias" control={<Radio disabled={!usuarioActualId} />} label="Ver solo mis notas" />
          </RadioGroup>

          {/* Listado de notas */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {notasFiltradas.length > 0 ? (
              notasFiltradas.map((nota) => (
                <Paper
                  key={nota._id}
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: "grey.100",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {/* Se usa la fecha de creación y el prestador poblado */}
                    {new Date(nota.fecha_creacion).toLocaleDateString()} –
                    {nota.prestador
                      ? `${nota.prestador.nombres || ''} ${nota.prestador.apellidos || 'Prestador Desconocido'}`
                      : 'Prestador no especificado'}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body1">{nota.nota}</Typography>
                </Paper>
              ))
            ) : (
              <Typography variant="body1" color="textSecondary">
                No hay notas disponibles bajo el filtro actual.
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ flex: 1, minWidth: 280 }}>
          <CartelInformacionSocio socio={socio} />
        </Box>
      </Box>
    </Box>
  );
}