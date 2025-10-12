const express = require('express');
const router = express.Router();
const multer = require('multer');

const SolicitudController = require('../controllers/filtroSolicitudes');
const Solicitud = require('../models/filtroSolicitudes');

// --- Configuración Multer ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// --- Subida de archivos ---
router.post(
  '/:id/archivos',
  upload.fields([
    { name: 'factura', maxCount: 1 },
    { name: 'receta', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const solicitud = await Solicitud.findById(id);
      if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });

      // Inicializar adjuntos si no existen
      if (!solicitud.descripcion) solicitud.descripcion = {};
      if (!Array.isArray(solicitud.descripcion.adjuntos)) solicitud.descripcion.adjuntos = [];

      // Agregar archivos subidos
      if (req.files['factura']) {
        solicitud.descripcion.adjuntos.push({
          tipo: 'Factura',
          nombreArchivo: req.files['factura'][0].originalname,
          path: req.files['factura'][0].path
        });
      }
      if (req.files['receta']) {
        solicitud.descripcion.adjuntos.push({
          tipo: 'Receta',
          nombreArchivo: req.files['receta'][0].originalname,
          path: req.files['receta'][0].path
        });
      }

      await solicitud.save();
      res.status(200).json({ message: 'Archivos subidos correctamente', adjuntos: solicitud.descripcion.adjuntos });
    } catch (err) {
      console.error('Error al subir archivos:', err);
      res.status(500).json({ message: 'Error al subir archivos', error: err.message });
    }
  }
);

// --- Rutas principales ---
router.get('/', SolicitudController.getSolicitudes);           // Listar solicitudes
router.get('/:id', SolicitudController.getSolicitudById);      // Detalle de solicitud
router.patch('/:id/cambiar-estado', SolicitudController.cambiarEstadoSolicitud); // Cambiar estado
router.put('/:id', SolicitudController.updateSolicitud);       // Actualizar solicitud

module.exports = router;
