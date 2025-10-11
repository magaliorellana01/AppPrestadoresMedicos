const express = require('express');
const router = express.Router();
const SolicitudController = require('../controllers/filtroSolicitudes');

// Rutas para solicitudes
router.get('/', SolicitudController.getSolicitudes);
router.get('/:id', SolicitudController.getSolicitudById);
router.patch('/:id/cambiar-estado', SolicitudController.cambiarEstadoSolicitud);
router.put('/:id', SolicitudController.updateSolicitud);

module.exports = router;