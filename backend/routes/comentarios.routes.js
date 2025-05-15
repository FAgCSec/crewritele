// routes/comentarios.routes.js
const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentarioController');

router.post('/', comentarioController.crearComentario);
router.get('/:comentario_id', comentarioController.obtenerTodosLosComentariosPorNoticia);
router.put('/:comentario_id', comentarioController.editarComentario);
router.delete('/:id', comentarioController.eliminarComentario);

module.exports = router;