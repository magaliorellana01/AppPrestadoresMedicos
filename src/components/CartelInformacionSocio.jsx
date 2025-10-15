import { Box, Typography } from "@mui/material";
import CredencialIcon from "../icons/icono-credencial.png";
import React from "react";

// Se envuelve el componente en React.forwardRef para poder reuitlizarlo
const CartelInformacionSocio = React.forwardRef(({ socio }, ref) => {
  function calcularEdad(fechaNacimiento) {
    if (!fechaNacimiento) return "—";
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad;
  }

  return (
    <Box
      ref={ref}
      display="flex"
      flexDirection={{ xs: "column", sm: "column", md: "row" }}
      alignItems={{ xs: "flex-start", sm: "flex-start", md: "center" }}
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
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
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
          pt: { md: 6 },
        }}
      />

      <Box
        display="grid"
        gap={0.5}
        sx={{
          width: "100%",
          textAlign: { xs: "center", sm: "center", md: "left" },
        }}
      >
        <Typography variant="body1" sx={{ color: "text.primary" }}>
          <strong>Afiliado:</strong>{" "}
          {`${socio?.nombres ?? ""} ${socio?.apellidos ?? ""}`.trim() || "—"}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.primary" }}>
          <strong>Edad:</strong> {calcularEdad(socio?.fecha_nacimiento)} años
        </Typography>
        <Typography variant="body1" sx={{ color: "text.primary" }}>
          <strong>Género:</strong> {socio?.genero ?? "—"}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.primary" }}>
          <strong>DNI:</strong> {socio?.dni ?? "—"}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.primary" }}>
          <strong>Miembro:</strong> {socio?.rol ?? "—"}
        </Typography>
      </Box>
    </Box>
  );
});

export default CartelInformacionSocio;