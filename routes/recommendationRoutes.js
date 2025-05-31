const express = require('express');
const router = express.Router();
const { recommendProperty, getRecommendations } = require('../controllers/recommendation');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, recommendProperty);
router.get('/', authMiddleware, getRecommendations);

module.exports = router;