import React from "react";
import { Box, TextField } from "@mui/material";

export default function HistoriasClinicasSearch({ q, onChange }) {
  return (
    <Box sx={{ mb: 2, maxWidth: 660 }}>
      <TextField
        fullWidth
        size="small"
        value={q}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por Nro Afiliado, Nombres, Apellidos o Tipo"
        InputProps={{
          inputProps: { "aria-label": "buscar afiliado" },
        }}
        sx={{
          "& .MuiInputBase-input": {
            fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
            py: { xs: 1, sm: 1.25, md: 1.5 }
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: 2
          }
        }}
      />
    </Box>
  );
}
