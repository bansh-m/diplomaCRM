const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/bookings', bookingController.createBooking);
router.get('/bookings/:roomId', bookingController.viewBookings);

module.exports = router;
