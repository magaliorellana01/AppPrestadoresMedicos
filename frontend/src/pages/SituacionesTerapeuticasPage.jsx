import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, TextField, Typography, RadioGroup, FormControlLabel, Radio, useMediaQuery, useTheme, Container, Autocomplete, CircularProgress } from "@mui/material";
import { Add } from "@mui/icons-material";
import ModalNuevaSTerapeutica from "../components/ModalNuevaSTerapeutica";
import { getSituacionesTerapeuticasBySocioId, searchSocios } from "../services";
import TablaAgrupadaPorFamilia from "../components/TablaAgrupadaPorFamilia";
import debounce from 'lodash.debounce';


const SituacionesTerapeuticasPage = ({ theme }) => {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const [openModal, setOpenModal] = useState(false);
  const [situacionesTerapeuticas, setSituacionesTerapeuticas] = useState(null);
  const [filtro, setFiltro] = useState("todas");
  const prestadorLogueadoId = JSON.parse(sessionStorage.getItem("prestador"))?._id;

  // Estados para el Autocomplete
  const [afiliadoOptions, setAfiliadoOptions] = useState([]);
  const [afiliadoInputValue, setAfiliadoInputValue] = useState("");
  const [isAfiliadoLoading, setIsAfiliadoLoading] = useState(false);
  const [selectedAfiliado, setSelectedAfiliado] = useState(null);

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
    if (!selectedAfiliado) {
      fetchSocios(afiliadoInputValue);
    }
  }, [afiliadoInputValue, fetchSocios, selectedAfiliado]);


  const handleSeleccionAfiliado = async (socio) => {
    setSelectedAfiliado(socio);
    if (socio) {
      const resultados = await getSituacionesTerapeuticasBySocioId(socio._id);
      setSituacionesTerapeuticas(resultados);
      setAfiliadoInputValue(`${socio.nombres} ${socio.apellidos} (${socio.dni})`);
    } else {
      setSituacionesTerapeuticas(null);
      setAfiliadoInputValue("");
    }
  };

  const handleLimpiar = () => {
    setAfiliadoInputValue("");
    setSelectedAfiliado(null);
    setAfiliadoOptions([]);
    setSituacionesTerapeuticas(null);
    setFiltro("todas");
  };

  const situacionesFiltradas = (situacionesTerapeuticas || []).filter((sit) => {
    if (filtro === "mias") {
      return sit.prestador._id === prestadorLogueadoId;
    }
    return true;
  });

  // Índice de titulares por ID para poder nombrar correctamente los grupos
  const titularesPorId = situacionesFiltradas.reduce((map, sit) => {
    const socio = sit.socio;
    if (socio && socio.rol === 'Titular') {
      const id = socio._id ? socio._id.toString() : null;
      if (id) {
        map[id] = `${socio.apellidos}, ${socio.nombres}`;
      }
    }
    return map;
  }, {});

  const situacionesAgrupadasPorFamilia = situacionesFiltradas.reduce((acc, sit) => {
    
    const socio = sit.socio;
    const titularId = socio.rol === 'Titular' 
      ? socio._id 
      : socio.es_familiar_de; 

  
    const key = titularId ? titularId.toString() : 'sin_titular';

    if (!acc[key]) {
      acc[key] = {
        titularId: key,
        nombreTitular: titularesPorId[key] || (socio.rol === 'Titular' ? `${socio.apellidos}, ${socio.nombres}` : 'Familiar (Titular no encontrado)'),
        situaciones: []
      };
    }
    
    
    acc[key].situaciones.push(sit);

    return acc;
  }, {});

  const gruposFamiliares = Object.values(situacionesAgrupadasPorFamilia);

  return (
    <Container maxWidth={false} sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" color="primary" mb={4}>
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
          <Autocomplete
            id="situaciones-afiliado-search-autocomplete"
            options={afiliadoOptions}
            getOptionLabel={(option) => `${option.nombres} ${option.apellidos} (${option.dni})`}
            inputValue={afiliadoInputValue}
            onInputChange={(event, newInputValue) => {
              setAfiliadoInputValue(newInputValue);
            }}
            onChange={(event, newValue) => {
              handleSeleccionAfiliado(newValue);
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
            sx={{ maxWidth: 660 }}
          />
          <Box display="flex" gap={2} flexDirection={{ xs: "column", sm: "row" }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ fontSize: { xs: "16px", sm: "20px", md: "22px" }, width: { xs: "100%", sm: "fit-content" } }}
              onClick={handleLimpiar}
              disabled={!afiliadoInputValue && !selectedAfiliado}
            >
              Limpiar
            </Button>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="primary"
          sx={{ fontSize: { xs: "16px", sm: "20px", md: "22px" }, height: 'fit-content', width: { xs: '100%', sm: 'auto', md: 500 } }}
          onClick={() => setOpenModal(true)}
        >
          Agregar Situación Terapéutica
          <Add sx={{ ml: 1 }} />
        </Button>
      </Box>
      {situacionesTerapeuticas !== null && (
        <>
          <RadioGroup
            row={!isMobile}
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            sx={{ mb: 2 }}
          >
            <FormControlLabel
              value="todas"
              control={<Radio />}
              label="Ver todas las situaciones terapéuticas"
              sx={{ '& .MuiFormControlLabel-label': { fontSize: { xs: '14px', sm: '16px' } } }}
            />
            <FormControlLabel
              value="mias"
              control={<Radio />}
              label="Ver las creadas por mi"
              disabled={!prestadorLogueadoId}
              sx={{ '& .MuiFormControlLabel-label': { fontSize: { xs: '14px', sm: '16px' } } }}
            />
          </RadioGroup>

          {/* <TableSituacionesTerapeuticas situacionesTerapeuticas={situacionesFiltradas} /> */}
          <TablaAgrupadaPorFamilia gruposFamiliares={gruposFamiliares} />
        </>
      )}

      <ModalNuevaSTerapeutica openModal={openModal} setOpenModal={setOpenModal} />
    </Container>
  );
};


export default SituacionesTerapeuticasPage;