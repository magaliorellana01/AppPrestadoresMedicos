export const ESPECIALIDADES = [
  "Clínica Médica",
  "Pediatría",
  "Cardiología",
  "Dermatología",
  "Traumatología",
  "Ginecología"
];

export const MEDICOS = [
  { id: "m1", nombre: "Dra. Sol Noguera",  especialidades: ["Clínica Médica", "Cardiología"] },
  { id: "m2", nombre: "Dr. Iván Rojas",    especialidades: ["Pediatría"] },
  { id: "m3", nombre: "Dra. Magalí O.",    especialidades: ["Dermatología", "Clínica Médica"] },
  { id: "m4", nombre: "Dr. Bruno Pérez",   especialidades: ["Traumatología"] },
  { id: "m5", nombre: "Dra. Ana Torres",   especialidades: ["Ginecología"] },
];

export const CENTROS = [
  { id: "c1", nombre: "Centro Norte", medicos: ["m1","m3","m5"] },
  { id: "c2", nombre: "Centro Sur",   medicos: ["m2","m4"] },
  { id: "c3", nombre: "Centro Oeste", medicos: ["m1","m2","m4"] }
];

// Helper para crear turnos
function T(id, fecha, hora, afiliado, especialidad, medicoId, centroId, notas = []) {
  return { id, fecha, hora, afiliado, especialidad, medicoId, centroId, notas };
}

// Afiliados demo
const A = [
  "1000001 · Noguera, Sol",
  "1000002 · Orellana, Magalí",
  "1000003 · Rojas, Iván",
  "1000004 · Pérez, Ana",
  "1000005 · Torres, Bruno",
  "1000006 · Díaz, Marta",
  "1000007 · López, Juan",
  "1000008 · García, Carla",
  "1000009 · Silva, Pedro",
  "1000010 · Fernández, Luis",
];

// Notas demo
const N1 = [{ ts: "2025-10-05T10:35:00Z", texto: "Consulta inicial. PA 120/80." }];
const N2 = [{ ts: "2025-10-10T13:05:00Z", texto: "Indica estudio de laboratorio." }];

// Fechas objetivo para probar calendario
// Mes actual: octubre 2025
// También agrego algunos de noviembre 2025
export const TURNOS = [
  // ---------- Semana 1 (oct-2025) ----------
  T("t1",  "2025-10-01", "09:00", A[0], "Clínica Médica", "m1", "c1"),
  T("t2",  "2025-10-01", "09:30", A[1], "Dermatología",   "m3", "c1"),
  T("t3",  "2025-10-01", "10:00", A[2], "Pediatría",      "m2", "c2"),
  T("t4",  "2025-10-01", "10:30", A[3], "Traumatología",  "m4", "c2"),
  T("t5",  "2025-10-01", "11:00", A[4], "Ginecología",    "m5", "c1"),

  T("t6",  "2025-10-02", "09:00", A[5], "Clínica Médica", "m1", "c3"),
  T("t7",  "2025-10-02", "09:30", A[6], "Dermatología",   "m3", "c1"),
  T("t8",  "2025-10-02", "10:00", A[7], "Pediatría",      "m2", "c2"),
  T("t9",  "2025-10-02", "10:30", A[8], "Traumatología",  "m4", "c2"),
  T("t10", "2025-10-02", "11:00", A[9], "Ginecología",    "m5", "c1"),

  T("t11", "2025-10-03", "09:00", A[1], "Clínica Médica", "m1", "c1", N1),
  T("t12", "2025-10-03", "09:20", A[2], "Clínica Médica", "m1", "c1"),
  T("t13", "2025-10-03", "09:40", A[3], "Clínica Médica", "m1", "c1"),
  T("t14", "2025-10-03", "10:00", A[4], "Clínica Médica", "m1", "c1"),
  T("t15", "2025-10-03", "10:20", A[5], "Clínica Médica", "m1", "c1"),
  T("t16", "2025-10-03", "10:40", A[6], "Clínica Médica", "m1", "c1"),
  T("t17", "2025-10-03", "11:00", A[7], "Clínica Médica", "m1", "c1"),
  T("t18", "2025-10-03", "11:20", A[8], "Clínica Médica", "m1", "c1"),
  T("t19", "2025-10-03", "11:40", A[9], "Clínica Médica", "m1", "c1"),
  // este día tiene >3 turnos para probar "+N más" en el calendario

  // ---------- Semana 2 ----------
  T("t20", "2025-10-06", "09:00", A[0], "Pediatría",      "m2", "c2"),
  T("t21", "2025-10-06", "09:45", A[1], "Pediatría",      "m2", "c2"),
  T("t22", "2025-10-06", "10:30", A[2], "Pediatría",      "m2", "c2"),

  T("t23", "2025-10-07", "09:00", A[3], "Dermatología",   "m3", "c1"),
  T("t24", "2025-10-07", "09:30", A[4], "Dermatología",   "m3", "c1"),
  T("t25", "2025-10-07", "10:00", A[5], "Dermatología",   "m3", "c1"),

  T("t26", "2025-10-08", "09:00", A[6], "Traumatología",  "m4", "c2"),
  T("t27", "2025-10-08", "10:00", A[7], "Traumatología",  "m4", "c2"),
  T("t28", "2025-10-08", "11:00", A[8], "Traumatología",  "m4", "c2"),

  T("t29", "2025-10-09", "09:00", A[9], "Ginecología",    "m5", "c1"),
  T("t30", "2025-10-09", "09:30", A[0], "Ginecología",    "m5", "c1"),
  T("t31", "2025-10-09", "10:00", A[1], "Ginecología",    "m5", "c1"),

  T("t32", "2025-10-10", "09:00", A[2], "Cardiología",    "m1", "c3", N2),
  T("t33", "2025-10-10", "09:30", A[3], "Cardiología",    "m1", "c3"),
  T("t34", "2025-10-10", "10:00", A[4], "Cardiología",    "m1", "c3"),

  // ---------- Semana 3 ----------
  T("t35", "2025-10-13", "09:00", A[5], "Clínica Médica", "m1", "c1"),
  T("t36", "2025-10-13", "09:30", A[6], "Clínica Médica", "m1", "c1"),
  T("t37", "2025-10-13", "10:00", A[7], "Clínica Médica", "m1", "c1"),

  T("t38", "2025-10-14", "09:00", A[8], "Pediatría",      "m2", "c2"),
  T("t39", "2025-10-14", "09:45", A[9], "Pediatría",      "m2", "c2"),

  T("t40", "2025-10-15", "10:00", A[0], "Dermatología",   "m3", "c1"),
  T("t41", "2025-10-15", "10:30", A[1], "Dermatología",   "m3", "c1"),

  T("t42", "2025-10-16", "09:00", A[2], "Traumatología",  "m4", "c2"),
  T("t43", "2025-10-16", "10:00", A[3], "Traumatología",  "m4", "c2"),

  T("t44", "2025-10-17", "09:00", A[4], "Ginecología",    "m5", "c1"),
  T("t45", "2025-10-17", "09:30", A[5], "Ginecología",    "m5", "c1"),

  // ---------- Semana 4 ----------
  T("t46", "2025-10-20", "09:00", A[6], "Cardiología",    "m1", "c3"),
  T("t47", "2025-10-20", "09:30", A[7], "Cardiología",    "m1", "c3"),
  T("t48", "2025-10-20", "10:00", A[8], "Dermatología",   "m3", "c1"),
  T("t49", "2025-10-20", "10:30", A[9], "Dermatología",   "m3", "c1"),

  T("t50", "2025-10-21", "15:00", A[2], "Pediatría",      "m2", "c2"),
  T("t51", "2025-10-21", "15:30", A[3], "Pediatría",      "m2", "c2"),

  T("t52", "2025-10-22", "11:15", A[4], "Clínica Médica", "m3", "c1"),
  T("t53", "2025-10-22", "11:45", A[5], "Clínica Médica", "m3", "c1"),

  T("t54", "2025-10-23", "09:00", A[6], "Traumatología",  "m4", "c2"),
  T("t55", "2025-10-23", "10:00", A[7], "Traumatología",  "m4", "c2"),

  T("t56", "2025-10-24", "09:00", A[8], "Ginecología",    "m5", "c1"),
  T("t57", "2025-10-24", "09:30", A[9], "Ginecología",    "m5", "c1"),

  // ---------- Resto de octubre ----------
  T("t58", "2025-10-27", "09:00", A[0], "Clínica Médica", "m1", "c1"),
  T("t59", "2025-10-27", "09:30", A[1], "Clínica Médica", "m1", "c1"),
  T("t60", "2025-10-28", "10:00", A[2], "Pediatría",      "m2", "c2"),
  T("t61", "2025-10-29", "10:00", A[3], "Dermatología",   "m3", "c1"),
  T("t62", "2025-10-30", "09:00", A[4], "Traumatología",  "m4", "c2"),
  T("t63", "2025-10-31", "09:00", A[5], "Ginecología",    "m5", "c1"),

  // ---------- Noviembre 2025 (para probar cambio de mes) ----------
  T("t64", "2025-11-03", "09:00", A[6], "Cardiología",    "m1", "c3"),
  T("t65", "2025-11-03", "09:30", A[7], "Cardiología",    "m1", "c3"),
  T("t66", "2025-11-04", "10:00", A[8], "Pediatría",      "m2", "c2"),
  T("t67", "2025-11-05", "10:00", A[9], "Dermatología",   "m3", "c1"),
  T("t68", "2025-11-06", "09:00", A[0], "Traumatología",  "m4", "c2"),
  T("t69", "2025-11-07", "09:00", A[1], "Ginecología",    "m5", "c1"),
];
