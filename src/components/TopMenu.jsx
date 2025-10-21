import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../icons/logo.png";

function MenuOption({ path, content }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const theme = useTheme();
  return (
    <Box
      sx={{
        typography: pathname === path ? "topMenuSelected" : "topMenu",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        fontSize: "29px",
        color: pathname === path ? theme.color.secondary : "white",
      }}
      onClick={() => navigate(path)}
    >
      {content}
    </Box>
  );
}

export function TopMenu({ theme }) {
  const prestador = JSON.parse(localStorage.getItem('prestador'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('prestador');
    navigate('/login');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={8}
      sx={{ height: "4rem", backgroundColor: theme.color.primary, pl: 4, pr: 4, width: "100%", flexWrap: "nowrap" }}
    >
      <MenuOption
        path="/"
        content={
          <img src={Logo} alt="Logo" style={{ width: "60px", height: "60px", marginTop: "10px" }} />
        }
      />
      {
        prestador && 
        <>
          <MenuOption path="/solicitudes" content="Solicitudes" />
          <MenuOption path="/historias-clinicas" content="Historias Clinicas" />
          <MenuOption path="/situaciones-terapeuticas" content="Situaciones Terapéuticas" />
          <MenuOption path="/turnos" content="Turnos" />
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, pr: 6 }}>
            <Typography variant="body1" color="white" noWrap>{prestador.nombres} {prestador.apellidos}</Typography>
            <Button variant="contained" size="small" sx={{ backgroundColor: theme.color.secondary }} onClick={handleLogout}>Cerrar sesión</Button>
          </Box>
        </>
      }
      </Stack>
  );
}
