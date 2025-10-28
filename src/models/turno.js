const { Schema, model, Types } = require("mongoose");

const NotaSchema = new Schema({
  ts: { type: Date, default: Date.now },
  texto: { type: String, required: true },
  autor_id: { type: Types.ObjectId, ref: "Prestador" },
}, { _id: false });

const TurnoSchema = new Schema({
  fecha: { type: Date, required: true },          // solo día
  hora:  { type: String, required: true },        // "HH:mm"
  duracion_min: { type: Number, default: 30 },
  estado: { type: String, enum: ["disponible","reservado","cancelado"], default: "disponible" },

  prestador_medico_id: { type: Types.ObjectId, ref: "Prestador", required: true },
  centro_id:          { type: Types.ObjectId, ref: "Prestador" }, // si aplica
  especialidad: { type: String },

  socio_id: { type: String },          // opcional
  paciente_nombre: { type: String },   // opcional

  notas: [NotaSchema],
}, { timestamps: true });

TurnoSchema.index({ prestador_medico_id: 1, fecha: 1 });
TurnoSchema.index({ centro_id: 1, fecha: 1 });
TurnoSchema.index({ fecha: 1, hora: 1 });

module.exports = model("Turno", TurnoSchema);
