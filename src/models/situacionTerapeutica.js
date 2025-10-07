import mongoose from 'mongoose';

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
  estado: {
    type: String,
    enum: ['pendiente', 'autorizada', 'rechazada', 'en curso', 'finalizada'],
    default: 'pendiente'
  },
  sesionesAutorizadas: { 
    type: Number, 
    default: 0 
  },
  sesionesRealizadas: { 
    type: Number, 
    default: 0 
  },
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

export default mongoose.model('SituacionTerapeutica', SituacionTerapeuticaSchema);