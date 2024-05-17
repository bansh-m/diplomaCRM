const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.get('/:roomId/schedule', bookingController. getSchedule)

router.get('/:roomId/:slotId', bookingController.getSlotDetails);

router.post('/:roomId/:slotId/book', bookingController.createBooking);

router.put('/:roomId/:slotId/book', bookingController.updateBooking);

router.delete('/:roomId/:slotId/book', bookingController.deleteBooking);

module.exports = router;