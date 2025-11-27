import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Container,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getHistoriasClinicasByMultipleParams, searchSocios } from "../services/index.js";
import TablaHistoriasAgrupadaPorFamilia from "../components/TablaHistoriasAgrupadaPorFamilia";
import debounce from 'lodash.debounce';

export default function HistoriasClinicasPage({ theme }) {
  const nav = useNavigate();
  const [historiasClinicas, setHistoriasClinicas] = useState(null);

  // Estados para el Autocomplete
  const [afiliadoOptions, setAfiliadoOptions] = useState([]);
  const [afiliadoInputValue, setAfiliadoInputValue] = useState("");
  const [isAfiliadoLoading, setIsAfiliadoLoading] = useState(false);
  const [selectedAfiliado, setSelectedAfiliado] = useState(null); // Objeto completo del socio seleccionado

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


  const handleBuscar = async () => {
    const searchInput = afiliadoInputValue.trim();
    if (searchInput.length >= 3) {
      const resultados = await getHistoriasClinicasByMultipleParams(searchInput);
      setHistoriasClinicas(resultados);
    } else {
      setHistoriasClinicas([]);
    }
  };

  const handleLimpiar = () => {
    setAfiliadoInputValue("");
    setSelectedAfiliado(null);
    setAfiliadoOptions([]);
    setHistoriasClinicas(null);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleBuscar();
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" color="primary">
          Historias Clínicas
        </Typography>
      </Box>

      <Box
        mb={2}
        display="flex"
        justifyContent={{ xs: "flex-start", md: "space-between" }}
        flexDirection={{ xs: "column-reverse", md: "row" }}
        gap={2}
      >
        <Box width="100%" display="flex" flexDirection="column" gap={3}>
        <Autocomplete
            id="historias-afiliado-search-autocomplete"
            options={afiliadoOptions}
            getOptionLabel={(option) => `${option.nombres} ${option.apellidos} (${option.dni})`}
            inputValue={afiliadoInputValue}
            onInputChange={(event, newInputValue) => {
              setAfiliadoInputValue(newInputValue);
            }}
            onChange={(event, newValue) => {
              setSelectedAfiliado(newValue);
              if (newValue) {
                setAfiliadoInputValue(`${newValue.nombres} ${newValue.apellidos} (${newValue.dni})`);
              } else {
                setAfiliadoInputValue("");
              }
            }}
            onKeyDown={onKeyDown}
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
              disabled={!afiliadoInputValue.trim() && (!historiasClinicas || historiasClinicas.length === 0)}
            >
              Limpiar
            </Button>

            <Button
              variant="contained"
  
              color="primary"
              sx={{ fontSize: { xs: "16px", sm: "20px", md: "22px" }, width: { xs: "100%", sm: "fit-content" } }}
              onClick={handleBuscar}
              disabled={afiliadoInputValue.trim().length < 3}
            >
              Buscar
              <Search sx={{ ml: 1 }} />
            </Button>
          </Box>
        </Box>
      </Box>

      <Paper>
        {historiasClinicas && (
          historiasClinicas.length === 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Nombres</strong></TableCell>
                    <TableCell><strong>Apellidos</strong></TableCell>
                    <TableCell><strong>DNI</strong></TableCell>
                    <TableCell><strong>Tipo</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} align="center">No hay resultados</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            (() => {
              const titularesPorId = (historiasClinicas || []).reduce((map, r) => {
                const socio = r.socio;
                if (socio && socio.rol === 'Titular') {
                  const id = socio._id ? socio._id.toString() : null;
                  if (id) {
                    map[id] = `${socio.apellidos}, ${socio.nombres}`;
                  }
                }
                return map;
              }, {});

              const historiasAgrupadasPorFamilia = (historiasClinicas || []).reduce((acc, r) => {
                const socio = r.socio;
                const titularId = socio && (socio.rol === 'Titular' ? socio._id : socio.es_familiar_de);
                const key = titularId ? titularId.toString() : 'sin_titular';

                if (!acc[key]) {
                  acc[key] = {
                    titularId: key,
                    nombreTitular: titularesPorId[key] || (socio && socio.rol === 'Titular' ? `${socio.apellidos}, ${socio.nombres}` : 'Familiar (Titular no encontrado)'),
                    historias: []
                  };
                }
                acc[key].historias.push(r);
                return acc;
              }, {});

              const gruposFamiliares = Object.values(historiasAgrupadasPorFamilia);

              return <TablaHistoriasAgrupadaPorFamilia gruposFamiliares={gruposFamiliares} />;
            })()
          )
        )}
      </Paper>
    </Container>
  );
}
