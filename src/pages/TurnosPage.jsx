import React, { useMemo, useState, useRef, useEffect } from "react";
import { Box, Stack, Typography, Alert, Chip } from "@mui/material";
import CalendarMonth from "../components/CalendarMonth";
import TurnosFilters from "../components/TurnosFilters";
import TurnosList from "../components/TurnosList";
import NotaDialog from "../components/NotaDialog";
import { ESPECIALIDADES, MEDICOS, CENTROS, TURNOS } from "../data/turnos_demo";
import { useAuth } from "../auth/context"; // stub temporal hasta login real

// Fallback si no hay contexto válido
function usePerfilLocalStorage() {
  try { return JSON.parse(localStorage.getItem("perfil") || "{}"); } catch { return {}; }
}

const fmt = (d) => d.toISOString().slice(0, 10);

export default function TurnosPage() {
  const listaRef = useRef(null);

  // perfil
  let role = "ADMIN";
  let medicoIdLogin = "";
  let centroIdLogin = "";
  try {
    const { user } = useAuth?.() ?? {};
    if (user?.role) role = user.role;
    if (user?.medicoId) medicoIdLogin = user.medicoId;
    if (user?.centroId) centroIdLogin = user.centroId;
  } catch {
    const perfil = usePerfilLocalStorage();
    if (perfil?.tipo === "medico") { role = "MEDICO"; medicoIdLogin = perfil.medicoId || "m1"; }
    if (perfil?.tipo === "centro") { role = "ADMIN";  centroIdLogin = perfil.centroId || ""; }
  }

  // Estado base
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [turnos, setTurnos] = useState(TURNOS);
  const [notaDlg, setNotaDlg] = useState({ open:false, turno:null, texto:"" });
  const [flash, setFlash] = useState("");

  // Filtros
  const [filters, setFilters] = useState({
    medicoId: role === "MEDICO" ? medicoIdLogin : "",
    especialidad: "",
    sedeId: "",
  });

  // Catálogos derivados
  const SEDES = useMemo(() => CENTROS.map(c => ({ id: c.id, nombre: c.nombre })), []);

  const medicosVisibles = useMemo(() => {
    if (filters.sedeId) {
      const c = CENTROS.find(x => x.id === filters.sedeId);
      const ids = new Set(c?.medicos ?? []);
      return MEDICOS.filter(m => ids.has(m.id));
    }
    return MEDICOS;
  }, [filters.sedeId]);

  const especialidadesDisponibles = useMemo(() => {
    const sourceMedicoId = role === "MEDICO" ? medicoIdLogin : filters.medicoId;
    if (sourceMedicoId) {
      const m = MEDICOS.find(x => x.id === sourceMedicoId);
      return m?.especialidades ?? ESPECIALIDADES;
    }
    return ESPECIALIDADES;
  }, [role, medicoIdLogin, filters.medicoId]);

  // Filtro de turnos
  const turnosFiltrados = useMemo(() => {
    return turnos.filter(t => {
      if (role === "MEDICO" && t.medicoId !== medicoIdLogin) return false;
      if (centroIdLogin && t.centroId !== centroIdLogin) return false;
      if (filters.medicoId && t.medicoId !== filters.medicoId) return false;
      if (filters.especialidad && t.especialidad !== filters.especialidad) return false;
      if (filters.sedeId && t.centroId !== filters.sedeId) return false; // sede == centro
      return true;
    });
  }, [turnos, role, medicoIdLogin, centroIdLogin, filters]);

  // Agrupación por fecha
  const turnosByDate = useMemo(() => {
    const map = {};
    for (const t of turnosFiltrados) (map[t.fecha] ||= []).push(t);
    Object.values(map).forEach(arr => arr.sort((a,b)=>a.hora.localeCompare(b.hora)));
    return map;
  }, [turnosFiltrados]);

  const dayKey = fmt(selectedDate);
  const turnosDelDia = turnosByDate[dayKey] ?? [];

  // Scroll a la lista luego de seleccionar fecha (solo pantallas chicas)
  useEffect(() => {
    if (!listaRef.current) return;
    const isMobile = window.matchMedia("(max-width: 992px)").matches;
    if (!isMobile) return;
    const y = listaRef.current.getBoundingClientRect().top + window.scrollY - 72; // compensación header
    window.scrollTo({ top: y, behavior: "smooth" });
  }, [selectedDate, turnosDelDia.length]);

  const handleSelectDate = (d) => setSelectedDate(d);

  // Notas
  const guardarNota = () => {
    const { turno, texto } = notaDlg;
    if (!turno || !texto.trim()) { setNotaDlg({ open:false, turno:null, texto:"" }); return; }
    setTurnos(prev => prev.map(t => t.id === turno.id
      ? { ...t, notas:[...(t.notas||[]), { ts:new Date().toISOString(), texto:texto.trim() }] }
      : t
    ));
    setNotaDlg({ open:false, turno:null, texto:"" });
    setFlash("Nota agregada.");
    setTimeout(()=>setFlash(""), 2000);
  };

  return (
    <Box sx={{ p:2 }}>
      <Typography variant="h4" color="primary" mb={1}>Turnos</Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Calendario y gestión de turnos. Notas por turno.
      </Typography>

      <TurnosFilters
        role={role}
        values={filters}
        onChange={(p) => setFilters(s => ({ ...s, ...p }))}
        medicos={medicosVisibles}
        especialidades={especialidadesDisponibles}
        sedes={SEDES}
      />

      {flash && <Alert severity="success" sx={{ mb:2 }}>{flash}</Alert>}

      <Stack direction={{ xs:"column", lg:"row" }} spacing={2} sx={{ mt: 3 }}>
        <Box sx={{ flex:2 }}>
          <CalendarMonth
            currentDate={currentDate}
            onPrev={()=>setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth()-1, 1))}
            onNext={()=>setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 1))}
            turnosByDate={turnosByDate}
            onSelectDate={handleSelectDate}
          />
        </Box>

        <Box sx={{ flex:1, mt: { xs: 1, lg: 0 } }} ref={listaRef}>
          <TurnosList
            fecha={selectedDate}
            turnos={turnosDelDia}
            extra={(t) => (t.centroId ? <Chip size="small" label={SEDES.find(s=>s.id===t.centroId)?.nombre || "Sede"} /> : null)}
            onAgregarNota={(t)=>setNotaDlg({ open:true, turno:t, texto:"" })}
          />
        </Box>
      </Stack>

      <NotaDialog
        open={notaDlg.open}
        texto={notaDlg.texto}
        onChange={(v)=>setNotaDlg(s=>({ ...s, texto:v }))}
        onClose={()=>setNotaDlg({ open:false, turno:null, texto:"" })}
        onSave={guardarNota}
      />
    </Box>
  );
}
