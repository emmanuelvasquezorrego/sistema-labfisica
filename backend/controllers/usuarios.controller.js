const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const generarToken = require('../utils/generarToken');

// Controlador que agrupa todas las operaciones relacionadas con usuarios
const UsuariosController = {

  // Registro de un nuevo usuario
  // Valida los datos recibidos, verifica si el correo ya existe,
  // encripta la contraseña y guarda el usuario en la base de datos.
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

  // Inicio de sesión
  // Verifica si el correo existe, compara la contraseña, y si es válido,
  // genera un token JWT para autenticación.
  login: async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
      const usuario = await Usuario.buscarPorCorreo(correo);
      if (!usuario) return res.status(404).json({ message: 'Correo no registrado' });

      const valido = await bcrypt.compare(contraseña, usuario.contraseña);
      if (!valido) return res.status(401).json({ message: 'Contraseña incorrecta' });

      const token = generarToken(usuario);
      res.json({ token, usuario: { id_usuario: usuario.id_usuario, nombre: usuario.nombre, rol: usuario.rol } });
    } catch (error) {
      res.status(500).json({ message: 'Error en login', error });
    }
  },

  // Obtener la lista completa de usuarios
  obtenerTodos: async (req, res) => {
    try {
      const usuarios = await Usuario.obtenerTodos();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuarios', error });
    }
  },

  // Obtener un usuario por su ID (parámetro en la ruta)
  obtenerPorId: async (req, res) => {
    try {
      const usuario = await Usuario.buscarPorId(req.params.id);
      if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ message: 'Error al buscar usuario', error });
    }
  },

  // Buscar usuario por correo (parámetro en la ruta)
  obtenerPorCorreo: async (req, res) => {
    try {
      const usuario = await Usuario.buscarPorCorreo(req.params.correo);
      if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ message: 'Error al buscar usuario', error });
    }
  },

  // Búsqueda de usuarios por nombre (parámetro en la ruta)
  buscarPorNombre: async (req, res) => {
    try {
      const resultados = await Usuario.buscarPorNombre(req.params.nombre);
      res.json(resultados);
    } catch (error) {
      res.status(500).json({ message: 'Error en búsqueda', error });
    }
  },

  // Actualización de contraseña
  // Verifica que el usuario tenga permiso (sea el mismo o admin),
  // valida la contraseña actual (si no es admin), y actualiza la contraseña en la BD.
  actualizarContraseña: async (req, res) => {
    const idSolicitado = parseInt(req.params.id);
    const { id, rol } = req.usuario; // Datos del usuario autenticado
    const { nuevaContraseña, actualContraseña } = req.body;

    if (rol !== 'admin' && id !== idSolicitado) {
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

  // Actualiza el rol de un usuario
  actualizar: async (req, res) => {
    const id = parseInt(req.params.id);
    const { rol } = req.body;

    try {
      const usuario = await Usuario.buscarPorId(id);
      if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

      if (!rol) return res.status(400).json({ message: 'Se requiere el rol' });

      await Usuario.actualizar(id, { rol });
      res.json({ message: 'Rol actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar usuario', error });
    }
  },

  // Elimina un usuario por su ID
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
