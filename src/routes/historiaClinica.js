const express = require("express");
const { getHistoriasClinicas } = require("../controllers/historiaClinica.js");

const router = express.Router();

router.get("/historias-clinicas", getHistoriasClinicas);

module.exports = router;
