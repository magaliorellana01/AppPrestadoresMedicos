import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const FiltroFechas = ({ rangoSeleccionado, onRangoChange, onAplicar }) => {
  const opciones = [
    { value: 7, label: 'Últimos 7 días' },
    { value: 30, label: 'Últimos 30 días' },
    { value: 90, label: 'Últimos 90 días' },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        height: '100%',
        justifyContent: 'flex-end',
        mt: 3
      }}
    >
      <FormControl sx={{ minWidth: 180 }} size="small">
        <InputLabel id="rango-fechas-label">Rango de fechas</InputLabel>
        <Select
          labelId="rango-fechas-label"
          id="rango-fechas-select"
          value={rangoSeleccionado}
          label="Rango de fechas"
          onChange={(e) => onRangoChange(e.target.value)}
        >
          {opciones.map((opcion) => (
            <MenuItem key={opcion.value} value={opcion.value}>
              {opcion.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        startIcon={<RefreshIcon />}
        onClick={onAplicar}
        size="small"
        sx={{
          textTransform: 'none',
          fontWeight: 500,
          px: 2
        }}
      >
        Actualizar
      </Button>
    </Box>
  );
};

export default FiltroFechas;
