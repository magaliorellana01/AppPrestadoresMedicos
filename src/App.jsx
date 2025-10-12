import React from "react";
import { Box, useTheme } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TopMenu } from "./components/TopMenu";
import TurnosPage from "./pages/TurnosPage.jsx";
import SolicitudesPage from "./pages/SolicitudesPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFoundPage from "./pages/NotFoundPage";
import Footer, { FOOTER_HEIGHT } from "./components/Footer";
import HistoriasClinicasPage from "./pages/HistoriasClinicasPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DetalleHistoriaClinica from "./pages/DetalleHistoriaClinica.jsx";
import SituacionesTerapeuticasPage from "./pages/SituacionesTerapeuticasPage.jsx";
import DetalleSituacionTerapeutica from "./pages/DetalleSituacionTerapeutica.jsx"

export function App() {
  const theme = useTheme();

  return (
    <Box sx={{ backgroundColor: theme.color.background, minHeight: "100vh", width: "100%" }}>
      <BrowserRouter>
        <TopMenu theme={theme} />
        <Box
          sx={{
            px: { xs: 1, md: 4 },
            py: 4,
            pb: {
              xs: `calc(${FOOTER_HEIGHT.xs}px + 8px)`,
              md: `calc(${FOOTER_HEIGHT.md}px + 16px)`,
            },
          }}
        >
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/historias-clinicas" element={<HistoriasClinicasPage />} />
            <Route path="/historia-clinica/:id" element={<DetalleHistoriaClinica />} />
            <Route path="/turnos" element={<TurnosPage theme={theme} />} />
            <Route path="/solicitudes" element={<SolicitudesPage theme={theme} />} />
            <Route
              path="/situaciones-terapeuticas"
              element={<SituacionesTerapeuticasPage theme={theme} />}
            />
             <Route
              path="/situaciones-terapeuticas/:id"
              element={<DetalleSituacionTerapeutica theme={theme} />}
            />
            <Route path="/" element={<HomePage theme={theme} />} />
            <Route path="*" element={<NotFoundPage theme={theme} />} />
          </Routes>
        </Box>
        <Footer />
      </BrowserRouter>
    </Box>
  );
}
