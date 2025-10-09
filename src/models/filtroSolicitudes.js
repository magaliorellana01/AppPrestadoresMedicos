const mongoose = require('mongoose');
const SolicitudEsquema = new mongoose.Schema({
    estado: {
        type: String,
        required: true,
        enum: ['Aprobado', 'Rechazado', 'Observado', 'EnAnálisis', 'Recibido'],
    },

    tipo: {
        type: String,
        required: true,
        enum: ['Reintegro', 'Autorizacion', 'Receta'],
    },

    socio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Socio',
        required: true,
    },

    fechaCreacion: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true
});

const Solicitud = mongoose.model('Solicitud', SolicitudEsquema);
module.exports = Solicitud;