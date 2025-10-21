import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomePage = ({ theme }) => {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <Typography variant='h4' color={theme.color.primary}>
            Bienvenido a la plataforma de gestión de solicitudes de atención médica
        </Typography>
        <Button variant="contained" size="large" onClick={()=>navigate('/login')}>Ir a login</Button>
    </Box>
  )
}

export default HomePage;