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
    Modal,
    Paper,
} from "@mui/material";
import { getSituacionTerapeuticaByID, createNovedadTerapeutica, updateSituacionTerapeutica, finalizarSituacionTerapeutica } from "../services";
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
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const handleOpenConfirmModal = () => setOpenConfirmModal(true);
    const handleCloseConfirmModal = () => setOpenConfirmModal(false);


    const handleConfirmFinalizar = async () => {
        handleCloseConfirmModal();

        try {
            await finalizarSituacionTerapeutica(id);
            window.history.back();

        } catch (error) {
            console.error("Error al finalizar la situación:", error);
            const errorMessage = error.response
                ? error.response.data.message || 'Error desconocido del servidor.'
                : 'No se pudo conectar con el servidor.';

            setSnackbar({
                open: true,
                message: `Error al finalizar. Detalles: ${errorMessage}`,
                severity: "error"
            });
        }
    };
    const handleFinalizarSituacion = handleOpenConfirmModal;

    const handleAgregarNovedad = async () => {
        if (!nuevaNovedad.trim()) return;

        try {
            const situacionActualizada = await createNovedadTerapeutica(id, nuevaNovedad);
            setNuevaNovedad("");
            setSituacion(situacionActualizada);
            setSnackbar({ open: true, message: "Novedad agregada correctamente", severity: "success" });
        } catch (err) {
            console.error("Error al agregar novedad:", err);
            setSnackbar({ open: true, message: err.response?.data?.message || "No se pudo agregar la novedad", severity: "error" });
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
            setError(err.response?.data?.message || err.message || "Error desconocido al cargar la situación.");
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
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems={{ xs: "flex-start", md: "center" }} mb={3} gap={1}>
                <Typography
                    variant="body2"
                    sx={{ cursor: "pointer", color: "primary.main", flexShrink: 0, fontSize: { xs: '14px', sm: '16px' } }}
                    onClick={() => window.history.back()}
                >
                    ← Volver a Situaciones Terapéuticas
                </Typography>
                <Typography variant="h4" color="primary" sx={{ textAlign: { xs: "left", md: "center" }, fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }, width: '100%', wordBreak: 'break-word' }}>
                    {situacion.socio.nombres} {situacion.socio.apellidos} - Situación terapéutica
                </Typography>
            </Box>

            <Box display="flex" flexDirection={{ xs: "column", md: "column", lg: "row" }} gap={4} justifyContent="center" alignItems={{ xs: "center", md: "center", lg: "stretch" }}>
                {/* IZQ */}
                <Box display="flex" flexDirection="column" gap={3} sx={{
                    width: { xs: '100%', sm: '90%', md: 500 },
                    maxWidth: { xs: '100%', sm: '90%', md: 500 }
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
                            maxWidth: { xs: '100%', md: 500 }
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
                            maxWidth: { xs: '100%', md: 500 }
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
                            maxWidth: { xs: '100%', md: 500 }
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

                    width: { xs: '100%', sm: '90%', md: 600 },
                    maxWidth: { xs: '100%', sm: '90%', md: 600 },
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
                            maxWidth: { xs: '100%', md: 600 }
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
                                sx={{ width: "100%", fontSize: { xs: "14px", sm: "16px" } }}
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
                            maxWidth: { xs: '100%', md: 600 }
                        }}
                    >
                        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} alignItems={{ xs: "stretch", sm: "center" }} justifyContent="space-between" width="100%" gap={{ xs: 1, sm: 0 }}>
                            <Typography variant="subtitle2" sx={{ color: "text.secondary", minWidth: { xs: 'auto', sm: 150 } }}>
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
                        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} alignItems={{ xs: "stretch", sm: "center" }} justifyContent="space-between" width="100%" gap={{ xs: 1, sm: 0 }}>
                            <Typography variant="subtitle2" sx={{ color: "text.secondary", minWidth: { xs: 'auto', sm: 150 } }}>
                                Fecha de Fin
                            </Typography>
                            <TextField
                                type="date"
                                variant="outlined"
                                size="small"
                                value={fechaFinEditable}
                                onChange={(e) => {
                                    setFechaFinEditable(e.target.value)
                                    console.log(fechaFinEditable)
                                }
                                }
                                InputLabelProps={{ shrink: true }}
                                sx={{ flexGrow: 1 }}
                            />
                        </Box>
                    </Box>
                    <Box
                        display="flex"
                        flexDirection={{ xs: "column", sm: "row" }}
                        alignItems={{ xs: "stretch", sm: "center" }}
                        justifyContent="space-between"
                        width="100%"
                        gap={2}
                    >

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleGuardarCambios}

                            sx={{ flex: 1, fontSize: { xs: "14px", sm: "16px" } }}
                        >
                            Guardar cambios
                        </Button>


                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleFinalizarSituacion}
                            sx={{ flex: 1, fontSize: { xs: "14px", sm: "16px" } }}
                        >
                            Dar de alta situación
                        </Button>
                    </Box>

                    <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}
                        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
                            {snackbar.message}
                        </Alert>
                    </Snackbar>                   
                    <Modal
                        open={openConfirmModal}
                        onClose={handleCloseConfirmModal}
                        aria-labelledby="modal-title"
                        aria-describedby="modal-description"
                        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                    >
                        <Box
                            sx={{
                                width: { xs: "90%", md: "500px" }, 
                                backgroundColor: "white",
                                p: 4,
                                borderRadius: '22px',
                                border: '1px solid #E5E7EB'
                            }}
                        >
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            
                                <Typography variant="h4" color="primary" sx={{ fontSize: "28px" }}>
                                    Confirmar alta
                                </Typography>
                                
                            </Box>

                            <Divider sx={{ mt: 2, mb: 3 }} />

                            <Typography id="modal-description" sx={{ mt: 2, mb: 3, fontSize: "16px" }}>
                                ¿Está seguro de que quiere dar de alta esta situación terapéutica?
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    justifyContent: "flex-end",
                                    gap: { xs: 1.5, sm: 2 },
                                    mt: 2
                                }}
                            >
                                <Button
                                    variant="contained"
                                    
                                    onClick={handleCloseConfirmModal}
                                    sx={{
                                        fontSize: { xs: "16px", sm: "18px" },
                                        width: { xs: "100%", sm: "175px" },
                                        borderRadius: "10px",
                                        color:"primary"
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error" 
                                    onClick={handleConfirmFinalizar}
                                    sx={{
                                        fontSize: { xs: "16px", sm: "18px" },
                                        width: { xs: "100%", sm: "175px" },
                                        borderRadius: "10px"
                                    }}
                                >
                                    Dar de alta
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                </Box>
            </Box>
        </Box>

    )
}