const mongoose = require("mongoose");

const prestadorSchema = new mongoose.Schema({
  nombres: {
    type: String,
    required: true,
  },
  apellidos: {
    type: String,
    required: true,
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
    required: true,
  },
  cuit: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\d{11}$/.test(v);
      },
      message: "El CUIT debe tener exactamente 11 dígitos",
    },
  },
  password: {
    type: String,
    required: false,
  },
  matricula: {
    type: String,
    required: true,
    unique: true,
  },
  es_centro_medico: {
    type: Boolean,
    default: false,
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