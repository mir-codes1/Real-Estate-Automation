const express = require('express');
const router = express.Router();
const { generateCaptionHandler } = require('../controllers/aiController');

router.post('/generate-caption', generateCaptionHandler);

module.exports = router;
