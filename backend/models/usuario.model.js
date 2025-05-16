const pool = require('./db');

const Usuario = {
  crear: async ({ nombre, correo, contraseña, rol }) => {
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES (?, ?, ?, ?)',
      [nombre, correo, contraseña, rol]
    );
    return result.insertId;
  },

  buscarPorCorreo: async (correo) => {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    return rows[0];
  },

  buscarPorId: async (id) => {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
    return rows[0];
  },

  buscarPorNombre: async (nombre) => {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE nombre LIKE ?', [`%${nombre}%`]);
    return rows;
  },

  obtenerTodos: async () => {
    const [rows] = await pool.query('SELECT * FROM usuarios');
    return rows;
  },

  actualizarContraseña: async (id, nuevaContraseña) => {
    await pool.query('UPDATE usuarios SET contraseña = ? WHERE id_usuario = ?', [nuevaContraseña, id]);
  },

  eliminar: async (id) => {
    await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
  }
};

module.exports = Usuario;