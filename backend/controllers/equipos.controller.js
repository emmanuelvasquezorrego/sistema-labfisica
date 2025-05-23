const Equipo = require('../models/equipo.model');

// Controlador para manejar las operaciones CRUD de equipos
const EquiposController = {

  // Método para obtener todos los equipos
  obtenerTodos: async (req, res) => {
    try {
      const equipos = await Equipo.obtenerTodos();
      res.json(equipos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener equipos', error });
    }
  },

  // Método para obtener un equipo por su ID
  obtenerPorId: async (req, res) => {
    try {
      const equipo = await Equipo.obtenerPorId(req.params.id);
      if (!equipo) return res.status(404).json({ message: 'Equipo no encontrado' });
      res.json(equipo);
    } catch (error) {
      res.status(500).json({ message: 'Error al buscar equipo', error });
    }
  },

  // Método para obtener equipos por tipo
  obtenerPorTipo: async (req, res) => {
    try {
      const equipos = await Equipo.obtenerPorTipo(req.params.tipo);
      res.json(equipos);
    } catch (error) {
      res.status(500).json({ message: 'Error al buscar por tipo', error });
    }
  },

  // Método para buscar equipos por nombre
  buscarPorNombre: async (req, res) => {
    try {
      const equipos = await Equipo.buscarPorNombre(req.params.nombre);
      res.json(equipos);
    } catch (error) {
      res.status(500).json({ message: 'Error al buscar por nombre', error });
    }
  },

  // Método para crear un nuevo equipo
  crear: async (req, res) => {
    try {
      const { nombre, tipo, codigo_inventario, estado } = req.body;
      const id = await Equipo.crear({ nombre, tipo, codigo_inventario, estado: estado || 'Disponible' });
      res.status(201).json({ message: 'Equipo creado', id });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear equipo', error });
    }
  },

  // Método para actualizar un equipo
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const datos = req.body;
      console.log('Actualizar equipo:', id, datos);

      await Equipo.actualizar(id, datos);
      res.json({ message: 'Equipo actualizado' });
    } catch (error) {
      console.error('Error al actualizar equipo:', error);
      res.status(500).json({ message: 'Error al actualizar', error });
    }
  },

  // Método para eliminar un equipo
  eliminar: async (req, res) => {
    try {
      await Equipo.eliminar(req.params.id);
      res.json({ message: 'Equipo eliminado' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar', error });
    }
  }
};

module.exports = EquiposController;