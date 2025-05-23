const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const UsuariosController = require('../controllers/usuarios.controller');
const auth = require('../middlewares/auth.middleware');
const autorizarRol = require('../middlewares/roles.middleware');

// Registro
router.post('/register',
  body('nombre').notEmpty(),
  body('correo').isEmail(),
  body('contraseña').isLength({ min: 6 }),
  body('rol').isIn(['admin', 'estudiante']),
  UsuariosController.registrar
);

// Login
router.post('/login', UsuariosController.login);

// Obtener todos (solo admin)
router.get('/', auth, autorizarRol('admin'), UsuariosController.obtenerTodos);

// Buscar por ID
router.get('/:id', auth, UsuariosController.obtenerPorId);

// Buscar por correo
router.get('/correo/:correo', auth, UsuariosController.obtenerPorCorreo);

// Buscar por nombre
router.get('/buscar/nombre/:nombre', auth, UsuariosController.buscarPorNombre);

// Actualizar contraseña (usuario o admin)
router.put('/:id/password', auth, UsuariosController.actualizarContraseña);

// Actualizar datos del usuario (por ejemplo: rol) – solo admin
router.put('/:id', auth, autorizarRol('admin'), UsuariosController.actualizar);

// Eliminar usuario (solo admin)
router.delete('/:id', auth, autorizarRol('admin'), UsuariosController.eliminar);

module.exports = router;