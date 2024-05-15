const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    dayTemplate: {  // Шаблон для одного дня, що може бути дубльований
        startTime: String,
        endTime: String,
        sessionDuration: Number,
        breakDuration: Number,
        slots: [{
            start: Date,
            end: Date,
        }]
    },
    completeSchedule: [{
        date: Date,
        slots: [{
            start: Date,
            end: Date,
            status: {
                type: String,
                required: true,
                enum: ['free', 'booked'],
                default: 'free'
            },
            booking: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Booking',
                required: false
            }
        }]
    }]
});

module.exports = mongoose.model('Schedule', scheduleSchema);