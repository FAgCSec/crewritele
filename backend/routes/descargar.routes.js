// routes/descargar.routes.js
const express = require('express');
const router = express.Router();
const descargarArchivosController = require('../controllers/descargarArchivosController');

router.get('/descargar-db', descargarArchivosController.descargarDb);
router.get('/descargar-pdf/:id', descargarArchivosController.descargarPdf);
router.get('/descargar-excel/:id', descargarArchivosController.descargarExcel);

module.exports = router;