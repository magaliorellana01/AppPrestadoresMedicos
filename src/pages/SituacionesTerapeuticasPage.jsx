import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import ModalNuevaSTerapeutica from "../components/ModalNuevaSTerapeutica";
import { getSituacionTerapeuticaByMultipleParams } from "../services";
import TableSituacionesTerapeuticas from "../components/TableSituacionesTerapeuticas";


const SituacionesTerapeuticasPage = ({ theme }) => {
  const [q, setQ] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [situacionesTerapeuticas, setSituacionesTerapeuticas] = useState(null);

  const handleBuscar = async () => {
    const resultados = await getSituacionTerapeuticaByMultipleParams(q);
    setSituacionesTerapeuticas(resultados);
  };

  const handleLimpiar = () => {
    setQ("");
    setSituacionesTerapeuticas(null);
  };

  return (
    <Box>
      <Typography variant="h4" color={theme.color.primary} mb={4}>
        Situaciones Terapéuticas
      </Typography>

      <Box
        mb={2}
        display="flex"
        justifyContent={{ xs: "flex-start", md: "space-between" }}
        flexDirection={{ xs: "column-reverse", md: "row" }}
        gap={2}
      >
        <Box width="100%" display="flex" flexDirection="column" gap={3}>
          <TextField
            fullWidth
            size="small"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (q.trim()) {
                  handleBuscar();
                }
              }
            }}
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
          <Box display="flex" gap={2}>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ fontSize: "22px", width: "fit-content" }} 
              onClick={handleLimpiar}
              disabled={!q.trim() && (!situacionesTerapeuticas || situacionesTerapeuticas.length === 0)}
            >
              Limpiar
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ fontSize: "22px", width: "fit-content" }} 
              onClick={handleBuscar} 
              disabled={!q.trim()}
            >
              Buscar
              <Search sx={{ ml: 1 }} />
            </Button>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="primary"
          sx={{ fontSize: "22px", height: 'fit-content', width: { xs: '100%', md: 500 } }}
          onClick={() => setOpenModal(true)}
        >
          Agregar Situación Terapéutica
          <Add sx={{ ml: 1 }} />
        </Button>
      </Box>

      <TableSituacionesTerapeuticas situacionesTerapeuticas={situacionesTerapeuticas} />

      <ModalNuevaSTerapeutica openModal={openModal} setOpenModal={setOpenModal} />

    </Box>
  );
};

export default SituacionesTerapeuticasPage;