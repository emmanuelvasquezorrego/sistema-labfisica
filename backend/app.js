const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Importar rutas de los distintos módulos
const usuariosRoutes = require('./routes/usuarios.routes');
const equiposRoutes = require('./routes/equipos.routes');
const movimientosRoutes = require('./routes/movimientos.routes');

// Middleware para habilitar CORS y parsear JSON
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/equipos', equiposRoutes);
app.use('/api/movimientos', movimientosRoutes);

// Ruta raíz para comprobar que el servidor funciona
app.get('/', (req, res) => res.send('API del laboratorio en funcionamiento'));

// Iniciar el servidor en el puerto definido
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));