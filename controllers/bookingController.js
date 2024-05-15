const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Schedule = require('../models/Schedule');

exports.createBooking = async (req, res) => {
    const { roomId, timeslotId, clientName, clientContact } = req.body;

    try {
        const newBooking = new Booking({
            room: roomId,
            timeslot: {
                start: timeslotId.start,
                end: timeslotId.end
            },
            clientName,
            clientContact
        });
        await newBooking.save();

        // Знайти і оновити розклад
        const schedule = await Schedule.findOne({ 'room': roomId, 'timeslots._id': timeslotId });
        if (schedule) {
            const slot = schedule.timeslots.id(timeslotId);
            if (!slot.booking) {
                slot.booking = newBooking._id; // Додати посилання на бронювання
                await schedule.save();
            } else {
                return res.status(400).send('Timeslot is already booked');
            }
        }

        res.status(201).send('Booking created successfully');
    } catch (error) {
        console.error('Failed to create booking:', error);
        res.status(500).send('Error creating booking');
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
