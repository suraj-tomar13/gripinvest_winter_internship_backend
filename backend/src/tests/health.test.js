const request = require('supertest');
const app = require('../app');

describe('Health Check API', () => {
    describe('GET /health', () => {
        it('should return health status', async () => {
            const response = await request(app)
                .get('/health');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 'Service is up and running');
        });
    });
});
