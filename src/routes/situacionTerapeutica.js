const express = require("express");
const {
    getSituacionTerapeuticaById,
    getSituacionesTerapeuticasByMultipleEntries,
    updateSituacionTerapeutica,
    agregarNovedad
} = require("../controllers/situacionTerapeutica");

const router = express.Router();

router.get("/:id", getSituacionTerapeuticaById); 

router.get("/search", getSituacionesTerapeuticasByMultipleEntries);

router.put("/:id", updateSituacionTerapeutica);


router.post("/:situacionTerapeuticaId/novedades", agregarNovedad);

module.exports = router;