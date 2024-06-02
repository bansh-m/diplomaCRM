const express = require('express');
const router = express.Router();
const actorController = require('../controllers/actorController');

router.get('/:id', actorController.getActor)

router.post('/create', actorController.createActor);

router.put('/:id', actorController.updateActor);

router.delete('/:id', actorController.deleteActor);

module.exports = router;