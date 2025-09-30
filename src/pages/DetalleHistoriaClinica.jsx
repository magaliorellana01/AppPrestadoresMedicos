import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
} from "@mui/material";
import CartelInformacionSocio from "../components/CartelInformacionSocio";
import demoItems from "../data/historias_demo";
import { useState } from "react";

export default function DetalleDeHistoriaClinica() {
  const { id } = useParams();
  const socio = demoItems.find((x) => String(x.id) === id);

  const [filtro, setFiltro] = useState("todas");

  if (!socio) {
    return (
      <Box p={4}>
        <Typography variant="h5" color="error">
          Historia clínica no encontrada
        </Typography>
      </Box>
    );
  }

  // Agregué notas de ejemplo (Magalí)
  const notas = [
    {
      fecha: "20/9/2025",
      profesional: "Cardiólogo Juan Perez",
      texto: "Se realizó un electrocardiograma y salió muy bien",
      autorId: 1,
    },
    {
      fecha: "9/9/2025",
      profesional: "Traumatóloga Maia Gonzalez",
      texto: "La resonancia magnética salió perfecta sin señal de esguince, hematoma ni hueso roto",
      autorId: 2,
    },
    {
      fecha: "1/9/2025",
      profesional: "Traumatóloga Maia Gonzalez",
      texto: "Veo bien todas las articulaciones pero mandé a realizar una resonancia...",
      autorId: 2,
    },
    {
      fecha: "1/9/2025",
      profesional: "Clínico Médico Fernando Buey",
      texto: "Presenta dolores en la rodilla, derivo con traumatología.",
      autorId: 3,
    },
  ];

  const usuarioActualId = 2;

  const notasFiltradas =
    filtro === "mias" ? notas.filter((n) => n.autorId === usuarioActualId) : notas;

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", px: 2, py: 4 }}>
      {/* Arrow back hecho por Mati */}
      <Typography
        variant="body2"
        sx={{ mb: 2, cursor: "pointer", color: "primary.main" }}
        onClick={() => window.history.back()}
      >
        ← Volver a Lista de Afiliados
      </Typography>

      {/* Título hecho por Magalí */}
      <Typography variant="h4" sx={{ mb: 3 }}>
        Historia clínica de {socio.nombres} {socio.apellidos}
      </Typography>

      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        <Box sx={{ flex: 2, minWidth: 300 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Notas
          </Typography>

          {/* Hecho por Mati */}
          <RadioGroup row value={filtro} onChange={(e) => setFiltro(e.target.value)} sx={{ mb: 2 }}>
            <FormControlLabel value="todas" control={<Radio />} label="Ver todas las notas" />
            <FormControlLabel value="mias" control={<Radio />} label="Ver solo mis notas" />
          </RadioGroup>

          {/* Listado de notas hecho por Magalí */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {notasFiltradas.map((nota, idx) => (
              <Paper
                key={idx}
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: "grey.100",
                  borderRadius: 2,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {nota.fecha} – {nota.profesional}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1">{nota.texto}</Typography>
              </Paper>
            ))}
          </Box>
        </Box>

        <Box sx={{ flex: 1, minWidth: 280 }}>
          <CartelInformacionSocio socio={socio} />
        </Box>
      </Box>
    </Box>
  );
}
