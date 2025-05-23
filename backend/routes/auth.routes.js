const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const { body } = require("express-validator");

// Ruta POST /login para iniciar sesión
router.post(
  "/login",
  [
    // Validación: el campo 'correo' debe ser un email válido
    body("correo").isEmail().withMessage("Correo inválido"),
    // Validación: el campo 'contraseña' no debe estar vacío
    body("contraseña").notEmpty().withMessage("Contraseña requerida")
  ],
  // Controlador que maneja la lógica del login
  AuthController.login
);

module.exports = router;