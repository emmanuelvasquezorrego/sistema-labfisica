const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const { body } = require("express-validator");

router.post(
  "/login",
  [
    body("correo").isEmail().withMessage("Correo inválido"),
    body("contraseña").notEmpty().withMessage("Contraseña requerida")
  ],
  AuthController.login
);

module.exports = router;