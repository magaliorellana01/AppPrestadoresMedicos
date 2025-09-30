const express = require("express");
const {
  getHistoriasClinicas,
  getHistoriaClinicaById,
  createHistoriaClinica,
  updateHistoriaClinica,
  deleteHistoriaClinica,
} = require("../controllers/historiaClinica.js");

const router = express.Router();

router.get("/", getHistoriasClinicas);
router.get("/:id", getHistoriaClinicaById);
router.post("/", createHistoriaClinica);
router.put("/:id", updateHistoriaClinica);
router.delete("/:id", deleteHistoriaClinica);

module.exports = router;
