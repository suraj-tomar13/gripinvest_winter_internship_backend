const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investments.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware.authenticate);
router.post('/', investmentController.invest);
router.get('/portfolio', investmentController.getPortfolio);

module.exports = router;