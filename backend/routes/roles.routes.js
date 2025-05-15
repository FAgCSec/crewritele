// routes/roles.routes.js
const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');

router.post('/', rolController.crearRol);
router.get('/', rolController.obtenerRoles);
router.put('/:id', rolController.editarRol);
router.delete('/:id', rolController.eliminarRol);

module.exports = router;