const express = require("express");
const {
    getSituacionTerapeuticaById,
    getSituacionesTerapeuticasByMultipleEntries,
    updateSituacionTerapeutica,
    agregarNovedad,
    createSituacionTerapeutica
} = require("../controllers/situacionTerapeutica");

const router = express.Router();

router.get("/search", getSituacionesTerapeuticasByMultipleEntries);

router.get("/:id", getSituacionTerapeuticaById); 

router.put("/:id", updateSituacionTerapeutica);

router.post("/", createSituacionTerapeutica);

router.post("/:situacionTerapeuticaId/novedades", agregarNovedad);

module.exports = router;