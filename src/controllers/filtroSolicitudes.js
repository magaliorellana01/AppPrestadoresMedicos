const Solicitud = require('../models/solicitud.js');
const Prestador = require('../models/prestador.js');
const Sede = require('../models/sede.js');

exports.getSolicitudes = async (req, res) => {
    try {
        const page = Math.max(0, parseInt(req.query.page, 10) || 0);
        const size = Math.max(1, parseInt(req.query.size, 10) || 10);
        const { estado, tipo } = req.query;
        const prestador = req.prestador;

        
        const baseClauses = [];

        baseClauses.push({
            tipo: 'Receta',
            estado: 'Recibido',
            prestadorAsignado: { $exists: false}
        })

       
        let scopedClause;
        if (prestador.es_centro_medico) {
            
            const sedes = await Sede.find({ centro_medico_id: prestador._id }).select('_id');
            const sedeIds = sedes.map(s => s._id);
            const medicos = await Prestador.find({ es_centro_medico: false, sedes: { $in: sedeIds } }).select('_id');
            const personalIds = medicos.map(m => m._id);
            personalIds.push(prestador._id);  

            scopedClause = {
                prestadorAsignado: { $in: personalIds }
            };
        } else {
            scopedClause = {
                prestadorAsignado: prestador._id
            };
        }
        baseClauses.push(scopedClause);
        
        const securityFilter = { $or: baseClauses };

        
        const finalFilterClauses = [securityFilter];
        if (estado && estado !== 'Todas') {
            finalFilterClauses.push({ estado: estado });
        }
        if (tipo) {
            finalFilterClauses.push({ tipo: tipo });
        }

        const filter = { $and: finalFilterClauses };

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
            { $limit: size },
            {
                $project: {
                    _id: 1,
                    nro: 1,
                    afiliadoNombre: 1,
                    tipo: 1,
                    estado: 1,
                    fechaCreacion: 1,
                }
            }
        ];

        const content = await Solicitud.aggregate(pipeline);
        return res.json({ content, total, page, size });
    }
    catch (error) {
        console.error('Error en getSolicitudes:', error);
        return res.status(500).json({ message: 'Error del servidor' });
    }
};
