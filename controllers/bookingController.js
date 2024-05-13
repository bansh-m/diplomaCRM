const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Actor = require('../models/Actor');

exports.createBooking = async (req, res) => {
    try {
        const booking = new Booking(req.body);
        await booking.save();
        // Оновлення розкладу акторів, якщо кімната має акторів
        if (booking.room.hasActors) {
            const room = await Room.findById(booking.room).populate('actors');
            room.actors.forEach(async (actor) => {
                // Додаємо логіку для оновлення графіку акторів тут
                // Наприклад, встановлення часу бронювання як робочого часу для актора
            });
        }
        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.viewBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ room: req.params.roomId }).populate('room');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
