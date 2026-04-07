const express = require('express');
const router = express.Router();
const { getAllLogs, getLogsByListingId } = require('../controllers/logsController');
const validateId = require('../middleware/validateId');

router.get('/', getAllLogs);
router.get('/:listingId', validateId('listingId'), getLogsByListingId);

module.exports = router;
