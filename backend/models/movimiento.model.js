const pool = require('./db');

const Movimiento = {
  obtenerEquiposDisponibles: async () => {
    const [rows] = await pool.query("SELECT * FROM equipos WHERE estado = 'Disponible'");
    return rows;
  },

  crearPrestamo: async ({ id_usuario, fecha_prestamo, fecha_devolucion_esperada, equipos }) => {
    const [result] = await pool.query(
      'INSERT INTO prestamos (id_usuario, fecha_prestamo, fecha_devolucion_esperada) VALUES (?, ?, ?)',
      [id_usuario, fecha_prestamo, fecha_devolucion_esperada]
    );
    const id_prestamo = result.insertId;

    for (const id_equipo of equipos) {
      await pool.query('INSERT INTO detalle_prestamo (id_prestamo, id_equipo) VALUES (?, ?)', [id_prestamo, id_equipo]);
      await pool.query("UPDATE equipos SET estado = 'Prestado' WHERE id_equipo = ?", [id_equipo]);
    }

    return id_prestamo;
  },

  actualizarEstadoEquipo: async (id_equipo, estado) => {
    await pool.query('UPDATE equipos SET estado = ? WHERE id_equipo = ?', [estado, id_equipo]);
  },

  historialPorUsuario: async (id_usuario) => {
    const [rows] = await pool.query(
      `SELECT p.*, e.nombre AS equipo, e.tipo
       FROM prestamos p
       JOIN detalle_prestamo dp ON p.id_prestamo = dp.id_prestamo
       JOIN equipos e ON dp.id_equipo = e.id_equipo
       WHERE p.id_usuario = ?
       ORDER BY p.fecha_prestamo DESC`,
      [id_usuario]
    );
    return rows;
  }
};

module.exports = Movimiento;