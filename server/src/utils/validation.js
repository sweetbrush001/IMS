const { z } = require('zod');

const registerSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6),
    role: z.enum(['ADMIN', 'STAFF']).optional(),
});

const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
});

const gemSchema = z.object({
    name: z.string(),
    carat_weight: z.number(),
    color: z.string(),
    price: z.number(),
    origin: z.string(),
    certification_id: z.string(),
});

module.exports = { registerSchema, loginSchema, gemSchema };
