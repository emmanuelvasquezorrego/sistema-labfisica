// Importa el pool de conexiones para interactuar con la base de datos MySQL
const pool = require('./db');

const Equipo = {
  // Crea un nuevo equipo en la base de datos con los datos proporcionados
  crear: async ({ nombre, tipo, codigo_inventario, estado }) => {
    const [result] = await pool.query(
      'INSERT INTO equipos (nombre, tipo, codigo_inventario, estado) VALUES (?, ?, ?, ?)',
      [nombre, tipo, codigo_inventario, estado]
    );
    return result.insertId; // Retorna el ID del nuevo equipo insertado
  },

  // Obtiene todos los equipos registrados en la base de datos
  obtenerTodos: async () => {
    const [rows] = await pool.query('SELECT * FROM equipos');
    return rows;
  },

  // Busca un equipo por su ID
  obtenerPorId: async (id) => {
    const [rows] = await pool.query('SELECT * FROM equipos WHERE id_equipo = ?', [id]);
    return rows[0]; // Retorna el primer (y único) resultado encontrado
  },

  // Filtra los equipos según el tipo especificado
  obtenerPorTipo: async (tipo) => {
    const [rows] = await pool.query('SELECT * FROM equipos WHERE tipo = ?', [tipo]);
    return rows;
  },

  // Busca equipos cuyo nombre contenga el texto proporcionado (búsqueda parcial)
  buscarPorNombre: async (nombre) => {
    const [rows] = await pool.query('SELECT * FROM equipos WHERE nombre LIKE ?', [`%${nombre}%`]);
    return rows;
  },

  // Actualiza uno o más campos de un equipo identificado por su ID
  actualizar: async (id, datos) => {
    const campos = [];  // Lista de campos a actualizar
    const valores = []; // Valores correspondientes

    // Recorre el objeto de datos para generar dinámicamente la consulta
    for (const campo in datos) {
      campos.push(`${campo} = ?`);
      valores.push(datos[campo]);
    }

    valores.push(id); // Agrega el ID al final para la cláusula WHERE
    const sql = `UPDATE equipos SET ${campos.join(', ')} WHERE id_equipo = ?`;
    await pool.query(sql, valores);
  },

  // Elimina un equipo de la base de datos por su ID
  eliminar: async (id) => {
    await pool.query('DELETE FROM equipos WHERE id_equipo = ?', [id]);
  }
};

// Exporta el objeto Equipo con todas sus funciones para usarlo en otros módulos
module.exports = Equipo;