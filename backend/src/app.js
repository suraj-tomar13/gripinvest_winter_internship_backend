const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/products.routes');
const investmentRoutes = require('./routes/investments.routes');
const transactionRoutes = require('./routes/transactions.routes');
const { logTransaction } = require('./utils/logger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // HTTP request logger

// Middleware to log all API calls
app.use((req, res, next) => {
    const user = req.user || null;
    res.on('finish', () => {
        logTransaction(user, req, res);
    });
    next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/transactions', transactionRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    // You would add database status check here
    res.status(200).json({ status: 'Service is up and running' });
});

module.exports = app;