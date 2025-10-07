const mongoose = require("mongoose");

const NovedadSchema = new Schema({
  fecha: {
    type: Date,
    required: true,
    default: Date.now,
  },
  descripcion: {
    type: String,
    required: true,
    trim: true,
  },
});


const situacionTerapeuticaSchema = new Schema(
  {
    socio: {
      type: Schema.Types.ObjectId,
      ref: "Socio",
      required: true,
    },
    diagnostico: {
      type: String,
      required: true,
      trim: true,
      maxlength: 400,
    },
    fechaAlta: {
      type: Date,
      required: true,
      default: Date.now,
    },
    fechaFinalizacion: {
      type: Date,
    },
    novedades: {
      type: [NovedadSchema],
      default: [],
    },
    estado: {
      type: String,
      enum: ["activa", "inactiva"],
      default: "activa",
    },
  },
  {
    timestamps: true,
  }
);

export default model("situacionTerapeutica", situacionTerapeuticaSchema);