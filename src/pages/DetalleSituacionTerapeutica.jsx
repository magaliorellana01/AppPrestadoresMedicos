import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Paper,
} from "@mui/material";
import { getSituacionTerapeuticaByID } from "../services";
import CartelInformacionSocio from "../components/CartelInformacionSocio";
import DiagnosticoIcon from "../icons/icono-diagnostico.jpg"
import TratamientoIcon from "../icons/icono-tratamiento.jpg"
export default function DetalleSituacionTerapeutica() {
    const { id } = useParams();
    const [situacion, setSituacion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [diagnosticoEditable, setDiagnosticoEditable] = useState('');
    const [tratamientoEditable, setTratamientoEditable] = useState(''); 

    const fetchSituacionTerapeutica = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getSituacionTerapeuticaByID(id);
            setSituacion(data);

        } catch (err) {
            console.error("Error al cargar la situación terapéutica:", err);
            setError(err.message || "Error desconocido al cargar la situación.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchSituacionTerapeutica();
    }, [fetchSituacionTerapeutica]);

    useEffect(() => {
    if (situacion) {
        
        setDiagnosticoEditable(situacion.diagnostico || '');
        
       
        setTratamientoEditable(situacion.tratamiento || '');
        
       
    }
}, [situacion]); 
    if (loading) {
        return (
            <Box p={4} display="flex" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }
    if (error || !situacion) {
        return (
            <Box p={4}>
                <Typography variant="h5" color="error">
                    Situación Terapéutica no encontrada
                </Typography>
                {error && (
                    <Typography variant="body1" color="textSecondary">
                        {error}
                    </Typography>
                )}
            </Box>
        );
    }
    return (
        <Box >
            <Typography variant="h4" sx={{ mb: 3 }}>
                {situacion.socio.nombres} {situacion.socio.apellidos} - Situación terapéutica
            </Typography>
            <CartelInformacionSocio socio={situacion.socio} />


    <Box
    display="flex"
    flexDirection={{ xs: "column", sm: "column", md: "row" }}
    alignItems={{ xs: "center", sm: "center", md: "center" }}
    gap={2}
    p={{ xs: 2, sm: 2, md: 3 }}
    sx={{
        width: "100%",
        maxWidth: 400,
        border: "1px solid",
        borderColor: "border.main",
        borderRadius: 2,
        backgroundColor: "background.default",
        boxSizing: "border-box",
    }}
>
    
    <Box
        sx={{
            display: "flex",
            flexDirection: "column", 
            alignItems: "center",    
            flexShrink: 0 
        }}
    >
     
        <Box
            component="img"
            src={DiagnosticoIcon}
            alt="icono diagnostico"
            sx={{
                width: 100,
                height: "auto",
                
                flexShrink: 0,
            }}
        />

      
        <Typography
            variant="subtitle2"
            sx={{ 
                color: "text.secondary", 
                mt: 0.5, 
                mb: 0.5 
            }}
        >
            Diagnóstico
        </Typography>
    </Box>

   
    <Box sx={{ flexGrow: 1, width: { xs: "100%", sm: "100%" } }}>
        <TextField
            fullWidth
            multiline
            variant="outlined"
            minRows={6}
            maxRows={6}
            value={diagnosticoEditable}
            onChange={(e) => setDiagnosticoEditable(e.target.value)}
            inputProps={{ maxLength: 400 }}
            sx={{
                backgroundColor: "background.paper",
                "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                        borderColor: "divider",
                    },
                    "&:hover fieldset": {
                        borderColor: "primary.main",
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                    },
                },
            }}
        />
    </Box>
</Box>
<Box
    display="flex"
    flexDirection={{ xs: "column", sm: "column", md: "row" }}
    alignItems={{ xs: "center", sm: "center", md: "center" }}
    gap={2}
    p={{ xs: 2, sm: 2, md: 3 }}
    sx={{
        width: "100%",
        maxWidth: 400,
        border: "1px solid",
        borderColor: "border.main",
        borderRadius: 2,
        backgroundColor: "background.default",
        boxSizing: "border-box",
    }}
>
    
    <Box
        sx={{
            display: "flex",
            flexDirection: "column", 
            alignItems: "center",    
            flexShrink: 0 
        }}
    >
     
        <Box
            component="img"
            src={TratamientoIcon}
            alt="icono diagnostico"
            sx={{
                width: 100,
                height: "auto",
                
                flexShrink: 0,
            }}
        />

      
        <Typography
            variant="subtitle2"
            sx={{ 
                color: "text.secondary", 
                mt: 0.5, 
                mb: 0.5 
            }}
        >
            Tratamiento
        </Typography>
    </Box>

   
    <Box sx={{ flexGrow: 1, width: { xs: "100%", sm: "100%" } }}>
        <TextField
            fullWidth
            multiline
            variant="outlined"
            minRows={6}
            maxRows={6}
            value={tratamientoEditable}
            onChange={(e) => setTratamientoEditable(e.target.value)}
            inputProps={{ maxLength: 400 }}
            sx={{
                backgroundColor: "background.paper",
                "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                        borderColor: "divider",
                    },
                    "&:hover fieldset": {
                        borderColor: "primary.main",
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                    },
                },
            }}
        />
    </Box>
</Box>
        </Box>

    )
}