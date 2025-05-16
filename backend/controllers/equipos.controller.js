const Equipo = require('../models/equipo.model');

const EquiposController = {
  obtenerTodos: async (req, res) => {
    try {
      const equipos = await Equipo.obtenerTodos();
      res.json(equipos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener equipos', error });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const equipo = await Equipo.obtenerPorId(req.params.id);
      if (!equipo) return res.status(404).json({ message: 'Equipo no encontrado' });
      res.json(equipo);
    } catch (error) {
      res.status(500).json({ message: 'Error al buscar equipo', error });
    }
  },

  obtenerPorTipo: async (req, res) => {
    try {
      const equipos = await Equipo.obtenerPorTipo(req.params.tipo);
      res.json(equipos);
    } catch (error) {
      res.status(500).json({ message: 'Error al buscar por tipo', error });
    }
  },

  buscarPorNombre: async (req, res) => {
    try {
      const equipos = await Equipo.buscarPorNombre(req.params.nombre);
      res.json(equipos);
    } catch (error) {
      res.status(500).json({ message: 'Error al buscar por nombre', error });
    }
  },

  crear: async (req, res) => {
    try {
      const { nombre, tipo, codigo_inventario, estado } = req.body;
      const id = await Equipo.crear({ nombre, tipo, codigo_inventario, estado: estado || 'Disponible' });
      res.status(201).json({ message: 'Equipo creado', id });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear equipo', error });
    }
  },


  actualizar: async (req, res) => {
    try {
      await Equipo.actualizar(req.params.id, req.body);
      res.json({ message: 'Equipo actualizado' });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar', error });
    }
  },

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