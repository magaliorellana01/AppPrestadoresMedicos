import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React from 'react';

export default function TablaHistoriasAgrupadaPorFamilia({ gruposFamiliares }) { 
    
    const nav = useNavigate();

    if (!gruposFamiliares || gruposFamiliares.length === 0) {
        return <Typography>No se encontraron historias clínicas</Typography>;
    }

    const handleRowClick = (id) => {
        nav(`/historia-clinica/${id}`);
    };
    
    const headerTextColor = '#2D6A8C';

    return (
        <TableContainer component={Box}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ color: headerTextColor, fontWeight: 'bold' }}>Nombres</TableCell>
                        <TableCell sx={{ color: headerTextColor, fontWeight: 'bold' }}>Apellidos</TableCell>
                        <TableCell sx={{ color: headerTextColor, fontWeight: 'bold' }}>DNI</TableCell>
                        <TableCell sx={{ color: headerTextColor, fontWeight: 'bold' }}>Tipo</TableCell>
                    </TableRow>
                </TableHead>
                
                <TableBody>
                    {gruposFamiliares.map((grupo, indexGrupo) => (
                        <React.Fragment key={grupo.titularId}>
                            {grupo.historias.map((historia, indexHist) => (
                                <TableRow 
                                    key={historia._id ?? `${historia.socio?.dni}-${historia.socio?.apellidos}-${historia.socio?.nombres}`}
                                    onClick={() => handleRowClick(historia._id ?? historia.socio?._id)}
                                    sx={{ 
                                        cursor: "pointer",
                                        
                                        borderTop: indexHist === 0 
                                            ? `3px solid ${headerTextColor}` 
                                            : 'none',
                                    }} 
                                >
                                    <TableCell>{historia.socio?.nombres ?? historia.nombre ?? "-"}</TableCell>
                                    <TableCell>{historia.socio?.apellidos ?? historia.apellido ?? "-"}</TableCell>
                                    <TableCell>{historia.socio?.dni ?? historia.dni ?? "-"}</TableCell>
                                    <TableCell>{historia.socio?.rol === 'Titular' ? 'Titular' : (grupo.nombreTitular ? `Familiar de ${grupo.nombreTitular}` : '—')}</TableCell>
                                </TableRow>
                            ))}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}


