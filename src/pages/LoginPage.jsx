import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import Logo from "../icons/logo2.png";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { login } from "../services";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ theme }) => {
  const [cuit, setCuit] = useState("");
  const [password, setPassword] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();
  const prestador = JSON.parse(localStorage.getItem('prestador'));

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) setCuit(value);
  };

  const handleChangePswd = (e) => {
    const value = e.target.value;
    setPassword(value);
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    try {
      const response = await login(cuit, password);
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('prestador', JSON.stringify(response.prestador));
      setSnackbar({ open: true, message: "Bienvenido", severity: "success" });
      navigate('/solicitudes');
    } catch (error) {
      console.log('error', error);
      setSnackbar({ open: true, message: error.message || "No se pudo iniciar sesión", severity: "error" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('prestador');
    window.location.reload();
  };

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        bgcolor: "#F9FAFB",
        gap: 3,
      }}
    >
      <Box
        component="img"
        src={Logo}
        alt="Logo"
        sx={{
          width: { xs: "150px", sm: "100px" },
          height: "auto",
          mt: 5,
          mb: 0,
        }}
      />
      <Typography variant="h6" sx={{ textAlign: "center", mt: 0, mb: 2 }}>
        Medicina Integral
      </Typography>

      {!prestador ? <Box
        sx={{
          backgroundColor: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 3,
          width: { xs: "90%", sm: "400px" },
          p: 4,
          boxShadow: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
            mb: 8,
            borderBottom: "1px solid #E5E7EB",
            pb: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Prestadores
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            gap: 6,
          }}
        >
          <TextField label="CUIT" value={cuit} onChange={handleChange} />

          <TextField
            label="Contraseña"
            onChange={handleChangePswd}
            value={password}
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? "hide the password" : "display the password"}
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              width: "auto",
              maxWidth: 225,
            }}
          />
          <Button
            variant="contained"
            size="large"
            disabled={cuit.length !== 11}
            onClick={handleLogin}
          >
            Login
          </Button>
        </Box>
      </Box> : 
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <Typography variant="h6">Estás logueado como {prestador.nombres} {prestador.apellidos}</Typography>
        <Button variant="contained" size="large" onClick={handleLogout}>Cerrar sesión</Button>
      </Box>}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;
