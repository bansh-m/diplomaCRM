const Room = require('../models/Room');
const Booking = require('../models/Booking');

exports.getRoomSchedule = async (req, res) => {
    try {
        const { roomId } = req.params;
        const bookings = await Booking.find({ room: roomId }).sort({ startTime: 1 });
        res.json(bookings);
    } catch (error) {
        console.error('Failed to retrieve room schedule:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.listRooms = async (req, res) => {
    try {
        const rooms = await Room.find({});
        res.json(rooms);
    } catch (error) {
        console.error('Failed to list rooms:', error);
        res.status(500).json({ error: error.message });
    }
};
