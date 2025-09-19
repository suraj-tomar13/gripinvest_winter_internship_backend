const pool = require('../services/db.service');

class Investment {
    static async create(investmentData) {
        const { user_id, product_id, amount, expected_return, maturity_date } = investmentData;
        const [result] = await pool.execute(
            'INSERT INTO investments (user_id, product_id, amount, expected_return, maturity_date) VALUES (?, ?, ?, ?, ?)',
            [user_id, product_id, amount, expected_return, maturity_date]
        );
        return result.insertId;
    }

    static async findByUserId(user_id) {
        const [rows] = await pool.execute(
            `SELECT i.*, p.name AS product_name, p.risk_level, p.investment_type, p.annual_yield
             FROM investments i
             JOIN investment_products p ON i.product_id = p.id
             WHERE i.user_id = ? ORDER BY i.invested_at DESC`,
            [user_id]
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM investments WHERE id = ?', [id]);
        return rows[0] || null;
    }

    static async findByUserAndProduct(user_id, product_id) {
        const [rows] = await pool.execute(
            'SELECT * FROM investments WHERE user_id = ? AND product_id = ?',
            [user_id, product_id]
        );
        return rows;
    }

    static async updateStatus(id, status) {
        const [result] = await pool.execute('UPDATE investments SET status = ? WHERE id = ?', [status, id]);
        return result.affectedRows > 0;
    }

    static async getTotalInvestmentByUser(user_id) {
        const [rows] = await pool.execute(
            'SELECT SUM(amount) as total FROM investments WHERE user_id = ? AND status = "active"',
            [user_id]
        );
        return rows[0].total || 0;
    }

    static async getPortfolioInsights(user_id) {
        const [rows] = await pool.execute(
            `SELECT p.risk_level, COUNT(*) as count, SUM(i.amount) as total_amount
             FROM investments i
             JOIN investment_products p ON i.product_id = p.id
             WHERE i.user_id = ? AND i.status = 'active'
             GROUP BY p.risk_level`,
            [user_id]
        );
        
        const insights = {
            riskDistribution: { low: 0, moderate: 0, high: 0 },
            totalInvested: 0,
            diversificationScore: 0
        };

        rows.forEach(row => {
            insights.riskDistribution[row.risk_level] = row.total_amount;
            insights.totalInvested += row.total_amount;
        });

        // Calculate diversification score (simplified)
        const riskLevels = Object.values(insights.riskDistribution).filter(val => val > 0);
        insights.diversificationScore = riskLevels.length > 1 ? Math.min(100, riskLevels.length * 25) : 25;

        return insights;
    }
}

module.exports = Investment;
