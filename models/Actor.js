const mongoose = require('mongoose');

const actorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Actor', actorSchema);
