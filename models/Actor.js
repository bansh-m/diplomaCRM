const mongoose = require('mongoose');

const actorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    photo: { type: String, default: '/img/icon.png'},
    age: { type: Number },
    contactNumber: { type: String },
    rooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }]
});

module.exports = mongoose.model('Actor', actorSchema);