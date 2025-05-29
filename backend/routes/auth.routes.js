// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/verificar', authController.verificarToken);

module.exports = router;