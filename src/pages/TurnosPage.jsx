import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Box, Stack, Typography, Alert, Chip, Container,
  useMediaQuery, useTheme, Drawer, Fab, Paper, TextField, MenuItem
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CalendarMonth from "../components/CalendarMonth";
import TurnosFilters from "../components/TurnosFilters";
import TurnosList from "../components/TurnosList";
import NotaDialog from "../components/NotaDialog";
import VerNotasDialog from "../components/VerNotasDialog";
import { MEDICOS, CENTROS } from "../data/turnos_demo";
import dayjs from "dayjs";

// Servicios API centralizados
import {
  getTurnos,
  createTurnosSlots,
  updateTurno,
  addNotaTurno,
  getSedes,
  getEspecialidades,
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
  // Backend ahora popula prestador_medico_id con nombres y apellidos
  const medicoPop = typeof t.prestador_medico_id === 'object' ? t.prestador_medico_id : null;
  const sedePop = t.sede_id || null;
  return {
    id: t._id,
    fecha: dayjs(t.fecha).format("YYYY-MM-DD"),
    hora: t.hora,
    estado: t.estado,
    medicoId: typeof t.prestador_medico_id === 'object' ? t.prestador_medico_id._id : t.prestador_medico_id,
    medicoNombre: medicoPop ? `${medicoPop.nombres} ${medicoPop.apellidos}`.trim() : "",
    sedeId: typeof sedePop === 'object' ? sedePop._id : sedePop || "",
    sedeNombre: sedePop && typeof sedePop === 'object' ? sedePop.nombre : "",
    especialidad: t.especialidad || "",
    socioId: t.socio_id || "",
    paciente: t.paciente_nombre || "",
    pacienteApellido: t.paciente_apellido || "",
    notas: (t.notas || []).map((n) => ({
      ts: n.ts || n.createdAt || new Date().toISOString(),
      texto: n.texto,
      autorNombre: n.autor_id
        ? `${n.autor_id.nombres || ''} ${n.autor_id.apellidos || ''}`.trim()
        : 'Prestador',
    })),
  };
}

export default function TurnosPage() {
  const listaRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

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
  const [verNotasDlg, setVerNotasDlg] = useState({ open: false, turno: null });
  const [flash, setFlash] = useState("");
  const [calendarDrawerOpen, setCalendarDrawerOpen] = useState(false);
  const [sedes, setSedes] = useState([]);
  const [sedeSeleccionada, setSedeSeleccionada] = useState("");
  const [especialidades, setEspecialidades] = useState([]);

  const [filters, setFilters] = useState({
    medicoId: role === "MEDICO" ? medicoIdLogin : "",
    especialidad: "",
    sedeId: "",
    horaDesde: "",
    horaHasta: "",
  });

  const medicosVisibles = useMemo(() => {
    // TODO: filtrar médicos por sede cuando sea necesario
    return MEDICOS;
  }, []);

  const fechaSel = useMemo(() => dayjs(selectedDate).format("YYYY-MM-DD"), [selectedDate]);

  // Cargar sedes del prestador logueado
  useEffect(() => {
    async function loadSedes() {
      try {
        console.log("Cargando sedes para:", role);
        console.log("prestador.sedes:", prestador?.sedes);

        let sedesData = [];

        // Para CENTROS: si no tienen sedes asignadas, cargar todas
        if (role === "CENTRO" && (!prestador?.sedes || !Array.isArray(prestador.sedes) || prestador.sedes.length === 0)) {
          console.log("Centro sin sedes asignadas, cargando todas las sedes del sistema");
          sedesData = await getSedes();
        }
        // Para MÉDICOS: si no tienen sedes, no pueden trabajar
        else if (role === "MEDICO" && (!prestador?.sedes || !Array.isArray(prestador.sedes) || prestador.sedes.length === 0)) {
          console.warn("Médico sin sedes asignadas");
          setSedes([]);
          return;
        }
        // Si tiene sedes asignadas (tanto médico como centro)
        else {
          // Verificar si las sedes ya están pobladas (tienen nombre) o son solo ObjectIds
          const primeraSede = prestador.sedes[0];
          const estaPoblada = typeof primeraSede === 'object' && primeraSede !== null && primeraSede.nombre;

          if (estaPoblada) {
            // Las sedes ya vienen con los datos completos
            console.log("Sedes ya pobladas");
            sedesData = prestador.sedes;
          } else {
            // Las sedes son ObjectIds, necesitamos buscarlas
            console.log("Sedes son ObjectIds, buscando datos completos...");
            const todasLasSedes = await getSedes();

            // Filtrar solo las sedes que están en prestador.sedes
            sedesData = todasLasSedes.filter(sede => {
              return prestador.sedes.some(sedeId => {
                const sedeIdStr = typeof sedeId === 'object' ? sedeId.toString() : sedeId;
                const currentSedeIdStr = typeof sede._id === 'object' ? sede._id.toString() : sede._id;
                return sedeIdStr === currentSedeIdStr;
              });
            });
            console.log("Sedes filtradas:", sedesData.length);
          }
        }

        // Eliminar duplicados usando Map basado en _id (convertir todo a string)
        const sedesMap = new Map();
        sedesData.forEach(sede => {
          if (sede && sede._id && sede.nombre) {
            // Normalizar el _id a string para comparación
            let id;
            if (typeof sede._id === 'string') {
              id = sede._id;
            } else if (sede._id.$oid) {
              id = sede._id.$oid;
            } else if (typeof sede._id.toString === 'function') {
              id = sede._id.toString();
            } else {
              id = String(sede._id);
            }

            if (!sedesMap.has(id)) {
              sedesMap.set(id, sede);
            }
          }
        });

        console.log("Duplicados eliminados. Sedes únicas:", sedesMap.size);

        // Convertir a array y ordenar alfabéticamente
        const sedesUnicas = Array.from(sedesMap.values());
        const sedesOrdenadas = sedesUnicas.sort((a, b) =>
          (a.nombre || '').localeCompare(b.nombre || '')
        );

        console.log("Sedes finales cargadas:", sedesOrdenadas.length);
        setSedes(sedesOrdenadas);

        // Si es centro médico, seleccionar la primera sede alfabéticamente por defecto
        if (role === "CENTRO" && sedesOrdenadas.length > 0) {
          setSedeSeleccionada(sedesOrdenadas[0]._id);
        }
      } catch (error) {
        console.error("Error cargando sedes:", error);
        setSedes([]);
      }
    }
    loadSedes();
  }, [role, prestador]);

  // Cargar especialidades dinámicamente
  useEffect(() => {
    async function loadEspecialidades() {
      try {
        if (role === "MEDICO") {
          // Para médicos, usar las especialidades de su perfil
          if (prestador?.especialidades && Array.isArray(prestador.especialidades)) {
            setEspecialidades(prestador.especialidades);
          } else {
            // Si no tiene especialidades en el perfil, cargar todas
            const especialidadesData = await getEspecialidades();
            setEspecialidades(especialidadesData);
          }
        } else {
          // Para centros, cargar del sistema
          const params = {};
          if (sedeSeleccionada) {
            params.sedeId = sedeSeleccionada;
          }
          const especialidadesData = await getEspecialidades(params);
          setEspecialidades(especialidadesData);
        }
      } catch (error) {
        console.error("Error cargando especialidades:", error);
        setEspecialidades([]);
      }
    }
    loadEspecialidades();
  }, [role, sedeSeleccionada, prestador]);

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
    if (role === "CENTRO" && sedeSeleccionada) params.sedeId = sedeSeleccionada;

    // Si es centro y hay filtro de especialidad, agregarlo
    if (role === "CENTRO" && filters.especialidad) {
      params.especialidad = filters.especialidad;
    }

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
  }, [mesInicio.getTime(), mesFin.getTime(), role, medicoIdLogin, sedeSeleccionada, filters.especialidad]);

  // --- FILTROS ---
  const fechaSeleccionada = useMemo(
    () => dayjs(selectedDate).format("YYYY-MM-DD"),
    [selectedDate]
  );

  const turnosDelDia = useMemo(() => {
    return turnos
      .filter((t) => {
        // Filtro por fecha
        if (t.fecha !== fechaSeleccionada) return false;

        // Filtro por médico (si es médico logueado)
        if (role === "MEDICO" && medicoIdLogin && t.medicoId !== medicoIdLogin) return false;

        // Filtro por sede (para centros, usa sedeSeleccionada; para médicos, usa filters.sedeId)
        if (role === "CENTRO" && sedeSeleccionada && t.sedeId !== sedeSeleccionada) return false;
        if (role === "MEDICO" && filters.sedeId && t.sedeId !== filters.sedeId) return false;

        // Filtro por médico específico (para centros)
        if (filters.medicoId && t.medicoId !== filters.medicoId) return false;

        // Filtro por especialidad
        if (filters.especialidad && t.especialidad !== filters.especialidad) return false;

        // Filtro por rango horario (para centros)
        if (role === "CENTRO" && filters.horaDesde && t.hora < filters.horaDesde) return false;
        if (role === "CENTRO" && filters.horaHasta && t.hora > filters.horaHasta) return false;

        return true;
      })
      .sort((a, b) => a.hora.localeCompare(b.hora));
  }, [turnos, fechaSeleccionada, role, medicoIdLogin, sedeSeleccionada, filters]);

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

  const handleSelectDate = (d) => {
    setSelectedDate(d);
    if (isMobile) {
      setCalendarDrawerOpen(false);
    }
  };

  // Crear agenda del día seleccionado
  async function generarAgendaHoy() {
    // El médico debe elegir en qué sede atiende ese día
    const sedeParaTurnos = role === "MEDICO"
      ? (sedes.length > 0 ? sedes[0]._id : undefined)  // Si es médico, toma su primera sede de trabajo
      : sedeSeleccionada;  // Si es centro, usa la sede seleccionada

    if (!sedeParaTurnos && sedes.length > 0) {
      setFlash("Por favor seleccione una sede");
      setTimeout(() => setFlash(""), 2000);
      return;
    }

    await createTurnosSlots({
      medicoId: role === "MEDICO" ? medicoIdLogin : filters.medicoId || medicoIdLogin,
      sedeId: sedeParaTurnos,
      fecha: fechaSel,
      desdeHora: "09:00",
      hastaHora: "13:00",
      intervaloMin: 30,
      duracionMin: 30,
      especialidad: (prestador?.especialidades && prestador.especialidades.length > 0)
        ? prestador.especialidades[0]
        : filters.especialidad || "",
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

  const abrirVerNotas = (turno) => {
    setVerNotasDlg({ open: true, turno });
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      {flash && <Alert severity="success" sx={{ mb: 2 }}>{flash}</Alert>}

      {/* Botón de calendario en mobile - arriba a la derecha */}
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Fab
            color="primary"
            aria-label="abrir calendario"
            size="medium"
            onClick={() => setCalendarDrawerOpen(true)}
          >
            <CalendarTodayIcon />
          </Fab>
        </Box>
      )}

      {/* Filtros para centros médicos */}
      {role === "CENTRO" && (
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              select
              label="Sede"
              value={sedeSeleccionada}
              onChange={(e) => setSedeSeleccionada(e.target.value)}
              size="small"
              sx={{ minWidth: { xs: "100%", sm: 200 }, maxWidth: { xs: "100%", sm: 250 } }}
            >
              {sedes.map((sede) => (
                <MenuItem key={sede._id} value={sede._id}>
                  {sede.nombre}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Especialidad"
              value={filters.especialidad}
              onChange={(e) => setFilters({ ...filters, especialidad: e.target.value })}
              size="small"
              sx={{ minWidth: { xs: "100%", sm: 200 }, maxWidth: { xs: "100%", sm: 250 } }}
            >
              <MenuItem value="">Todas</MenuItem>
              {especialidades.map((esp) => (
                <MenuItem key={esp} value={esp}>
                  {esp}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          {/* Filtro de rango horario */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              select
              label="Desde hora"
              value={filters.horaDesde}
              onChange={(e) => setFilters({ ...filters, horaDesde: e.target.value })}
              size="small"
              sx={{ minWidth: { xs: "100%", sm: 200 }, maxWidth: { xs: "100%", sm: 250 } }}
            >
              <MenuItem value="">Todas</MenuItem>
              {Array.from({ length: 24 }, (_, i) => {
                const hora = i.toString().padStart(2, '0') + ':00';
                return (
                  <MenuItem key={hora} value={hora}>
                    {hora}
                  </MenuItem>
                );
              })}
            </TextField>
            <TextField
              select
              label="Hasta hora"
              value={filters.horaHasta}
              onChange={(e) => setFilters({ ...filters, horaHasta: e.target.value })}
              size="small"
              sx={{ minWidth: { xs: "100%", sm: 200 }, maxWidth: { xs: "100%", sm: 250 } }}
            >
              <MenuItem value="">Todas</MenuItem>
              {Array.from({ length: 24 }, (_, i) => {
                const hora = i.toString().padStart(2, '0') + ':00';
                return (
                  <MenuItem key={hora} value={hora}>
                    {hora}
                  </MenuItem>
                );
              })}
            </TextField>
          </Stack>
        </Stack>
      )}

      {/* Filtros para médicos */}
      {role === "MEDICO" && (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
          <TextField
            select
            label="Sede"
            value={filters.sedeId}
            onChange={(e) => setFilters({ ...filters, sedeId: e.target.value })}
            size="small"
            sx={{ minWidth: { xs: "100%", sm: 200 }, maxWidth: { xs: "100%", sm: 250 } }}
          >
            <MenuItem value="">Todas las sedes</MenuItem>
            {sedes.map((sede) => (
              <MenuItem key={sede._id} value={sede._id}>
                {sede.nombre}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Especialidad"
            value={filters.especialidad}
            onChange={(e) => setFilters({ ...filters, especialidad: e.target.value })}
            size="small"
            sx={{ minWidth: { xs: "100%", sm: 200 }, maxWidth: { xs: "100%", sm: 250 } }}
          >
            <MenuItem value="">Todas</MenuItem>
            {especialidades.map((esp) => (
              <MenuItem key={esp} value={esp}>
                {esp}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      )}

      <Stack direction={{ xs: "column", lg: "row" }} spacing={2} sx={{ mt: 3 }}>
        {/* Lista de turnos - Principal */}
        <Box sx={{ flex: 3, order: { xs: 2, lg: 1 } }} ref={listaRef}>
          <TurnosList
            fecha={selectedDate}
            turnos={turnosDelDiaEnriquecidos}
            role={role}
            onVerNotas={abrirVerNotas}
            onAgregarNota={(t) => setNotaDlg({ open: true, turno: t, texto: "" })}
            onReservar={reservar}
            onCancelar={cancelar}
          />
        </Box>

        {/* Calendario - Solo visible en desktop */}
        {!isMobile && (
          <Box sx={{ flex: 1, order: { xs: 1, lg: 2 } }}>
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
              selectedDate={selectedDate}
            />
          </Box>
        )}
      </Stack>

      {/* Drawer con calendario para mobile */}
      <Drawer
        anchor="right"
        open={isMobile && calendarDrawerOpen}
        onClose={() => setCalendarDrawerOpen(false)}
      >
        <Box sx={{ width: 340, p: 2 }}>
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
            selectedDate={selectedDate}
          />
        </Box>
      </Drawer>

      <VerNotasDialog
        open={verNotasDlg.open}
        notas={verNotasDlg.turno?.notas || []}
        onClose={() => setVerNotasDlg({ open: false, turno: null })}
      />

      <NotaDialog
        open={notaDlg.open}
        texto={notaDlg.texto}
        onChange={(v) => setNotaDlg((s) => ({ ...s, texto: v }))}
        onClose={() => setNotaDlg({ open: false, turno: null, texto: "" })}
        onSave={guardarNota}
      />
    </Container>
  );
}
