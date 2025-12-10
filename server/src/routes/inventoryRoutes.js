const express = require('express');
const prisma = require('../prisma');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { gemSchema } = require('../utils/validation');

const router = express.Router();

// GET all gems (Search/Filter)
router.get('/', async (req, res) => {
    try {
        const { color, origin, minPrice, maxPrice } = req.query;
        const where = {};

        if (color) where.color = { contains: color, mode: 'insensitive' };
        if (origin) where.origin = { contains: origin, mode: 'insensitive' };
        if (minPrice) where.price = { gte: parseFloat(minPrice) };
        if (maxPrice) where.price = { lte: parseFloat(maxPrice) };

        const gems = await prisma.gem.findMany({ where });
        res.json(gems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST new gem (Staff & Admin)
router.post('/', authenticateToken, authorizeRole(['ADMIN', 'STAFF']), async (req, res) => {
    try {
        const data = gemSchema.parse(req.body);
        const gem = await prisma.gem.create({
            data: {
                ...data,
                created_by_id: req.user.userId,
            },
        });
        res.status(201).json(gem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT update gem (Admin only)
router.put('/:id', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
    try {
        const { id } = req.params;
        const data = gemSchema.partial().parse(req.body);
        const gem = await prisma.gem.update({
            where: { id: parseInt(id) },
            data,
        });
        res.json(gem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE gem (Admin only)
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.gem.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Gem deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
