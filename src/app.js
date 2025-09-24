const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir frontend desde carpeta public
app.use(express.static(path.join(__dirname, '../public')));

// Rutas API
const contactoRoutes = require('./routes/contacto.routes');
app.use('/api/contactos', contactoRoutes);

// Conectar a Mongo y levantar servidor
const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
  );
});
