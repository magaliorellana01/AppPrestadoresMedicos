const SituacionTerapeutica = require('../models/situacionTerapeutica')
const Socio = require('../models/socio')
const Prestador = require('../models/prestador')

exports.getSituacionesTerapeuticasByMultipleEntries = async (req, res) => {
  try {
    const { input } = req.query;

    if (!input || String(input).trim() === '') {
      return res.status(400).json({ message: "El query param 'input' es obligatorio." });
    }

    const socioFilter = {
      $or: [
        { dni: input },
        { telefono: input },
        { apellidos: { $regex: input, $options: 'i' } }
      ]
    };

    const socios = await Socio.find(socioFilter).select('_id rol');

    if (!socios.length) {
      return res.status(200).json([]);
    }

    const socioIds = socios.map(s => s._id);

    const situaciones = await SituacionTerapeutica.find({ socio: { $in: socioIds } })
      .populate('socio')
      .populate('prestador');

    const situacionesFinales = [];

    // Si el socio es titular, se agregan las situaciones terapéuticas del titular y las del familiar
    // Si el socio es familiar, NO se agregan las situaciones terapéuticas del titular
    for (const socio of socios) {
      if (socio.rol === 'Titular') {
        situacionesFinales.push(...situaciones.filter(s => s.socio._id.toString() === socio._id.toString()));
        const familiares = await Socio.find({ es_familiar_de: socio._id }).select('_id');
        const familiaresIds = familiares.map(f => f._id);
        const situacionesFamiliares = await SituacionTerapeutica.find({ socio: { $in: familiaresIds } })
          .populate('socio')
          .populate('prestador');
        situacionesFinales.push(...situacionesFamiliares);
      } else {
        situacionesFinales.push(...situaciones.filter(s => s.socio._id.toString() === socio._id.toString()));
      }
    }
    return res.status(200).json(situacionesFinales);
  } catch (error) {
    console.error('Error al obtener la situación terapéutica:', error);
    res.status(500).json({ 
            message: error.message || "Error interno del servidor"
    })
  }
};

 exports.getSituacionTerapeuticaById = async (req, res) => {
  try {
    const { id } = req.params;

    const situacion = await SituacionTerapeutica.findById(id)
      .populate('socio')

    if (!situacion) {
      return res.status(404).json({ message: 'Situación terapéutica no encontrada' });
    }

    res.status(200).json(situacion);
  } catch (error) {
    console.error('Error al obtener la situación terapéutica:', error);
    res.status(500).json({ 
            message: error.message || "Error interno del servidor"
    })
  }
};

exports.updateSituacionTerapeutica = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No se recibieron datos para actualizar.' });
    }

    const situacionActualizada = await SituacionTerapeutica.findByIdAndUpdate(
      id,
      { ...updates },
      { new: true, runValidators: true }
    )
      .populate('socio')

    if (!situacionActualizada) {
      return res.status(404).json({ message: 'Situación terapéutica no encontrada.' });
    }

    res.status(200).json(situacionActualizada);
  } catch (error) {
    console.error('Error al actualizar la situación terapéutica:', error);
    res.status(500).json({ 
            message: error.message || "Error interno del servidor"
        });
  }
};

exports.agregarNovedad = async (req, res) => {
  try {
    const { situacionTerapeuticaId } = req.params;
    const { nota } = req.body;
    
    if (req.prestador.es_centro_medico) {
      return res.status(403).json({ message: 'Un centro médico no puede agregar una novedad en situaciones terapeuticas.' });
    }

    if (!nota) {
      return res.status(400).json({ message: 'La nota es obligatoria.' });
    }

    const prestadorData = {
      _id: req.prestador._id,
      nombres: req.prestador.nombres,
      apellidos: req.prestador.apellidos,
      especialidad: req.prestador.especialidades.join(', '),
      cuit: req.prestador.cuit,
      matricula: req.prestador.matricula,
      es_centro_medico: req.prestador.es_centro_medico,
    };

    const situacion = await SituacionTerapeutica.findByIdAndUpdate( 
      situacionTerapeuticaId,
      { $push: { novedadesMedicas: { nota, prestador: prestadorData } } }, 
      { new: true, runValidators: true }
    )
      .populate('socio')
      .populate('prestador');

    if (!situacion) {
      return res.status(404).json({ message: 'Situación terapéutica no encontrada.' });
    }

    res.status(200).json(situacion);
  } catch (error) {
    console.error('Error al agregar novedad:', error);
    res.status(500).json({ 
            message: error.message || "Error interno del servidor"
        })};
};

exports.createSituacionTerapeutica = async (req, res) => {
  try {
    const socio = await Socio.findOne({ dni: req.body.dniAfiliado });
    if (!socio) {
      return res.status(404).json({ message: 'Socio no encontrado' });
    }
    req.body.socio = socio._id;
    req.body.prestador = req.prestador._id;
    const situacion = await SituacionTerapeutica.create(req.body);
    res.status(201).json(situacion);
  } catch (error) {
    console.error('Error al crear la situación terapéutica:', error);
    res.status(500).json({ 
      message: error.message || "Error interno del servidor"
    });
  }
};