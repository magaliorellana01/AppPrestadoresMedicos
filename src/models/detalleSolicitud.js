const mongoose = require('mongoose');

const DetalleSolicitudSchema = new mongoose.Schema({
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
        enum: ['Aprobado', 'Rechazado', 'Observado', 'En Análisis', 'Recibido'],
    },
    motivo: {
        type: String,
        required: false
    },
    monto: {
        type: Number
    },
    proveedor: {
        type: String
    },
    descripcion: {
        texto: { type: String },
        adjuntos: [{
            nombreArchivo: { type: String },
            tipoArchivo: { type: String },
            path: { type: String }
        }]
    },
    historialEstados: [{
        estado: { type: String },
        motivo: { type: String },
        usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Prestador' },
        fecha: { type: Date, default: Date.now }
    }],

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

const DetalleSolicitud = mongoose.model('DetalleSolicitud', DetalleSolicitudSchema, 'solicituds');
module.exports = DetalleSolicitud;
