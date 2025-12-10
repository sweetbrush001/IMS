const request = require('supertest');
const app = require('../index');
const prisma = require('../src/prisma');

describe('Auth Endpoints', () => {
    let server;

    beforeAll(async () => {
        // Clean up DB
        await prisma.gem.deleteMany();
        await prisma.user.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                username: 'testadmin',
                password: 'password123',
                role: 'ADMIN',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User created');
    });

    it('should login the user and return a token', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                username: 'testadmin',
                password: 'password123',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('role', 'ADMIN');
    });

    it('should fail login with wrong password', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                username: 'testadmin',
                password: 'wrongpassword',
            });
        expect(res.statusCode).toEqual(401);
    });
});
