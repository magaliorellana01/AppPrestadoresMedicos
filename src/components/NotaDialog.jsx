import React from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";

export default function NotaDialog({ open, texto, onChange, onClose, onSave }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Agregar nota al turno</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          multiline
          minRows={3}
          fullWidth
          placeholder="Evolución, indicaciones, estudios, etc."
          value={texto}
          onChange={(e)=>onChange(e.target.value)}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={onSave}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}
