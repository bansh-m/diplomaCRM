const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    difficulty: { type: Number, min: 1, max: 10, required: true },
    actorPerformance: { type: Number, min: 1, max: 10, required: true },
    overallRating: { type: Number, min: 1, max: 10, required: true },
    comment: { type: String, required: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);