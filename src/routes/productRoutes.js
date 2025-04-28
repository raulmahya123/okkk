const express = require('express');
const { getAllProducts, createProduct, updateProduct } = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');
const { route } = require('./authRoutes');
const router = express.Router();

router.get('/', protect, getAllProducts);
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);

module.exports = router;
