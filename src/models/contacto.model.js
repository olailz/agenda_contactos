const mongoose = require('mongoose');
const validator = require('validator');

const contactoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    minlength: [3, "Mínimo 3 caracteres"]
  },
  telefono: {
    type: String,
    required: [true, "El teléfono es obligatorio"],
    validate: { validator: v => /^[0-9]{8,15}$/.test(v), message: "Teléfono inválido" }
  },
  correo: {
    type: String,
    validate: { validator: v => v === "" || validator.isEmail(v), message: "Correo inválido" }
  }
},{timestamps:true});

module.exports = mongoose.model('Contacto', contactoSchema);
