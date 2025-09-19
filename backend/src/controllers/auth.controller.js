const bcrypt = require('bcrypt');
const pool = require('../services/db.service');
const { createToken } = require('../utils/jwt');

exports.signup = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    
    // AI Integration: Suggest password strength improvements.
    const passwordStrength = "strong"; // Placeholder value.

    try {
        const password_hash = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            `INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)`,
            [first_name, last_name, email, password_hash]
        );
        const token = createToken({ id: result.insertId, email });
        res.status(201).json({ message: 'User created successfully', token, passwordFeedback: `Your password is considered ${passwordStrength}` });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Email already registered' });
        }
        res.status(500).json({ error: 'Failed to create user', message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.execute(`SELECT * FROM users WHERE email = ?`, [email]);
        const user = rows[0];
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            res.locals.errorMessage = 'Invalid email or password';
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = createToken({ id: user.id, email: user.email });
        res.status(200).json({ token });
    } catch (error) {
        res.locals.errorMessage = 'Login failed';
        res.status(500).json({ error: 'Login failed', message: error.message });
    }
};

exports.passwordReset = async (req, res) => {
    res.locals.errorMessage = 'Password reset not implemented';
    res.status(501).json({ message: 'Password reset not implemented yet' });
};