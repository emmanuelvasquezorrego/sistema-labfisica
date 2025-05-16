const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const generarToken = require('../utils/generarToken');

const UsuariosController = {
  registrar: async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });

    const { nombre, correo, contraseña, rol } = req.body;

    try {
      const existente = await Usuario.buscarPorCorreo(correo);
      if (existente) return res.status(400).json({ message: 'El correo ya está registrado' });

      const hashed = await bcrypt.hash(contraseña, 10);
      const id = await Usuario.crear({ nombre, correo, contraseña: hashed, rol });

      res.status(201).json({ id, nombre, correo, rol });
    } catch (error) {
      res.status(500).json({ message: 'Error al registrar usuario', error });
    }
  },

  login: async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
      const usuario = await Usuario.buscarPorCorreo(correo);
      if (!usuario) return res.status(404).json({ message: 'Correo no registrado' });

      const valido = await bcrypt.compare(contraseña, usuario.contraseña);
      if (!valido) return res.status(401).json({ message: 'Contraseña incorrecta' });

      const token = generarToken(usuario);
      res.json({ token, usuario: { id: usuario.id_usuario, nombre: usuario.nombre, rol: usuario.rol } });
    } catch (error) {
      res.status(500).json({ message: 'Error en login', error });
    }
  },

  obtenerTodos: async (req, res) => {
    try {
      const usuarios = await Usuario.obtenerTodos();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuarios', error });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const usuario = await Usuario.buscarPorId(req.params.id);
      if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ message: 'Error al buscar usuario', error });
    }
  },

  obtenerPorCorreo: async (req, res) => {
    try {
      const usuario = await Usuario.buscarPorCorreo(req.params.correo);
      if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ message: 'Error al buscar usuario', error });
    }
  },

  buscarPorNombre: async (req, res) => {
    try {
      const resultados = await Usuario.buscarPorNombre(req.params.nombre);
      res.json(resultados);
    } catch (error) {
      res.status(500).json({ message: 'Error en búsqueda', error });
    }
  },

    actualizarContraseña: async (req, res) => {
    const idSolicitado = parseInt(req.params.id);
    const { id: idToken, rol } = req.usuario;
    const { nuevaContraseña, actualContraseña } = req.body;

    if (rol !== 'admin' && idToken !== idSolicitado) {
      return res.status(403).json({ message: 'No puedes cambiar la contraseña de otro usuario' });
    }

    try {
      const usuario = await Usuario.buscarPorId(idSolicitado);
      if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

      if (rol !== 'admin') {
        const esValida = await bcrypt.compare(actualContraseña, usuario.contraseña);
        if (!esValida) return res.status(401).json({ message: 'Contraseña actual incorrecta' });
      }

      const hashed = await bcrypt.hash(nuevaContraseña, 10);
      await Usuario.actualizarContraseña(idSolicitado, hashed);

      res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar contraseña', error });
    }
  },


  eliminar: async (req, res) => {
    try {
      await Usuario.eliminar(req.params.id);
      res.json({ message: 'Usuario eliminado' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar', error });
    }
  }
};

module.exports = UsuariosController;