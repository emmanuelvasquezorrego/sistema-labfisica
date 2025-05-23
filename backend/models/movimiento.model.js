// Importa el pool de conexiones a la base de datos
const pool = require('./db');

const Movimiento = {
  // Obtiene todos los equipos cuyo estado es 'Disponible'
  obtenerEquiposDisponibles: async () => {
    const [rows] = await pool.query("SELECT * FROM equipos WHERE estado = 'Disponible'");
    return rows;
  },

  // Crea un nuevo préstamo y registra los equipos asociados al mismo
  crearPrestamo: async ({ id_usuario, fecha_prestamo, fecha_devolucion_esperada, equipos }) => {
    // Inserta el préstamo en la tabla 'prestamos'
    const [result] = await pool.query(
      'INSERT INTO prestamos (id_usuario, fecha_prestamo, fecha_devolucion_esperada) VALUES (?, ?, ?)',
      [id_usuario, fecha_prestamo, fecha_devolucion_esperada]
    );

    const id_prestamo = result.insertId;

    // Registra cada equipo en la tabla de detalle del préstamo y cambia su estado a 'Prestado'
    for (const id_equipo of equipos) {
      await Movimiento.agregarDetallePrestamo(id_prestamo, id_equipo);
      await Movimiento.actualizarEstadoEquipo(id_equipo, 'Prestado');
    }

    // Crea un recibo asociado al préstamo
    await Movimiento.crearRecibo(id_prestamo, equipos.length);

    return id_prestamo;
  },

  // Registra el detalle del préstamo (relación entre préstamo y equipo)
  agregarDetallePrestamo: async (id_prestamo, id_equipo) => {
    await pool.query(
      'INSERT INTO detalle_prestamo (id_prestamo, id_equipo) VALUES (?, ?)',
      [id_prestamo, id_equipo]
    );
  },

  // Actualiza el estado de un equipo (por ejemplo: Disponible, Prestado)
  actualizarEstadoEquipo: async (id_equipo, estado) => {
    await pool.query('UPDATE equipos SET estado = ? WHERE id_equipo = ?', [estado, id_equipo]);
  },

  // Registra un recibo en la tabla 'recibos' con la fecha actual y total de equipos prestados
  crearRecibo: async (id_prestamo, total_equipos) => {
    await pool.query(
      'INSERT INTO recibos (id_prestamo, fecha_emision, total_equipos) VALUES (?, CURDATE(), ?)',
      [id_prestamo, total_equipos]
    );
  },

  // Devuelve el historial de préstamos realizados por un usuario, incluyendo detalles de los equipos
  historialPorUsuario: async (id_usuario) => {
    const [rows] = await pool.query(
      `SELECT p.*, e.nombre AS equipo, e.tipo, p.estado
      FROM prestamos p
      JOIN detalle_prestamo dp ON p.id_prestamo = dp.id_prestamo
      JOIN equipos e ON dp.id_equipo = e.id_equipo
      WHERE p.id_usuario = ?
      ORDER BY p.fecha_prestamo DESC
      `,
      [id_usuario]
    );
    return rows;
  },

  // Obtiene todos los préstamos, con información del usuario y los equipos prestados
  todosLosPrestamos: async () => {
    const [rows] = await pool.query(`
      SELECT p.*, u.nombre, u.correo, e.nombre AS equipo, e.tipo
      FROM prestamos p
      JOIN usuarios u ON p.id_usuario = u.id_usuario
      JOIN detalle_prestamo dp ON p.id_prestamo = dp.id_prestamo
      JOIN equipos e ON dp.id_equipo = e.id_equipo
      ORDER BY p.fecha_prestamo DESC
    `);
    return rows;
  },

  // Marca un préstamo como devuelto y actualiza el estado de todos sus equipos a 'Disponible'
  marcarComoDevuelto: async (id_prestamo) => {
    // Actualiza la tabla 'prestamos' con la fecha de devolución real y estado 'Devuelto'
    await pool.query(`
      UPDATE prestamos 
      SET fecha_devolucion_real = CURDATE(), estado = 'Devuelto' 
      WHERE id_prestamo = ?
    `, [id_prestamo]);

    // Obtiene los equipos asociados al préstamo
    const [detalles] = await pool.query(
      "SELECT id_equipo FROM detalle_prestamo WHERE id_prestamo = ?",
      [id_prestamo]
    );

    // Cambia el estado de cada equipo a 'Disponible'
    for (const { id_equipo } of detalles) {
      await pool.query(
        "UPDATE equipos SET estado = 'Disponible' WHERE id_equipo = ?",
        [id_equipo]
      );
    }
  },

  // Calcula estadísticas de préstamos por mes y por equipo
  obtenerEstadisticasPorMesYEquipo: async () => {
    const [rows] = await pool.query(`
      SELECT 
        MONTH(p.fecha_prestamo) AS mes,
        e.nombre AS equipo,
        COUNT(*) AS cantidad
      FROM prestamos p
      JOIN detalle_prestamo dp ON p.id_prestamo = dp.id_prestamo
      JOIN equipos e ON dp.id_equipo = e.id_equipo
      GROUP BY mes, equipo
    `);

    // Convierte los números de mes en nombres y agrupa los datos
    const nombresMeses = [
      "", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const mapa = {};

    for (const fila of rows) {
      const nombreMes = nombresMeses[fila.mes];
      if (!mapa[nombreMes]) mapa[nombreMes] = { mes: nombreMes };
      mapa[nombreMes][fila.equipo] = fila.cantidad;
    }

    return Object.values(mapa); // Retorna un array con estadísticas por mes
  },

  // Devuelve los 10 equipos más prestados, ordenados por cantidad
  equiposMasPrestados: async () => {
    const [rows] = await pool.query(`
      SELECT e.nombre AS equipo, COUNT(*) AS cantidad
      FROM detalle_prestamo dp
      JOIN equipos e ON dp.id_equipo = e.id_equipo
      GROUP BY dp.id_equipo
      ORDER BY cantidad DESC
      LIMIT 10
    `);
    return rows;
  },
};

// Exporta el objeto Movimiento para utilizar sus funciones en otros módulos
module.exports = Movimiento;