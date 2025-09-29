import React, { useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HistoriasClinicasSearch from "../components/SearchHistoriasClinicas";
import HistoriasClinicasTable from "../components/TableHistoriasClinicas";
import demoItems from "../data/historias_demo";

const normalizar = (str) =>
  String(str).normalize("NFD") // separa los caracteres compuestos en 2. "á" -> ("a","´") 
             .replace(/[\u0300-\u036f]/g, "") // limpia los caracteres especiales -> "'" con ese rango 
             .toLowerCase();

export default function HistoriasClinicasPage({ items, titulo = "Historias Clínicas", descripcion = "Listado de titulares y familiares" }) {
  const nav = useNavigate();

  // base de datos
  const base = useMemo(() => (items?.length ? items : demoItems), [items]);

  // estado búsqueda y paginación
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // filtrar
  const filtered = useMemo(() => {
    const query = normalizar(q.trim());
    if (!query) return base;
    return base.filter((x) =>
      [x.nombres, x.apellidos, x.rol, x.nro_afiliado]
        .filter(Boolean)
        .some((v) => normalizar(v).includes(query))
    );
  }, [q, base]);

  // slice de página
  const pageRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  // reset página al cambiar filtro o tamaño
  React.useEffect(() => { setPage(0); }, [q, rowsPerPage]);

  return (
    <Box sx={{ maxWidth: 1500, mx: "auto", px: { xs: 2, md: 4 }, py: 1 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h3" color="primary">{titulo}</Typography>
        {descripcion && (
          <Typography variant="h5" sx={{ color: "text.secondary", mt: 0.5 }}>
            {descripcion}
          </Typography>
        )}
      </Box>

      <HistoriasClinicasSearch q={q} onChange={setQ} />

      <HistoriasClinicasTable
        rows={pageRows}
        count={filtered.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        onSelect={(p) => nav(`/historias/${p.id}`)}
      />
    </Box>
  );
}
