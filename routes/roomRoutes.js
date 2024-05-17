const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const bookingController = require('../controllers/bookingController');

router.post('/create', roomController.createRoom);

router.get('/:id', roomController.getRoom);

module.exports = router; 