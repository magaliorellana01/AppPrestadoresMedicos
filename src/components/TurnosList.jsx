import React from "react";
import {
  Paper, Typography, Divider, List, ListItem, ListItemText,
  Button, Chip, Stack
} from "@mui/material";
import { MEDICOS, CENTROS } from "../data/turnos_demo";

const sedeNombre = (id) => CENTROS.find((s) => s.id === id)?.nombre ?? "—";

// Fallbacks para nombre de médico: populate → campo plano → catálogo demo
const nombreMedico = (t) =>
  t.medicoNombre
  || (t.prestador_medico && `${t.prestador_medico.nombres ?? ""} ${t.prestador_medico.apellidos ?? ""}`.trim())
  || (t.medico && `${t.medico.nombres ?? ""} ${t.medico.apellidos ?? ""}`.trim())
  || MEDICOS.find((m) => m.id === t.medicoId)?.nombre
  || "—";

export default function TurnosList({ fecha, turnos, onAgregarNota, onVerNotas }) {
  // Comparar fechas usando hora local, no UTC
  const getLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const esHoy = getLocalDateString(fecha) === getLocalDateString(new Date());
  const fechaFormateada = fecha.toLocaleDateString("es-AR", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
        <Typography variant="h5" color="primary" sx={{ textTransform: 'capitalize' }}>
          {esHoy ? 'Turnos de Hoy' : 'Turnos'}
        </Typography>
        {esHoy && (
          <Chip label="HOY" color="primary" size="small" />
        )}
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, textTransform: 'capitalize' }}>
        {fechaFormateada}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Total: {turnos.length} turno{turnos.length !== 1 ? 's' : ''}
      </Typography>
      <Divider sx={{ my: 1 }} />

      <List dense>
        {turnos.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            Sin turnos.
          </Typography>
        )}

        {turnos.map((t) => {
          const med = nombreMedico(t);
          const sede = sedeNombre(t.centroId || t.sedeId);

          // Construir información del paciente
          const nroAfiliado = t.socioId || "";
          const nombreCompleto = t.paciente && t.pacienteApellido
            ? `${t.paciente} ${t.pacienteApellido}`
            : t.paciente || t.afiliado || "";

          return (
            <ListItem
              key={t.id}
              alignItems="flex-start"
              secondaryAction={
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => onVerNotas(t)}
                    disabled={!t.notas || t.notas.length === 0}
                  >
                    Ver Notas
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => onAgregarNota(t)}
                  >
                    Agregar Nota
                  </Button>
                </Stack>
              }
            >
              <ListItemText
                primary={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body1" fontWeight="bold">{t.hora}</Typography>
                    {nroAfiliado && (
                      <Typography variant="body2" color="text.secondary">
                        N° {nroAfiliado}
                      </Typography>
                    )}
                    {nombreCompleto && (
                      <Typography variant="body2">{nombreCompleto}</Typography>
                    )}
                  </Stack>
                }
                secondary={
                  <Stack direction="row" flexWrap="wrap" gap={0.5} alignItems="center">
                    {t.especialidad ? <Chip size="small" label={t.especialidad} /> : null}
                    <Chip size="small" label={med} />
                    <Chip size="small" label={sede} />
                    {t.notas?.length > 0 && (
                      <Typography variant="caption" sx={{ ml: 0.5 }}>
                        Notas: {t.notas.length}
                      </Typography>
                    )}
                  </Stack>
                }
              />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
}
