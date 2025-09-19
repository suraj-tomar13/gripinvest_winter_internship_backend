const request = require('supertest');
const app = require('../app');

// Mock the database service
jest.mock('../services/db.service', () => ({
    execute: jest.fn()
}));

const pool = require('../services/db.service');

describe('Products API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/products', () => {
        it('should get all products successfully', async () => {
            const mockProducts = [
                {
                    id: '1',
                    name: 'Test Bond',
                    investment_type: 'bond',
                    tenure_months: 36,
                    annual_yield: 6.5,
                    risk_level: 'low',
                    min_investment: 1000,
                    max_investment: 100000,
                    description: 'Test bond description'
                }
            ];

            pool.execute.mockResolvedValueOnce([mockProducts]);

            const response = await request(app)
                .get('/api/products');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('products');
            expect(response.body.products).toEqual(mockProducts);
        });

        it('should return 500 for database error', async () => {
            pool.execute.mockRejectedValueOnce(new Error('Database connection failed'));

            const response = await request(app)
                .get('/api/products');

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', 'Failed to fetch products');
        });
    });

    describe('POST /api/products', () => {
        const mockToken = 'valid-jwt-token';
        const mockUser = { id: '123', email: 'admin@example.com' };

        beforeEach(() => {
            // Mock JWT verification
            jest.doMock('../utils/jwt', () => ({
                verifyToken: jest.fn().mockReturnValue(mockUser)
            }));
        });

        it('should create a product successfully', async () => {
            const productData = {
                name: 'New Bond Fund',
                investment_type: 'bond',
                tenure_months: 24,
                annual_yield: 7.0,
                risk_level: 'low',
                min_investment: 1000,
                max_investment: 50000
            };

            pool.execute.mockResolvedValueOnce([{ insertId: '456' }]);

            const response = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(productData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Product created successfully');
            expect(response.body).toHaveProperty('productId', '456');
        });

        it('should return 401 without authentication', async () => {
            const productData = {
                name: 'New Bond Fund',
                investment_type: 'bond',
                tenure_months: 24,
                annual_yield: 7.0,
                risk_level: 'low',
                min_investment: 1000
            };

            const response = await request(app)
                .post('/api/products')
                .send(productData);

            expect(response.status).toBe(401);
        });

        it('should return 500 for database error', async () => {
            const productData = {
                name: 'New Bond Fund',
                investment_type: 'bond',
                tenure_months: 24,
                annual_yield: 7.0,
                risk_level: 'low',
                min_investment: 1000
            };

            pool.execute.mockRejectedValueOnce(new Error('Database connection failed'));

            const response = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(productData);

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', 'Failed to create product');
        });
    });

    describe('PUT /api/products/:id', () => {
        const mockToken = 'valid-jwt-token';
        const mockUser = { id: '123', email: 'admin@example.com' };

        it('should update a product successfully', async () => {
            const updateData = {
                annual_yield: 8.0,
                risk_level: 'moderate'
            };

            pool.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const response = await request(app)
                .put('/api/products/123')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(updateData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Product updated successfully');
        });

        it('should return 404 for non-existent product', async () => {
            const updateData = {
                annual_yield: 8.0
            };

            pool.execute.mockResolvedValueOnce([{ affectedRows: 0 }]);

            const response = await request(app)
                .put('/api/products/999')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(updateData);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Product not found');
        });
    });

    describe('DELETE /api/products/:id', () => {
        const mockToken = 'valid-jwt-token';
        const mockUser = { id: '123', email: 'admin@example.com' };

        it('should delete a product successfully', async () => {
            pool.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const response = await request(app)
                .delete('/api/products/123')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Product deleted successfully');
        });

        it('should return 404 for non-existent product', async () => {
            pool.execute.mockResolvedValueOnce([{ affectedRows: 0 }]);

            const response = await request(app)
                .delete('/api/products/999')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Product not found');
        });
    });
});
