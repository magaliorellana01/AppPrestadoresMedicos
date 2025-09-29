const mongoose = require("mongoose");

const prestadorSchema = new mongoose.Schema({
  nombres: {
    type: String,
    required: false,
  },
  apellidos: {
    type: String,
    required: false,
  },
  telefono: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  direccion: {
    type: String,
    required: false,
  },
  ciudad: {
    type: String,
    required: false,
  },
  provincia: {
    type: String,
    required: false,
  },
  especialidad: {
    type: String,
    required: false,
  },
  cuit: {
    type: String,
    required: false,
  },
  matricula: {
    type: String,
    required: false,
  },
  es_centro_medico: {
    type: Boolean,
    required: false,
  },
  estado: {
    type: String,
    enum: ["Activo", "Inactivo"],
    default: "Activo",
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

const PrestadorModel = mongoose.model("Prestador", prestadorSchema);

module.exports = PrestadorModel;
