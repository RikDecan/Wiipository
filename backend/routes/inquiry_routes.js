const express = require('express');
const router = express.Router();
const InquiryController = require('../controllers/inquiry_controller');

// TODO: Implementeer de volgende routes:
// POST / - create new inquiry
// GET / - get all inquiries

// TODO: Voeg route toe voor nieuwe inquiry
router.post('/', InquiryController.create);

// TODO: Voeg route toe voor alle inquiries
router.get('/', InquiryController.getAll);

module.exports = router;