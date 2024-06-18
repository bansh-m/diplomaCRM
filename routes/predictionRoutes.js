const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authToken = process.env.JWT_PRIVATE_KEY;

router.get('/', async (req, res) => {
    res.render('predictions');
});


router.get('/predict', async (req, res) => {
    const roomId = req.query.room_id;

    try {
        const response = await axios.get('http://127.0.0.1:5000/predict', {
            params: {
                room_id: roomId
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching prediction:', error);
        res.status(500).send('Server error');
    }
});

router.post('/train', async (req, res) => {
    const roomId = req.body.room_id;

    if (!roomId) {
        return res.status(400).send('room_id is required');
    }

    try {
        const response = await axios.post('http://127.0.0.1:5000/train', { room_id: roomId }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error training model:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;