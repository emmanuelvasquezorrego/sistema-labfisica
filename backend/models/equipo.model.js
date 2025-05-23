const pool = require('./db');

// Modelo para manejar las operaciones CRUD de equipos
const Equipo = {
  // Método para crear un nuevo equipo
  crear: async ({ nombre, tipo, codigo_inventario, estado }) => {
    const [result] = await pool.query(
      'INSERT INTO equipos (nombre, tipo, codigo_inventario, estado) VALUES (?, ?, ?, ?)',
      [nombre, tipo, codigo_inventario, estado]
    );
    return result.insertId;
  },

  // Métodos para obtener, actualizar y eliminar equipos
  obtenerTodos: async () => {
    const [rows] = await pool.query('SELECT * FROM equipos');
    return rows;
  },

  obtenerPorId: async (id) => {
    const [rows] = await pool.query('SELECT * FROM equipos WHERE id_equipo = ?', [id]);
    return rows[0];
  },

  obtenerPorTipo: async (tipo) => {
    const [rows] = await pool.query('SELECT * FROM equipos WHERE tipo = ?', [tipo]);
    return rows;
  },

  buscarPorNombre: async (nombre) => {
    const [rows] = await pool.query('SELECT * FROM equipos WHERE nombre LIKE ?', [`%${nombre}%`]);
    return rows;
  },

  actualizar: async (id, datos) => {
    const campos = [];
    const valores = [];

    for (const campo in datos) {
      campos.push(`${campo} = ?`);
      valores.push(datos[campo]);
    }

    valores.push(id);
    const sql = `UPDATE equipos SET ${campos.join(', ')} WHERE id_equipo = ?`;
    await pool.query(sql, valores);
  },

  eliminar: async (id) => {
    await pool.query('DELETE FROM equipos WHERE id_equipo = ?', [id]);
  }
};

module.exports = Equipo;