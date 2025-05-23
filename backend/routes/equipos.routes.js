const express = require('express');
const router = express.Router();
const EquiposController = require('../controllers/equipos.controller');
const auth = require('../middlewares/auth.middleware');
const autorizarRol = require('../middlewares/roles.middleware');

// Rutas para manejar las operaciones CRUD de equipos

// Obtener equipos por tipo
router.get('/tipo/:tipo', EquiposController.obtenerPorTipo);

// Buscar equipos por nombre
router.get('/buscar/nombre/:nombre', auth, EquiposController.buscarPorNombre);

// Obtener un equipo por ID
router.get('/:id', auth, EquiposController.obtenerPorId);

// Obtener todos los equipos
router.get('/', EquiposController.obtenerTodos);

// Crear un nuevo equipo
router.post('/', auth, autorizarRol('admin'), EquiposController.crear);

// Actualizar un equipo
router.put('/:id', auth, autorizarRol('admin'), EquiposController.actualizar);

// Eliminar un equipo
router.delete('/:id', auth, autorizarRol('admin'), EquiposController.eliminar);

module.exports = router;