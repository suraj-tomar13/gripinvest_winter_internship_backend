const pool = require('../services/db.service');

class User {
    static async create(userData) {
        const { first_name, last_name, email, password_hash, risk_appetite = 'moderate' } = userData;
        const [result] = await pool.execute(
            'INSERT INTO users (first_name, last_name, email, password_hash, risk_appetite) VALUES (?, ?, ?, ?, ?)',
            [first_name, last_name, email, password_hash, risk_appetite]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0] || null;
    }

    static async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0] || null;
    }

    static async update(id, updateData) {
        const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
        const values = Object.values(updateData);
        values.push(id);
        
        const [result] = await pool.execute(`UPDATE users SET ${fields} WHERE id = ?`, values);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = User;
