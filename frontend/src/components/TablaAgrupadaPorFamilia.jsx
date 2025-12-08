import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, Card, CardContent, Stack, Chip, useMediaQuery, useTheme, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React from 'react';

export default function TablaAgrupadaPorFamilia({ gruposFamiliares }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const nav = useNavigate();

    if (!gruposFamiliares || gruposFamiliares.length === 0) {
        return <Typography>No se encontraron situaciones terapéuticas</Typography>;
    }

    const handleRowClick = (id) => {
        nav(`/situaciones-terapeuticas/${id}`);
    };

    const headerTextColor = '#2D6A8C';

    // Vista mobile con cards
    if (isMobile) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {gruposFamiliares.map((grupo, indexGrupo) => (
                    <Box key={grupo.titularId}>
                        {grupo.situaciones.map((situacion, indexSit) => (
                            <Card
                                key={situacion._id}
                                onClick={() => handleRowClick(situacion._id)}
                                sx={{
                                    cursor: 'pointer',
                                    mb: 1.5,
                                    borderTop: indexSit === 0 ? `3px solid ${headerTextColor}` : 'none',
                                    '&:hover': {
                                        boxShadow: 3,
                                        transform: 'translateY(-2px)',
                                        transition: 'all 0.2s'
                                    }
                                }}
                            >
                                <CardContent>
                                    <Stack spacing={1.5}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                                            <Typography variant="h6" color={headerTextColor} fontWeight="bold">
                                                {situacion.socio.apellidos}, {situacion.socio.nombres}
                                            </Typography>
                                            <Chip
                                                label={situacion.socio.rol === 'Titular' ? 'Titular' : 'Familiar'}
                                                size="small"
                                                color={situacion.socio.rol === 'Titular' ? 'primary' : 'default'}
                                            />
                                        </Stack>

                                        <Divider />

                                        <Stack spacing={0.5}>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>DNI:</strong> {situacion.socio.dni}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Teléfono:</strong> {situacion.socio.telefono}
                                            </Typography>
                                            {situacion.socio.rol !== 'Titular' && (
                                                <Typography variant="body2" color="text.secondary">
                                                    <strong>Familiar de:</strong> {grupo.nombreTitular}
                                                </Typography>
                                            )}
                                        </Stack>

                                        <Divider />

                                        <Typography variant="body2">
                                            <strong>Diagnóstico:</strong> {situacion.diagnostico}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Prestador:</strong>{' '}
                                            {situacion.prestador.es_centro_medico
                                                ? situacion.prestador.nombres
                                                : situacion.prestador.apellidos}
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        ))}
                        {indexGrupo < gruposFamiliares.length - 1 && (
                            <Divider sx={{ my: 2, borderBottomWidth: 2 }} />
                        )}
                    </Box>
                ))}
            </Box>
        );
    }

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
                                    <TableCell>{situacionTerapeutica.diagnostico}</TableCell>
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