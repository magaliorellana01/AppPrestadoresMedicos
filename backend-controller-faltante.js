// Archivo: src/controllers/filtroSolicitudes.js
const Solicitud = require('../models/filtroSolicitudes');

// Función existente
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

// FUNCIONES FALTANTES - Agregar estas funciones:

// Obtener una solicitud por ID
exports.getSolicitudById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Buscando solicitud con ID:', id);
        
        const solicitud = await Solicitud.findById(id).lean();
        
        if (!solicitud) {
            console.log('Solicitud no encontrada para ID:', id);
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }

        console.log('Solicitud encontrada:', solicitud);
        
        // Agregar datos mock para que coincida con lo que espera el frontend
        const solicitudConDatos = {
            ...solicitud,
            // Datos del afiliado (mock)
            afiliado: {
                nombre: solicitud.afiliadoNombre || 'Sin datos',
                edad: Math.floor(Math.random() * 50) + 20,
                genero: Math.random() > 0.5 ? 'Femenino' : 'Masculino',
                nroAfiliado: solicitud.nro || 'Sin datos',
                parentesco: Math.random() > 0.5 ? 'Titular' : 'Familiar'
            },
            // Detalles de la solicitud (mock)
            detalles: {
                fecha: new Date().toLocaleDateString('es-AR'),
                monto: `$${Math.floor(Math.random() * 100000) + 10000}`,
                proveedor: 'Farmacia Central'
            },
            // Descripción (mock)
            descripcion: 'Adjunta facturas de la medicación oncológica que mi médico me indicó.',
            // Archivos adjuntos (mock)
            archivos: [
                { nombre: 'Factura.pdf' },
                { nombre: 'Receta.pdf' }
            ]
        };

        res.json(solicitudConDatos);
    } catch (error) {
        console.error('Error en getSolicitudById:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Actualizar una solicitud
exports.updateSolicitud = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, motivo } = req.body;

        console.log('Actualizando solicitud:', id, 'Estado:', estado, 'Motivo:', motivo);

        // Validar que el estado sea válido
        const estadosValidos = ['Recibido', 'EnAnalisis', 'Observado', 'Aprobado', 'Rechazado'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({ message: 'Estado inválido' });
        }

        // Si es Observado o Rechazado, el motivo es obligatorio
        if ((estado === 'Observado' || estado === 'Rechazado') && !motivo) {
            return res.status(400).json({ message: 'El motivo es obligatorio para este estado' });
        }

        const solicitudActualizada = await Solicitud.findByIdAndUpdate(
            id,
            { 
                estado,
                motivo,
                fechaActualizacion: new Date()
            },
            { new: true }
        );

        if (!solicitudActualizada) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }

        console.log('Solicitud actualizada:', solicitudActualizada);
        res.json(solicitudActualizada);
    } catch (error) {
        console.error('Error en updateSolicitud:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};
