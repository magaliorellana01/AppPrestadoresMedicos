const SituacionTerapeutica = require('../models/situacionTerapeutica')
const Socio = require('../models/socio')
const mongoose = require("mongoose");

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
                { nombres: { $regex: input, $options: "i" } },
                { apellidos: { $regex: input, $options: "i" } }
            ]
        };

        
        const sociosEncontrados = await Socio.find(socioFilter).select('_id rol es_familiar_de');

        if (!sociosEncontrados.length) {
            return res.status(200).json([]);
        }

       
        const titularesIds = new Set();
        for (const socio of sociosEncontrados) {
            if (socio.rol === 'Titular') {
                titularesIds.add(socio._id.toString());
            } else if (socio.rol === 'Familiar' && socio.es_familiar_de) {
                titularesIds.add(socio.es_familiar_de.toString());
            }
        }

        if (titularesIds.size === 0) {
             return res.status(200).json([]); 
        }

      
        const familiasIds = Array.from(titularesIds).map(id => new mongoose.Types.ObjectId(id));

        const todosLosMiembrosDeLasFamilias = await Socio.find({
            $or: [
                { _id: { $in: familiasIds } }, // Los titulares
                { es_familiar_de: { $in: familiasIds } } // Los familiares de esos titulares
            ]
        }).select('_id');
        
        const todosLosSocioIds = todosLosMiembrosDeLasFamilias.map(s => s._id);

        
        const situacionesFinales = await SituacionTerapeutica.find({ socio: { $in: todosLosSocioIds } })
            .populate('socio')
            .populate('prestador'); 

        return res.status(200).json(situacionesFinales);

    } catch (error) {
        console.error('Error al obtener la situación terapéutica:', error);
        res.status(500).json({
            message: error.message || "Error interno del servidor"
        });
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
    // req.body.sede = req.sede._id; (DESCOMENTAR CUANDO SE AGREGUE LA VARIABLE SEDE DE MANERA GLOBAL)
    const situacion = await SituacionTerapeutica.create(req.body);
    res.status(201).json(situacion);
  } catch (error) {
    console.error('Error al crear la situación terapéutica:', error);
    res.status(500).json({ 
      message: error.message || "Error interno del servidor"
    });
  }
};