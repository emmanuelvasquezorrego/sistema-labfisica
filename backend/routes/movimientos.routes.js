const express = require('express');
const router = express.Router();
const MovimientosController = require('../controllers/movimientos.controller');
const auth = require('../middlewares/auth.middleware');
const autorizarRol = require('../middlewares/roles.middleware');

// Obtener equipos disponibles, requiere autenticación
router.get('/disponibles', auth, MovimientosController.equiposDisponibles);

// Crear un nuevo préstamo, requiere autenticación
router.post('/', auth, MovimientosController.crearPrestamo);

// Cambiar estado de un equipo, requiere autenticación y rol admin
router.put('/equipo/:id/estado', auth, autorizarRol('admin'), MovimientosController.cambiarEstado);

// Obtener historial de préstamos de un usuario, requiere autenticación
router.get('/historial/:id', auth, MovimientosController.historial);

// Obtener todos los préstamos (vista admin), requiere autenticación y rol admin
router.get('/prestamos/admin', auth, autorizarRol('admin'), MovimientosController.todosLosPrestamos);

// Marcar un préstamo como devuelto, requiere autenticación y rol admin
router.put('/prestamos/:id/devolver', auth, autorizarRol('admin'), MovimientosController.marcarDevuelto);

// Obtener estadísticas generales, requiere autenticación y rol admin
router.get('/estadisticas', auth, autorizarRol('admin'), MovimientosController.estadisticas);

// Obtener equipos más prestados, requiere autenticación y rol admin
router.get('/estadisticas/equipos', auth, autorizarRol('admin'), MovimientosController.equiposMasPrestados);

module.exports = router;
