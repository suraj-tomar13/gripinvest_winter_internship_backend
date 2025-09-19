const pool = require('../services/db.service');

const logTransaction = async (user, req, res) => {
    const { method, originalUrl: endpoint } = req;
    const { statusCode } = res;
    const error_message = res.locals.errorMessage || null;

    const user_id = user ? user.id : null;
    const email = user ? user.email : null;

    const query = `
        INSERT INTO transaction_logs (user_id, email, endpoint, http_method, status_code, error_message)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
        await pool.execute(query, [user_id, email, endpoint, method, statusCode, error_message]);
    } catch (error) {
        console.error('Failed to log transaction:', error);
    }
};

module.exports = { logTransaction };