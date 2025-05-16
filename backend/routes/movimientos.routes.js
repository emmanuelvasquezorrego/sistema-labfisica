const express = require('express');
const router = express.Router();
const MovimientosController = require('../controllers/movimientos.controller');
const auth = require('../middlewares/auth.middleware');
const autorizarRol = require('../middlewares/roles.middleware');

router.get('/disponibles', auth, MovimientosController.equiposDisponibles);
router.post('/', auth, MovimientosController.crearPrestamo);
router.put('/equipo/:id/estado', auth, autorizarRol('admin'), MovimientosController.cambiarEstado);
router.get('/historial/:id', auth, MovimientosController.historial);

module.exports = router;
