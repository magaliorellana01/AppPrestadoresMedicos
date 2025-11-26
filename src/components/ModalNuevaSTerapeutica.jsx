import React, { useState, useEffect, useCallback } from "react";
import { Alert, Autocomplete, Box, Button, CircularProgress, Divider, IconButton, Modal, Snackbar, TextField, Typography, useTheme } from "@mui/material";
import { Close } from "@mui/icons-material";
import { createSituacionTerapeutica, searchSocios } from "../services";
import { useNavigate } from "react-router-dom";
import debounce from 'lodash.debounce';


const formatTodayYYYYMMDD = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

export default function ModalNuevaSTerapeutica({ openModal, setOpenModal }) {
    const theme = useTheme();
    const navigate = useNavigate();
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    
    // State para el Autocomplete
    const [afiliadoOptions, setAfiliadoOptions] = useState([]);
    const [afiliadoInputValue, setAfiliadoInputValue] = useState("");
    const [isAfiliadoLoading, setIsAfiliadoLoading] = useState(false);
    const [selectedAfiliado, setSelectedAfiliado] = useState(null);

    const [form, setForm] = useState({
        dniAfiliado: "",
        fechaInicio: formatTodayYYYYMMDD(),
        fechaFin: "",
        diagnostico: "",
        tratamiento: "",
      });
    
      const handleChangeField = (field) => (event) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
      };

      const fetchSocios = useCallback(
        debounce(async (inputValue) => {
          if (inputValue && inputValue.length >= 3) {
            setIsAfiliadoLoading(true);
            try {
              const data = await searchSocios(inputValue);
              setAfiliadoOptions(data || []);
            } catch (error) {
              console.error("Error buscando socios:", error);
              setAfiliadoOptions([]);
            } finally {
              setIsAfiliadoLoading(false);
            }
          } else {
            setAfiliadoOptions([]);
          }
        }, 500),
        []
      );
    
      useEffect(() => {
        fetchSocios(afiliadoInputValue);
      }, [afiliadoInputValue, fetchSocios]);
    
      const handleCrear = async () => {
        try {
          const situacion = await createSituacionTerapeutica(form);
          setSnackbar({ open: true, message: 'Situación terapéutica creada correctamente', severity: "success" });
          setOpenModal(false);
          navigate(`/situaciones-terapeuticas/${situacion._id}`);
        } catch (error) {
          console.log('error', error);
          setSnackbar({ open: true, message: error.response?.data?.message || error.message || 'Error al crear la situación terapéutica' , severity: "error" });
        }
      };
    
      useEffect(() => {
        if (!openModal) {
          setForm({
            dniAfiliado: "",
            fechaInicio: formatTodayYYYYMMDD(),
            fechaFin: "",
            diagnostico: "",
            tratamiento: "",
          });
          setSelectedAfiliado(null);
          setAfiliadoInputValue("");
          setAfiliadoOptions([]);
        }
      }, [openModal]);


  return (
    <>
        <Modal open={openModal} onClose={() => setOpenModal(false)} sx={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
            
        <Box sx={{ backgroundColor: "white", p: 4,  borderRadius: '22px', border: '1px solid #E5E7EB', width: { xs: "90%", md: "1008px" } }}>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography color={theme.color.primary} fontSize="28px">Nueva Situación Terapéutica</Typography>
              <IconButton onClick={() => setOpenModal(false)}>
              <Close />
            </IconButton>
        </Box>

        <Divider sx={{ mt: 2, mb: 4 }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Autocomplete
              id="afiliado-search-autocomplete"
              options={afiliadoOptions}
              getOptionLabel={(option) => `${option.nombres} ${option.apellidos} (${option.dni})`}
              inputValue={afiliadoInputValue}
              onInputChange={(event, newInputValue) => {
                setAfiliadoInputValue(newInputValue);
              }}
              onChange={(event, newValue) => {
                setSelectedAfiliado(newValue);
                setForm((prev) => ({ ...prev, dniAfiliado: newValue ? newValue.dni : "" }));
              }}
              value={selectedAfiliado}
              loading={isAfiliadoLoading}
              loadingText="Buscando..."
              noOptionsText="No se encontraron afiliados. Ingrese DNI, nombre o apellido (mín. 4 caracteres)."
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Buscar por DNI, Nombres o Apellidos (mín. 4 caracteres)"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isAfiliadoLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            <TextField
            aria-label="fecha de alta"
            disabled
            fullWidth
            InputLabelProps={{ shrink: true }}
            label="Fecha de Alta *"
            onChange={handleChangeField("fechaInicio")}
            size="small"
            type="date"
            value={form.fechaInicio}
            />
            <TextField
            aria-label="fecha de finalización"
            fullWidth
            InputLabelProps={{ shrink: true }}
            label="Fecha de Finalización"
            onChange={handleChangeField("fechaFin")}
            size="small"
            type="date"
            value={form.fechaFin}
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

        <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, justifyContent: "flex-end", gap: { xs: 1.5, sm: 0 }, mt: 2 }}>
            <Button
                variant="contained"
                color="primary"
                sx={{ fontSize: { xs: "16px", sm: "20px", md: "22px" }, width: { xs: "100%", sm: "175px" }, borderRadius: "10px", color: 'white', backgroundColor: theme.color.secondary }}
                onClick={() => setOpenModal(false)}
            >
            Cancelar
            </Button>
            <Button
                variant="contained"
                color="primary"
                sx={{ fontSize: { xs: "16px", sm: "20px", md: "22px" }, width: { xs: "100%", sm: "175px" }, ml: { xs: 0, sm: 2 }, borderRadius: "10px" }}
                onClick={handleCrear}
                disabled={!form.dniAfiliado || !form.fechaInicio || !form.diagnostico || !form.tratamiento}>
            Crear
            </Button>
        </Box>
        </Box>
        </Modal>
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
          <Alert severity={snackbar.severity} sx={{ width: "100%" }}>{snackbar.message}</Alert>
        </Snackbar>
    </>
  );
}
