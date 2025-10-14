const Solicitud = require('../models/detalleSolicitud');
const Socio = require('../models/socio');
const Prestador = require('../models/prestador');

// ===== Helper: calcular edad =====
const calcularEdadNumerica = (fechaNacimiento) => {
  if (!fechaNacimiento) return null;
  const nacimiento = new Date(fechaNacimiento);
  if (isNaN(nacimiento.getTime())) return null;
  const hoy = new Date();
  let años = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) años--;
  return años >= 0 ? años : null;
};

// ===== Detalle de solicitud =====
exports.getSolicitudById = async (req, res) => {
  try {
    let solicitud = await Solicitud.findById(req.params.id)
      .populate({
        path: 'afiliadoId',
        select: 'nombres apellidos dni genero rol fecha_nacimiento historia_clinica',
        populate: { path: 'historia_clinica', select: 'fecha_nacimiento genero' }
      })
      .populate('usuarioCambioEstado', 'nombre apellido email')
      .lean();

    if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });

    let afiliado = solicitud.afiliadoId || null;
    let historia = afiliado?.historia_clinica || null;

    // Intentar buscar socio por nro/dni si no hay afiliado o historia
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
      nroAfiliado: afiliado?.dni || solicitud.datos?.nroAfiliado || solicitud.nro || 'No disponible',
      tipoMiembro
    };

    // Datos según tipo de solicitud
    const datosPorTipo = {
      Reintegro: { monto: 50000, proveedor: 'Farmacia Central', descripcion: 'Adjunto facturas de la medicación oncológica.', adjuntos: [{ nombreArchivo: 'Factura.pdf', tipoArchivo: 'Factura' }, { nombreArchivo: 'Receta.pdf', tipoArchivo: 'Receta' }] },
      Autorizacion: { monto: 0, proveedor: 'Hospital Central', descripcion: 'Solicitud de autorización para procedimiento médico especializado.', adjuntos: [{ nombreArchivo: 'Solicitud.pdf', tipoArchivo: 'Solicitud' }, { nombreArchivo: 'Presupuesto.pdf', tipoArchivo: 'Presupuesto' }] },
      Receta: { monto: 15000, proveedor: 'Farmacia del Pueblo', descripcion: 'Receta médica para medicamentos de tratamiento crónico.', adjuntos: [{ nombreArchivo: 'Receta.pdf', tipoArchivo: 'Receta' }] }
    };
    const datosEspecificos = datosPorTipo[solicitud.tipo] || {};

    const detalleSolicitud = {
      titulo: `${solicitud.tipo} por Medicación Oncológica`,
      estado: solicitud.estado,
      estadoDisplay: { EnAnalisis: 'En Análisis', Recibido: 'Recibido', Observado: 'Observado', Aprobado: 'Aprobado', Rechazado: 'Rechazado' }[solicitud.estado] || solicitud.estado,
      datos: afiliadoData,
      detalles: {
        fecha: solicitud.fechaCreacion ? new Date(solicitud.fechaCreacion).toLocaleDateString('es-ES') : 'No disponible',
        monto: `$${datosEspecificos.monto?.toLocaleString() || '0'}`,
        proveedor: datosEspecificos.proveedor || solicitud.detalles?.proveedor || 'No especificado'
      },
      descripcion: {
        texto: solicitud.descripcion?.texto || datosEspecificos.descripcion || 'Sin descripción disponible',
        adjuntos: solicitud.descripcion?.adjuntos || datosEspecificos.adjuntos || []
      },
      accion: {
        estadoActual: solicitud.estado,
        motivoActual: solicitud.motivoCambioEstado || solicitud.accion?.motivoActual || '',
        usuarioCambio: solicitud.usuarioCambioEstado ? `${solicitud.usuarioCambioEstado.nombre} ${solicitud.usuarioCambioEstado.apellido}` : null,
        fechaCambio: solicitud.fechaCambioEstado || solicitud.accion?.fechaCambio || null
      },
      _id: solicitud._id,
      tipo: solicitud.tipo,
      fechaCreacion: solicitud.fechaCreacion,
      afiliadoCompleto: afiliado || null
    };

    res.json({ message: 'Detalle de solicitud obtenido correctamente', solicitud: detalleSolicitud });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ===== Actualizar solicitud =====
exports.updateSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado: nuevoEstado, motivo, usuarioId } = req.body;

    const estadosValidos = ['Recibido', 'EnAnalisis', 'Observado', 'Aprobado', 'Rechazado'];
    if (!estadosValidos.includes(nuevoEstado)) return res.status(400).json({ message: 'Estado no válido' });
    if ((nuevoEstado === 'Observado' || nuevoEstado === 'Rechazado') && !motivo) return res.status(400).json({ message: 'Motivo obligatorio' });

    if (usuarioId && !(await Prestador.findById(usuarioId))) return res.status(404).json({ message: 'Usuario no encontrado' });

    const solicitud = await Solicitud.findById(id);
    if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });

    const transiciones = { Recibido: ['EnAnalisis'], EnAnalisis: ['Observado','Aprobado','Rechazado'], Observado: ['EnAnalisis','Aprobado','Rechazado'], Aprobado: [], Rechazado: [] };
    if (!transiciones[solicitud.estado].includes(nuevoEstado)) return res.status(400).json({ message: `No se puede cambiar de ${solicitud.estado} a ${nuevoEstado}` });

    solicitud.estado = nuevoEstado;
    solicitud.motivoCambioEstado = motivo;
    solicitud.usuarioCambioEstado = usuarioId || null;
    solicitud.fechaCambioEstado = new Date();
    await solicitud.save();

    const solicitudActualizada = await Solicitud.findById(id).populate('afiliadoId', 'nombres apellidos dni telefono email');
    res.json({ message: 'Estado actualizado correctamente', solicitud: solicitudActualizada });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error interno del servidor', error: err.message });
  }
};

// ===== Subir archivos a solicitud =====
exports.subirArchivos = async (req, res) => {
  try {
    const { id } = req.params;
    const solicitud = await Solicitud.findById(id);
    if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });

    // Inicializar adjuntos si no existen
    if (!solicitud.descripcion) solicitud.descripcion = {};
    if (!Array.isArray(solicitud.descripcion.adjuntos)) solicitud.descripcion.adjuntos = [];

    // Agregar archivos subidos
    if (req.files['factura']) {
      solicitud.descripcion.adjuntos.push({
        tipo: 'Factura',
        nombreArchivo: req.files['factura'][0].originalname,
        path: req.files['factura'][0].path
      });
    }
    if (req.files['receta']) {
      solicitud.descripcion.adjuntos.push({
        tipo: 'Receta',
        nombreArchivo: req.files['receta'][0].originalname,
        path: req.files['receta'][0].path
      });
    }

    await solicitud.save();
    res.status(200).json({ message: 'Archivos subidos correctamente', adjuntos: solicitud.descripcion.adjuntos });
  } catch (err) {
    console.error('Error al subir archivos:', err);
    res.status(500).json({ message: 'Error al subir archivos', error: err.message });
  }
};
