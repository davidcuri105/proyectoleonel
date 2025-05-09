// server/routes.js

const express = require('express');
const router = express.Router();
const authController = require('./auth');  // Importa el controlador de autenticación

// Ruta para login
router.post('/login', authController.login);

module.exports = router;
