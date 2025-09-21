import { useState } from "react"
import { Box,  Typography, Button , TextField, Alert} from "@mui/material";
import Logo from "../icons/logo2.png";


const LoginPage = ({ theme }) => {
      const [cuit, setCuit] = useState("");

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) setCuit(value);
  };
    const handleLogin = () => {
     alert(`CUIT ingresado: ${cuit}`);
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
        mb: 0
      }}

    />
      <Typography
    variant="h6" 
    sx={{ textAlign: "center",mt: 0, mb: 2 }}
  >
    Medicina Integral
  </Typography>

    <Box
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
            gap: 8,
          }}
        >
          <TextField
            label="Ingrese su CUIT"
            value={cuit}
            onChange={handleChange}
           
          />

          <Button
            variant="contained"
            size="large"
            onClick={handleLogin}
            disabled={cuit.length !== 11} 
          >
            Login
          </Button>
      </Box>
    </Box>
  </Box>
);
}

export default LoginPage;