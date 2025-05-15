// routes/usuarios.routes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/', usuarioController.crearUsuario);
router.post('/:id/foto', usuarioController.subirFotoPerfil);
router.get('/:id/foto', usuarioController.obtenerFotoPerfil);
router.get('/', usuarioController.obtenerUsuarios);
router.get('/:id', usuarioController.obtenerUnUsuario);
router.put('/:id', usuarioController.editarUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);
router.delete('/:id/foto', usuarioController.eliminarFotoPerfil);
router.post('/login', usuarioController.loginUsuario);
router.post('/login/google', usuarioController.loginUsuarioCorreo);

module.exports = router;