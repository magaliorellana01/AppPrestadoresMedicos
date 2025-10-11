// Archivo: src/routes/filtroSolicitudes.js
const express = require('express');
const router = express.Router();
const SolicitudController = require('../controllers/filtroSolicitudes');

// Ruta existente para obtener todas las solicitudes
router.get('/', SolicitudController.getSolicitudes);

// RUTAS FALTANTES - Agregar estas líneas:
router.get('/:id', SolicitudController.getSolicitudById);
router.put('/:id', SolicitudController.updateSolicitud);

module.exports = router;
