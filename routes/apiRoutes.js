const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const bookingController = require('../controllers/bookingController');

router.get('/rooms/:roomId/schedule', apiController.getRoomSchedule);

router.post('/rooms/:roomId/book', bookingController.createBooking);

router.get('/rooms', apiController.listRooms);

module.exports = router;
