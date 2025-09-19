import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Chip,
  Stack,
} from "@mui/material";

/**
 * HistoriasClinicasList (MUI)
 * Props:
 *  - titulo?: string
 *  - descripcion?: string
 *  - items?: Array<{ id?: string|number, nombre: string, rol?: string, nroAfiliado?: string }>
 *  - onSelect?: (item) => void
 */
export default function HistoriasClinicasList({
  titulo = "Historias Clínicas",
  descripcion = "Listado de titulares y familiares",
  items,
  onSelect,
}) {
  // Datos demo
  const demoItems = [
    { id: "1000001", nombre: "Sol Noguera", rol: "Titular", nroAfiliado: "1000001" },
    { id: "1000002", nombre: "Magalí Orellana", rol: "Familiar", nroAfiliado: "1000002" },
    { id: "1000003", nombre: "Iván Rojas", rol: "Titular", nroAfiliado: "1000003" },
    { id: "1000004", nombre: "Hernan Viltez", rol: "Titular", nroAfiliado: "1000004" },
    { id: "1000005", nombre: "Matias Carabajal", rol: "Titular", nroAfiliado: "1000005" },
    { id: "1000006", nombre: "Laura Pérez", rol: "Familiar", nroAfiliado: "1000006" },
    { id: "1000007", nombre: "Juan Gómez", rol: "Titular", nroAfiliado: "1000007" },
    { id: "1000008", nombre: "Ana Torres", rol: "Familiar", nroAfiliado: "1000008" },
    { id: "1000009", nombre: "Carlos Méndez", rol: "Titular", nroAfiliado: "1000009" },
    { id: "1000010", nombre: "María López", rol: "Familiar", nroAfiliado: "1000010" },
    { id: "1000011", nombre: "Diego Sánchez", rol: "Titular", nroAfiliado: "1000011" },
    { id: "1000012", nombre: "Valeria Ruiz", rol: "Familiar", nroAfiliado: "1000012" },
    { id: "1000013", nombre: "Jorge Fernández", rol: "Titular", nroAfiliado: "1000013" },
    { id: "1000014", nombre: "Cecilia Martínez", rol: "Familiar", nroAfiliado: "1000014" },
    { id: "1000015", nombre: "Andrés Ramírez", rol: "Titular", nroAfiliado: "1000015" },
    { id: "1000016", nombre: "Lucía Castro", rol: "Familiar", nroAfiliado: "1000016" },
    { id: "1000017", nombre: "Sebastián Rojas", rol: "Titular", nroAfiliado: "1000017" },
    { id: "1000018", nombre: "Patricia Díaz", rol: "Familiar", nroAfiliado: "1000018" },
    { id: "1000019", nombre: "Fernando Morales", rol: "Titular", nroAfiliado: "1000019" },
    { id: "1000020", nombre: "Marcela Ortiz", rol: "Familiar", nroAfiliado: "1000020" },
    { id: "1000021", nombre: "Ricardo Herrera", rol: "Titular", nroAfiliado: "1000021" },
    { id: "1000022", nombre: "Verónica Ramos", rol: "Familiar", nroAfiliado: "1000022" },
    { id: "1000023", nombre: "Gabriel Vega", rol: "Titular", nroAfiliado: "1000023" },
    { id: "1000024", nombre: "Silvia Acosta", rol: "Familiar", nroAfiliado: "1000024" },
    { id: "1000025", nombre: "Martín Cabrera", rol: "Titular", nroAfiliado: "1000025" },
    { id: "1000026", nombre: "Daniela Bravo", rol: "Familiar", nroAfiliado: "1000026" },
    { id: "1000027", nombre: "Alfredo Medina", rol: "Titular", nroAfiliado: "1000027" },
    { id: "1000028", nombre: "Juliana Paredes", rol: "Familiar", nroAfiliado: "1000028" },
    { id: "1000029", nombre: "Esteban Navarro", rol: "Titular", nroAfiliado: "1000029" },
    { id: "1000030", nombre: "Mónica Salazar", rol: "Familiar", nroAfiliado: "1000030" },
  ];

  const keyFor = (x) => x.id ?? x.nroAfiliado ?? x.nombre;

  const base = useMemo(() => {
    const src = items?.length ? items : demoItems;
    const seen = new Set();
    const out = [];
    for (const x of src) {
      const k = keyFor(x);
      if (!seen.has(k)) {
        seen.add(k);
        out.push(x);
      }
    }
    return out;
  }, [items]);

  const [q, setQ] = useState("");

  const normalizar = (str) =>
    String(str).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filtered = useMemo(() => {
    const query = normalizar(q.trim());
    if (!query) return base;
    return base.filter((x) =>
      [x.nombre, x.rol, x.nroAfiliado].filter(Boolean).some((v) => normalizar(v).includes(query))
    );
  }, [q, base]);

  return (
    <Box sx={{ width: "100%", px: { xs: 2, md: 6 }, py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ color: "primary", fontWeight: 600 }}>
          {titulo}
        </Typography>
        {descripcion ? (
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            {descripcion}
          </Typography>
        ) : null}
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3, maxWidth: 560 }}>
        <TextField
          fullWidth
          size="small"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por Nro Afiliado, Nombre, Apellido o Tipo"
          InputProps={{ inputProps: { "aria-label": "buscar afiliado" } }}
        />
      </Box>

      {/* List */}
      {filtered.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            textAlign: "center",
            color: "text.secondary",
            borderStyle: "dashed",
          }}
        >
          Sin resultados para “{q}”.
        </Paper>
      ) : (
        <List sx={{ p: 0 }}>
          {filtered.map((item) => (
            <Paper
              key={keyFor(item)}
              elevation={0}
              sx={{
                mb: 1.5,
                borderRadius: 2,
                bgcolor: "grey.200",
                "&:hover": { bgcolor: "grey.300" },
                transition: "background-color .15s",
              }}
            >
              <ListItemButton onClick={() => onSelect?.(item)} sx={{ borderRadius: 2 }}>
                <ListItemText
                  primary={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography sx={{ fontWeight: 600, color: "text.primary" }}>
                        {item.nombre}
                      </Typography>
                      {item.rol ? <Chip label={item.rol} size="small" /> : null}
                    </Stack>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Nro Afiliado: {item.nroAfiliado}
                    </Typography>
                  }
                />
              </ListItemButton>
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
}
