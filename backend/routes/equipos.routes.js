const express = require('express');
const router = express.Router();
const EquiposController = require('../controllers/equipos.controller');
const auth = require('../middlewares/auth.middleware');
const autorizarRol = require('../middlewares/roles.middleware');

// Ruta para obtener todos los equipos, sin autenticación
router.get('/', EquiposController.obtenerTodos);

// Ruta para obtener un equipo por ID, requiere autenticación
router.get('/:id', auth, EquiposController.obtenerPorId);

// Ruta para obtener equipos por tipo, sin autenticación
router.get('/tipo/:tipo', EquiposController.obtenerPorTipo);

// Ruta para buscar equipos por nombre, requiere autenticación
router.get('/buscar/nombre/:nombre', auth, EquiposController.buscarPorNombre);

// Ruta para crear un nuevo equipo, requiere autenticación y rol admin
router.post('/', auth, autorizarRol('admin'), EquiposController.crear);

// Ruta para actualizar un equipo por ID, requiere autenticación y rol admin
router.put('/:id', auth, autorizarRol('admin'), EquiposController.actualizar);

// Ruta para eliminar un equipo por ID, requiere autenticación y rol admin
router.delete('/:id', auth, autorizarRol('admin'), EquiposController.eliminar);

module.exports = router;