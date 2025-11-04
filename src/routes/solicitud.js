const express = require('express');
const router = express.Router();
const multer = require('multer');

const SolicitudController = require('../controllers/solicitud');

// --- Configuración Multer ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// --- Rutas principales ---
router.get('/:id', SolicitudController.getSolicitudById);      // Detalle de solicitud
router.put('/:id', SolicitudController.updateSolicitud);       // Actualizar solicitud

// --- Subida de archivos ---
router.post(
  '/:id/archivos',
  upload.fields([
    { name: 'factura', maxCount: 1 },
    { name: 'receta', maxCount: 1 }
  ]),
  SolicitudController.subirArchivos
);

module.exports = router;
