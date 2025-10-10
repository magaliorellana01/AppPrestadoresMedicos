const Solicitud = require('../models/filtroSolicitudes');

exports.getSolicitudes = async (req, res) => {
    try {
        const page = Math.max(0, parseInt(req.query.page, 10) || 0);
        const size = Math.max(1, parseInt(req.query.size, 10) || 10);
        const { estado, tipo, q } = req.query;

        const filter = {};
        if (estado) filter.estado = estado;
        if (tipo) filter.tipo = tipo;
        if (q) {
            filter.$or = [
                { nro: { $regex: q, $options: 'i' } },
                { afiliadoNombre: { $regex: q, $options: 'i' } },
            ];
        }

        const total = await Solicitud.countDocuments(filter);
        const content = await Solicitud.find(filter)
            .skip(page * size)
            .limit(size)
            .sort({ fechaCreacion: -1 })
            .lean();

        return res.json({ content, total, page, size });
    }
    catch (error) {
        console.error('Error en getSolicitudes:', error);
        return res.status(500).json({ message: 'Error del servidor' });
    }
};