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
  Chip,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getHistoriasClinicasByMultipleParams } from "../services/index.js";

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
    <Box sx={{ maxWidth: 1500, mx: "auto", px: { xs: 2, md: 2 }, py: 1 }}>
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
            placeholder="Buscar por DNI, Nombre, Apellido"
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

          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              color="primary"
              sx={{ fontSize: "22px", width: "fit-content" }}
              onClick={handleLimpiar}
              disabled={!q.trim() && (!historiasClinicas || historiasClinicas.length === 0)}
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
      </Box>

      <Paper>
        {historiasClinicas && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Nombres</strong></TableCell>
                  <TableCell><strong>Apellidos</strong></TableCell>
                  <TableCell><strong>Nro Afiliado</strong></TableCell>
                  <TableCell><strong>Tipo</strong></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {historiasClinicas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">No hay resultados</TableCell>
                  </TableRow>
                ) : (
                  historiasClinicas.map((r) => (
                    <TableRow
                      key={r._id ?? `${r.socio?.dni}-${r.socio?.apellidos}-${r.socio?.nombres}`}
                      hover
                      onClick={() => nav(`/historia-clinica/${r._id ?? r.socio?._id}`)}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>{r.socio?.nombres ?? r.nombre ?? "-"}</TableCell>
                      <TableCell>{r.socio?.apellidos ?? r.apellido ?? "-"}</TableCell>
                      <TableCell>{r.socio?.dni ?? r.dni ?? "-"}</TableCell>
                      <TableCell>
                        <Chip label={r.socio?.rol ?? r.tipo ?? "—"} size="small" variant="outlined" />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
