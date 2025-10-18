import React from "react";
import { Paper, Stack, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export default function TurnosFilters({
  medicoId, especialidad,
  medicos, especialidades,
  onChangeMedico, onChangeEspecialidad
}) {
  return (
    <Paper elevation={2} sx={{ p:2, borderRadius:3, mb:2 }}>
      <Stack direction={{ xs:"column", md:"row" }} spacing={2} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Médico</InputLabel>
          <Select value={medicoId} label="Médico" onChange={(e)=>onChangeMedico(e.target.value)}>
            <MenuItem value="">Todos</MenuItem>
            {medicos.map(m => <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Especialidad</InputLabel>
          <Select value={especialidad} label="Especialidad" onChange={(e)=>onChangeEspecialidad(e.target.value)}>
            <MenuItem value="">Todas</MenuItem>
            {especialidades.map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)}
          </Select>
        </FormControl>
      </Stack>
    </Paper>
  );
}
