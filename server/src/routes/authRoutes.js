const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma');
const { registerSchema, loginSchema } = require('../utils/validation');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = registerSchema.parse(req.body);
        const existingUser = await prisma.user.findUnique({ where: { username } });

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { username, password_hash, role: role || 'STAFF' },
        });

        res.status(201).json({ message: 'User created', userId: user.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = loginSchema.parse(req.body);
        const user = await prisma.user.findUnique({ where: { username } });

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, role: user.role });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
