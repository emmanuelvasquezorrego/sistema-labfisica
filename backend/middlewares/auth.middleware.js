// Importa el paquete jsonwebtoken para trabajar con tokens JWT
const jwt = require('jsonwebtoken');
// Carga las variables de entorno desde un archivo .env
require('dotenv').config();

// Middleware para autenticar el token JWT en las solicitudes protegidas
const authenticateToken = (req, res, next) => {
  // Extrae el token del encabezado Authorization (formato esperado: 'Bearer token')
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  // Verifica el token utilizando la clave secreta definida en el archivo .env
  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });

    // Si el token es válido, se adjunta la información del usuario al objeto `req`
    req.usuario = usuario;

    // Llama a la siguiente función middleware o controlador en la cadena
    next();
  });
};

// Exporta el middleware para que pueda ser usado en otras partes de la aplicación
module.exports = authenticateToken;
