import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import ModalNuevaSTerapeutica from "../components/ModalNuevaSTerapeutica";


const SituacionesTerapeuticasPage = ({ theme }) => {
  const [q, setQ] = useState("");
  const [openModal, setOpenModal] = useState(false);

  return (
    <Box>
      <Typography variant="h4" color={theme.color.primary} mb={4}>
        Situaciones Terapéuticas
      </Typography>

      <Box mb={2} display="flex" justifyContent="space-between">
        <Box width="100%" display="flex" flexDirection="column" gap={3}>
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
          <Button variant="contained" color="primary" sx={{ fontSize: "22px", width: "fit-content" }} onClick={() => setOpenModal(true)} >
            Buscar
            <Search sx={{ ml: 1 }} />
          </Button>
        </Box>

        <Button variant="contained" color="primary" sx={{ fontSize: "22px", height: 'fit-content', width: '500px' }} onClick={() => setOpenModal(true)}>
          Agregar Situación Terapéutica
          <Add sx={{ ml: 1 }} />
        </Button>
      </Box>

      <ModalNuevaSTerapeutica openModal={openModal} setOpenModal={setOpenModal} />

    </Box>
  );
};

export default SituacionesTerapeuticasPage;