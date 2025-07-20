const express = require('express');
const router = express.Router();
const PropertyController = require('../controllers/property_controller');

// TODO✅: Implementeer de volgende routes:
// GET / - alle properties
// GET /featured - featured properties  
// GET /:id - single property

// TODO✅: Voeg route toe voor alle properties
router.get('/', PropertyController.getAll);
// TODO✅: Voeg route toe voor featured properties
router.get('/featured', PropertyController.getFeatured);
// TODO✅: Voeg route toe voor single property
router.get('/:id', PropertyController.getById);




module.exports = router;