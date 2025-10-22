import React, { useMemo } from "react";
import { Box, Typography, Chip, Stack, Paper, IconButton } from "@mui/material";
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

export default function CalendarMonth({
  currentDate, onPrev, onNext, turnosByDate, onSelectDate
}) {
  const y = currentDate.getFullYear();
  const m = currentDate.getMonth();
  const cells = useMemo(() => buildMonth(y, m), [y, m]);
  const monthLabel = currentDate.toLocaleDateString("es-AR", { month: "long", year: "numeric" });

  // misma grilla para header y cuerpo
  const gridSx = {
    display: "grid",
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
    gap: 1, // mismo gap para ambos
    alignItems: "stretch",
  };

  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <IconButton onClick={onPrev} size="small"><ArrowBackIosNewIcon fontSize="inherit" /></IconButton>
        <Typography variant="h6" sx={{ textTransform: "capitalize" }}>{monthLabel}</Typography>
        <IconButton onClick={onNext} size="small"><ArrowForwardIosIcon fontSize="inherit" /></IconButton>
      </Box>

      {/* Header de días con misma grilla y gap */}
      <Box sx={{ ...gridSx, mb: 1 }}>
        {["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].map(d => (
          <Box key={d}>
            <Typography variant="caption" sx={{ fontWeight: 600, textAlign: "center", color: "text.secondary" }}>
              {d}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Cuerpo del mes con misma grilla y gap */}
      <Box sx={gridSx}>
        {cells.map((d, i) => {
          const key = d.toISOString().slice(0, 10);
          const items = turnosByDate[key] ?? [];
          const isOtherMonth = d.getMonth() !== m;

          return (
            <Paper
              key={i}
              onClick={() => onSelectDate?.(d)}
              variant="outlined"
              sx={{
                p: 1,
                height: { xs: 120, sm: 132 }, // alto consistente
                cursor: "pointer",
                borderRadius: 2,
                opacity: isOtherMonth ? 0.5 : 1,
                display: "flex",
                flexDirection: "column",
                minWidth: 0, // evita overflow
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600 }}>{d.getDate()}</Typography>

              <Stack
                spacing={0.5}
                mt={0.5}
                sx={{
                  overflow: "hidden",
                  "& .MuiChip-root": { maxWidth: "100%", height: 22 },
                  "& .MuiChip-label": {
                    px: 0.5, fontSize: 11,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  },
                }}
              >
                {items.slice(0, 3).map(t => (
                  <Chip key={t.id} size="small" label={`${t.hora} · ${t.especialidad}`} />
                ))}
                {items.length > 3 && (
                  <Typography variant="caption" color="primary">+{items.length - 3} más</Typography>
                )}
              </Stack>
            </Paper>
          );
        })}
      </Box>
    </Paper>
  );
}
