const Solicitud = require('../models/filtroSolciitudes');

exports.getSolicitudes = async (req, res) => {
    try {
        const { page = 0, size = 10, estado, tipo } = req.query;
        const filters = {};

        if (estado) {
            filters.estado = estado;
        }

        if (tipo) {
            filters.tipo = tipo;
        }

        const skip = parseInt(page) * parseInt(size);
        const limit = parseInt(size);
        
        const solicitudes = await Solicitud.find(filters).skip(skip).limit(limit);
        const total = await Solicitud.countDocuments(filters);

        res.status(200).json({
            content: solicitudes,
            total: total,
            totalPages: Math.ceil(total / limit),
        });

    } catch (error) {
        console.error("Error al obtener las solicitudes: ", error);
        res.status(500).json({
            message: "Error del servidor.",
            details: error.message
        });
    }
} 