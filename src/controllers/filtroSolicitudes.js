const Solicitud = require('../models/solicitud.js');

exports.getSolicitudes = async (req, res) => {
    try {
        const page = Math.max(0, parseInt(req.query.page, 10) || 0);
        const size = Math.max(1, parseInt(req.query.size, 10) || 10);
        const { estado, tipo } = req.query;
        const prestadorId = req.prestador._id;

        const filter = {};

        if (estado === 'Todas') {
            filter.$or = [
                { estado: 'Recibido', prestadorAsignado: { $exists: false } },
                { prestadorAsignado: prestadorId }
            ];
        } else if (estado === 'Recibido') {
            filter.estado = 'Recibido';
            filter.prestadorAsignado = { $exists: false };
        } else if (estado) {
            filter.estado = estado;
            filter.prestadorAsignado = prestadorId;
        }

        if (tipo) {
            filter.tipo = tipo;
        }

        const total = await Solicitud.countDocuments(filter);
        const pipeline = [
            { $match: filter },
            {
                $addFields: {
                    estadoOrder: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$estado", "En Análisis"] }, then: 1 },
                                { case: { $eq: ["$estado", "Observado"] }, then: 2 },
                            ],
                            default: 3
                        }
                    }
                }
            },
            { $sort: { estadoOrder: 1, fechaCreacion: -1 } },
            { $skip: page * size },
            { $limit: size }
        ];

        const content = await Solicitud.aggregate(pipeline);
        return res.json({ content, total, page, size });
    }
    catch (error) {
        console.error('Error en getSolicitudes:', error);
        return res.status(500).json({ message: 'Error del servidor' });
    }
};
