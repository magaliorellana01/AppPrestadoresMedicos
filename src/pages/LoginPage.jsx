import { useState} from "react"
import { Box,  Typography, Button , TextField, InputLabel,OutlinedInput, InputAdornment, IconButton} from "@mui/material";
import Logo from "../icons/logo2.png";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const LoginPage = ({ theme }) => {
      const [cuit, setCuit] = useState("");
      const [password, setPassword] = useState("");

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) setCuit(value);
  };

  
  const handleChangePswd = (e) => {
    const value = e.target.value;
    setPassword(value);
  };  

    const handleLogin = () => {
     alert(`CUIT ingresado: ${cuit} ${password}`);
  };

  const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
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
            gap: 6,
          }}
        >
          <TextField
            label="CUIT"
            value={cuit}
            onChange={handleChange}
           
          />
        
          <TextField
            label="Contraseña"
            onChange={handleChangePswd}
            value={password}
            type={showPassword ? 'text' : 'password'}
       InputProps={{
          endAdornment: (
      <InputAdornment position="end">
        <IconButton
          aria-label={showPassword ? 'hide the password' : 'display the password'}
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
    width: 'auto',        
    maxWidth: 225,          
  }}   
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