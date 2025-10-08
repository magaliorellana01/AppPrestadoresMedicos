import * as React from 'react';
import Chip from '@mui/material/Chip';


const estilosDeBoton = {
    py: 0.5,
    px: 1,
    height: "auto",
    borderRadius: "20px",
    whiteSpace: "nowrap",
    margin: "2px 0",

    '& .MuiChip-label': {
        padding: "5px",
        fontSize: "0.875rem",
        fontWeight: 600,
    }
}


const getEstadoProps = (estado) => {
    const colores = {
        Recibido: { bg: 'rgba(158, 158, 158, 0.5)', text: '#616161' },
        EnAnalisis: { bg: 'rgba(0, 140, 180, 0.5)', text: '#007090' },
        Observado: { bg: 'rgba(255, 193, 7, 0.5)', text: '#e0a800' },
        Aprobado: { bg: 'rgba(76, 175, 80, 0.5)', text: '#388e3c' },
        Rechazado: { bg: 'rgba(244, 67, 54, 0.5)', text: '#d32f2f' },
    }
    switch (estado) {
        case 'Recibido':
            return { label: estado, variant: 'outlined', sx: { ...estilosDeBoton, backgroundColor: colores.Recibido.bg, color: colores.Recibido.text } };
        case 'En Análisis':
            return { label: estado, color: 'info', variant: 'filled', sx: { ...estilosDeBoton, backgroundColor: colores.EnAnalisis.bg, color: colores.EnAnalisis.text } };
        case 'Observado':
            return { label: estado, sx: { ...estilosDeBoton, backgroundColor: colores.Observado.bg, color: colores.Observado.text }, variant: 'filled' };
        case 'Aprobado':
            return { label: estado, color: 'success', variant: 'filled', sx: { ...estilosDeBoton, backgroundColor: colores.Aprobado.bg, color: colores.Aprobado.text } };
        case 'Rechazado':
            return { label: estado, color: 'error', variant: 'filled', sx: { ...estilosDeBoton, backgroundColor: colores.Rechazado.bg, color: colores.Rechazado.text } };
        default:
            return { label: estado, color: 'default', variant: 'outlined', sx: { ...estilosDeBoton, backgroundColor: colores.Recibido.bg, color: colores.Recibido.text } };
    }
};

const ComponenteDeEstados = ({ estado }) => {

    const props = getEstadoProps(estado);

    return (
        <Chip
            size="medium"
            {...props}
        />
    );
};

export default ComponenteDeEstados;