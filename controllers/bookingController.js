const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Actor = require('../models/Actor');

exports.createBooking = async (req, res) => {
    const { roomId, startTime, endTime, clientName, clientContact } = req.body;

    try {
        const room = await Room.findById(roomId).populate('actors');
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Перевірка на конфлікти часу бронювання
        const overlappingBookings = await Booking.find({
            room: roomId,
            endTime: { $gt: startTime },
            startTime: { $lt: endTime }
        });

        if (overlappingBookings.length > 0) {
            return res.status(400).json({ message: "The room is already booked for the selected time" });
        }

        // Створення нового бронювання
        const newBooking = new Booking({
            room: roomId,
            startTime,
            endTime,
            clientName,
            clientContact,
            actors: room.actors.map(actor => actor._id)
        });
        await newBooking.save();

        res.status(201).json({ message: "Room booked successfully", booking: newBooking });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: "Error booking room" });
    }
};

exports.getRoomBookings = async (req, res) => {
    try {
        const { roomId } = req.params;
        const bookings = await Booking.find({ room: roomId });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error });
    }
};
