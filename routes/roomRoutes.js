const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const bookingController = require('../controllers/bookingController');

router.post('/create', roomController.createRoom);
router.get('/:id', roomController.getRoom);


router.get('/slots/:slotId', bookingController.getSlotDetails); // Новий маршрут для отримання деталей слота

// router.put('/:id', roomController.updateRoom);
// router.delete('/rooms/:id', roomController.deleteRoom);

module.exports = router;