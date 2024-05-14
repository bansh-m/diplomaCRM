const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    clientName: {
        type: String,
        required: true
    },
    clientContact: {
        type: String,
        required: true
    },
    actors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Actor'
    }]
});

module.exports = mongoose.model('Booking', bookingSchema);
