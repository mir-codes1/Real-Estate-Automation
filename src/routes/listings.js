const express = require('express');
const router = express.Router();
const { getAllListings, getListingById, createListing } = require('../controllers/listingsController');
const { processListing } = require('../controllers/processController');
const { sendToAutomation } = require('../controllers/automationController');
const validateId = require('../middleware/validateId');

router.get('/', getAllListings);
router.get('/:id', validateId(), getListingById);
router.post('/', createListing);
router.post('/:id/process', validateId(), processListing);
router.post('/:id/send-to-automation', validateId(), sendToAutomation);

module.exports = router;
