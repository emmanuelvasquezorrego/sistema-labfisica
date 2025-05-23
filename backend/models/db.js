// Importa el módulo mysql2 en su versión con promesas para trabajar con bases de datos de forma asíncrona
const mysql = require('mysql2/promise');
// Carga las variables de entorno definidas en el archivo .env
require('dotenv').config();

// Crea un pool de conexiones a la base de datos MySQL utilizando configuración desde variables de entorno
const pool = mysql.createPool({
  host: process.env.DB_HOST,           // Dirección del servidor de base de datos
  user: process.env.DB_USER,           // Usuario de la base de datos
  password: process.env.DB_PASSWORD,   // Contraseña del usuario
  database: process.env.DB_NAME,       // Nombre de la base de datos a utilizar
  waitForConnections: true,            // Esperar si no hay conexiones disponibles en el pool
  connectionLimit: 10                  // Número máximo de conexiones simultáneas en el pool
});

// Exporta el pool para poder reutilizarlo en otros módulos que necesiten acceder a la base de datos
module.exports = pool;
