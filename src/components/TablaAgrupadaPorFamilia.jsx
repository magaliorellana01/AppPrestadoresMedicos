import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React from 'react';

export default function TablaAgrupadaPorFamilia({ gruposFamiliares }) { 
    
    const nav = useNavigate();

    if (!gruposFamiliares || gruposFamiliares.length === 0) {
        return <Typography>No se encontraron situaciones terapéuticas</Typography>;
    }

    const handleRowClick = (id) => {
        nav(`/situaciones-terapeuticas/${id}`);
    };
    
    const headerTextColor = '#2D6A8C';

    return (
        <TableContainer component={Box}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ color: headerTextColor, fontWeight: 'bold' }}>DNI</TableCell>
                        <TableCell sx={{ color: headerTextColor, fontWeight: 'bold' }}>Socio</TableCell> 
                        <TableCell sx={{ color: headerTextColor, fontWeight: 'bold' }}>Tipo</TableCell>
                        <TableCell sx={{ color: headerTextColor, fontWeight: 'bold' }}>Diagnóstico</TableCell>
                        <TableCell sx={{ color: headerTextColor, fontWeight: 'bold' }}>Teléfono</TableCell>
                        <TableCell sx={{ color: headerTextColor, fontWeight: 'bold' }}>Prestador</TableCell>
                    </TableRow>
                </TableHead>
                
                <TableBody>
                    {gruposFamiliares.map((grupo, indexGrupo) => (
                        <React.Fragment key={grupo.titularId}>
                            {grupo.situaciones.map((situacionTerapeutica, indexSit) => (
                                <TableRow 
                                    key={situacionTerapeutica._id}
                                    onClick={() => handleRowClick(situacionTerapeutica._id)}
                                    sx={{ 
                                        cursor: "pointer",
                                        
                                        borderTop: indexSit === 0 
                                            ? `3px solid ${headerTextColor}` 
                                            : 'none',
                                            
                                        
                                        borderBottom: indexSit === grupo.situaciones.length - 1 && indexGrupo !== gruposFamiliares.length - 1
                                            ? 'none' 
                                            : 'none',
                                    }} 
                                >
                                    <TableCell>{situacionTerapeutica.socio.dni}</TableCell>
                                    
                                    <TableCell>
                        
                                            {situacionTerapeutica.socio.apellidos}
                                        , {situacionTerapeutica.socio.nombres}
                                    </TableCell>
                                    <TableCell>{situacionTerapeutica.socio.rol === 'Titular' ? 'Titular' : `Familiar de ${grupo.nombreTitular}`}</TableCell>
                                    <TableCell>{situacionTerapeutica.tratamiento}</TableCell>
                                    <TableCell>{situacionTerapeutica.socio.telefono}</TableCell>
                                    
                                    <TableCell>
                                        {situacionTerapeutica.prestador.es_centro_medico
                                            ? situacionTerapeutica.prestador.nombres
                                            : situacionTerapeutica.prestador.apellidos
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}