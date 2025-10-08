const SituacionTerapeutica = require('../models/situacionTerapeutica')
const Socio = require('../models/socio')

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
        { nombres: { $regex: input, $options: 'i' } },
        { apellidos: { $regex: input, $options: 'i' } }
        // expresion regular en Mongoose que indica búsqueda insensible a mayúsculas/minúsculas.
      ]
    };

    const socios = await Socio.find(socioFilter).select('_id');

    if (!socios.length) {
      return res.status(200).json([]);
    }

    const socioIds = socios.map(s => s._id);

    const situaciones = await SituacionTerapeutica.find({ socio: { $in: socioIds } })
      .populate('socio');

    return res.status(200).json(situaciones);
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
    const { id } = req.params;
    const { nota } = req.body;

    if (!nota) {
      return res.status(400).json({ message: 'La nota es obligatoria.' });
    }

    
    const situacion = await SituacionTerapeutica.findByIdAndUpdate(
      id,
      { $push: { novedadesMedicas: { nota } } },
      { new: true, runValidators: true }
    )
      .populate('socio')
      

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