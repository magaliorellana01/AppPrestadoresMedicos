import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HistoriasClinicasSearch from "../components/SearchHistoriasClinicas";
import HistoriasClinicasTable from "../components/TableHistoriasClinicas";
import { getAllHistoriasClinicas } from "../services";

const normalizar = (str) =>
  String(str)
    .normalize("NFD") // separa los caracteres compuestos en 2. "á" -> ("a","´")
    .replace(/[\u0300-\u036f]/g, "") // limpia los caracteres especiales -> "'" con ese rango
    .toLowerCase();

export default function HistoriasClinicasPage() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [historiasClinicas, setHistoriasClinicas] = useState([]);

  // filtrar
  const filtered = useMemo(() => {
    const query = normalizar(q.trim());
    if (!query) return historiasClinicas;
    return historiasClinicas.filter((x) =>
      [x.socio.nombres, x.socio.apellidos, x.socio.rol, x.socio.nro_afiliado]
        .filter(Boolean)
        .some((v) => normalizar(v).includes(query))
    );
  }, [q, historiasClinicas]);

  const pageRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  // reset página al cambiar filtro o tamaño
  useEffect(() => {
    setPage(0);
  }, [q, rowsPerPage]);

  useEffect(() => {
    const fetchHistoriasClinicas = async () => {
      const historiasClinicas = await getAllHistoriasClinicas();
      setHistoriasClinicas(historiasClinicas.historiasClinicas);
    };
    fetchHistoriasClinicas();
  }, []);

  return (
    <Box sx={{ maxWidth: 1500, mx: "auto", px: { xs: 2, md: 4 }, py: 1 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h3" color="primary">
          Historias Clínicas
        </Typography>
        <Typography variant="h5" sx={{ color: "text.secondary", mt: 0.5 }}>
          Listado de titulares y familiares
        </Typography>
      </Box>

      <HistoriasClinicasSearch q={q} onChange={setQ} />

      <HistoriasClinicasTable
        rows={pageRows}
        count={filtered.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        onSelect={(p) => nav(`/historias/${p._id}`)}
      />
    </Box>
  );
}
