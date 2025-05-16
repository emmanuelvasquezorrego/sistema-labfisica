const Usuario = require("../models/usuario.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const AuthController = {
  login: async (req, res) => {
    try {
      const { correo, contraseña } = req.body;
      const usuario = await Usuario.findByEmail(correo);
      
      if (!usuario || !(await bcrypt.compare(contraseña, usuario.contraseña))) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      const token = jwt.sign(
        { id: usuario.id_usuario, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
      );

      res.json({ token, rol: usuario.rol });
    } catch (error) {
      res.status(500).json({ error: "Error en el servidor" });
    }
  },
};

module.exports = AuthController;