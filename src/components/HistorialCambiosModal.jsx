import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';

const HistorialCambiosModal = ({ open, onClose, historial }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Historial de Cambios de la Tarjeta de Acción</DialogTitle>
      <DialogContent>
        {historial && historial.length > 0 ? (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Usuario (CUIL)</TableCell>
                  <TableCell>Fecha y Hora</TableCell>
                  <TableCell>Descripción del Cambio</TableCell>
                  <TableCell>Estado Final</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historial.map((cambio, index) => (
                  <TableRow key={index}>
                    <TableCell>{`${cambio.usuario} (${cambio.cuil})`}</TableCell>
                    <TableCell>{cambio.fechaHora}</TableCell>
                    <TableCell>{cambio.descripcion}</TableCell>
                    <TableCell>{cambio.estado}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography sx={{ mt: 2 }}>No hay historial de cambios para mostrar.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default HistorialCambiosModal;
