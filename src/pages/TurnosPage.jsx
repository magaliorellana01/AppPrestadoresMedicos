import React, { useMemo, useState, useRef, useEffect } from "react";
import { Box, Stack, Typography, Alert, Chip } from "@mui/material";
import CalendarMonth from "../components/CalendarMonth";
import TurnosFilters from "../components/TurnosFilters";
import TurnosList from "../components/TurnosList";
import NotaDialog from "../components/NotaDialog";
import { ESPECIALIDADES, MEDICOS, CENTROS } from "../data/turnos_demo";
import dayjs from "dayjs";

// Servicios API centralizados
import {
  getTurnos,
  createTurnosSlots,
  updateTurno,
  addNotaTurno,
} from "../services";

function usePerfilLocalStorage() {
  try {
    return JSON.parse(localStorage.getItem("perfil") || "{}");
  } catch {
    return {};
  }
}

const fmt = (d) => d.toISOString().slice(0, 10);

function mapTurnoFromApi(t) {
  const medicoPop = t.prestador_medico || t.medico || null; // por si el back hace populate
  return {
    id: t._id,
    fecha: dayjs(t.fecha).format("YYYY-MM-DD"),
    hora: t.hora,
    estado: t.estado,
    medicoId: t.prestador_medico_id,
    medicoNombre: medicoPop ? `${medicoPop.nombres} ${medicoPop.apellidos}` : "",
    centroId: t.centro_id || "",
    especialidad: t.especialidad || "",
    socioId: t.socio_id || "",
    paciente: t.paciente_nombre || "",
    notas: (t.notas || []).map((n) => ({
      ts: n.ts || n.createdAt || new Date().toISOString(),
      texto: n.texto,
    })),
  };
}

export default function TurnosPage() {
  const listaRef = useRef(null);

  // Perfil del usuario logueado (localStorage del login del backend)
  const prestador = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("prestador") || "{}");
    } catch {
      return {};
    }
  }, []);
  let role = prestador?.es_centro_medico ? "CENTRO" : "MEDICO";
  let medicoIdLogin = role === "MEDICO" ? prestador?._id || "" : "";
  let centroIdLogin = role === "CENTRO" ? prestador?._id || "" : "";

  // Fallback para pruebas locales
  if (!prestador?._id) {
    try {
      const perfil = usePerfilLocalStorage();
      if (perfil?.tipo === "medico") {
        role = "MEDICO";
        medicoIdLogin = perfil.medicoId || "m1";
      }
      if (perfil?.tipo === "centro") {
        role = "CENTRO";
        centroIdLogin = perfil.centroId || "";
      }
    } catch {}
  }

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [turnos, setTurnos] = useState([]);
  const [notaDlg, setNotaDlg] = useState({ open: false, turno: null, texto: "" });
  const [flash, setFlash] = useState("");

  const [filters, setFilters] = useState({
    medicoId: role === "MEDICO" ? medicoIdLogin : "",
    especialidad: "",
    sedeId: role === "CENTRO" ? centroIdLogin : "",
  });

  const SEDES = useMemo(() => CENTROS.map((c) => ({ id: c.id, nombre: c.nombre })), []);
  const medicosVisibles = useMemo(() => {
    if (filters.sedeId) {
      const c = CENTROS.find((x) => x.id === filters.sedeId);
      const ids = new Set(c?.medicos ?? []);
      return MEDICOS.filter((m) => ids.has(m.id));
    }
    return MEDICOS;
  }, [filters.sedeId]);

  const especialidadesDisponibles = useMemo(() => {
    const sourceMedicoId = role === "MEDICO" ? medicoIdLogin : filters.medicoId;
    if (sourceMedicoId) {
      const m = MEDICOS.find((x) => x.id === sourceMedicoId);
      return m?.especialidades ?? ESPECIALIDADES;
    }
    return ESPECIALIDADES;
  }, [role, medicoIdLogin, filters.medicoId]);

  const fechaSel = useMemo(() => dayjs(selectedDate).format("YYYY-MM-DD"), [selectedDate]);

  // Mapa id → nombre para fallback si el back no hace populate
  const medicoNombreById = useMemo(() => {
    const m = {};
    if (prestador?._id) m[prestador._id] = `${prestador.nombres || ""} ${prestador.apellidos || ""}`.trim();
    MEDICOS.forEach((x) => { m[x.id] = x.nombre; });
    return m;
  }, [prestador]);

  // --- Obtener turnos del MES actual ---
  const mesInicio = useMemo(
    () => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    [currentDate]
  );
  const mesFin = useMemo(
    () => new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
    [currentDate]
  );
  const fmtISO = (d) => new Date(d).toISOString().slice(0, 10);

  async function fetchTurnos() {
    const params = { desde: fmtISO(mesInicio), hasta: fmtISO(mesFin) };
    if (role === "MEDICO" && medicoIdLogin) params.medicoId = medicoIdLogin;
    if (role === "CENTRO" && centroIdLogin) params.centroId = centroIdLogin;
    try {
      const data = await getTurnos(params);
      setTurnos((data || []).map(mapTurnoFromApi));
    } catch (e) {
      console.error("Error cargando turnos:", e);
      setTurnos([]);
    }
  }

  useEffect(() => {
    fetchTurnos().catch(console.error);
  }, [mesInicio.getTime(), mesFin.getTime(), role, medicoIdLogin, centroIdLogin]);

  // --- FILTROS ---
  const fechaSeleccionada = useMemo(
    () => dayjs(selectedDate).format("YYYY-MM-DD"),
    [selectedDate]
  );

  const turnosDelDia = useMemo(() => {
    return turnos
      .filter((t) => {
        if (t.fecha !== fechaSeleccionada) return false;
        if (role === "MEDICO" && medicoIdLogin && t.medicoId !== medicoIdLogin) return false;
        if (role === "CENTRO" && centroIdLogin && t.centroId !== centroIdLogin) return false;
        if (filters.medicoId && t.medicoId !== filters.medicoId) return false;
        if (filters.especialidad && t.especialidad !== filters.especialidad) return false;
        if (filters.sedeId && t.centroId !== filters.sedeId) return false;
        return true;
      })
      .sort((a, b) => a.hora.localeCompare(b.hora));
  }, [turnos, fechaSeleccionada, role, medicoIdLogin, centroIdLogin, filters]);

  // Enriquecer con nombre de médico si falta
  const turnosDelDiaEnriquecidos = useMemo(() => {
    return turnosDelDia.map((t) => ({
      ...t,
      medicoNombre: t.medicoNombre || medicoNombreById[t.medicoId] || "",
    }));
  }, [turnosDelDia, medicoNombreById]);

  // Agrupación para el calendario
  const turnosByDate = useMemo(() => {
    const map = {};
    for (const t of turnos) (map[t.fecha] ||= []).push(t);
    Object.values(map).forEach((arr) =>
      arr.sort((a, b) => a.hora.localeCompare(b.hora))
    );
    return map;
  }, [turnos]);

  useEffect(() => {
    if (!listaRef.current) return;
    const isMobile = window.matchMedia("(max-width: 992px)").matches;
    if (!isMobile) return;
    const y = listaRef.current.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, [selectedDate, turnosDelDiaEnriquecidos.length]);

  const handleSelectDate = (d) => setSelectedDate(d);

  // Crear agenda del día seleccionado
  async function generarAgendaHoy() {
    await createTurnosSlots({
      medicoId:
        role === "MEDICO" ? medicoIdLogin : filters.medicoId || medicoIdLogin,
      centroId:
        role === "CENTRO" ? centroIdLogin : filters.sedeId || undefined,
      fecha: fechaSel,
      desdeHora: "09:00",
      hastaHora: "13:00",
      intervaloMin: 30,
      duracionMin: 30,
      especialidad: prestador?.especialidad || filters.especialidad || "",
    });
    await fetchTurnos();
    setFlash("Agenda generada.");
    setTimeout(() => setFlash(""), 2000);
  }

  // Reservar / cancelar
  const reservar = async (id, socioId, paciente) => {
    await updateTurno(id, {
      estado: "reservado",
      socio_id: socioId,
      paciente_nombre: paciente,
    });
    await fetchTurnos();
  };
  const cancelar = async (id) => {
    await updateTurno(id, { estado: "cancelado" });
    await fetchTurnos();
  };

  // Notas
  const guardarNota = async () => {
    const { turno, texto } = notaDlg;
    if (!turno || !texto.trim()) {
      setNotaDlg({ open: false, turno: null, texto: "" });
      return;
    }
    try {
      await addNotaTurno(turno.id, texto.trim());
      await fetchTurnos();
      setFlash("Nota agregada.");
      setTimeout(() => setFlash(""), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setNotaDlg({ open: false, turno: null, texto: "" });
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" color="primary" mb={1}>
        Turnos
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Calendario y gestión de turnos. Notas por turno.
      </Typography>

      <TurnosFilters
        role={role}
        values={filters}
        onChange={(p) => setFilters((s) => ({ ...s, ...p }))}
        medicos={medicosVisibles}
        especialidades={especialidadesDisponibles}
        sedes={SEDES}
        onGenerarAgenda={generarAgendaHoy}
      />

      {flash && <Alert severity="success" sx={{ mb: 2 }}>{flash}</Alert>}

      <Stack direction={{ xs: "column", lg: "row" }} spacing={2} sx={{ mt: 3 }}>
        <Box sx={{ flex: 2 }}>
          <CalendarMonth
            currentDate={currentDate}
            onPrev={() =>
              setCurrentDate(
                new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
              )
            }
            onNext={() =>
              setCurrentDate(
                new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
              )
            }
            turnosByDate={turnosByDate}
            onSelectDate={handleSelectDate}
          />
        </Box>

        <Box sx={{ flex: 1, mt: { xs: 1, lg: 0 } }} ref={listaRef}>
          <TurnosList
            fecha={selectedDate}
            turnos={turnosDelDiaEnriquecidos}
            extra={(t) =>
              t.centroId ? (
                <Chip
                  size="small"
                  label={SEDES.find((s) => s.id === t.centroId)?.nombre || "Sede"}
                />
              ) : null
            }
            onAgregarNota={(t) => setNotaDlg({ open: true, turno: t, texto: "" })}
            onReservar={reservar}
            onCancelar={cancelar}
          />
        </Box>
      </Stack>

      <NotaDialog
        open={notaDlg.open}
        texto={notaDlg.texto}
        onChange={(v) => setNotaDlg((s) => ({ ...s, texto: v }))}
        onClose={() => setNotaDlg({ open: false, turno: null, texto: "" })}
        onSave={guardarNota}
      />
    </Box>
  );
}
