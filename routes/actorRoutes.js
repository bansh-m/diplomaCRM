const express = require('express');
const router = express.Router();
const actorController = require('../controllers/actorController');

router.post('/create', actorController.createActor);

router.put('/actors/:id', actorController.updateActor);

router.delete('/actors/:id', actorController.deleteActor);

module.exports = router;