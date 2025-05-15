// routes/noticias.routes.js
const express = require('express');
const router = express.Router();
const noticiaController = require('../controllers/noticiaController');

router.post('/', noticiaController.crearNoticia);
router.get('/', noticiaController.obtenerNoticias);
router.put('/:id', noticiaController.editarNoticia);
router.delete('/:id', noticiaController.eliminarNoticia);

module.exports = router;