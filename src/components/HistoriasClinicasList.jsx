import React, { useMemo, useState } from "react";
import {
  Box, Typography, TextField, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Chip
} from "@mui/material";

/**
 * HistoriasClinicasList (MUI tabla con paginación)
 * Props:
 *  - titulo?: string
 *  - descripcion?: string
 *  - items?: Array<{ id: string|number, nombres: string, apellidos: string, rol?: string, nro_afiliado?: string }>
 *  - onSelect?: (item) => void
 */
export default function HistoriasClinicasList({
  titulo = "Historias Clínicas",
  descripcion = "Listado de titulares y familiares",
  items,
  onSelect,
}) {
  // Datos demo con nombres y apellidos compuestos
  const demoItems = [
    { id: "1000001",  nombres: "Sol Andrea",        apellidos: "Noguera",             rol: "Titular",  nro_afiliado: "1000001" },
    { id: "1000002",  nombres: "Magalí Fernanda",   apellidos: "Orellana López",      rol: "Familiar", nro_afiliado: "1000002" },
    { id: "1000003",  nombres: "Iván Alejandro",    apellidos: "Rojas",               rol: "Titular",  nro_afiliado: "1000003" },
    { id: "1000004",  nombres: "Hernan Gabriel",    apellidos: "Viltez",              rol: "Titular",  nro_afiliado: "1000004" },
    { id: "1000005",  nombres: "Matias Eduardo",    apellidos: "Carabajal",           rol: "Titular",  nro_afiliado: "1000005" },
    { id: "1000006",  nombres: "Laura Beatriz",     apellidos: "Pérez Gómez",         rol: "Familiar", nro_afiliado: "1000006" },
    { id: "1000007",  nombres: "Juan Manuel",       apellidos: "Gómez",               rol: "Titular",  nro_afiliado: "1000007" },
    { id: "1000008",  nombres: "Ana Sofía",         apellidos: "Torres Ramírez",      rol: "Familiar", nro_afiliado: "1000008" },
    { id: "1000009",  nombres: "Carlos Alberto",    apellidos: "Méndez",              rol: "Titular",  nro_afiliado: "1000009" },
    { id: "1000010",  nombres: "María José",        apellidos: "López Fernández",     rol: "Familiar", nro_afiliado: "1000010" },
    { id: "1000011",  nombres: "Diego Sebastián",   apellidos: "Sánchez",             rol: "Titular",  nro_afiliado: "1000011" },
    { id: "1000012",  nombres: "Valeria Inés",      apellidos: "Ruiz",                rol: "Familiar", nro_afiliado: "1000012" },
    { id: "1000013",  nombres: "Jorge Enrique",     apellidos: "Fernández",           rol: "Titular",  nro_afiliado: "1000013" },
    { id: "1000014",  nombres: "Cecilia Mariela",   apellidos: "Martínez Díaz",       rol: "Familiar", nro_afiliado: "1000014" },
    { id: "1000015",  nombres: "Andrés Felipe",     apellidos: "Ramírez",             rol: "Titular",  nro_afiliado: "1000015" },
    { id: "1000016",  nombres: "Lucía Carolina",    apellidos: "Castro",              rol: "Familiar", nro_afiliado: "1000016" },
    { id: "1000017",  nombres: "Sebastián Nicolás", apellidos: "Rojas Morales",       rol: "Titular",  nro_afiliado: "1000017" },
    { id: "1000018",  nombres: "Patricia Elena",    apellidos: "Díaz",                rol: "Familiar", nro_afiliado: "1000018" },
    { id: "1000019",  nombres: "Fernando Javier",   apellidos: "Morales Suárez",      rol: "Titular",  nro_afiliado: "1000019" },
    { id: "1000020",  nombres: "Marcela Soledad",   apellidos: "Ortiz",               rol: "Familiar", nro_afiliado: "1000020" },
    { id: "1000021",  nombres: "Ricardo Andrés",    apellidos: "Herrera Ponce",       rol: "Titular",  nro_afiliado: "1000021" },
    { id: "1000022",  nombres: "Verónica Paula",    apellidos: "Ramos",               rol: "Familiar", nro_afiliado: "1000022" },
    { id: "1000023",  nombres: "Gabriel Esteban",   apellidos: "Vega López",          rol: "Titular",  nro_afiliado: "1000023" },
    { id: "1000024",  nombres: "Silvia Angélica",   apellidos: "Acosta",              rol: "Familiar", nro_afiliado: "1000024" },
    { id: "1000025",  nombres: "Martín Alejandro",  apellidos: "Cabrera",             rol: "Titular",  nro_afiliado: "1000025" },
    { id: "1000026",  nombres: "Daniela Florencia", apellidos: "Bravo González",      rol: "Familiar", nro_afiliado: "1000026" },
    { id: "1000027",  nombres: "Alfredo Damián",    apellidos: "Medina",              rol: "Titular",  nro_afiliado: "1000027" },
    { id: "1000028",  nombres: "Juliana Teresa",    apellidos: "Paredes Silva",       rol: "Familiar", nro_afiliado: "1000028" },
    { id: "1000029",  nombres: "Esteban Rodrigo",   apellidos: "Navarro",             rol: "Titular",  nro_afiliado: "1000029" },
    { id: "1000030",  nombres: "Mónica Alejandra",  apellidos: "Salazar Torres",      rol: "Familiar", nro_afiliado: "1000030" },
    { id: "1000031",  nombres: "Adriana Beatriz",   apellidos: "Vargas",              rol: "Titular",  nro_afiliado: "1000031" },
    { id: "1000032",  nombres: "Hugo Martín",       apellidos: "Domínguez Pérez",     rol: "Familiar", nro_afiliado: "1000032" },
    { id: "1000033",  nombres: "Raúl Eduardo",      apellidos: "García",              rol: "Titular",  nro_afiliado: "1000033" },
    { id: "1000034",  nombres: "Claudia Verónica",  apellidos: "Benítez Ramírez",     rol: "Familiar", nro_afiliado: "1000034" },
    { id: "1000035",  nombres: "Marcos Daniel",     apellidos: "Silva",               rol: "Titular",  nro_afiliado: "1000035" },
    { id: "1000036",  nombres: "Florencia Isabel",  apellidos: "Córdoba",             rol: "Familiar", nro_afiliado: "1000036" },
    { id: "1000037",  nombres: "Pablo Nicolás",     apellidos: "Álvarez",             rol: "Titular",  nro_afiliado: "1000037" },
    { id: "1000038",  nombres: "Tamara Julieta",    apellidos: "Ríos Gutiérrez",      rol: "Familiar", nro_afiliado: "1000038" },
    { id: "1000039",  nombres: "Federico Andrés",   apellidos: "Molina",              rol: "Titular",  nro_afiliado: "1000039" },
    { id: "1000040",  nombres: "Rocío Belén",       apellidos: "Serrano Díaz",        rol: "Familiar", nro_afiliado: "1000040" },
    { id: "1000041",  nombres: "Mauricio Gabriel",  apellidos: "Giménez",             rol: "Titular",  nro_afiliado: "1000041" },
    { id: "1000042",  nombres: "Natalia Soledad",   apellidos: "Luna Fernández",      rol: "Familiar", nro_afiliado: "1000042" },
    { id: "1000043",  nombres: "Oscar Javier",      apellidos: "Ponce",               rol: "Titular",  nro_afiliado: "1000043" },
    { id: "1000044",  nombres: "Marta Alejandra",   apellidos: "Acuña Ramírez",       rol: "Familiar", nro_afiliado: "1000044" },
    { id: "1000045",  nombres: "Tomás Emiliano",    apellidos: "Romero",              rol: "Titular",  nro_afiliado: "1000045" },
    { id: "1000046",  nombres: "Camila Eugenia",    apellidos: "Ortiz Cabrera",       rol: "Familiar", nro_afiliado: "1000046" },
    { id: "1000047",  nombres: "Gonzalo Adrián",    apellidos: "Peralta",             rol: "Titular",  nro_afiliado: "1000047" },
    { id: "1000048",  nombres: "Julieta Vanesa",    apellidos: "Márquez",             rol: "Familiar", nro_afiliado: "1000048" },
    { id: "1000049",  nombres: "Sergio Esteban",    apellidos: "Aguilar Ruiz",        rol: "Titular",  nro_afiliado: "1000049" },
    { id: "1000050",  nombres: "Paula Antonella",   apellidos: "Campos",              rol: "Familiar", nro_afiliado: "1000050" },
    { id: "1000051",  nombres: "Rodrigo Javier",    apellidos: "Espinoza Torres",     rol: "Titular",  nro_afiliado: "1000051" },
    { id: "1000052",  nombres: "Mariana Daniela",   apellidos: "Quiroga",             rol: "Familiar", nro_afiliado: "1000052" },
    { id: "1000053",  nombres: "Alejandro Luis",    apellidos: "Godoy Ramírez",       rol: "Titular",  nro_afiliado: "1000053" },
    { id: "1000054",  nombres: "Lorena Gabriela",   apellidos: "Mendoza",             rol: "Familiar", nro_afiliado: "1000054" },
    { id: "1000055",  nombres: "Matías Hernán",     apellidos: "Peña López",          rol: "Titular",  nro_afiliado: "1000055" },
    { id: "1000056",  nombres: "Carolina Beatriz",  apellidos: "Reyes",               rol: "Familiar", nro_afiliado: "1000056" },
    { id: "1000057",  nombres: "Facundo Ariel",     apellidos: "Cruz Fernández",      rol: "Titular",  nro_afiliado: "1000057" },
    { id: "1000058",  nombres: "Agustina Celeste",  apellidos: "Vega",                rol: "Familiar", nro_afiliado: "1000058" },
    { id: "1000059",  nombres: "Maximiliano José",  apellidos: "Paredes Martínez",    rol: "Titular",  nro_afiliado: "1000059" },
    { id: "1000060",  nombres: "Eliana Verónica",   apellidos: "Campos Suárez",       rol: "Familiar", nro_afiliado: "1000060" },
  ];

  const keyFor = (x) => x.id ?? x.nro_afiliado ?? x.nombres;

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const normalizar = (str) =>
    String(str).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filtered = useMemo(() => {
    const query = normalizar(q.trim());
    if (!query) return base;
    return base.filter((x) =>
      [x.nombres, x.apellidos, x.rol, x.nro_afiliado]
        .filter(Boolean)
        .some((v) => normalizar(v).includes(query))
    );
  }, [q, base]);

  // Página actual
  const pageRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  // Reset de página al cambiar filtro o tamaño
  React.useEffect(() => { setPage(0); }, [q, rowsPerPage]);

  return (
    <Box sx={{ maxWidth: 1500, mx: "auto", px: { xs: 2, md: 4 }, py: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h3" color="primary">
          {titulo}
        </Typography>
        {descripcion ? (
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            {descripcion}
          </Typography>
        ) : null}
      </Box>

      <Box sx={{ mb: 2, maxWidth: 560 }}>
        <TextField
          fullWidth
          size="small"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por Nro Afiliado, Nombres, Apellidos o Tipo"
          InputProps={{ inputProps: { "aria-label": "buscar afiliado" } }}
        />
      </Box>

      <Paper variant="outlined">
        <TableContainer>
          <Table sx={{ "& td": { fontSize: "1.5rem" }, "& th": { fontSize: "1.5rem" } }}>
            <TableHead>
              <TableRow>
                <TableCell><b>Nombres</b></TableCell>
                <TableCell><b>Apellidos</b></TableCell>
                <TableCell><b>Nro Afiliado</b></TableCell>
                <TableCell><b>Tipo</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ color: "text.secondary" }}>
                    Sin resultados{q ? ` para “${q}”` : ""}.
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((item) => (
                  <TableRow
                    key={keyFor(item)}
                    hover
                    onClick={() => onSelect?.(item)}
                    sx={{ cursor: onSelect ? "pointer" : "default" }}
                  >
                    <TableCell>{item.nombres}</TableCell>
                    <TableCell>{item.apellidos}</TableCell>
                    <TableCell>{item.nro_afiliado}</TableCell>
                    <TableCell>
                      {item.rol ? (
                        <Chip
                          label={item.rol}
                          color={item.rol === "Titular" ? "primary" : "default"}
                          size="small"
                        />
                      ) : "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Filas por página"
        />
      </Paper>
    </Box>
  );
}
