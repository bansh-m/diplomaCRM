const express = require('express');
const router = express.Router();
const apiController = require('./apiController');

router.get('/:roomId', apiController.getRoom)
router.get('/rooms', apiController.getAllRooms);
router.post('/booking', apiController.storeBooking);
router.post('/review', apiController.storeReview);

module.exports = router;