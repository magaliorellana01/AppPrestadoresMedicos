const express = require("express");
const {
    getHistoriasClinicasByMultipleEntries,
    getHistoriasClinicas,
    getHistoriaClinicaById,
    createHistoriaClinica,
    updateHistoriaClinica,
    deleteHistoriaClinica,
    addNotaAHC,
} = require("../controllers/historiaClinica.js");

const router = express.Router();
router.get("/search/:input", getHistoriasClinicasByMultipleEntries);
router.get("/", getHistoriasClinicas);
router.get("/:id", getHistoriaClinicaById);
router.post("/", createHistoriaClinica);
router.put("/:id", updateHistoriaClinica);
router.delete("/:id", deleteHistoriaClinica);

router.post("/:historiaClinicaId/notas", addNotaAHC);

module.exports = router;