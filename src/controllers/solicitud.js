const Solicitud = require('../models/solicitud');
const Socio = require('../models/socio');
const Prestador = require('../models/prestador');

const calcularEdadNumerica = (fechaNacimiento) => {
  if (!fechaNacimiento) return null;
  const nacimiento = new Date(fechaNacimiento);
  if (Number.isNaN(nacimiento.getTime())) return null;
  const hoy = new Date();
  let años = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) años--;
  return años >= 0 ? años : null;
};

exports.getSolicitudById = async (req, res) => {
  try {
    let solicitud = await Solicitud.findById(req.params.id)
      .populate({
        path: 'afiliadoId',
        select: 'nombres apellidos dni genero rol fecha_nacimiento historia_clinica',
        populate: { path: 'historia_clinica', select: 'fecha_nacimiento genero' }
      })
      .populate({ path: 'historialEstados.usuario', select: 'nombres apellidos cuit especialidades' })
      .lean();

    if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });

    let afiliado = solicitud.afiliadoId || null;
    let historia = afiliado?.historia_clinica || null;

    if (!afiliado || (!historia && !afiliado?.fecha_nacimiento && !afiliado?.genero)) {
      const posibles = [solicitud.datos?.nroAfiliado, solicitud.nro, solicitud.afiliadoDni, solicitud.dni, solicitud.afiliadoNombre].filter(Boolean);
      for (const valor of posibles) {
        const buscado = String(valor).split('-')[0].trim();
        const socio = await Socio.findOne({ $or: [{ dni: buscado }, { nroAfiliado: buscado }] })
          .populate('historia_clinica', 'fecha_nacimiento genero')
          .lean();
        if (socio) {
          afiliado = socio;
          historia = socio.historia_clinica || null;
          break;
        }
      }
    }

    const edadNum = calcularEdadNumerica(historia?.fecha_nacimiento || afiliado?.fecha_nacimiento);
    const edadStr = edadNum !== null ? `${edadNum} años` : 'No disponible';
    const genero = historia?.genero || afiliado?.genero || 'No disponible';
    const tipoMiembro = afiliado?.rol || solicitud.datos?.tipoMiembro || 'No especificado';

    const afiliadoData = {
      afiliado: afiliado ? `${afiliado.nombres || ''} ${afiliado.apellidos || ''}`.trim() : (solicitud.afiliadoNombre || solicitud.datos?.afiliado) || 'No disponible',
      edad: solicitud.datos?.edad && solicitud.datos?.edad !== 'No disponible' ? solicitud.datos.edad : edadStr,
      genero: solicitud.datos?.genero && solicitud.datos?.genero !== 'No disponible' ? solicitud.datos.genero : genero,
      dni: afiliado?.dni || solicitud.datos?.nroAfiliado || solicitud.nro || 'No disponible',
      tipoMiembro
    };

    const ultimoCambio = solicitud.historialEstados?.[solicitud.historialEstados.length - 1];

    const historialFormateado = (solicitud.historialEstados || []).map(cambio => ({
      usuario: cambio.usuario ? `${cambio.usuario.nombres} ${cambio.usuario.apellidos}` : 'Sistema',
      cuil: cambio.usuario ? cambio.usuario.cuit : 'N/A',
      profesion: cambio.usuario?.especialidades?.join(', ') || null,
      fechaHora: new Date(cambio.fecha).toLocaleString('es-AR'),
      descripcion: cambio.motivo || `Cambio de estado a: ${cambio.estado}`,
      estado: cambio.estado,
    })).reverse();

    const detalleSolicitud = {
      titulo: `${solicitud.tipo} por Medicación Oncológica`,
      estado: solicitud.estado,
      estadoDisplay: solicitud.estado,
      datos: afiliadoData,
      detalles: {
        fecha: solicitud.fechaCreacion ? new Date(solicitud.fechaCreacion).toLocaleDateString('es-ES') : 'No disponible',
        monto: `${solicitud.monto?.toLocaleString() || '0'}`,
        proveedor: solicitud.proveedor || 'No especificado'
      },
      descripcion: {
        texto: solicitud.descripcion?.texto || 'Sin descripción disponible',
        adjuntos: solicitud.descripcion?.adjuntos || []
      },
      accion: {
        estadoActual: solicitud.estado,
        motivoActual: ultimoCambio?.motivo || '',
        usuarioCambio: ultimoCambio?.usuario ? `${ultimoCambio.usuario.nombre} ${ultimoCambio.usuario.apellido}` : null,
        fechaCambio: ultimoCambio?.fecha || null
      },
      _id: solicitud._id,
      tipo: solicitud.tipo,
      fechaCreacion: solicitud.fechaCreacion,
      afiliadoCompleto: afiliado || null,
      historial: historialFormateado,
      comentariosSocio: solicitud.comentariosSocio || [],
      comentariosPrestador: await Promise.all((solicitud.comentariosPrestador || []).map(async comentario => {
        const prestador = comentario.prestador ? await Prestador.findById(comentario.prestador).select('nombres apellidos especialidades').lean() : null;
        return {
          comentario: comentario.comentario,
          fecha: comentario.fecha,
          prestador: prestador ? `${prestador.nombres} ${prestador.apellidos} - ${prestador.especialidades.join(', ')}` : null
        }
      }))
    };

    res.json({ message: 'Detalle de solicitud obtenido correctamente', solicitud: detalleSolicitud });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.updateSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado: nuevoEstado, motivo } = req.body;
    const prestadorId = req.prestador._id;

    const estadosValidos = ['Recibido', 'En Análisis', 'Observado', 'Aprobado', 'Rechazado'];
    if (!estadosValidos.includes(nuevoEstado)) return res.status(400).json({ message: 'Estado no válido' });
    if ((nuevoEstado === 'Observado' || nuevoEstado === 'Rechazado') && !motivo) return res.status(400).json({ message: 'Motivo obligatorio' });

    const solicitud = await Solicitud.findById(id);
    if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });

    
    if (nuevoEstado === solicitud.estado) {
      return res.json({ message: 'No se detectaron cambios en el estado. No se guardó historial.', solicitud });
    }

    if (solicitud.prestadorAsignado && solicitud.prestadorAsignado.toString() !== prestadorId.toString()) {
      return res.status(403).json({ message: "Esta solicitud está siendo gestionada por otro prestador. No tienes permisos para modificarla." });
    }

    const transiciones = {
        'Recibido': ['En Análisis'],
        'En Análisis': ['Observado', 'Aprobado', 'Rechazado', 'Recibido'], 
        'Observado': ['Aprobado', 'Rechazado', 'En Análisis', 'Recibido'],
        'Aprobado': [],
        'Rechazado': [] 
    };

    if (!transiciones[solicitud.estado]?.includes(nuevoEstado)) {
        return res.status(400).json({ message: `Transición de estado no permitida: de '${solicitud.estado}' a '${nuevoEstado}'.` });
    }

    const estadoAnterior = solicitud.estado;
    let descripcionCambio = `Estado cambiado de '${estadoAnterior}' a '${nuevoEstado}'.`;
    if (motivo) {
        descripcionCambio += ` Motivo: ${motivo}`;
    }

    const nuevoHistorial = {
        estado: nuevoEstado,
        motivo: descripcionCambio,
        usuario: prestadorId,
        fecha: new Date()
    };

    solicitud.estado = nuevoEstado;
    if (nuevoEstado === 'Recibido') {
      solicitud.prestadorAsignado = undefined;
    } else if (!solicitud.prestadorAsignado) {
      solicitud.prestadorAsignado = prestadorId;
    }
    if (!Array.isArray(solicitud.historialEstados)) {
        solicitud.historialEstados = [];
    }
    solicitud.historialEstados.push(nuevoHistorial);
    await solicitud.save();

    const solicitudActualizada = await Solicitud.findById(id).populate('afiliadoId', 'nombres apellidos dni telefono email');
    res.json({ message: 'Estado actualizado correctamente', solicitud: solicitudActualizada });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error interno del servidor', error: err.message });
  }
};

