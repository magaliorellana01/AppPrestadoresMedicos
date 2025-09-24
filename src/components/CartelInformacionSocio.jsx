import { Box, Typography } from "@mui/material";
import CredencialIcon from "../icons/icono-credencial.png";

export default function CartelInformacionSocio({ socio }) {
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
        border: "1px solid #ccc",
        borderRadius: 2,
        backgroundColor: "#f9f9f9",
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
        <Typography variant="body1" sx={{ color: "#424245" }}><strong>Afiliado:</strong> {socio?.nombre ?? "—"}</Typography>
        <Typography variant="body1" sx={{ color: "#424245" }}><strong>Edad:</strong> {socio?.edad ? `${socio.edad} años` : "—"}</Typography>
        <Typography variant="body1" sx={{ color: "#424245" }}><strong>Género:</strong> {socio?.genero ?? "—"}</Typography>
        <Typography variant="body1" sx={{ color: "#424245" }}><strong>Nro Afiliado:</strong> {socio?.nroAfiliado ?? "—"}</Typography>
        <Typography variant="body1" sx={{ color: "#424245" }}><strong>Miembro:</strong> {socio?.miembro ?? "—"}</Typography>
        <Typography variant="body1" sx={{ color: "#424245" }}><strong>Patología:</strong> {socio?.patologia ?? "—"}</Typography>
      </Box>
    </Box>
  );
}
