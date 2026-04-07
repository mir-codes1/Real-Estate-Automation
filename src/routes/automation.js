const express = require('express');
const router = express.Router();
const { automationResult } = require('../controllers/callbackController');

router.post('/result', automationResult);

module.exports = router;
