import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, Stack, Paper
} from "@mui/material";
import dayjs from "dayjs";

export default function VerNotasDialog({ open, onClose, notas = [] }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Notas del turno</DialogTitle>
      <DialogContent>
        {notas.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', py: 2 }}>
            No hay notas registradas para este turno
          </Typography>
        ) : (
          <Box sx={{ maxHeight: 400, overflowY: 'auto', pr: 1 }}>
            <Stack spacing={1.5}>
              {notas.map((nota, idx) => (
                <Paper
                  key={idx}
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: 'grey.100',
                    borderLeft: '3px solid',
                    borderColor: 'primary.main'
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Box>
                      <Typography variant="caption" fontWeight="bold" color="primary">
                        {nota.autorNombre || 'Prestador'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" ml={1}>
                        {nota.autorEspecialidades}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {dayjs(nota.ts).format('DD/MM/YYYY HH:mm')}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {nota.texto}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
