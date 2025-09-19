const pool = require('../services/db.service');

exports.getTransactions = async (req, res) => {
    const { user_id, email } = req.query;

    let query = 'SELECT * FROM transaction_logs WHERE 1=1';
    const params = [];

    if (user_id) {
        query += ' AND user_id = ?';
        params.push(user_id);
    }
    if (email) {
        query += ' AND email = ?';
        params.push(email);
    }

    try {
        const [rows] = await pool.execute(query, params);
        
        const errorSummary = 'No errors found for this user.'; // Placeholder.

        res.status(200).json({ logs: rows, errorSummary });
    } catch (error) {
        res.locals.errorMessage = 'Failed to fetch logs';
        res.status(500).json({ error: 'Failed to fetch logs', message: error.message });
    }
};