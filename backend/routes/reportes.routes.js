// routes/reportes.routes.js
const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');

// Ruta para obtener noticias con más comentarios que el promedio
router.get('/noticias-comentarios-promedio', reportesController.noticiasComentariosPromedio);

// Ruta para obtener usuarios que comentaron en todas las noticias de un autor
router.get('/usuarios-comentaron-todas-noticias/:autorId', reportesController.usuariosComentaronTodasLasNoticias);

// Ruta para obtener el último comentario por usuario
router.get('/ultimo-comentario-por-usuario', reportesController.ultimoComentarioPorUsuario);

// Ruta para obtener la cantidad de comentarios por noticia
router.get('/comentarios-por-noticia', reportesController.comentariosPorNoticia);

module.exports = router;
