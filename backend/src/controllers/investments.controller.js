const pool = require('../services/db.service');

exports.invest = async (req, res) => {
    const { product_id, amount } = req.body;
    const user_id = req.user.id;

    const userBalance = 100000;
    if (amount > userBalance) {
        res.locals.errorMessage = 'Insufficient funds';
        return res.status(400).json({ error: 'Insufficient funds. Please top up your account.' });
    }

    try {
        const [productRows] = await pool.execute('SELECT annual_yield, tenure_months FROM investment_products WHERE id = ?', [product_id]);
        const product = productRows[0];
        if (!product) {
            res.locals.errorMessage = 'Product not found';
            return res.status(404).json({ error: 'Product not found' });
        }

        const expected_return = amount + (amount * product.annual_yield / 100);
        const maturity_date = new Date();
        maturity_date.setMonth(maturity_date.getMonth() + product.tenure_months);

        const [result] = await pool.execute(
            `INSERT INTO investments (user_id, product_id, amount, expected_return, maturity_date) 
            VALUES (?, ?, ?, ?, ?)`,
            [user_id, product_id, amount, expected_return, maturity_date]
        );
        res.status(201).json({ message: 'Investment successful', investmentId: result.insertId });
    } catch (error) {
        res.locals.errorMessage = 'Failed to make investment';
        res.status(500).json({ error: 'Failed to make investment', message: error.message });
    }
};

exports.getPortfolio = async (req, res) => {
    const user_id = req.user.id;
    try {
        const [rows] = await pool.execute(
            `SELECT i.*, p.name AS product_name, p.risk_level
            FROM investments i
            JOIN investment_products p ON i.product_id = p.id
            WHERE i.user_id = ?`,
            [user_id]
        );
        
        const totalValue = rows.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        const insights = {
            riskDistribution: { low: 0, moderate: 0, high: 0 },
            totalInvested: totalValue
        };
        
        res.status(200).json({ portfolio: rows, insights });
    } catch (error) {
        res.locals.errorMessage = 'Failed to fetch portfolio';
        res.status(500).json({ error: 'Failed to fetch portfolio', message: error.message });
    }
};