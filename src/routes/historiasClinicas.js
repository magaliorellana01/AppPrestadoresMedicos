const express = require("express");
const { getHistoriasClinicas } = require("../controllers/historiasClinicas.js");

const router = express.Router();

router.get("/historias-clinicas", getHistoriasClinicas);

module.exports = router;
