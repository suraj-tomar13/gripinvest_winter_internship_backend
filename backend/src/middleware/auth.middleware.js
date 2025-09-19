const { verifyToken } = require('../utils/jwt');
const pool = require('../services/db.service');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Access token required' });
        }

        const token = authHeader.substring(7);
        const decoded = verifyToken(token);
        
        if (!decoded) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        // Verify user still exists in database
        const [rows] = await pool.execute('SELECT id, email, first_name, last_name FROM users WHERE id = ?', [decoded.id]);
        if (rows.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = rows[0];
        next();
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed' });
    }
};

const authorizeAdmin = (req, res, next) => {
    // For this demo, we'll consider all authenticated users as admins
    // In a real application, you'd check for admin role in the database
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    next();
};

module.exports = {
    authenticate,
    authorizeAdmin
};
