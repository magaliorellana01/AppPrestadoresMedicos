import { Box, Stack } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../icons/logo.png";

function MenuOption({ path, content }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <Box 
      sx={{ typography: pathname === path ? 'topMenuSelected' : 'topMenu', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '29px' }} 
      onClick={() => navigate(path)}
    >
      {content}
    </Box>
  );
}

export function TopMenu({ theme }) {
  return (
    <Stack direction='row' alignItems='center' spacing={8} sx={{ width: '100%', height: '4rem', backgroundColor: theme.color.primary, pl: 4 }}>
      <MenuOption path='/' content={<img src={Logo} alt='Logo' style={{ width: '60px', height: '60px', marginTop: '10px' }} />} />
      <MenuOption path='/solicitudes' content='Solicitudes' />
      <MenuOption path='/historias' content='Historias Clinicas' />
      <MenuOption path='/actors' content='Situaciones Terapéuticas' />
      <MenuOption path='/turnos' content='Turnos' />
    </Stack>
  );
}