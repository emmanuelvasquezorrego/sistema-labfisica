const Movimiento = require('../models/movimiento.model');

// Controlador para gestión de préstamos y movimientos de equipos
const MovimientosController = {
  // Obtiene listado de equipos disponibles para préstamo
  equiposDisponibles: async (req, res) => {
    try {
      const equipos = await Movimiento.obtenerEquiposDisponibles();
      res.json(equipos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener equipos', error });
    }
  },

  // Registra un nuevo préstamo (con validación de usuario autenticado)
  crearPrestamo: async (req, res) => {
    try {
      console.log("Usuario autenticado:", req.usuario);  // Log para debugging

      const id_usuario = req.usuario.id_usuario;  // ID del usuario desde el token
      const { fecha_prestamo, fecha_devolucion_esperada, equipos } = req.body;
      
      const id = await Movimiento.crearPrestamo({ 
        id_usuario, 
        fecha_prestamo, 
        fecha_devolucion_esperada, 
        equipos 
      });
      
      res.status(201).json({ message: 'Préstamo creado', id });
    } catch (error) {
      res.status(500).json({ message: 'Error al registrar préstamo', error });
    }
  },

  // Actualiza el estado de un equipo (Ej: 'En préstamo', 'En mantenimiento')
  cambiarEstado: async (req, res) => {
    try {
      const { estado } = req.body;
      await Movimiento.actualizarEstadoEquipo(req.params.id, estado);
      res.json({ message: 'Estado actualizado' });
    } catch (error) {
      res.status(500).json({ message: 'Error al cambiar estado', error });
    }
  },

  // Obtiene el historial de préstamos de un usuario específico
  historial: async (req, res) => {
    try {
      const prestamos = await Movimiento.historialPorUsuario(req.params.id);
      res.json(prestamos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener historial', error });
    }
  },

  // Obtiene todos los préstamos registrados (para administración)
  todosLosPrestamos: async (req, res) => {
    try {
      const prestamos = await Movimiento.todosLosPrestamos();
      res.json(prestamos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener préstamos', error });
    }
  },

  // Marca un préstamo como devuelto (actualiza fecha_devolucion_real en BD)
  marcarDevuelto: async (req, res) => {
    try {
      await Movimiento.marcarComoDevuelto(req.params.id);
      res.json({ message: 'Préstamo marcado como devuelto' });
    } catch (err) {
      res.status(500).json({ message: 'Error al marcar préstamo como devuelto', err });
    }
  },

  // Genera estadísticas de uso por mes y tipo de equipo
  estadisticas: async (req, res) => {
    try {
      const resultado = await Movimiento.obtenerEstadisticasPorMesYEquipo();
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ message: "Error al obtener estadísticas", error: err });
    }
  },

  // Identifica los equipos con más préstamos (reporte)
  equiposMasPrestados: async (req, res) => {
    try {
      const equipos = await Movimiento.equiposMasPrestados();
      res.json(equipos);
    } catch (err) {
      res.status(500).json({ message: "Error al obtener equipos más prestados", error: err });
    }
  }
};

module.exports = MovimientosController;