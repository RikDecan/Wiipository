const express = require('express');
const router = express.Router();
const LocationController = require('../controllers/location_controller');

// TODO: Implementeer de volgende routes:
// GET / - alle locations
// GET /:id - single location

// TODO: Voeg route toe voor alle locations
router.get('/', LocationController.getAll)

// TODO: Voeg route toe voor single location  
router.get('/:id', LocationController.getById)


module.exports = router;