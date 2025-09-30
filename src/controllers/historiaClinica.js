const HistoriaClinica = require("../models/historiaClinica");

exports.getHistoriasClinicas = async (req, res) => {
  const historiasClinicas = await HistoriaClinica.find().populate("socio");
  res.json({ message: "Historias Clinicas obtenidas correctamente", historiasClinicas });
};

exports.getHistoriaClinicaById = async (req, res) => {
  const historiaClinica = await HistoriaClinica.findById(req.params.id).populate("socio");
  res.json({ message: "Historia Clinica obtenida correctamente", historiaClinica });
};

exports.createHistoriaClinica = async (req, res) => {
  const historiaClinica = await HistoriaClinica.create(req.body).populate("socio");
  res.json({ message: "Historia Clinica creada correctamente", historiaClinica });
};

exports.updateHistoriaClinica = async (req, res) => {
  const historiaClinica = await HistoriaClinica.findByIdAndUpdate(req.params.id, req.body, {
    populate: "socio",
    new: true,
  });
  res.json({ message: "Historia Clinica actualizada correctamente", historiaClinica });
};

exports.deleteHistoriaClinica = async (req, res) => {
  await HistoriaClinica.findByIdAndDelete(req.params.id).populate("socio");
  res.json({ message: "Historia Clinica eliminada correctamente" });
};
