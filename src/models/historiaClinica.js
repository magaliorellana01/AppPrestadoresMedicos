const mongoose = require("mongoose");

const historiaClinicaSchema = new mongoose.Schema({
  patologia: {
    type: String,
    required: false,
  },
  socio: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Socio",
  },
  fecha_creacion: {
    type: Date,
    default: Date.now,
  },
  fecha_actualizacion: {
    type: Date,
    default: Date.now,
  },
});

const HistoriaClinicaModel = mongoose.model("HistoriaClinica", historiaClinicaSchema);

module.exports = HistoriaClinicaModel;
