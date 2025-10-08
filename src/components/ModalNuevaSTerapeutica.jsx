import React, { useState, useEffect } from "react";
import { Box, Button, Divider, IconButton, Modal, TextField, Typography, useTheme } from "@mui/material";
import { Close } from "@mui/icons-material";


const formatTodayYYYYMMDD = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

export default function ModalNuevaSTerapeutica({ openModal, setOpenModal }) {

    const theme = useTheme();
    const [form, setForm] = useState({
        dniAfiliado: "",
        fechaAlta: formatTodayYYYYMMDD(),
        fechaFinalizacion: "",
        diagnostico: "",
        tratamiento: "",
      });
    
      const handleChangeField = (field) => (event) => {
        if(field === "dniAfiliado") {
          setForm((prev) => ({ ...prev, [field]: event.target.value.replace(/\D/g, "") }));
        } else {
          setForm((prev) => ({ ...prev, [field]: event.target.value }));
        }
      };
    
      const handleCrear = async () => {
        // TODO: integrar con servicio createSituacionTerapeutica(form)
        // Por ahora, solo log para ver los valores
        console.log("Crear Situación Terapéutica:", form);
      };
    
      useEffect(() => {
        if (!openModal) {
          setForm({
            dniAfiliado: "",
            fechaAlta: formatTodayYYYYMMDD(),
            fechaFinalizacion: "",
            diagnostico: "",
            tratamiento: "",
          });
        }
      }, [openModal, setForm]);


  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)} sx={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
        
    <Box sx={{ width: "500px", backgroundColor: "white", p: 4,  borderRadius: '22px', border: '1px solid #E5E7EB', width: { xs: "90%", md: "1008px" } }}>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography color={theme.color.primary} fontSize="28px">Nueva Situación Terapéutica</Typography>
        <IconButton onClick={() => setOpenModal(false)}>
          <Close />
        </IconButton>
      </Box>

      <Divider sx={{ mt: 2, mb: 4 }} />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          aria-label="dni afiliado"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="DNI Afiliado *"
          onChange={handleChangeField("dniAfiliado")}
          size="small"
          value={form.dniAfiliado}
        />
        <TextField
          aria-label="fecha de alta"
          disabled
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="Fecha de Alta *"
          onChange={handleChangeField("fechaAlta")}
          size="small"
          type="date"
          value={form.fechaAlta}
        />
        <TextField
          aria-label="fecha de finalización"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="Fecha de Finalización"
          onChange={handleChangeField("fechaFinalizacion")}
          size="small"
          type="date"
          value={form.fechaFinalizacion}
        />
        <TextField
          aria-label="diagnóstico"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="Diagnóstico *"
          onChange={handleChangeField("diagnostico")}
          size="small"
          value={form.diagnostico}
        />
        <TextField
          aria-label="tratamiento"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="Tratamiento *"
          onChange={handleChangeField("tratamiento")}
          size="small"
          value={form.tratamiento}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button variant="contained" color="primary" sx={{ fontSize: "22px", width: "175px", borderRadius: "10px", color: 'white', backgroundColor: theme.color.secondary }} onClick={() => setOpenModal(false)}>
          Cancelar
        </Button>
        <Button variant="contained" color="primary" sx={{ fontSize: "22px", width: "175px", ml: 2, borderRadius: "10px" }} onClick={handleCrear} disabled={!form.dniAfiliado || !form.fechaAlta || !form.diagnostico || !form.tratamiento}>
          Crear
        </Button>
      </Box>
    </Box>

  </Modal>
  );
}