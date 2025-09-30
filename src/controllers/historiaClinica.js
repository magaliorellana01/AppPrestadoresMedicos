const HistoriaClinica = require("../models/historiaClinica");
const Nota = require("../models/nota");

exports.getHistoriasClinicas = async (req, res) => {
    try {
        const historiasClinicas = await HistoriaClinica.find().populate("socio");
        res.json({ message: "Historias Clinicas obtenidas correctamente", historiasClinicas });
    } catch (error) {
        console.error("Error al obtener Historias Clínicas:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.getHistoriaClinicaById = async (req, res) => {
    try {
        const historiaClinicaId = req.params.id;

        //busca la Historia Clínica por su _id de Mongoose
        const historiaClinica = await HistoriaClinica.findById(historiaClinicaId)
            .populate("socio")
            .populate("medico_cabecera"); 

        if (!historiaClinica) {
            return res.status(404).json({ message: "Historia Clínica no encontrada" });
        }

        // buscar todas las Notas asociadas a esta Historia Clínica
        const notas = await Nota.find({ historia_clinica: historiaClinicaId })
            .populate("prestador") //para saber quien hizo la nota
            .sort({ fecha_creacion: -1 }); //en orden de mas reciente a mas vieja

        //combinar HHC y Notas para la respuesta
        const respuestaDetalle = {
            ...historiaClinica.toObject(),
            notas: notas,
        };

        res.json({ 
            message: "Detalle de Historia Clínica obtenido correctamente", 
            historiaClinica: respuestaDetalle 
        });

    } catch (error) {
        console.error("Error al obtener detalle de Historia Clínica:", error);
        res.status(500).json({ 
            message: "Error interno del servidor", 
            error: error.message 
        });
    }
};

exports.createHistoriaClinica = async (req, res) => {
    try {
        const historiaClinica = await HistoriaClinica.create(req.body);
        const historiaClinicaPopulated = await HistoriaClinica.findById(historiaClinica._id).populate(
            "socio"
        );
        res.status(201).json({
            message: "Historia Clinica creada correctamente",
            historiaClinica: historiaClinicaPopulated,
        });
    } catch (error) {
        console.error("Error al crear Historia Clínica:", error);
        res.status(400).json({ message: "Error al crear la Historia Clínica", error: error.message });
    }
};

exports.updateHistoriaClinica = async (req, res) => {
    try {
        const historiaClinica = await HistoriaClinica.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        }).populate("socio");
        if (!historiaClinica) {
            return res.status(404).json({ message: "Historia Clínica no encontrada para actualizar" });
        }
        res.json({ message: "Historia Clinica actualizada correctamente", historiaClinica });
    } catch (error) {
        console.error("Error al actualizar Historia Clínica:", error);
        res.status(400).json({ message: "Error al actualizar la Historia Clínica", error: error.message });
    }
};

exports.deleteHistoriaClinica = async (req, res) => {
    try {
        const result = await HistoriaClinica.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: "Historia Clínica no encontrada para eliminar" });
        }
        res.json({ message: "Historia Clinica eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar Historia Clínica:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

//agregar nota a una historia clinica
exports.addNotaAHC = async (req, res) => {
    const { historiaClinicaId } = req.params;
    const { nota, prestadorId } = req.body; 

    try {
        //verifica si la Historia Clínica existe
        const historiaClinica = await HistoriaClinica.findById(historiaClinicaId);

        if (!historiaClinica) {
            return res.status(404).json({ message: "Historia Clínica no encontrada para agregar nota" });
        }

        //crea la nueva nota
        const nuevaNota = await Nota.create({
            nota: nota,
            historia_clinica: historiaClinicaId,
            prestador: prestadorId,
            socio: historiaClinica.socio,
        });

        // opcional: Popular la nota para devolver la info completa al frontend
        const notaPopulated = await Nota.findById(nuevaNota._id).populate("prestador");

        res.status(201).json({
            message: "Nota agregada correctamente a la Historia Clínica",
            nota: notaPopulated,
        });

    } catch (error) {
        console.error("Error al agregar nota a Historia Clínica:", error);
        res.status(500).json({ 
            message: "Error interno del servidor al crear la nota.", 
            error: error.message 
        });
    }
};