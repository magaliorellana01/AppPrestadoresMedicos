const mongoose = require("mongoose");

const SituacionTerapeuticaSchema = new mongoose.Schema({
  socio: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Socio', 
    required: true 
  },
  prestador: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Prestador', 
    required: true 
  },
  diagnostico: { 
    type: String, 
    required: true 
  },
  tratamiento: { 
    type: String, 
    required: true 
  },
  fechaInicio: { 
    type: Date, 
    default: Date.now 
  },
  fechaFin: Date,
  
  observaciones: String,
  novedadesMedicas: [
    {
      nota: { type: String, required: true },
      fechaCreacion: { type: Date, default: Date.now }
    }
  ],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const SituacionTerapeutica = mongoose.model("SituacionTerapeutica", SituacionTerapeuticaSchema);

module.exports = SituacionTerapeutica;