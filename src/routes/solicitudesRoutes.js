//sirve para los archivos dentro de la tarjeta descripcion 
const express = require('express');
const router = express.Router();
const HistoriaController = require('../controllers/historiaController'); // o tu controller de solicitudes
const multer = require('multer');
const path = require('path');

// Configuración de Multer para guardar archivos en ./uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads')); // carpeta uploads
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Ruta para subir archivos (factura + receta/adicional)
router.post('/:id/archivos', upload.fields([
  { name: 'factura', maxCount: 1 },
  { name: 'receta', maxCount: 1 }
]), async (req, res) => {
  try {
    const { id } = req.params;
    const solicitud = await Solicitud.findById(id); // tu modelo de solicitud
    if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });

    // Guardar los archivos en el objeto de la solicitud
    if (!solicitud.descripcion.adjuntos) solicitud.descripcion.adjuntos = [];

    if (req.files['factura']) {
      solicitud.descripcion.adjuntos.push({
        tipo: 'factura',
        nombreArchivo: req.files['factura'][0].originalname,
        path: req.files['factura'][0].path
      });
    }

    if (req.files['receta']) {
      solicitud.descripcion.adjuntos.push({
        tipo: 'receta',
        nombreArchivo: req.files['receta'][0].originalname,
        path: req.files['receta'][0].path
      });
    }

    await solicitud.save();
    res.json({ message: 'Archivos subidos correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error subiendo archivos' });
  }
});

module.exports = router;
