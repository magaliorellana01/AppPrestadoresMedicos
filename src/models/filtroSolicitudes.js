const mongoose = require('mongoose');

const SolicitudSchema = new mongoose.Schema({
    nro: {
        type: String
    },

    afiliadoNombre: {
        type: String
    },

    afiliadoId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Socio'
    },

    tipo: {
        type: String,
        required: true,
        enum: ['Reintegro', 'Autorizacion', 'Receta'],
    },

    estado: {
        type: String,
        required: true,
        enum: ['Aprobado', 'Rechazado', 'Observado', 'EnAnalisis', 'Recibido'],
    },
    motivo: {
        type: String,
        required: false
    },
    // Campos para el workflow
    motivoCambioEstado: {
        type: String
    },

    usuarioCambioEstado: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Prestador'
    },

    fechaCambioEstado: {
        type: Date
    },

    fechaCreacion: {
        type: Date,
        default: Date.now,
    },
    fechaActualizacion: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true
});

const Solicitud = mongoose.model('Solicitud', SolicitudSchema);
module.exports = Solicitud;