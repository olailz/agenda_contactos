const express = require('express');
const router = express.Router();
const contactoCtrl = require('../controllers/contacto.controller');

router.post('/', contactoCtrl.createContacto);
router.get('/', contactoCtrl.getContactos);
router.get('/:id', contactoCtrl.getContactoById);
router.put('/:id', contactoCtrl.updateContacto);
router.delete('/:id', contactoCtrl.deleteContacto);

module.exports = router;
