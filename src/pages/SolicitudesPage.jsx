import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Container, Grid, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TablaGenerica from "../components/TablaGenerica";
import ComponenteDeEstados from "../components/EstadosComponente";
import { getSolicitudesFiltradas } from "../services";
import { useNavigate, useLocation } from "react-router-dom";

// Estados y tipos:

const estadosOpciones = [
  { label: 'Recibido', value: 'Recibido' },
  { label: 'En Análisis', value: 'En Análisis' },
  { label: ' Observado', value: 'Observado' },
  { label: 'Aprobado', value: 'Aprobado' }, 
  { label: 'Rechazado', value: 'Rechazado' },
];

const tiposOpciones = [
  { label: 'Reintegro', value: 'Reintegro' },
  { label: 'Autorizacion', value: 'Autorizacion' },
  { label: 'Receta', value: 'Receta' },
];

// TABLA:

const columnasSolicitudes = [
  { id: 'nro', label: 'Nro Solicitud', align: 'left', width: '15%' },
  { id: 'afiliadoNombre', label: 'Afiliado', align: 'left', width: '30%' },
  { id: 'tipo', label: 'Tipo', align: 'left', width: '20%' },
  {
    id: 'estado',
    label: 'Estado',
    align: 'center',
    width: '20%',
    renderCell: (row) => <ComponenteDeEstados estado={row.estado} />,
    sxCell: { padding: '8px' }
  },
  { id: 'fechaCreacion', label: 'Fecha', align: 'right', width: '15%', renderCell: (row) => row.fechaCreacion ? new Date(row.fechaCreacion).toLocaleDateString('es-AR') : '-', },
];

const keyForSolicitudes = (item) => item._id || item.id;


const SolicitudesPage = () => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('Todas'); 
  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const json = await getSolicitudesFiltradas({
        page,
        size: rowsPerPage,
        estado: estadoFiltro,
        tipo: tipoFiltro,
      });
      setData(json.content || []);
      setCount(json.total || 0);
    } catch (err) {
      console.error('Error al conectar con el backend:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, estadoFiltro, tipoFiltro, location.key]);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant='h4'>Solicitudes</Typography>
        <Button endIcon={<ArrowForwardIcon />} variant="text">Ir al Dashboard</Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid>
          <FormControl size="small" sx={{ minWidth: 200 }} variant="outlined">
            <InputLabel id= "tipo-label">Tipo</InputLabel>
            <Select labelId="tipo-label" value={tipoFiltro} onChange={(e) => { setTipoFiltro(e.target.value); setPage(0); }} label= "Tipo">
              {tiposOpciones.map((op) => <MenuItem key={op.value} value={op.value}>{op.label}</MenuItem>)}
              <MenuItem value="">Todas</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id= "estado-label">Estado</InputLabel>
            <Select labelId="estado-label" value={estadoFiltro} onChange={(e) => { setEstadoFiltro(e.target.value); setPage(0); }} label="Estado">
              {estadosOpciones.map((op) => <MenuItem key={op.value} value={op.value}>{op.label}</MenuItem>)}
              <MenuItem value="Todas">Todas</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ overflowX: 'auto', mb: 4 }}>
        {isLoading ? <Typography align="center" sx={{ py: 4 }}>Cargando solicitudes...</Typography> :
          <TablaGenerica
            columns={columnasSolicitudes}
            rows={data}
            count={count}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(e, p) => setPage(p)}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            keyFor={keyForSolicitudes}
            onRowClick={(row) => navigate(`/solicitudes/${row._id}`)} 
          />}
      </Box>
    </Container>
  );
};

export default SolicitudesPage;