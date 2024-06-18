const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

router.get('/', async (req, res) => {
    const { room_id } = req.query;
    try {
        const reviews = await Review.find({ roomId: room_id }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

module.exports = router;