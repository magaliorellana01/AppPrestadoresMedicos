import { Box, Typography, useTheme } from "@mui/material";
import CredencialIcon from "../icons/icono-credencial.png";


export default function CartelInformacionSocio({ socio }) {
  
  const theme = useTheme();
  
  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", sm: "column", md: "row" }}
      alignItems={{ xs: "flex-start", sm: "flex-start" ,md: "center" }}
      gap={2}
      p={{ xs: 2, sm: 2 ,md: 3 }}
      sx={{
        width: "100%",                 
        maxWidth: 400,                 
        border: "1px solid",
        borderColor:"border.main",
        borderRadius: 2,
        backgroundColor: "background.default",
        boxSizing: "border-box",
      }}
    >
      <Box
        component="img"
        src={CredencialIcon}
        alt="icono credencial"
        sx={{
          width: 100,  
          height: "auto",
          flexShrink: 0,
          alignSelf: { xs: "center", sm: "center", md: "flex-start" },
          pt:{ md: 6 }
        }}
      />

      
      <Box
        display="grid"
        gap={0.5}
        sx={{
          width: "100%",              
          textAlign: { xs: "center",sm: "center", md: "left" },
        }}
      >
        <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Afiliado:</strong> {`${socio?.nombres ?? ""} ${socio?.apellidos ?? ""}`.trim() || "—"}</Typography>
        <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Edad:</strong> {socio?.edad ? `${socio.edad} años` : "—"}</Typography>
        <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Género:</strong> {socio?.genero ?? "—"}</Typography>
        <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Nro Afiliado:</strong> {socio?.nro_afiliado ?? "—"}</Typography>
        <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Miembro:</strong> {socio?.rol ?? "—"}</Typography>
        <Typography variant="body1" sx={{ color: "text.primary" }}><strong>Patología:</strong> {socio?.historia_clinica?.patologia ?? "—"}</Typography>
      </Box>
    </Box>
  );
}
