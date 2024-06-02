const mongoose = require('mongoose');

const actorSchema = new mongoose.Schema({
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
    name: { type: String, required: true },
    // address: { type: String, required: true },
    photo: { type: String, default: '/img/icon.png' },
    age: { type: Number },
    contactNumber: { type: String },
});

module.exports = mongoose.model('Actor', actorSchema);  