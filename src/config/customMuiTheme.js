import { createTheme } from "@mui/material";
import { blue, blueGrey, lightBlue } from "@mui/material/colors";

export const customMuiTheme = createTheme({
   palette: {

    primary: {
      main: "#2D6A8C", 
    },
    secondary: {
      main: "#4BAE72", 
    },

    background: {
      default: "#F9FAFB", 
    },
    border: {
      main: "#E5E7EB", 
    },
    text: {
      primary: "#111827", 
      secondary: "#6B7280", 
    },

    // Estados 
    aprobado: {
      main: "#4BAE72", 
    },
    rechazado: {
      main: "#DC2626", 
    },
    observado: {
      main: "#EAB308", 
    },
    analisis: {
      main: "#2563EB", 
    },
    recibido: {
      main: "#9CA3AF", 
    },

    // Accentos opcionales
    accentViolet: {
      main: "#9333EA", 
    },
    accentOrange: {
      main: "#F97316", 
    },
  },
  typography: {
    h3: {
      fontWeight: 'bold'
    },
    h4: {
      fontWeight: 'bold',
      color: lightBlue[700],
    },
    h5: {
      fontWeight: 'bold',
      color: blue[800],
      fontSize: '1.5rem',
    },
    subtitle1: {
      fontSize: '1rem',
    },
    subtitle2: {
      fontSize: '1.2rem',
    },
    button: {
      textTransform: 'none',
    },
    topMenu: {
      color: blueGrey[50],
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    topMenuSelected: {
      color: blueGrey[100],
      fontSize: '1.5rem',
      fontWeight: 'bold',
    }
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 'bold',
          fontSize: '1rem',
          color: lightBlue[900]
        }
      }
    }
  },
  color: {
    primary: '#2D6A8C',
    secondary: '#AFACAC',
    background: 'F5F5F5',
  }
});
