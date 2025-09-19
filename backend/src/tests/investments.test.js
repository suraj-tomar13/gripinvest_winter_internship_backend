const request = require('supertest');
const app = require('../app');

// Mock the database service
jest.mock('../services/db.service', () => ({
    execute: jest.fn()
}));

const pool = require('../services/db.service');

describe('Investments API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/investments', () => {
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

        it('should create an investment successfully', async () => {
            const investmentData = {
                product_id: '456',
                amount: 5000
            };

            const mockProduct = {
                annual_yield: 7.0,
                tenure_months: 24
            };

            pool.execute
                .mockResolvedValueOnce([[mockProduct]]) // Product query
                .mockResolvedValueOnce([{ insertId: '789' }]); // Investment insert

            const response = await request(app)
                .post('/api/investments')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(investmentData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Investment successful');
            expect(response.body).toHaveProperty('investmentId', '789');
        });

        it('should return 400 for insufficient funds', async () => {
            const investmentData = {
                product_id: '456',
                amount: 200000 // More than user balance (100000)
            };

            const response = await request(app)
                .post('/api/investments')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(investmentData);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Insufficient funds. Please top up your account.');
        });

        it('should return 404 for non-existent product', async () => {
            const investmentData = {
                product_id: '999',
                amount: 5000
            };

            pool.execute.mockResolvedValueOnce([[]]); // No product found

            const response = await request(app)
                .post('/api/investments')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(investmentData);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Product not found');
        });

        it('should return 401 without authentication', async () => {
            const investmentData = {
                product_id: '456',
                amount: 5000
            };

            const response = await request(app)
                .post('/api/investments')
                .send(investmentData);

            expect(response.status).toBe(401);
        });

        it('should return 500 for database error', async () => {
            const investmentData = {
                product_id: '456',
                amount: 5000
            };

            pool.execute.mockRejectedValueOnce(new Error('Database connection failed'));

            const response = await request(app)
                .post('/api/investments')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(investmentData);

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', 'Failed to make investment');
        });
    });

    describe('GET /api/investments/portfolio', () => {
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

        it('should get portfolio successfully', async () => {
            const mockPortfolio = [
                {
                    id: '789',
                    user_id: '123',
                    product_id: '456',
                    amount: 5000,
                    expected_return: 5350,
                    maturity_date: '2025-12-31',
                    status: 'active',
                    product_name: 'Test Bond',
                    risk_level: 'low'
                }
            ];

            pool.execute.mockResolvedValueOnce([mockPortfolio]);

            const response = await request(app)
                .get('/api/investments/portfolio')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('portfolio');
            expect(response.body).toHaveProperty('insights');
            expect(response.body.portfolio).toEqual(mockPortfolio);
            expect(response.body.insights).toHaveProperty('totalInvested');
            expect(response.body.insights).toHaveProperty('riskDistribution');
        });

        it('should return 401 without authentication', async () => {
            const response = await request(app)
                .get('/api/investments/portfolio');

            expect(response.status).toBe(401);
        });

        it('should return 500 for database error', async () => {
            pool.execute.mockRejectedValueOnce(new Error('Database connection failed'));

            const response = await request(app)
                .get('/api/investments/portfolio')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', 'Failed to fetch portfolio');
        });
    });
});
