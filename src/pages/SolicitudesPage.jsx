import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Container, Grid, MenuItem, Select, FormControl, InputLabel, Paper, ToggleButton, ToggleButtonGroup } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TablaGenerica from "../components/TablaGenerica";
import ViewListIcon from '@mui/icons-material/ViewList';
import GroupIcon from '@mui/icons-material/Group';
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
  const [vistaActual, setVistaActual] = useState('propia');
  const navigate = useNavigate();
  const location = useLocation();
  const usuarioLogueado = JSON.parse(sessionStorage.getItem("prestador") || "{}");
  const esCentroMedico = usuarioLogueado?.es_centro_medico;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const json = await getSolicitudesFiltradas({
        page,
        size: rowsPerPage,
        estado: estadoFiltro,
        tipo: tipoFiltro,
        vista: esCentroMedico ? vistaActual : undefined
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
    setPage(0);
  }, [vistaActual]);

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, estadoFiltro, tipoFiltro, vistaActual, location.key]);


  const handleVistaChange = (event, newVista) => {
    if (newVista !== null) {
      setVistaActual(newVista);
    }
  };

  return (
    <Container maxWidth={false} sx={{ mt: 4, mb: 8 }}>
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} mb={4} gap={{ xs: 2, sm: 0 }}>
        <Typography variant='h4' color="primary" sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>Solicitudes</Typography>
        <Button
          endIcon={<ArrowForwardIcon />}
          variant="contained"
          onClick={() => navigate('/solicitudes/dashboard')}
          sx={{ textTransform: 'none', fontWeight: 500, width: { xs: '100%', sm: 'auto' }, fontSize: { xs: '14px', sm: '16px' } }}
        >
          Ver Dashboard
        </Button>
      </Box>

      {/* esto es solo visible para el cntro medico */}
      {esCentroMedico && (
        <Paper elevation={0} sx={{ mb: 3, bgcolor: 'transparent' }}>
          <ToggleButtonGroup
            value={vistaActual}
            exclusive
            onChange={handleVistaChange}
            aria-label="Vistas de solicitud"
            size="small"
            sx={{
              bgcolor: 'white',
              boxShadow: 1,
              '& .MuiToggleButton-root': {
                textTransform: 'none',
                px: 3,
                py: 1,
                fontWeight: 600,
                border: '1px solid #e0e0e0'
              },
              '& .Mui-selected': {
                bgcolor: '#1976d2 !important',
                color: 'white !important',
                borderColor: '#1976d2 !important'
              }
            }}
          >
            <ToggleButton value="propia">
              <ViewListIcon sx={{ mr: 1, fontSize: 20 }} />
              Mi Bandeja
            </ToggleButton>
            <ToggleButton value="equipo">
              <GroupIcon sx={{ mr: 1, fontSize: 20 }} />
              Equipo Médico
            </ToggleButton>
          </ToggleButtonGroup>

          <Typography variant="caption" display="block" sx={{ mt: 1, ml: 1, color: 'text.secondary' }}>
            {vistaActual === 'propia'
              ? 'Viendo: Solicitudes libres y asignadas al Centro.'
              : `Viendo: Solicitudes gestionadas por los médicos de ${usuarioLogueado.nombres || 'su centro'}.`}
          </Typography>
        </Paper>
      )}

      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} sx={{ mb: 4 }}>
        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 200 } }} variant="outlined">
          <InputLabel id="tipo-label">Tipo</InputLabel>
          <Select labelId="tipo-label" value={tipoFiltro} onChange={(e) => { setTipoFiltro(e.target.value); setPage(0); }} label="Tipo">
            {tiposOpciones.map((op) => <MenuItem key={op.value} value={op.value}>{op.label}</MenuItem>)}
            <MenuItem value="">Todas</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 200 } }}>
          <InputLabel id="estado-label">Estado</InputLabel>
          <Select labelId="estado-label" value={estadoFiltro} onChange={(e) => { setEstadoFiltro(e.target.value); setPage(0); }} label="Estado">
            {estadosOpciones.map((op) => <MenuItem key={op.value} value={op.value}>{op.label}</MenuItem>)}
            <MenuItem value="Todas">Todas</MenuItem>
          </Select>
        </FormControl>
      </Box>

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
        {/* Mensaje de ayuda si el filtro visual vacía la tabla */}
        {!isLoading && data.length > 0 && data.length === 0 && (
          <Typography align="center" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
            No hay solicitudes en esta pestaña. Prueba cambiando a "{vistaActual === 'propia' ? 'Equipo Médico' : 'Mi Bandeja'}" o revisa otra página.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default SolicitudesPage;