// Función middleware para autorizar el acceso según el rol del usuario
// Acepta uno o varios roles permitidos como argumentos (por ejemplo: 'admin', 'estudiante')
const autorizarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    // Verifica si el rol del usuario autenticado está incluido en la lista de roles permitidos
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      // Si no está autorizado, responde con un error 403 (Prohibido)
      return res.status(403).json({ message: 'No tienes permisos para esta acción' });
    }

    // Si el rol es válido, continúa con el siguiente middleware o controlador
    next();
  };
};

// Exporta el middleware para ser utilizado en rutas protegidas que requieren autorización por rol
module.exports = autorizarRol;
