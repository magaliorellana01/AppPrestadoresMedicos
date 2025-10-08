import React, { useState } from "react";
import { Box, Typography, Button, Container, Grid, MenuItem, Select, FormControl, InputLabel, Divider } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TablaGenerica from "../components/TablaGenerica";
import ComponenteDeEstados from "../components/EstadosComponente";


// Simulacion de datos hasta que tenga el back 

const dataSolicitudes = [
  { id: 1, nro: '123454', afiliado: 'Mateo Fernández', tipo: 'Reintegro', estado: 'Recibido', fecha: '12/08/2025' },
  { id: 2, nro: '123453', afiliado: 'Camila Duarte', tipo: 'Autorización', estado: 'En Análisis', fecha: '15/06/2025' },
  { id: 3, nro: '123452', afiliado: 'Sofía Benitez', tipo: 'Receta', estado: 'Observado', fecha: '10/07/2025' },
  { id: 4, nro: '123451', afiliado: 'Julián Herrera', tipo: 'Receta', estado: 'Aprobado', fecha: '14/07/2025' },
  { id: 5, nro: '123450', afiliado: 'Valentina López', tipo: 'Reintegro', estado: 'Aprobado', fecha: '10/05/2025' },
  { id: 6, nro: '123449', afiliado: 'Tomás Ríos', tipo: 'Autorización', estado: 'Rechazado', fecha: '06/04/2025' },
  { id: 7, nro: '123445', afiliado: 'Magalí Orellana', tipo: 'Autorización', estado: 'Aprobado', fecha: '03/04/2025' },
];

// TABLA:

const columnasSolicitudes = [
  { id: 'nro', label: 'Nro Solicitud', align: 'left', width: '15%' },
  { id: 'afiliado', label: 'Afiliado', align: 'left', width: '30%' },
  { id: 'tipo', label: 'Tipo', align: 'left', width: '20%' },
  {
    id: 'estado',
    label: 'Estado',
    align: 'center',
    width: '20%',
    renderCell: (row) => <ComponenteDeEstados estado={row.estado} />,
    sxCell: { padding: '8px' }
  },
  { id: 'fecha', label: 'Fecha', align: 'right', width: '15%' },
];

const keyForSolicitudes = (item) => item.id;


const SolicitudesPage = ({ theme }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8, minHeight: '80vh' }}>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant='h4' color={theme?.color?.primary || 'primary.main'} gutterBottom>
          Solicitudes
        </Typography>
        <Button
          endIcon={<ArrowForwardIcon />}
          variant="text"
          color="primary"
          onClick={() => console.log('Navegar al Dashboard')}
        >
          Ir al Dashboard
        </Button>
      </Box>


      <Typography variant="subtitle1" color= "#6B7280" fontWeight="bold" sx={{ mb: 1 }}>
        Filtros:
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Tipo</InputLabel>
            <Select
              label="Tipo"
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="Reintegro">Reintegro</MenuItem>
              <MenuItem value="Autorizacion">Autorización</MenuItem>
              <MenuItem value="Receta">Receta</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Estado</InputLabel>
            <Select
              label="Estado"
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="Recibido">Recibido</MenuItem>
              <MenuItem value="En Análisis">En Análisis</MenuItem>
              <MenuItem value="Observado">Observado</MenuItem>
              <MenuItem value="Aprobado">Aprobado</MenuItem>
              <MenuItem value="Rechazado">Rechazado</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box
        sx={{
          borderRadius: '4px',
          overflowX: 'auto',
          mb: 4,
          mt: 2
        }}
      >
        <TablaGenerica
          columns={columnasSolicitudes}
          rows={dataSolicitudes}
          count={dataSolicitudes.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={(rpp) => { setRowsPerPage(rpp); setPage(0); }}
          keyFor={keyForSolicitudes}
          sxContainer={{ elevation: 0 }}
        />
      </Box>

    </Container>
  );
};


export default SolicitudesPage;