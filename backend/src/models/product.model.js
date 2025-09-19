const pool = require('../services/db.service');

class Product {
    static async create(productData) {
        const { name, investment_type, tenure_months, annual_yield, risk_level, min_investment, max_investment, description } = productData;
        const [result] = await pool.execute(
            'INSERT INTO investment_products (name, investment_type, tenure_months, annual_yield, risk_level, min_investment, max_investment, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, investment_type, tenure_months, annual_yield, risk_level, min_investment, max_investment, description]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await pool.execute('SELECT * FROM investment_products ORDER BY created_at DESC');
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM investment_products WHERE id = ?', [id]);
        return rows[0] || null;
    }

    static async findByType(investment_type) {
        const [rows] = await pool.execute('SELECT * FROM investment_products WHERE investment_type = ? ORDER BY created_at DESC', [investment_type]);
        return rows;
    }

    static async findByRiskLevel(risk_level) {
        const [rows] = await pool.execute('SELECT * FROM investment_products WHERE risk_level = ? ORDER BY created_at DESC', [risk_level]);
        return rows;
    }

    static async update(id, updateData) {
        const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
        const values = Object.values(updateData);
        values.push(id);
        
        const [result] = await pool.execute(`UPDATE investment_products SET ${fields} WHERE id = ?`, values);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM investment_products WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async getRecommendedProducts(userRiskAppetite) {
        // Get products that match user's risk appetite, ordered by yield
        const [rows] = await pool.execute(
            'SELECT * FROM investment_products WHERE risk_level = ? ORDER BY annual_yield DESC LIMIT 5',
            [userRiskAppetite]
        );
        return rows;
    }
}

module.exports = Product;
