import request from 'supertest';
import app from '../src/server.js'; // Ensure server.ts exports 'app'

describe('Auth API', () => {
    it('should register a new user successfully', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                email: `test-${Date.now()}@example.com`,
                password: 'password123'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
    });

    it('should return 401 for invalid login', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'wrong@example.com',
                password: 'wrongpassword'
            });

        expect(res.statusCode).toEqual(401);
    });
});