import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Chip,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const keyFor = (x) => x._id ?? x.socio.nro_afiliado ?? x.socio.nombres;

export default function HistoriasClinicasTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onSelect,
}) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
      <TableContainer>
        <Table
          stickyHeader
          sx={{
            tableLayout: "fixed",
            width: "100%",
            "& th": {
              fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
              fontWeight: 700,
              backgroundColor: "background.paper",
              boxShadow: "inset 0 -1px 0 0 rgba(0,0,0,0.08)",
            },
            "& td": {
              fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
              py: { xs: 1, sm: 1.25, md: 1.5 },
            },
          }}
        >
          <colgroup>
            <col style={{ width: isXs ? "55%" : "36%" }} />
            <col style={{ width: isXs ? "0%" : "34%" }} />
            <col style={{ width: isXs ? "25%" : "20%" }} />
            <col style={{ width: isXs ? "20%" : "10%" }} />
          </colgroup>

          <TableHead>
            <TableRow>
              <TableCell>Nombres</TableCell>
              <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>Apellidos</TableCell>
              <TableCell align="center">DNI</TableCell>
              <TableCell align="center">Tipo</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: "text.secondary" }}>
                  Sin resultados.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((item) => (
                <TableRow
                  key={keyFor(item)}
                  hover
                  onClick={() => onSelect?.(item)}
                  sx={{
                    cursor: onSelect ? "pointer" : "default",
                    transition: "background-color .15s ease",
                    "&:nth-of-type(odd)": { backgroundColor: "grey.50" },
                    "&:hover": { backgroundColor: "grey.100" },
                  }}
                >
                  <TableCell
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontWeight: 500,
                    }}
                  >
                    <Tooltip title={item.socio.nombres} disableInteractive>
                      <span>{item.socio.nombres}</span>
                    </Tooltip>
                  </TableCell>

                  <TableCell
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: { xs: "none", sm: "table-cell" },
                    }}
                  >
                    <Tooltip title={item.socio.apellidos ?? ""} disableInteractive>
                      <span>{item.socio.apellidos}</span>
                    </Tooltip>
                  </TableCell>

                  <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                    {item.socio.nro_afiliado}
                  </TableCell>

                  <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                    {item.socio.rol ? (
                      <Chip
                        label={item.socio.rol}
                        variant="filled"
                        size="small"
                        sx={{
                          minWidth: 66, // mismo ancho
                          justifyContent: "center",
                          fontWeight: 600,
                          bgcolor: item.socio.rol === "Titular" ? "primary.dark" : "primary.light",
                          color: "primary.contrastText",
                          "& .MuiChip-label": { px: 0, width: "100%", textAlign: "center" },
                        }}
                      />
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={count}
        page={page}
        onPageChange={(_, p) => onPageChange(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Filas por página"
      />
    </Paper>
  );
}
