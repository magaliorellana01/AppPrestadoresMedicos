import React, { useState } from "react";
import { Box, Button, Divider, IconButton, Modal, TextField, Typography } from "@mui/material";
import { Add, Close } from "@mui/icons-material";

const SituacionesTerapeuticasPage = ({ theme }) => {
  const [q, setQ] = useState("");
  const [openModal, setOpenModal] = useState(false);

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

        <Button variant="contained" color="primary" sx={{ fontSize: "22px" }} onClick={() => setOpenModal(true)}>
          Agregar Situación Terapéutica
          <Add sx={{ ml: 1 }} />
        </Button>
      </Box>

      <Modal open={openModal} onClose={() => setOpenModal(false)} sx={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
        
        <Box sx={{ width: "500px", backgroundColor: "white", p: 4,  borderRadius: '22px', border: '1px solid #E5E7EB', width: { xs: "90%", md: "1008px" } }}>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography color={theme.color.primary} fontSize="28px">Nueva Situación Terapéutica</Typography>
            <IconButton onClick={() => setOpenModal(false)}>
              <Close />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField fullWidth size="small" label="DNI Afiliado" type="number" InputLabelProps={{ shrink: true }} aria-label="dni afiliado"/>
            <TextField fullWidth size="small" label="Fecha de Alta" type="date" InputLabelProps={{ shrink: true }} aria-label="fecha de alta"/>
            <TextField fullWidth size="small" label="Fecha de Finalización" type="date" InputLabelProps={{ shrink: true }} aria-label="fecha de finalización"/>
            <TextField fullWidth size="small" label="Diagnóstico" InputLabelProps={{ shrink: true }} aria-label="diagnóstico"/>
            <TextField fullWidth size="small" label="Tratamiento" InputLabelProps={{ shrink: true }} aria-label="tratamiento"/>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button variant="contained" color="primary" sx={{ fontSize: "22px", width: "175px", borderRadius: "10px", color: 'white', backgroundColor: theme.color.secondary }}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" sx={{ fontSize: "22px", width: "175px", ml: 2, borderRadius: "10px" }}>
              Crear
            </Button>
          </Box>
        </Box>

      </Modal>
    </Box>
  );
};

export default SituacionesTerapeuticasPage;