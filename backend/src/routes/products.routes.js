const express = require('express');
const router = express.Router();
const productController = require('../controllers/products.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', productController.getProducts);

router.use(authMiddleware.authenticate);
router.post('/', authMiddleware.authorizeAdmin, productController.createProduct);
router.put('/:id', authMiddleware.authorizeAdmin, productController.updateProduct);
router.delete('/:id', authMiddleware.authorizeAdmin, productController.deleteProduct);

module.exports = router;