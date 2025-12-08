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

// Helper para obtener fecha local en formato YYYY-MM-DD
const getLocalDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function CalendarMonth({
  currentDate, onPrev, onNext, turnosByDate, onSelectDate, selectedDate
}) {
  const y = currentDate.getFullYear();
  const m = currentDate.getMonth();
  const cells = useMemo(() => buildMonth(y, m), [y, m]);
  const monthLabel = currentDate.toLocaleDateString("es-AR", { month: "long", year: "numeric" });

  // Fecha seleccionada para destacarla (usar hora local)
  const selectedKey = selectedDate ? getLocalDateString(selectedDate) : null;
  const todayKey = getLocalDateString(new Date());

  // misma grilla para header y cuerpo
  const gridSx = {
    display: "grid",
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
    gap: 0.5,
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
        {["L","M","X","J","V","S","D"].map(d => (
          <Box key={d}>
            <Typography variant="caption" sx={{ fontWeight: 600, textAlign: "center", color: "text.secondary" }}>
              {d}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Cuerpo del mes - calendario compacto */}
      <Box sx={gridSx}>
        {cells.map((d, i) => {
          const key = getLocalDateString(d);
          const items = turnosByDate[key] ?? [];
          const isOtherMonth = d.getMonth() !== m;
          const isSelected = key === selectedKey;
          const isToday = key === todayKey;
          const hasTurnos = items.length > 0;

          return (
            <Box
              key={i}
              onClick={() => onSelectDate?.(d)}
              sx={{
                p: 0.5,
                height: 40,
                cursor: "pointer",
                borderRadius: 1,
                opacity: isOtherMonth ? 0.4 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: isSelected ? "primary.main" : isToday ? "primary.light" : "transparent",
                color: isSelected ? "white" : isToday ? "primary.dark" : "text.primary",
                border: hasTurnos && !isSelected ? "2px solid" : "none",
                borderColor: "primary.main",
                "&:hover": {
                  bgcolor: isSelected ? "primary.dark" : "action.hover",
                },
                transition: "all 0.2s",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: isSelected || isToday ? 700 : 400,
                  fontSize: 14
                }}
              >
                {d.getDate()}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Leyenda compacta */}
      <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
        <Typography variant="caption" color="text.secondary">
          <Box component="span" sx={{ display: "inline-block", width: 12, height: 12, bgcolor: "primary.light", borderRadius: 0.5, mr: 0.5 }} />
          Hoy
        </Typography>
        <Typography variant="caption" color="text.secondary">
          <Box component="span" sx={{ display: "inline-block", width: 12, height: 12, border: "2px solid", borderColor: "primary.main", borderRadius: 0.5, mr: 0.5 }} />
          Con turnos
        </Typography>
      </Box>
    </Paper>
  );
}
