const Solicitud = require('../models/solicitud');
const Prestador = require('../models/prestador');

/**
 * Obtener estadísticas del dashboard de solicitudes
 * Query params:
 * - fechaDesde: fecha inicio (ISO)
 * - fechaHasta: fecha fin (ISO)
 * - prestadorId: ID del prestador logeado
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const { fechaDesde, fechaHasta, prestadorId } = req.query;

    if (!fechaDesde || !fechaHasta || !prestadorId) {
      return res.status(400).json({
        message: 'Faltan parámetros requeridos: fechaDesde, fechaHasta, prestadorId'
      });
    }

    // Convertir fechas
    const desde = new Date(fechaDesde);
    const hasta = new Date(fechaHasta);
    hasta.setHours(23, 59, 59, 999); // Incluir todo el día final

    // Buscar el prestador para saber si es centro médico o médico individual
    const prestador = await Prestador.findById(prestadorId);
    if (!prestador) {
      return res.status(404).json({ message: 'Prestador no encontrado' });
    }

    // Construir filtro base  
    let filtroBase = {};

    filtroBase.prestadorAsignado = prestadorId;

    // === 1. PENDIENTES (sin filtro de fecha, solo estados no resueltos) ===
    const pendientes = await Solicitud.countDocuments({
      ...filtroBase,
      estado: { $nin: ['Aprobado', 'Rechazado'] }
    });

    // === 2. RESUELTAS en el rango de fechas ===
    const filtroResueltas = {
      ...filtroBase,
      // La condición principal es que una resolución ocurriera en el rango de fechas.
      // El estado final del ticket puede haber cambiado, pero para el dashboard,
      // cuenta como "resuelta" en ese período.
      'historialEstados': {
        $elemMatch: {
          estado: { $in: ['Aprobado', 'Rechazado'] },
          fecha: { $gte: desde, $lte: hasta }
        }
      }
    };

    const solicitudesResueltas = await Solicitud.find(filtroResueltas)
      .select('estado tipo fechaCreacion historialEstados monto')
      .lean();

    // Para consistencia, adjuntamos a cada solicitud su evento de resolución más reciente DENTRO DEL RANGO
    solicitudesResueltas.forEach(sol => {
      sol.resolucionEnRango = sol.historialEstados
        .filter(h =>
          (h.estado === 'Aprobado' || h.estado === 'Rechazado') &&
          new Date(h.fecha) >= desde &&
          new Date(h.fecha) <= hasta
        )
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0]; // Más reciente en el rango
    });

    const totalResueltas = solicitudesResueltas.length;

    // === 3. TIEMPO PROMEDIO DE RESOLUCIÓN ===
    let tiempoPromedioResolucion = 0;
    const TIEMPO_MAXIMO_RAZONABLE = 90; // días

    if (totalResueltas > 0) {
      let sumaDias = 0;
      let contadorConTiempo = 0;

      solicitudesResueltas.forEach(sol => {
        // Usamos el evento de resolución que ya identificamos
        const cambioResolucion = sol.resolucionEnRango;

        if (cambioResolucion && sol.fechaCreacion) {
          const fechaCreacion = new Date(sol.fechaCreacion);
          const fechaResolucion = new Date(cambioResolucion.fecha);
          const diferenciaDias = Math.round((fechaResolucion - fechaCreacion) / (1000 * 60 * 60 * 24));

          // Solo considerar tiempos razonables (0 a 90 días)
          if (diferenciaDias >= 0 && diferenciaDias <= TIEMPO_MAXIMO_RAZONABLE) {
            sumaDias += diferenciaDias;
            contadorConTiempo++;
          }
        }
      });

      tiempoPromedioResolucion = contadorConTiempo > 0
        ? Math.round(sumaDias / contadorConTiempo) // Redondeo a entero
        : 0;
    }

    // === 4. TASA DE APROBACIÓN ===
    // Usamos el estado del evento de resolución, no el estado final de la solicitud
    const aprobadas = solicitudesResueltas.filter(s => s.resolucionEnRango?.estado === 'Aprobado').length;
    const rechazadas = solicitudesResueltas.filter(s => s.resolucionEnRango?.estado === 'Rechazado').length;
    const totalCalculado = aprobadas + rechazadas;
    const tasaAprobacion = totalCalculado > 0
      ? Math.round((aprobadas / totalCalculado) * 100)
      : 0;

    // === 5. EVOLUCIÓN DIARIA ===
    const evolucionMap = new Map();

    solicitudesResueltas.forEach(sol => {
      // Usamos el evento de resolución que ya identificamos
      const cambioResolucion = sol.resolucionEnRango;

      if (cambioResolucion) {
        const fecha = new Date(cambioResolucion.fecha).toISOString().split('T')[0];

        if (!evolucionMap.has(fecha)) {
          evolucionMap.set(fecha, { fecha, aprobadas: 0, rechazadas: 0 });
        }

        const entry = evolucionMap.get(fecha);
        if (cambioResolucion.estado === 'Aprobado') {
          entry.aprobadas++;
        } else {
          entry.rechazadas++;
        }
      }
    });

    // Convertir a array y ordenar por fecha
    const evolucionDiaria = Array.from(evolucionMap.values())
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    // === 6. BREAKDOWN POR TIPO ===
    const porTipo = {
      Reintegro: { total: 0, aprobadas: 0, rechazadas: 0 },
      Autorizacion: { total: 0, aprobadas: 0, rechazadas: 0 },
      Receta: { total: 0, aprobadas: 0, rechazadas: 0 }
    };

    solicitudesResueltas.forEach(sol => {
      if (porTipo[sol.tipo] && sol.resolucionEnRango) {
        porTipo[sol.tipo].total++;
        if (sol.resolucionEnRango.estado === 'Aprobado') {
          porTipo[sol.tipo].aprobadas++;
        } else if (sol.resolucionEnRango.estado === 'Rechazado') {
          porTipo[sol.tipo].rechazadas++;
        }
      }
    });

    // === RESPUESTA FINAL ===
    res.json({
      resumen: {
        pendientes,
        resueltas: totalResueltas,
        tiempoPromedioResolucion,
        tasaAprobacion
      },
      evolucionDiaria,
      porTipo
    });

  } catch (err) {
    console.error('Error en getDashboardStats:', err);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: err.message
    });
  }
};
