import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  Button
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimerIcon from '@mui/icons-material/Timer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

import MetricCard from '../components/MetricCard';
import FiltroFechas from '../components/FiltroFechas';
import { getDashboardStats } from '../services';

const DashboardSolicitudesPage = () => {
  const navigate = useNavigate();
  const [rangoSeleccionado, setRangoSeleccionado] = useState(30);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Calcular fechas
      const fechaHasta = new Date();
      const fechaDesde = new Date();
      fechaDesde.setDate(fechaDesde.getDate() - rangoSeleccionado);

      // Convertir a ISO string
      const fechaDesdeISO = fechaDesde.toISOString();
      const fechaHastaISO = fechaHasta.toISOString();

      // Llamar al servicio
      const data = await getDashboardStats(fechaDesdeISO, fechaHastaISO);
      setStats(data);
    } catch (err) {
      console.error('Error cargando stats:', err);
      setError(err.message || 'Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarStats();
  }, []);

  const handleAplicar = () => {
    cargarStats();
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!stats) {
    return null;
  }

  const { resumen, evolucionDiaria, porTipo } = stats;

  // Formatear datos para el gráfico de evolución
  const datosEvolucion = evolucionDiaria.map(item => ({
    fecha: new Date(item.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }),
    Aprobadas: item.aprobadas,
    Rechazadas: item.rechazadas,
    Total: item.aprobadas + item.rechazadas
  }));

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 3, px: { xs: 2, sm: 3 } }}>
      {/* Título con botón de volver */}
      <Box mb={2} display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'flex-start' }} gap={{ xs: 2, sm: 0 }}>
        <Box>
          <Typography variant="h4" color="primary" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
            Dashboard de Solicitudes
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Visualización de métricas y estadísticas de solicitudes procesadas
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/solicitudes')}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            width: { xs: '100%', sm: 'auto' },
            fontSize: { xs: '14px', sm: '16px' },
            whiteSpace: 'nowrap'
          }}
        >
          Volver a Solicitudes
        </Button>
      </Box>

      {/* Filtros + Cards de métricas en la misma fila */}
      <Grid container spacing={2} mb={2} alignItems="stretch">
        {/* Filtro a la izquierda */}
        <Grid size={{ xs: 12, md: 2.5 }}>
          <FiltroFechas
            rangoSeleccionado={rangoSeleccionado}
            onRangoChange={setRangoSeleccionado}
            onAplicar={handleAplicar}
          />
        </Grid>

        {/* 4 Cards a la derecha */}
        <Grid size={{ xs: 12, sm: 6, md: 2.375 }}>
          <MetricCard
            title="Pendientes"
            value={resumen.pendientes}
            subtitle="Por resolver"
            color="#EAB308"
            icon={<PendingActionsIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.375 }}>
          <MetricCard
            title="Resueltas"
            value={resumen.resueltas}
            subtitle={`Últimos ${rangoSeleccionado} días`}
            color="#4BAE72"
            icon={<CheckCircleIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.375 }}>
          <MetricCard
            title="Tiempo Promedio"
            value={`${resumen.tiempoPromedioResolucion} días`}
            subtitle="Resolución"
            color="#2563EB"
            icon={<TimerIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.375 }}>
          <MetricCard
            title="Tasa de Aprobación"
            value={`${resumen.tasaAprobacion}%`}
            subtitle="Del total resuelto"
            color="#8B5CF6"
            icon={<TrendingUpIcon />}
          />
        </Grid>
      </Grid>

      {/* Layout en 2 columnas: Gráfico + Resumen */}
      <Grid container spacing={2}>
        {/* Gráfico de evolución */}
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
          <Paper sx={{ p: 2, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Evolución de Solicitudes Procesadas
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Cantidad de solicitudes resueltas por día
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={datosEvolucion}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="fecha"
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: 8,
                    padding: 12
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 20 }}
                  iconType="circle"
                />
                <Line
                  type="monotone"
                  dataKey="Aprobadas"
                  stroke="#4BAE72"
                  strokeWidth={2}
                  dot={{ fill: '#4BAE72', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="Rechazadas"
                  stroke="#DC2626"
                  strokeWidth={2}
                  dot={{ fill: '#DC2626', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Resumen por tipo */}
        <Grid size={{ xs: 12, md: 5, lg: 4 }}>
          <Paper sx={{ p: 2, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Resumen por Tipo
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Distribución de solicitudes procesadas
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {Object.entries(porTipo).map(([tipo, datos]) => (
                <Box
                  key={tipo}
                  sx={{
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    backgroundColor: '#fafafa'
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    {tipo}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2" color="text.secondary" fontSize="0.85rem">
                      Total:
                    </Typography>
                    <Typography variant="body2" fontWeight={600} fontSize="0.85rem">
                      {datos.total}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2" color="success.main" fontSize="0.85rem">
                      Aprobadas:
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color="success.main" fontSize="0.85rem">
                      {datos.aprobadas}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="error.main" fontSize="0.85rem">
                      Rechazadas:
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color="error.main" fontSize="0.85rem">
                      {datos.rechazadas}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardSolicitudesPage;
