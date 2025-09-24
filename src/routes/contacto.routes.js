const express = require('express');
const router = express.Router();
const contactoCtrl = require('../controllers/contacto.controller');

// Rutas CRUD
router.get('/', contactoCtrl.getContactos);
router.get('/:id', contactoCtrl.getContactoById);
router.post('/', contactoCtrl.createContacto);
router.put('/:id', contactoCtrl.updateContacto);
router.delete('/:id', contactoCtrl.deleteContacto);

module.exports = router;
