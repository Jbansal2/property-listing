const express = require('express');
const router = express.Router();
const { addFavorite, getFavorites, removeFavorite } = require('../controllers/favorite');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, addFavorite);
router.get('/', authMiddleware, getFavorites);
router.delete('/:id', authMiddleware, removeFavorite);

module.exports = router;