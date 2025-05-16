const Movimiento = require('../models/movimiento.model');

const MovimientosController = {
  equiposDisponibles: async (req, res) => {
    try {
      const equipos = await Movimiento.obtenerEquiposDisponibles();
      res.json(equipos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener equipos', error });
    }
  },

  crearPrestamo: async (req, res) => {
    try {
      const { id_usuario, fecha_prestamo, fecha_devolucion_esperada, equipos } = req.body;
      const id = await Movimiento.crearPrestamo({ id_usuario, fecha_prestamo, fecha_devolucion_esperada, equipos });
      res.status(201).json({ message: 'Préstamo creado', id });
    } catch (error) {
      res.status(500).json({ message: 'Error al registrar préstamo', error });
    }
  },

  cambiarEstado: async (req, res) => {
    try {
      const { estado } = req.body;
      await Movimiento.actualizarEstadoEquipo(req.params.id, estado);
      res.json({ message: 'Estado actualizado' });
    } catch (error) {
      res.status(500).json({ message: 'Error al cambiar estado', error });
    }
  },

  historial: async (req, res) => {
    try {
      const prestamos = await Movimiento.historialPorUsuario(req.params.id);
      res.json(prestamos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener historial', error });
    }
  }
};

module.exports = MovimientosController;
