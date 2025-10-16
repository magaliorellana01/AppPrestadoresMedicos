import * as React from 'react';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';

const estilosDeBoton = {
    py: 0.5,
    px: 1,
    height: "auto",
    borderRadius: "10px",
    whiteSpace: "nowrap",
    margin: "2px 0",

    '& .MuiChip-label': {
        padding: "5px",
        fontSize: "0.875rem",
        fontWeight: 400,
    }
}

//Función para mostrar el texto legible sin afectar color
const getEstadoDisplay = (estado) => {
    switch (estado) {
        case 'EnAnalisis':
            return 'En Análisis';
        case 'Recibido':
            return 'Recibido';
        case 'Observado':
            return 'Observado';
        case 'Aprobado':
            return 'Aprobado';
        case 'Rechazado':
            return 'Rechazado';
        default:
            return estado || '—';
    }
};

const getEstadoProps = (estado) => {
    const colores = {
        Recibido: { bg: '#F0F0F0', text: '#777777' },
        EnAnalisis: { bg: '#B5D6FF', text: '#2563EB' },
        Observado: { bg: '#FFEDB6', text: '#EAB308' },
        Aprobado: { bg: '#D1FFCE', text: '#4BAE72' },
        Rechazado: { bg: '#FFCECE', text: '#DC2626' },
    }

    switch (estado) {
        case 'Recibido':
            return { label: getEstadoDisplay(estado), variant: 'outlined', sx: { ...estilosDeBoton, backgroundColor: colores.Recibido.bg, color: colores.Recibido.text } };
        case 'EnAnalisis':
            return { label: getEstadoDisplay(estado), color: 'info', variant: 'filled', sx: { ...estilosDeBoton, backgroundColor: colores.EnAnalisis.bg, color: colores.EnAnalisis.text } };
        case 'Observado':
            return { label: getEstadoDisplay(estado), sx: { ...estilosDeBoton, backgroundColor: colores.Observado.bg, color: colores.Observado.text }, variant: 'filled' };
        case 'Aprobado':
            return { label: getEstadoDisplay(estado), color: 'success', variant: 'filled', sx: { ...estilosDeBoton, backgroundColor: colores.Aprobado.bg, color: colores.Aprobado.text } };
        case 'Rechazado':
            return { label: getEstadoDisplay(estado), color: 'error', variant: 'filled', sx: { ...estilosDeBoton, backgroundColor: colores.Rechazado.bg, color: colores.Rechazado.text } };
        default:
            return { label: getEstadoDisplay(estado), color: 'default', variant: 'outlined', sx: { ...estilosDeBoton, backgroundColor: colores.Recibido.bg, color: colores.Recibido.text } };
    }
};

const ComponenteDeEstados = ({ estado }) => {
    const estadoConEspacios = {
        EnAnalisis: "En Análisis",
        Recibido: "Recibido",
        Observado: "Observado",
        Aprobado: "Aprobado",
        Rechazado: "Rechazado",
    }[estado] || estado;

    const props = getEstadoProps(estado);

    return (
        <Chip
            size="small"
            {...props}
            label={estadoConEspacios}
        />
    );
};

export default ComponenteDeEstados;
