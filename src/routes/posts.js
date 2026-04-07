const express = require('express');
const router = express.Router();
const { getAllPosts } = require('../controllers/postsController');

router.get('/', getAllPosts);

module.exports = router;
