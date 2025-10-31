const Turno = require("../models/turno");
const Socio = require("../models/socio");
const Nota = require("../models/nota");
const { startOfDay, endOfDay, addMinutes, parseISO, format } = require("date-fns");

const isCentro = (req) => !!req.prestador?.es_centro_medico;

exports.list = async (req, res) => {
  const { fecha, medicoId, centroId, estado, desde, hasta } = req.query;

  const q = {};
  if (fecha) {
    const d = parseISO(fecha);
    q.fecha = { $gte: startOfDay(d), $lte: endOfDay(d) };
  }
  if (desde || hasta) {
    q.fecha = {
      ...(q.fecha || {}),
      ...(desde ? { $gte: startOfDay(parseISO(desde)) } : {}),
      ...(hasta ? { $lte: endOfDay(parseISO(hasta)) } : {}),
    };
  }
  if (estado) q.estado = estado;
  if (medicoId) q.prestador_medico_id = medicoId;
  if (centroId) q.centro_id = centroId;

  // Autorización
  if (isCentro(req)) {
    q.$or = [{ centro_id: req.prestador._id }, { prestador_medico_id: req.prestador._id }];
  } else {
    q.prestador_medico_id = req.prestador._id;
  }

  const items = await Turno.find(q)
    .populate('notas.autor_id', 'nombres apellidos')
    .sort({ fecha: 1, hora: 1 });
  res.json(items);
};

exports.createSlots = async (req, res) => {
  const {
    medicoId, centroId, fecha, desdeHora, hastaHora,
    intervaloMin = 30, duracionMin = 30, especialidad
  } = req.body;

  // Permisos
  if (!isCentro(req) && String(req.prestador._id) !== String(medicoId)) {
    return res.status(403).json({ message: "No autorizado" });
  }

  const day = parseISO(fecha);
  const start = parseISO(`${fecha}T${desdeHora}:00.000Z`);
  const end   = parseISO(`${fecha}T${hastaHora}:00.000Z`);

  const docs = [];
  for (let t = start; t < end; t = addMinutes(t, intervaloMin)) {
    docs.push({
      fecha: day,
      hora: format(t, "HH:mm"),
      duracion_min: duracionMin,
      estado: "disponible",
      prestador_medico_id: medicoId,
      centro_id: centroId || (isCentro(req) ? req.prestador._id : undefined),
      especialidad,
    });
  }
  const created = await Turno.insertMany(docs);
  res.status(201).json({ count: created.length });
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const patch = {};
  const allowed = ["estado","socio_id","paciente_nombre","paciente_apellido","prestador_medico_id","centro_id"];
  for (const k of allowed) if (k in req.body) patch[k] = req.body[k];

  const t = await Turno.findById(id);
  if (!t) return res.status(404).json({ message: "No encontrado" });

  // Autorización
  if (isCentro(req)) {
    if (String(t.centro_id) !== String(req.prestador._id) &&
        String(t.prestador_medico_id) !== String(req.prestador._id)) {
      return res.status(403).json({ message: "No autorizado" });
    }
  } else {
    if (String(t.prestador_medico_id) !== String(req.prestador._id)) {
      return res.status(403).json({ message: "No autorizado" });
    }
  }

  Object.assign(t, patch);
  await t.save();
  res.json(t);
};

exports.addNota = async (req, res) => {
  const { id } = req.params;
  const { texto } = req.body;
  if (!texto) return res.status(400).json({ message: "texto requerido" });

  const t = await Turno.findById(id);
  if (!t) return res.status(404).json({ message: "No encontrado" });

  // mismo control de autorización que update
  if (isCentro(req)) {
    if (String(t.centro_id) !== String(req.prestador._id) &&
        String(t.prestador_medico_id) !== String(req.prestador._id)) {
      return res.status(403).json({ message: "No autorizado" });
    }
  } else if (String(t.prestador_medico_id) !== String(req.prestador._id)) {
    return res.status(403).json({ message: "No autorizado" });
  }

  // 1. Guardar nota en el array del turno
  t.notas.push({ texto, autor_id: req.prestador._id });
  await t.save();

  // 2. Dual storage: Guardar también en colección Nota para historia clínica
  if (t.socio_id) {
    try {
      const socio = await Socio.findOne({ dni: t.socio_id }).select('historia_clinica');

      if (socio && socio.historia_clinica) {
        await Nota.create({
          nota: texto,
          socio: socio._id,
          historia_clinica: socio.historia_clinica,
          prestador: req.prestador._id,
          fecha_creacion: new Date(),
        });
      }
    } catch (err) {
      console.error("Error al guardar nota en historia clínica:", err);
      // No bloqueamos la respuesta, la nota ya está en el turno
    }
  }

  res.status(201).json({ ok: true });
};
