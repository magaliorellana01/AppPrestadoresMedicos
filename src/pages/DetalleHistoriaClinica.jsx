import { useParams } from "react-router-dom";
import { Box, Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import demoItems from "../data/historias_demo";
import { useState } from "react";

export default function HistoriaClinicaDetallePage() {
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

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", px: 2, py: 4 }}>
      <Typography
        variant="body2"
        sx={{ mb: 2, cursor: "pointer", color: "primary.main" }}
        onClick={() => window.history.back()}
      >
        ← Volver a Lista de Afiliados
      </Typography>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Notas
      </Typography>

      <RadioGroup
        row
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      >
        <FormControlLabel
          value="todas"
          control={<Radio />}
          label="Ver todas las notas"
        />
        <FormControlLabel
          value="mias"
          control={<Radio />}
          label="Ver solo mis notas"
        />
      </RadioGroup>
    </Box>
  );
}
