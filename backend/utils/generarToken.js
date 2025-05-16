const jwt = require('jsonwebtoken');
require('dotenv').config();

const generarToken = (usuario) => {
  return jwt.sign({ id: usuario.id_usuario, rol: usuario.rol }, process.env.JWT_SECRET, {
    expiresIn: '4h'
  });
};

module.exports = generarToken;