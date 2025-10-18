import React, { useMemo, useState } from "react";
import { Box, Stack, Typography, Alert } from "@mui/material";
import CalendarMonth from "../components/CalendarMonth";
import TurnosFilters from "../components/TurnosFilters";
import TurnosList from "../components/TurnosList";
import NotaDialog from "../components/NotaDialog";
import { ESPECIALIDADES, MEDICOS, CENTROS, TURNOS } from "../data/turnos_demo";

// Seleccionar para mostrar medico o centro medico
//localStorage.setItem("perfil", JSON.stringify({ tipo:"medico", medicoId:"m3" }));
localStorage.setItem("perfil", JSON.stringify({ tipo:"centro", centroId:"c2" }));
// Perfil simulado: guarda { tipo:"medico", medicoId:"m1" } o { tipo:"centro", centroId:"c1" }
function usePerfil() {
  try { return JSON.parse(localStorage.getItem("perfil") || "{}"); } catch { return {}; }
}

const fmt = (d) => d.toISOString().slice(0,10);

export default function TurnosPage() {
  const perfil = usePerfil();
  const esCentro = perfil?.tipo === "centro";
  const medicoIdLogin = perfil?.medicoId || "m1";
  const centroIdLogin = perfil?.centroId || "";

  // Estado base
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [turnos, setTurnos] = useState(TURNOS);
  const [notaDlg, setNotaDlg] = useState({ open:false, turno:null, texto:"" });
  const [flash, setFlash] = useState("");

  // Filtros visibles solo para centro
  const [medicoId, setMedicoId] = useState(esCentro ? "" : medicoIdLogin);
  const [especialidad, setEspecialidad] = useState("");

  // Derivados para centro
  const medicosCentro = useMemo(() => {
    if (!esCentro) return MEDICOS;
    const c = CENTROS.find(x => x.id === centroIdLogin);
    const ids = new Set(c?.medicos ?? []);
    return MEDICOS.filter(m => ids.has(m.id));
  }, [esCentro, centroIdLogin]);

  const especialidadesDisponibles = useMemo(() => {
    if (!esCentro && medicoIdLogin) {
      const m = MEDICOS.find(x => x.id === medicoIdLogin);
      return m?.especialidades ?? ESPECIALIDADES;
    }
    if (esCentro && medicoId) {
      const m = MEDICOS.find(x => x.id === medicoId);
      return m?.especialidades ?? ESPECIALIDADES;
    }
    return ESPECIALIDADES;
  }, [esCentro, medicoIdLogin, medicoId]);

  // Filtro de turnos
  const turnosFiltrados = useMemo(() => {
    return turnos.filter(t => {
      if (esCentro) {
        if (centroIdLogin && t.centroId !== centroIdLogin) return false;
        if (medicoId && t.medicoId !== medicoId) return false;
      } else {
        if (t.medicoId !== medicoIdLogin) return false;
      }
      if (especialidad && t.especialidad !== especialidad) return false;
      return true;
    });
  }, [turnos, esCentro, centroIdLogin, medicoId, medicoIdLogin, especialidad]);

  // Index por fecha
  const turnosByDate = useMemo(() => {
    const map = {};
    for (const t of turnosFiltrados) (map[t.fecha] ||= []).push(t);
    Object.values(map).forEach(arr => arr.sort((a,b)=>a.hora.localeCompare(b.hora)));
    return map;
  }, [turnosFiltrados]);

  const dayKey = fmt(selectedDate);
  const turnosDelDia = turnosByDate[dayKey] ?? [];

  // Notas
  const guardarNota = () => {
    const { turno, texto } = notaDlg;
    if (!turno || !texto.trim()) { setNotaDlg({ open:false, turno:null, texto:"" }); return; }
    setTurnos(prev => prev.map(t => t.id === turno.id
      ? { ...t, notas:[...(t.notas||[]), { ts:new Date().toISOString(), texto:texto.trim() }] }
      : t
    ));
    setNotaDlg({ open:false, turno:null, texto:"" });
    setFlash("Nota agregada. Se reflejará en la historia clínica al integrar backend.");
    setTimeout(()=>setFlash(""), 2000);
  };

  return (
    <Box sx={{ p:2 }}>
      <Typography variant="h4" color="primary" mb={1}>Turnos</Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Calendario y gestión de turnos. Notas por turno.
      </Typography>

      {esCentro && (
        <TurnosFilters
          medicoId={medicoId}
          especialidad={especialidad}
          medicos={medicosCentro}
          especialidades={especialidadesDisponibles}
          onChangeMedico={setMedicoId}
          onChangeEspecialidad={setEspecialidad}
        />
      )}

      {flash && <Alert severity="success" sx={{ mb:2 }}>{flash}</Alert>}

      <Stack direction={{ xs:"column", lg:"row" }} spacing={2}>
        <Box sx={{ flex:2 }}>
          <CalendarMonth
            currentDate={currentDate}
            onPrev={()=>setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth()-1, 1))}
            onNext={()=>setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 1))}
            turnosByDate={turnosByDate}
            onSelectDate={setSelectedDate}
          />
        </Box>

        <Box sx={{ flex:1 }}>
          <TurnosList
            fecha={selectedDate}
            turnos={turnosDelDia}
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
