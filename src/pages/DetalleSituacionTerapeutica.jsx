import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Divider,
    Snackbar,
    Alert,
} from "@mui/material";
import { getSituacionTerapeuticaByID, createNovedadTerapeutica, updateSituacionTerapeutica } from "../services";
import CartelInformacionSocio from "../components/CartelInformacionSocio";
import DiagnosticoIcon from "../icons/icono-diagnostico.jpg"
import TratamientoIcon from "../icons/icono-tratamiento.jpg"
import NovedadIcon from "../icons/icono-novedad-terapeutica.jpg"

export default function DetalleSituacionTerapeutica() {
    const { id } = useParams();
    const [situacion, setSituacion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [diagnosticoEditable, setDiagnosticoEditable] = useState('');
    const [tratamientoEditable, setTratamientoEditable] = useState('');
    const [fechaFinEditable, setFechaFinEditable] = useState("");
    const [nuevaNovedad, setNuevaNovedad] = useState("");
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const handleAgregarNovedad = async () => {
        if (!nuevaNovedad.trim()) return;

        try {
            const situacionActualizada = await createNovedadTerapeutica(id, nuevaNovedad);
            setNuevaNovedad("");
            setSituacion(situacionActualizada);
            setSnackbar({ open: true, message: "Novedad agregada correctamente", severity: "success" });
        } catch (err) {
            console.error("Error al agregar novedad:", err);
            setError(err.message || "Error al agregar novedad");
        }
    }

    const handleGuardarCambios = useCallback(async () => {
        if (!id) return;
        
        const updates = {
            diagnostico: diagnosticoEditable,
            tratamiento: tratamientoEditable,
            fechaFin: fechaFinEditable,
        };

        try {
            

            const situacionActualizada = await updateSituacionTerapeutica(id, updates);

            setSituacion(situacionActualizada);
            setSnackbar({ open: true, message: "Cambios guardados correctamente", severity: "success" });
        } catch (err) {
            console.error("Error al guardar la situación terapéutica:", err);
            setSnackbar({ open: true, message: err.response?.data?.message || "No se pudieron guardar los cambios", severity: "error" });
        } 
    }, [id, diagnosticoEditable, tratamientoEditable, fechaFinEditable]);


    const formatDateToInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date)) return ''; 

    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

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

    

            setFechaFinEditable(formatDateToInput(situacion.fechaFin))



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

    const novedades = situacion?.novedadesMedicas?.slice().reverse() || [];
    return (
        <Box p={{ xs: 2, md: 4 }} >
            <Box display="flex" flexDirection={{ xs: "column", md: "column", lg: "row" }} justifyContent="center" alignItems="center" mb={3}>
                <Typography
                    variant="body2"
                    sx={{ cursor: "pointer", color: "primary.main", flexShrink: 0 }}
                    onClick={() => window.history.back()}
                >
                    ← Volver a Situaciones Terapéuticas
                </Typography>
                <Typography variant="h4" sx={{ textAlign: "center", flexGrow: 1, mr: { xs: 0, md: "150px" } }}>
                    {situacion.socio.nombres} {situacion.socio.apellidos} - Situación terapéutica
                </Typography>
            </Box>

            <Box display="flex" flexDirection={{ xs: "column", md: "column", lg: "row" }} gap={4} justifyContent="center" alignItems={{ xs: "center", md: "center", lg: "stretch" }}>
                {/* IZQ */}
                <Box display="flex" flexDirection="column" gap={3} sx={{
                    width: { xs: 500, md: 500 },
                    maxWidth: { xs: 500, md: 500 }
                }} >

                    {/* Cartel de Información de Socio */}
                    <Box
                        p={3}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        sx={{
                            border: "1px solid",
                            borderColor: "border.main",
                            borderRadius: 2,
                            backgroundColor: "background.default",
                            maxWidth: 500
                        }}
                    >
                        <CartelInformacionSocio socio={situacion.socio} />
                    </Box>

                    {/* Box de Diagnóstico */}
                    <Box
                        display="flex"
                        flexDirection={{ xs: "column", sm: "column", md: "row" }}
                        alignItems={{ xs: "center", sm: "center", md: "center" }}
                        gap={2}
                        p={3}
                        sx={{
                            border: "1px solid",
                            borderColor: "border.main",
                            borderRadius: 2,
                            backgroundColor: "background.default",
                            maxWidth: 500
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
                                sx={{ width: 100, height: "auto", flexShrink: 0 }}
                            />
                            <Typography variant="subtitle2" sx={{ color: "text.secondary", mt: 0.5, mb: 0.5 }}>
                                Diagnóstico
                            </Typography>
                        </Box>
                        <Box sx={{ flexGrow: 1, width: { xs: "100%", sm: "100%" } }}>
                            <TextField
                                fullWidth
                                multiline
                                variant="outlined"
                                minRows={4}
                                maxRows={4}
                                value={diagnosticoEditable}
                                onChange={(e) => setDiagnosticoEditable(e.target.value)}
                                inputProps={{ maxLength: 400 }}
                                sx={{
                                    backgroundColor: "background.paper",
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": { borderColor: "divider" },
                                        "&:hover fieldset": { borderColor: "primary.main" },
                                        "&.Mui-focused fieldset": { borderColor: "primary.main" },
                                    },
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Box de Tratamiento */}
                    <Box
                        display="flex"
                        flexDirection={{ xs: "column", sm: "column", md: "row" }}
                        alignItems={{ xs: "center", sm: "center", md: "center" }}
                        gap={2}
                        p={3}
                        sx={{
                            border: "1px solid",
                            borderColor: "border.main",
                            borderRadius: 2,
                            backgroundColor: "background.default",
                            maxWidth: 500
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
                                sx={{ width: 100, height: "auto", flexShrink: 0 }}
                            />
                            <Typography variant="subtitle2" sx={{ color: "text.secondary", mt: 0.5, mb: 0.5 }}>
                                Tratamiento
                            </Typography>
                        </Box>
                        <Box sx={{ flexGrow: 1, width: { xs: "100%", sm: "100%" } }}>
                            <TextField
                                fullWidth
                                multiline
                                variant="outlined"
                                minRows={4}
                                maxRows={4}
                                value={tratamientoEditable}
                                onChange={(e) => setTratamientoEditable(e.target.value)}
                                inputProps={{ maxLength: 400 }}
                                sx={{
                                    backgroundColor: "background.paper",
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": { borderColor: "divider" },
                                        "&:hover fieldset": { borderColor: "primary.main" },
                                        "&.Mui-focused fieldset": { borderColor: "primary.main" },
                                    },
                                }}
                            />
                        </Box>
                    </Box>

                </Box>

                {/* DER */}
                <Box display="flex" flexDirection="column" gap={3} sx={{
                    flexShrink: 0,
                    flexGrow: 0,

                    width: { xs: 600, md: 600 },
                    maxWidth: { xs: 600, md: 600 },
                }}>
                    {/* Box de Novedades */}
                    <Box
                        display="flex"
                        flexDirection={{ xs: "column", sm: "row" }}
                        gap={2}
                        p={3}
                        sx={{
                            width: "100%",
                            border: "1px solid",
                            borderColor: "border.main",
                            borderRadius: 2,
                            backgroundColor: "background.default",
                            boxSizing: "border-box",
                            flexGrow: 1,
                            maxWidth: 600
                        }}
                    >
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="flex-start"
                            gap={1.5}
                            sx={{ flex: { xs: "1 1 100%", sm: "0 0 50%" } }}
                        >
                            <Box
                                component="img"
                                src={NovedadIcon}
                                alt="icono diagnostico"
                                sx={{ width: 100, height: "auto", flexShrink: 0 }}
                            />
                            <Typography variant="subtitle1" sx={{ color: "text.secondary", textAlign: "center" }}>
                                Novedades Médicas
                            </Typography>
                            <TextField
                                multiline
                                minRows={3}
                                variant="outlined"
                                fullWidth
                                value={nuevaNovedad}
                                onChange={(e) => setNuevaNovedad(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ width: "100%" }}
                                onClick={handleAgregarNovedad}
                            >
                                Agregar Novedad
                            </Button>
                        </Box>
                        <Box
                            display="flex"
                            flexDirection="column"
                            gap={2}
                            sx={{
                                flex: "1 1 50%",
                                minWidth: 0,
                                maxHeight: 265,
                                overflowY: "auto",
                                pr: 1,
                            }}
                        >
                            {novedades && novedades.length > 0 ? (
                                novedades.map((novedad, index) => (
                                    <Box key={novedad._id ?? index} sx={{ border: "1px solid", borderColor: "border.main", borderRadius: 2, p: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                            {novedad.prestador?.nombres} {novedad.prestador?.apellidos} - {novedad.prestador?.especialidad}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                            {novedad.fechaCreacion
                                                ? new Date(novedad.fechaCreacion).toLocaleString("es-AR", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                }).replace(', ', ' ')
                                                : "—"}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 1, color: "text.primary", wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                            {novedad.nota ?? "—"}
                                        </Typography>
                                        {index < novedades.length - 1 && <Divider sx={{ my: 1 }} />}
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No hay novedades registradas.
                                </Typography>
                            )}
                        </Box>
                    </Box>
                    {/* Box de Fechas */}
                    <Box
                        display="flex"
                        flexDirection="column"
                        gap={2}
                        p={3}
                        sx={{
                            width: "100%",
                            border: "1px solid",
                            borderColor: "border.main",
                            borderRadius: 2,
                            backgroundColor: "background.default",
                            boxSizing: "border-box",
                            maxWidth: 600
                        }}
                    >
                        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                            <Typography variant="subtitle2" sx={{ color: "text.secondary", minWidth: 150 }}>
                                Fecha de Inicio
                            </Typography>
                            <TextField
                                type="date"
                                variant="outlined"
                                size="small"
                                value={situacion.fechaInicio ? new Date(situacion.fechaInicio).toISOString().slice(0, 10) : ""}
                                InputLabelProps={{ shrink: true }}
                                disabled={true}
                                sx={{ flexGrow: 1 }}

                            />
                        </Box>
                        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                            <Typography variant="subtitle2" sx={{ color: "text.secondary", minWidth: 150 }}>
                                Fecha de Fin
                            </Typography>
                            <TextField
                                type="date"
                                variant="outlined"
                                size="small"
                                value={fechaFinEditable}
                                onChange={(e) => {setFechaFinEditable(e.target.value)
                                            console.log(fechaFinEditable)}
                                }
                                InputLabelProps={{ shrink: true }}
                                sx={{ flexGrow: 1 }}
                            />
                        </Box>
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ width: "100%" }}
                        onClick={handleGuardarCambios}

                    >
                        Guardar cambios
                    </Button>
                    <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}
                        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
                            {snackbar.message}
                        </Alert>
                    </Snackbar>

                </Box>
            </Box>
        </Box>

    )
}