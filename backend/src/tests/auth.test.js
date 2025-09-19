const request = require('supertest');
const app = require('../app');
const bcrypt = require('bcrypt');
const { createToken } = require('../utils/jwt');

// Mock the database service
jest.mock('../services/db.service', () => ({
    execute: jest.fn()
}));

const pool = require('../services/db.service');

describe('Authentication API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/signup', () => {
        it('should create a new user successfully', async () => {
            const userData = {
                first_name: 'John',
                last_name: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123'
            };

            pool.execute.mockResolvedValueOnce([{ insertId: '123' }]);

            const response = await request(app)
                .post('/api/auth/signup')
                .send(userData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'User created successfully');
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('passwordFeedback');
        });

        it('should return 409 for duplicate email', async () => {
            const userData = {
                first_name: 'John',
                last_name: 'Doe',
                email: 'existing@example.com',
                password: 'password123'
            };

            const error = new Error('Duplicate entry');
            error.code = 'ER_DUP_ENTRY';
            pool.execute.mockRejectedValueOnce(error);

            const response = await request(app)
                .post('/api/auth/signup')
                .send(userData);

            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty('error', 'Email already registered');
        });

        it('should return 500 for database error', async () => {
            const userData = {
                first_name: 'John',
                last_name: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123'
            };

            pool.execute.mockRejectedValueOnce(new Error('Database connection failed'));

            const response = await request(app)
                .post('/api/auth/signup')
                .send(userData);

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', 'Failed to create user');
        });

        it('should validate required fields', async () => {
            const userData = {
                first_name: 'John',
                // missing last_name, email, password
            };

            const response = await request(app)
                .post('/api/auth/signup')
                .send(userData);

            expect(response.status).toBe(500);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully with valid credentials', async () => {
            const credentials = {
                email: 'john.doe@example.com',
                password: 'password123'
            };

            const hashedPassword = await bcrypt.hash('password123', 10);
            const mockUser = {
                id: '123',
                email: 'john.doe@example.com',
                password_hash: hashedPassword
            };

            pool.execute.mockResolvedValueOnce([[mockUser]]);

            const response = await request(app)
                .post('/api/auth/login')
                .send(credentials);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
        });

        it('should return 401 for invalid email', async () => {
            const credentials = {
                email: 'nonexistent@example.com',
                password: 'password123'
            };

            pool.execute.mockResolvedValueOnce([[]]);

            const response = await request(app)
                .post('/api/auth/login')
                .send(credentials);

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Invalid email or password');
        });

        it('should return 401 for invalid password', async () => {
            const credentials = {
                email: 'john.doe@example.com',
                password: 'wrongpassword'
            };

            const hashedPassword = await bcrypt.hash('password123', 10);
            const mockUser = {
                id: '123',
                email: 'john.doe@example.com',
                password_hash: hashedPassword
            };

            pool.execute.mockResolvedValueOnce([[mockUser]]);

            const response = await request(app)
                .post('/api/auth/login')
                .send(credentials);

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Invalid email or password');
        });

        it('should return 500 for database error', async () => {
            const credentials = {
                email: 'john.doe@example.com',
                password: 'password123'
            };

            pool.execute.mockRejectedValueOnce(new Error('Database connection failed'));

            const response = await request(app)
                .post('/api/auth/login')
                .send(credentials);

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', 'Login failed');
        });
    });

    describe('POST /api/auth/password-reset', () => {
        it('should return 501 for not implemented', async () => {
            const response = await request(app)
                .post('/api/auth/password-reset')
                .send({ email: 'john.doe@example.com' });

            expect(response.status).toBe(501);
            expect(response.body).toHaveProperty('message', 'Password reset not implemented yet');
        });
    });
});

describe('JWT Utils', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        process.env = { ...originalEnv };
        process.env.JWT_SECRET = 'test-secret';
        process.env.JWT_EXPIRES_IN = '1h';
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it('should create a valid token', () => {
        const payload = { id: '123', email: 'test@example.com' };
        const token = createToken(payload);
        
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
    });
});
