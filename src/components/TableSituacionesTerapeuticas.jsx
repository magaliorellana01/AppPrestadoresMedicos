import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

export default function TableSituacionesTerapeuticas({ situacionesTerapeuticas }) {

    console.log(situacionesTerapeuticas);
    if (!situacionesTerapeuticas) {
        return null;
    }

    if (situacionesTerapeuticas.length === 0) {
        return <Typography>No se encontraron situaciones terapéuticas</Typography>
    }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Dni</TableCell>
            <TableCell>Apellidos</TableCell>
            <TableCell>Diagnóstico</TableCell>
            <TableCell>Teléfono</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {situacionesTerapeuticas.map((situacionTerapeutica) => (
            <TableRow key={situacionTerapeutica._id}>
                <TableCell>{situacionTerapeutica.socio.dni}</TableCell>
                <TableCell>{situacionTerapeutica.socio.apellidos}</TableCell>
                <TableCell>{situacionTerapeutica.tratamiento}</TableCell>
                <TableCell>{situacionTerapeutica.socio.telefono}</TableCell>
            </TableRow>
        ))}
    </TableBody>
    </Table>
    </TableContainer>
  );
}