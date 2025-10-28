/**
 * Seed de turnos mensuales para todos los médicos activos.
 * Genera entre 20 y 30 turnos por médico, distribuidos en el mes actual.
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Turno = require("../models/turno");
const Prestador = require("../models/prestador");

function genSlots({ fechaISO, medicoId, especialidad, cadaMin = 30, durMin = 30 }) {
  const out = [];
  const base = new Date(fechaISO);
  base.setHours(0, 0, 0, 0);

  const start = new Date(base); start.setHours(9, 0, 0, 0);  // 09:00
  const end = new Date(base);   end.setHours(13, 0, 0, 0);   // 13:00

  for (let t = new Date(start); t < end; t = new Date(t.getTime() + cadaMin * 60000)) {
    out.push({
      fecha: base,
      hora: t.toISOString().slice(11, 16),
      duracion_min: durMin,
      estado: "disponible",
      prestador_medico_id: medicoId,
      especialidad,
    });
  }
  return out;
}

// Selecciona días laborables aleatorios del mes
function sampleDays(year, month, count, diasMes) {
  const set = new Set();
  while (set.size < count) {
    const d = Math.floor(Math.random() * diasMes) + 1;
    const dow = new Date(year, month, d).getDay(); // 0=Dom,6=Sáb
    if (dow !== 0 && dow !== 6) set.add(d);
  }
  return [...set];
}

(async () => {
  if (!process.env.MONGODB_URI) throw new Error("Falta MONGODB_URI en .env");

  // --- Conexión segura ---
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.MONGODB_DB || "test", // cambia si tu DB es otra
  });

  console.log("✅ Conectado a MongoDB");

  // --- Limpieza y corrección de índice ---
  try {
    const idx = await Turno.collection.indexExists("fecha_1_hora_1_prestadorId_1");
    if (idx) {
      console.log("🧹 Eliminando índice obsoleto 'fecha_1_hora_1_prestadorId_1'");
      await Turno.collection.dropIndex("fecha_1_hora_1_prestadorId_1");
    }
  } catch (e) {
    // ignorar si no existe
  }

  await Turno.collection.createIndex(
    { prestador_medico_id: 1, fecha: 1, hora: 1 },
    { unique: true }
  );

  // --- Buscar médicos activos ---
  const medicos = await Prestador.find({ es_centro_medico: false, estado: /Activo/i }).lean();
  if (!medicos.length) {
    console.log("⚠️ No hay médicos activos en la base.");
    await mongoose.connection.close();
    return;
  }

  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = hoy.getMonth(); // mes actual
  const diasMes = new Date(year, month + 1, 0).getDate();

  let totalTurnos = 0;

  for (const m of medicos) {
    console.log(`👨‍⚕️ Generando turnos para ${m.nombres} ${m.apellidos} (${m.especialidad || "General"})`);

    // limpiar turnos previos de este mes
    const inicioMes = new Date(year, month, 1);
    const finMes = new Date(year, month + 1, 0, 23, 59, 59, 999);
    await Turno.deleteMany({
      prestador_medico_id: m._id,
      fecha: { $gte: inicioMes, $lte: finMes },
    });

    // seleccionar 4-5 días aleatorios de lunes a viernes
    const dias = sampleDays(year, month, 5, diasMes);

    for (const d of dias) {
      const fecha = new Date(year, month, d).toISOString().slice(0, 10);
      const docs = genSlots({
        fechaISO: fecha,
        medicoId: m._id,
        especialidad: m.especialidad || "General",
      });
      await Turno.insertMany(docs);
      totalTurnos += docs.length;
      console.log(`   • ${fecha}: ${docs.length} turnos`);
    }
  }

  console.log(`\n🎯 Total de turnos creados: ${totalTurnos}`);
  await mongoose.connection.close();
  console.log("🔌 Conexión cerrada");
  process.exit(0);
})().catch(async (err) => {
  console.error("❌ Error:", err);
  try { await mongoose.connection.close(); } catch {}
  process.exit(1);
});
