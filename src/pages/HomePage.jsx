import { Box, Button, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomePage = ({ theme }) => {
  const navigate = useNavigate();
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: { xs: 3, sm: 4 },
          minHeight: "60vh",
          textAlign: "center",
          px: { xs: 2, sm: 3 }
        }}
      >
        <Typography
          variant='h4'
          color={theme.color.primary}
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            fontWeight: 600,
            lineHeight: 1.3
          }}
        >
          Bienvenido a la plataforma de gestión de solicitudes de atención médica
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/login')}
          sx={{
            px: { xs: 3, sm: 4 },
            py: { xs: 1.5, sm: 2 },
            fontSize: { xs: '1rem', sm: '1.125rem' }
          }}
        >
          Ir a login
        </Button>
      </Box>
    </Container>
  )
}

export default HomePage;