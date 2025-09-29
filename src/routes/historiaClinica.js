const express = require("express");
const {
  getHistoriasClinicas,
  getHistoriaClinicaById,
  createHistoriaClinica,
  updateHistoriaClinica,
  deleteHistoriaClinica,
} = require("../controllers/historiaClinica.js");

const router = express.Router();

router.get("/historias-clinicas", getHistoriasClinicas);
router.get("/historias-clinicas/:id", getHistoriaClinicaById);
router.post("/historias-clinicas", createHistoriaClinica);
router.put("/historias-clinicas/:id", updateHistoriaClinica);
router.delete("/historias-clinicas/:id", deleteHistoriaClinica);

module.exports = router;
