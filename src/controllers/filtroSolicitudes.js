const Solicitud = require('../models/filtroSolicitudes');
const Socio = require('../models/socio');
const Prestador = require('../models/prestador');

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

// ===== OBTENER DETALLE DE SOLICITUD POR ID =====
exports.getSolicitudById = async (req, res) => {
    try {
        const solicitud = await Solicitud.findById(req.params.id)
            .populate('afiliadoId', 'nombres apellidos dni telefono email direccion ciudad provincia fecha_nacimiento genero rol')
            .lean();

        if (!solicitud) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }

        // Calcular edad del afiliado si tiene fecha de nacimiento
        let edad = null;
        if (solicitud.afiliadoId && solicitud.afiliadoId.fecha_nacimiento) {
            const fechaNacimiento = new Date(solicitud.afiliadoId.fecha_nacimiento);
            const hoy = new Date();
            edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        }

        // Generar datos específicos según el tipo de solicitud
        let datosEspecificos = {};
        
        if (solicitud.tipo === 'Reintegro') {
            // Datos para reintegro oncológico
            datosEspecificos = {
                monto: 50000,
                proveedor: 'Farmacia Central',
                descripcion: 'Adjunto facturas de la medicación oncológica que mi médico me indicó.',
                adjuntos: [
                    { nombreArchivo: 'Factura.pdf', tipoArchivo: 'Factura' },
                    { nombreArchivo: 'Receta.pdf', tipoArchivo: 'Receta' }
                ]
            };
        } else if (solicitud.tipo === 'Autorizacion') {
            // Datos para autorización
            datosEspecificos = {
                monto: 0,
                proveedor: 'Hospital Central',
                descripcion: 'Solicitud de autorización para procedimiento médico especializado.',
                adjuntos: [
                    { nombreArchivo: 'Solicitud.pdf', tipoArchivo: 'Solicitud' },
                    { nombreArchivo: 'Presupuesto.pdf', tipoArchivo: 'Presupuesto' }
                ]
            };
        } else if (solicitud.tipo === 'Receta') {
            // Datos para receta
            datosEspecificos = {
                monto: 15000,
                proveedor: 'Farmacia del Pueblo',
                descripcion: 'Receta médica para medicamentos de tratamiento crónico.',
                adjuntos: [
                    { nombreArchivo: 'Receta.pdf', tipoArchivo: 'Receta' }
                ]
            };
        }

        // Estructura optimizada para el frontend
        const detalleSolicitud = {
            // Título y estado
            titulo: `${solicitud.tipo} por Medicación Oncológica`,
            estado: solicitud.estado,
            estadoDisplay: solicitud.estado === 'EnAnalisis' ? 'En Análisis' : 
                          solicitud.estado === 'Recibido' ? 'Recibido' :
                          solicitud.estado === 'Observado' ? 'Observado' :
                          solicitud.estado === 'Aprobado' ? 'Aprobado' :
                          solicitud.estado === 'Rechazado' ? 'Rechazado' : solicitud.estado,
            
            // Tarjeta Datos (afiliado)
            datos: {
                afiliado: solicitud.afiliadoId ? `${solicitud.afiliadoId.nombres} ${solicitud.afiliadoId.apellidos}` : solicitud.afiliadoNombre,
                edad: edad ? `${edad} años` : 'No disponible',
                genero: solicitud.afiliadoId?.genero || 'No disponible',
                nroAfiliado: solicitud.afiliadoId?.dni || solicitud.nro,
                tipoMiembro: solicitud.afiliadoId?.rol === 'Titular' ? 'Titular' : 'Familiar'
            },
            
            // Tarjeta Detalles
            detalles: {
                fecha: solicitud.fechaCreacion ? new Date(solicitud.fechaCreacion).toLocaleDateString('es-ES') : 'No disponible',
                monto: `$${datosEspecificos.monto?.toLocaleString() || '0'}`,
                proveedor: datosEspecificos.proveedor || 'No especificado'
            },
            
            // Tarjeta Descripción
            descripcion: {
                texto: datosEspecificos.descripcion || 'Sin descripción disponible',
                adjuntos: datosEspecificos.adjuntos || []
            },
            
            // Tarjeta Acción
            accion: {
                estadoActual: solicitud.estado,
                motivoActual: solicitud.motivoCambioEstado || '',
                usuarioCambio: solicitud.usuarioCambioEstado || null,
                fechaCambio: solicitud.fechaCambioEstado || null
            },
            
            // Datos originales para referencia
            _id: solicitud._id,
            tipo: solicitud.tipo,
            fechaCreacion: solicitud.fechaCreacion,
            afiliadoCompleto: solicitud.afiliadoId
        };

        res.json({ 
            message: 'Detalle de solicitud obtenido correctamente', 
            solicitud: detalleSolicitud 
        });
    } catch (error) {
        console.error('Error al obtener detalle de solicitud:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// ===== CAMBIAR ESTADO DE SOLICITUD =====
exports.cambiarEstadoSolicitud = async (req, res) => {
    try {
        const { id } = req.params;
        const { nuevoEstado, motivo, usuarioId } = req.body;

        // Validar que el nuevo estado sea válido
        const estadosValidos = ['Recibido', 'EnAnalisis', 'Observado', 'Aprobado', 'Rechazado'];
        if (!estadosValidos.includes(nuevoEstado)) {
            return res.status(400).json({ message: 'Estado no válido' });
        }

        // Validar que se proporcione motivo para estados que lo requieren
        if ((nuevoEstado === 'Observado' || nuevoEstado === 'Rechazado') && !motivo) {
            return res.status(400).json({ message: 'El motivo es obligatorio para este estado' });
        }

        // Verificar que el usuario existe (si se proporciona)
        if (usuarioId) {
            const usuario = await Prestador.findById(usuarioId);
            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
        }

        const solicitud = await Solicitud.findById(id);
        if (!solicitud) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }

        // Validar transiciones de estado según el workflow
        const transicionesValidas = {
            'Recibido': ['EnAnalisis'],
            'EnAnalisis': ['Observado', 'Aprobado', 'Rechazado'],
            'Observado': ['EnAnalisis', 'Aprobado', 'Rechazado'],
            'Aprobado': [], // Estado final
            'Rechazado': [] // Estado final
        };

        if (!transicionesValidas[solicitud.estado].includes(nuevoEstado)) {
            return res.status(400).json({ 
                message: `No se puede cambiar de ${solicitud.estado} a ${nuevoEstado}` 
            });
        }

        // Actualizar el estado
        const solicitudActualizada = await Solicitud.findByIdAndUpdate(
            id,
            { 
                estado: nuevoEstado,
                motivoCambioEstado: motivo,
                usuarioCambioEstado: usuarioId,
                fechaCambioEstado: new Date()
            },
            { new: true }
        ).populate('afiliadoId', 'nombres apellidos dni telefono email');

        res.json({
            message: 'Estado de la solicitud actualizado correctamente',
            solicitud: solicitudActualizada
        });
    } catch (error) {
        console.error('Error al cambiar estado de la solicitud:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor', 
            error: error.message 
        });
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