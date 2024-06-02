const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    dayTemplate: {
        startTime: String,
        endTime: String,
        sessionDuration: Number,
        breakDuration: Number,
        slots: [{
            start: Date,
            end: Date
        }]
    },
    completeSchedule: [{
        date: Date,
        slots: [{
            title: {
                type: String,
                default: 'Available'
            },
            start: Date,
            end: Date,
            extendedProps: {
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
            }
        }]
    }]
});
module.exports = mongoose.model('Schedule', scheduleSchema);