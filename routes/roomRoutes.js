const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.post('/create', roomController.createRoom);
router.get('/:id', roomController.showRoom);
router.put('/:id', roomController.updateRoom);
router.delete('/rooms/:id', roomController.deleteRoom);

module.exports = router;