const Contacto = require('../models/contacto.model');

// Crear contacto
exports.createContacto = async (req, res) => {
  try {
    const contacto = new Contacto(req.body);
    await contacto.save();
    res.status(201).json(contacto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar contactos
exports.getContactos = async (req, res) => {
  try {
    const { nombre } = req.query;
    const filtro = nombre ? { nombre: new RegExp(nombre, 'i') } : {};
    const contactos = await Contacto.find(filtro);
    res.json(contactos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un contacto por ID
exports.getContactoById = async (req, res) => {
  try {
    const contacto = await Contacto.findById(req.params.id);
    if (!contacto) return res.status(404).json({ error: "No encontrado" });
    res.json(contacto);
  } catch (error) {
    res.status(400).json({ error: "ID inválido" });
  }
};

// Actualizar contacto
exports.updateContacto = async (req, res) => {
  try {
    const contacto = await Contacto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!contacto) return res.status(404).json({ error: "No encontrado" });
    res.json(contacto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar contacto
exports.deleteContacto = async (req, res) => {
  try {
    const contacto = await Contacto.findByIdAndDelete(req.params.id);
    if (!contacto) return res.status(404).json({ error: "No encontrado" });
    res.json({ message: "Eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
