const express = require("express");
const {
  getSituacionTerapeuticaById,
updateSituacionTerapeutica,
agregarNovedad
  
} = require("../controllers/situacionTerapeutica");

const router = express.Router();


router.get("/:id", getSituacionTerapeuticaById); 

router.put("/:id", updateSituacionTerapeutica);


router.post("/:situacionTerapeuticaId/novedades", agregarNovedad);

module.exports = router;