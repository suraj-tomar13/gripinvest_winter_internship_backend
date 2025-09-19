const bcrypt = require('bcrypt');

// Number of salt rounds for hashing. Higher value is more secure but slower.
const saltRounds = 10;

exports.hashPassword = async (password) => {
    // Hashes a plaintext password using bcrypt.
    return await bcrypt.hash(password, saltRounds);
};

exports.comparePassword = async (password, hash) => {
    // Compares a plaintext password with a stored hash.
    return await bcrypt.compare(password, hash);
};