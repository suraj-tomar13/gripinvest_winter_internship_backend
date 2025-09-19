const pool = require('../services/db.service');

class TransactionLog {
    static async create(logData) {
        const { user_id, email, endpoint, http_method, status_code, error_message } = logData;
        const [result] = await pool.execute(
            'INSERT INTO transaction_logs (user_id, email, endpoint, http_method, status_code, error_message) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, email, endpoint, http_method, status_code, error_message]
        );
        return result.insertId;
    }

    static async findByUserId(user_id, limit = 100) {
        const [rows] = await pool.execute(
            'SELECT * FROM transaction_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
            [user_id, limit]
        );
        return rows;
    }

    static async findByEmail(email, limit = 100) {
        const [rows] = await pool.execute(
            'SELECT * FROM transaction_logs WHERE email = ? ORDER BY created_at DESC LIMIT ?',
            [email, limit]
        );
        return rows;
    }

    static async getErrorSummary(user_id) {
        const [rows] = await pool.execute(
            `SELECT 
                COUNT(*) as total_errors,
                endpoint,
                error_message,
                DATE(created_at) as error_date
             FROM transaction_logs 
             WHERE user_id = ? AND status_code >= 400 AND error_message IS NOT NULL
             GROUP BY endpoint, error_message, DATE(created_at)
             ORDER BY total_errors DESC, error_date DESC
             LIMIT 10`,
            [user_id]
        );
        return rows;
    }

    static async getErrorSummaryByEmail(email) {
        const [rows] = await pool.execute(
            `SELECT 
                COUNT(*) as total_errors,
                endpoint,
                error_message,
                DATE(created_at) as error_date
             FROM transaction_logs 
             WHERE email = ? AND status_code >= 400 AND error_message IS NOT NULL
             GROUP BY endpoint, error_message, DATE(created_at)
             ORDER BY total_errors DESC, error_date DESC
             LIMIT 10`,
            [email]
        );
        return rows;
    }

    static async getRecentLogs(limit = 50) {
        const [rows] = await pool.execute(
            'SELECT * FROM transaction_logs ORDER BY created_at DESC LIMIT ?',
            [limit]
        );
        return rows;
    }

    static async getStatsByEndpoint() {
        const [rows] = await pool.execute(
            `SELECT 
                endpoint,
                http_method,
                COUNT(*) as total_requests,
                AVG(status_code) as avg_status_code,
                SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as error_count
             FROM transaction_logs 
             GROUP BY endpoint, http_method
             ORDER BY total_requests DESC`
        );
        return rows;
    }
}

module.exports = TransactionLog;
