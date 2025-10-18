import React, { useMemo } from "react";
import { Box, Grid, Typography, Chip, Stack, Paper, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function buildMonth(year, month) {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - ((first.getDay() + 6) % 7)); // lunes
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push(d);
  }
  return cells;
}

export default function CalendarMonth({ currentDate, onPrev, onNext, turnosByDate, onSelectDate }) {
  const y = currentDate.getFullYear();
  const m = currentDate.getMonth();
  const cells = useMemo(() => buildMonth(y, m), [y, m]);
  const monthLabel = currentDate.toLocaleDateString("es-AR", { month:"long", year:"numeric" });

  return (
    <Paper elevation={2} sx={{ p:2, borderRadius:3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <IconButton onClick={onPrev} size="small"><ArrowBackIosNewIcon fontSize="inherit" /></IconButton>
        <Typography variant="h6" sx={{ textTransform:"capitalize" }}>{monthLabel}</Typography>
        <IconButton onClick={onNext} size="small"><ArrowForwardIosIcon fontSize="inherit" /></IconButton>
      </Box>

      <Grid container columns={7}>
        {["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].map((d) => (
          <Grid key={d} item xs={1}>
            <Typography variant="caption" sx={{ fontWeight:600, px:1 }}>{d}</Typography>
          </Grid>
        ))}
      </Grid>

      <Grid container columns={7} spacing={1}>
        {cells.map((d, i) => {
          const key = d.toISOString().slice(0,10);
          const items = turnosByDate[key] ?? [];
          const isOtherMonth = d.getMonth() !== m;
          return (
            <Grid key={i} item xs={1}>
              <Paper
                onClick={() => onSelectDate?.(d)}
                variant="outlined"
                sx={{ p:1, minHeight:96, cursor:"pointer", borderRadius:2, opacity: isOtherMonth ? 0.5 : 1 }}
              >
                <Typography variant="caption" sx={{ fontWeight:600 }}>{d.getDate()}</Typography>
                <Stack spacing={0.5} mt={0.5}>
                  {items.slice(0,3).map(t => (
                    <Chip key={t.id} size="small" label={`${t.hora} · ${t.especialidad}`} />
                  ))}
                  {items.length > 3 && <Typography variant="caption">+{items.length - 3} más</Typography>}
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
}
