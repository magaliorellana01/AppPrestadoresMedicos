import React, { useState } from "react";
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
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getHistoriasClinicasByMultipleParams } from "../services/index.js";
import TablaHistoriasAgrupadaPorFamilia from "../components/TablaHistoriasAgrupadaPorFamilia";

export default function HistoriasClinicasPage({ theme }) {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [historiasClinicas, setHistoriasClinicas] = useState(null);

  const handleBuscar = async () => {
    const resultados = await getHistoriasClinicasByMultipleParams(q);
    setHistoriasClinicas(resultados);
  };

  const handleLimpiar = () => {
    setQ("");
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
          <TextField
            fullWidth
            size="small"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Buscar por DNI, Nombres, Apellidos o Teléfono"
            InputProps={{
              inputProps: { "aria-label": "buscar afiliado" },
            }}
            sx={{
              maxWidth: 660,
              backgroundColor: "white",
              "& .MuiInputBase-input": { py: 1 },
              "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: "22px" },
            }}
          />

          <Box display="flex" gap={2} flexDirection={{ xs: "column", sm: "row" }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ fontSize: { xs: "16px", sm: "20px", md: "22px" }, width: { xs: "100%", sm: "fit-content" } }}
              onClick={handleLimpiar}
              disabled={!q.trim() && (!historiasClinicas || historiasClinicas.length === 0)}
            >
              Limpiar
            </Button>

            <Button
              variant="contained"
              color="primary"
              sx={{ fontSize: { xs: "16px", sm: "20px", md: "22px" }, width: { xs: "100%", sm: "fit-content" } }}
              onClick={handleBuscar}
              disabled={!q.trim()}
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
