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

export default function TurnosList({ fecha, turnos, onAgregarNota }) {
  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
      <Typography variant="h6">
        Turnos · {fecha.toLocaleDateString("es-AR")}
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
          const paciente = t.paciente || t.afiliado || ""; // compatibilidad

          return (
            <ListItem
              key={t.id}
              alignItems="flex-start"
              secondaryAction={
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onAgregarNota(t)}
                >
                  Agregar Nota
                </Button>
              }
            >
              <ListItemText
                primary={`${t.hora}${paciente ? ` · ${paciente}` : ""}`}
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
