const express = require('express');
const router = express.Router();
const EquiposController = require('../controllers/equipos.controller');
const auth = require('../middlewares/auth.middleware');
const autorizarRol = require('../middlewares/roles.middleware');

router.get('/', auth, EquiposController.obtenerTodos);
router.get('/:id', auth, EquiposController.obtenerPorId);
router.get('/tipo/:tipo', auth, EquiposController.obtenerPorTipo);
router.get('/buscar/nombre/:nombre', auth, EquiposController.buscarPorNombre);

router.post('/', auth, autorizarRol('admin'), EquiposController.crear);
router.put('/:id', auth, autorizarRol('admin'), EquiposController.actualizar);
router.delete('/:id', auth, autorizarRol('admin'), EquiposController.eliminar);

module.exports = router;
