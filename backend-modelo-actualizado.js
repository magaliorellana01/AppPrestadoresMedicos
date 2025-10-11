// Archivo: src/models/filtroSolicitudes.js
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

    // CAMPOS FALTANTES - Agregar estos campos:
    motivo: {
        type: String,
        required: false
    },

    fechaActualizacion: {
        type: Date,
        default: Date.now
    },

    fechaCreacion: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true
});

const Solicitud = mongoose.model('Solicitud', SolicitudSchema);
module.exports = Solicitud;
