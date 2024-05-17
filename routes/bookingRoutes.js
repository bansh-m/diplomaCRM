const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/create', bookingController.createBooking);

// router.get('/rooms/:roomId/bookings', bookingController.getRoomBookings);

module.exports = router;