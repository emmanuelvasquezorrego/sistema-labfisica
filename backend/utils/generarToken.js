const jwt = require('jsonwebtoken');
require('dotenv').config();

// Función para generar un token JWT con los datos del usuario
const generarToken = (usuario) => {
  return jwt.sign(
    {
      id_usuario: usuario.id_usuario, // Identificador de usuario para backend
      id: usuario.id_usuario,         // Identificador de usuario para frontend
      nombre: usuario.nombre,         // Nombre del usuario
      rol: usuario.rol                // Rol del usuario para autorización
    },
    process.env.JWT_SECRET,           // Clave secreta para firmar el token
    { expiresIn: '4h' }               // Duración del token: 4 horas
  );
};

module.exports = generarToken;
