const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Schedule = require('../models/Schedule');
const Review = require('../models/Review');

router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find().populate('actors reviews');
        const reports = await Promise.all(rooms.map(async room => {
            const actorsCount = room.actors.length;
            const reviewsCount = await Review.countDocuments({roomId: room._id});
            const totalBookingsCount = await Booking.countDocuments({ roomId: room._id });
            const currentBookings = await Schedule.aggregate([
                { $match: { roomId: room._id } },
                { $unwind: '$completeSchedule' },
                { $unwind: '$completeSchedule.slots' },
                { $match: { 'completeSchedule.slots.extendedProps.status': 'booked' } },
                { $count: 'currentBookings' }
            ]);
            const currentBookingsCount = currentBookings[0] ? currentBookings[0].currentBookings : 0;
            return {
                roomId: room._id,
                roomName: room.name,
                actorsCount,
                reviewsCount,
                totalBookingsCount,
                currentBookingsCount
            };
        }));
        res.render('reports', { reports });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).send('Server error');
    }
});
module.exports = router;
