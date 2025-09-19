import React from "react";
import { Box, useTheme } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TopMenu } from "./components/TopMenu";
import { ActorsPage } from "./pages/ActorsPage";
import TurnosPage from "./pages/TurnosPage.jsx";
import SolicitudesPage from "./pages/SolicitudesPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFoundPage from "./pages/NotFoundPage";
import HistoriasClinicasPage from "./pages/HistoriasClinicasPage.jsx";

export function App() {
  const theme = useTheme();

  return (
    <Box sx={{ backgroundColor: theme.color.secondary, minHeight: '100vh', width: '100%' }}>
      <BrowserRouter>
        <TopMenu theme={theme} />
        <Box sx={{px: { xs: 1, md: 4 }, py: 4}}>
          <Routes>
            <Route path="/historias" element={<HistoriasClinicasPage />} />
            <Route path='/actors' element={<ActorsPage theme={theme} />} />
            <Route path='/turnos' element={<TurnosPage theme={theme} />} />
            <Route path='/solicitudes' element={<SolicitudesPage theme={theme} />} />
            <Route path='/' element={<HomePage theme={theme} />} />
            <Route path='*' element={<NotFoundPage theme={theme} />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </Box>
  )
}
