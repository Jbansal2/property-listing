const express = require('express');
const router = express.Router();
const { createProperty, getProperties, updateProperty, deleteProperty } = require('../controllers/property');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createProperty);
router.get('/', getProperties);
router.put('/:id', authMiddleware, updateProperty);
router.delete('/:id', authMiddleware, deleteProperty);

module.exports = router;