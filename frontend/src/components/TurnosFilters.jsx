import React from "react";
import { Stack, TextField, MenuItem } from "@mui/material";

/**
 * TurnosFilters
 * Props:
 *  - role: 'MEDICO' | 'ADMIN' | 'CENTRO'
 *  - values: { medicoId?: string, especialista?: string, sedeId?: string }
 *  - onChange: (patch: Partial<typeof values>) => void
 *  - medicos: Array<{ id, nombre }>
 *  - especialidades: Array<{ id, nombre } | string>
 *  - sedes: Array<{ id, nombre }>
 */
export default function TurnosFilters({ role, values, onChange, medicos = [], especialidades = [], sedes = [] }) {
  const showOnlySede = role === "MEDICO";

  const normEsp = (e) => (typeof e === "string" ? { id: e, nombre: e } : e);

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
      {!showOnlySede && (
        <>
          <TextField
            select label="Médico" size="small" value={values.medicoId ?? ""}
            onChange={(e) => onChange({ medicoId: e.target.value || "" })}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">Todos</MenuItem>
            {medicos.map(m => <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>)}
          </TextField>

          <TextField
            select label="Especialidad" size="small" value={values.especialidad ?? ""}
            onChange={(e) => onChange({ especialidad: e.target.value || "" })}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">Todas</MenuItem>
            {especialidades.map(e1 => {
              const it = normEsp(e1);
              return <MenuItem key={it.id} value={it.id}>{it.nombre}</MenuItem>;
            })}
          </TextField>
        </>
      )}

      <TextField
        select label="Sede" size="small" value={values.sedeId ?? ""}
        onChange={(e) => onChange({ sedeId: e.target.value || "" })}
        sx={{ minWidth: 180 }}
      >
        <MenuItem value="">Todas</MenuItem>
        {sedes.map(s => <MenuItem key={s.id} value={s.id}>{s.nombre}</MenuItem>)}
      </TextField>
    </Stack>
  );
}
