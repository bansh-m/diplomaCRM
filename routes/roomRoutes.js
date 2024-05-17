const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const bookingController = require('../controllers/bookingController');

router.post('/create', roomController.createRoom);
router.get('/:id', roomController.getRoom);

// Новий маршрут для отримання деталей слота
router.get('/slots/:slotId', bookingController.getSlotDetails);

// Додати нове бронювання
router.post('/slots/:slotId/book', bookingController.createBooking);

// Оновити існуюче бронювання
router.put('/slots/:slotId/book', bookingController.updateBooking);

// Видалити бронювання
router.delete('/slots/:slotId/book', bookingController.deleteBooking);

module.exports = router;