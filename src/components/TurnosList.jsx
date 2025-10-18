import React from "react";
import { Paper, Typography, Divider, List, ListItem, ListItemText, Button, Chip } from "@mui/material";
import { MEDICOS } from "../data/turnos_demo";

export default function TurnosList({ fecha, turnos, onAgregarNota }) {
  return (
    <Paper elevation={2} sx={{ p:2, borderRadius:3 }}>
      <Typography variant="h6">Turnos · {fecha.toLocaleDateString("es-AR")}</Typography>
      <Divider sx={{ my:1 }} />
      <List dense>
        {turnos.length === 0 && (
          <Typography variant="body2" color="text.secondary">Sin turnos.</Typography>
        )}
        {turnos.map(t => {
          const med = MEDICOS.find(m => m.id === t.medicoId)?.nombre ?? "—";
          return (
            <ListItem
              key={t.id}
              secondaryAction={
                <Button size="small" variant="outlined" onClick={()=>onAgregarNota(t)}>
                  Nota
                </Button>
              }
              alignItems="flex-start"
            >
              <ListItemText
                primary={`${t.hora} · ${t.afiliado}`}
                secondary={
                  <>
                    <Chip size="small" label={t.especialidad} sx={{ mr:1 }} />
                    <Chip size="small" label={med} />
                    {t.notas?.length ? (
                      <Typography variant="caption" display="block" sx={{ mt:0.5 }}>
                        Notas: {t.notas.length}
                      </Typography>
                    ) : null}
                  </>
                }
              />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
}
