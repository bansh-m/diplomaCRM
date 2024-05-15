const mongoose = require('mongoose');
const path = require('path');

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    hasActors: { type: Boolean, default: false },
    sessionDuration: { type: Number, required: true },
    breakDuration: { type: Number, required: true },
    thumbnail: { type: String, default: '/img/thumbnail.png' },
    playerLimits: {
        min: { type: Number, required: true },
        max: { type: Number, required: true }
    },
    actors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Actor'
    }],
    schedule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schedule'
    }
});

module.exports = mongoose.model('Room', roomSchema);
