const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const usuariosRoutes = require('./routes/usuarios.routes');
const equiposRoutes = require('./routes/equipos.routes');
const movimientosRoutes = require('./routes/movimientos.routes');

app.use(cors());
app.use(express.json());

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/equipos', equiposRoutes);
app.use('/api/movimientos', movimientosRoutes);

app.get('/', (req, res) => res.send('API del laboratorio en funcionamiento'));

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));