// Importa el pool de conexiones a la base de datos
const pool = require('./db');

const Usuario = {
  // Crea un nuevo usuario con nombre, correo, contraseña y rol
  crear: async ({ nombre, correo, contraseña, rol }) => {
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES (?, ?, ?, ?)',
      [nombre, correo, contraseña, rol]
    );
    return result.insertId; // Retorna el ID del usuario creado
  },

  // Busca un usuario por correo electrónico (para login o validaciones)
  buscarPorCorreo: async (correo) => {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    return rows[0]; // Retorna el primer usuario encontrado o undefined si no existe
  },

  // Busca un usuario por su ID
  buscarPorId: async (id) => {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
    return rows[0];
  },

  // Busca usuarios cuyo nombre contiene la cadena dada (búsqueda parcial)
  buscarPorNombre: async (nombre) => {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE nombre LIKE ?', [`%${nombre}%`]);
    return rows;
  },

  // Obtiene todos los usuarios registrados
  obtenerTodos: async () => {
    const [rows] = await pool.query('SELECT * FROM usuarios');
    return rows;
  },

  // Actualiza la contraseña de un usuario dado su ID
  actualizarContraseña: async (id, nuevaContraseña) => {
    await pool.query('UPDATE usuarios SET contraseña = ? WHERE id_usuario = ?', [nuevaContraseña, id]);
  },

  // Actualiza cualquier dato de un usuario dado su ID y un objeto con los campos a modificar
  actualizar: async (id, datos) => {
    const campos = [];
    const valores = [];

    // Construye dinámicamente la lista de campos y valores para la consulta
    for (const campo in datos) {
      campos.push(`${campo} = ?`);
      valores.push(datos[campo]);
    }

    valores.push(id);
    const sql = `UPDATE usuarios SET ${campos.join(', ')} WHERE id_usuario = ?`;
    await pool.query(sql, valores);
  },

  // Elimina un usuario por su ID
  eliminar: async (id) => {
    await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
  }
};

module.exports = Usuario;