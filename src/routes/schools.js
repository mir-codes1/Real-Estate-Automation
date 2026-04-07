const express = require('express');
const router = express.Router();
const { getNearbySchools } = require('../controllers/schoolsController');

router.get('/', getNearbySchools);

module.exports = router;
