const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const contactoRoutes = require('./routes/contacto.routes');
app.use('/api/contactos', contactoRoutes);

const PORT = process.env.PORT || 3000;
connectDB().then(()=>{
  app.listen(PORT,()=>console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
});
