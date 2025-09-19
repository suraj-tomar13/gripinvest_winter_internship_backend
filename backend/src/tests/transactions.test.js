const request = require('supertest');
const app = require('../app');

// Mock the database service
jest.mock('../services/db.service', () => ({
    execute: jest.fn()
}));

const pool = require('../services/db.service');

describe('Transactions API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/transactions', () => {
        const mockToken = 'valid-jwt-token';
        const mockUser = { id: '123', email: 'user@example.com' };

        beforeEach(() => {
            // Mock authentication middleware
            app.use((req, res, next) => {
                if (req.headers.authorization === `Bearer ${mockToken}`) {
                    req.user = mockUser;
                }
                next();
            });
        });

        it('should get transaction logs successfully', async () => {
            const mockLogs = [
                {
                    id: 1,
                    user_id: '123',
                    email: 'user@example.com',
                    endpoint: '/api/products',
                    http_method: 'GET',
                    status_code: 200,
                    error_message: null,
                    created_at: '2024-01-01T00:00:00.000Z'
                },
                {
                    id: 2,
                    user_id: '123',
                    email: 'user@example.com',
                    endpoint: '/api/investments',
                    http_method: 'POST',
                    status_code: 201,
                    error_message: null,
                    created_at: '2024-01-01T01:00:00.000Z'
                }
            ];

            pool.execute.mockResolvedValueOnce([mockLogs]);

            const response = await request(app)
                .get('/api/transactions')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('logs');
            expect(response.body).toHaveProperty('errorSummary');
            expect(response.body.logs).toEqual(mockLogs);
        });

        it('should filter logs by user_id', async () => {
            const mockLogs = [
                {
                    id: 1,
                    user_id: '123',
                    email: 'user@example.com',
                    endpoint: '/api/products',
                    http_method: 'GET',
                    status_code: 200,
                    error_message: null,
                    created_at: '2024-01-01T00:00:00.000Z'
                }
            ];

            pool.execute.mockResolvedValueOnce([mockLogs]);

            const response = await request(app)
                .get('/api/transactions?user_id=123')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(200);
            expect(response.body.logs).toEqual(mockLogs);
        });

        it('should filter logs by email', async () => {
            const mockLogs = [
                {
                    id: 1,
                    user_id: '123',
                    email: 'user@example.com',
                    endpoint: '/api/products',
                    http_method: 'GET',
                    status_code: 200,
                    error_message: null,
                    created_at: '2024-01-01T00:00:00.000Z'
                }
            ];

            pool.execute.mockResolvedValueOnce([mockLogs]);

            const response = await request(app)
                .get('/api/transactions?email=user@example.com')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(200);
            expect(response.body.logs).toEqual(mockLogs);
        });

        it('should return 401 without authentication', async () => {
            const response = await request(app)
                .get('/api/transactions');

            expect(response.status).toBe(401);
        });

        it('should return 500 for database error', async () => {
            pool.execute.mockRejectedValueOnce(new Error('Database connection failed'));

            const response = await request(app)
                .get('/api/transactions')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', 'Failed to fetch logs');
        });
    });
});
