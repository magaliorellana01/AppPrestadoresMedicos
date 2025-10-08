import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";

const SituacionesTerapeuticasPage = ({ theme }) => {
  const [q, setQ] = useState("");

  return (
    <Box>

      <Typography variant="h4" color={theme.color.primary} mb={4}>
        Situaciones Terapéuticas
      </Typography>

      <Box mb={2} display="flex" justifyContent="space-between">
        <TextField
          fullWidth
          size="small"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por Nro Afiliado, Apellido o Teléfono"
          InputProps={{
            inputProps: { "aria-label": "buscar afiliado" },
          }}
          sx={{
            maxWidth: 660,
            backgroundColor: "white",
            "& .MuiInputBase-input": {
              py: 1,
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              fontSize: '22px',
            },
          }}
        />

        <Button variant="contained" color="primary" sx={{ fontSize: "22px" }}>
          Agregar Situación Terapéutica
          <Add sx={{ ml: 1 }} />
        </Button>
      </Box>
    </Box>
  );
};

export default SituacionesTerapeuticasPage;