const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactions.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware.authenticate);
router.get('/', transactionController.getTransactions);

module.exports = router;