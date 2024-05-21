const Room = require('../models/Room');

exports.getRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id)
            .populate('actors')
            .populate('schedule')
            .populate('reviews')
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.json(room);
    } catch (error) {
        console.error('Error fetching slot details:', error);
        res.status(500).json({ message: 'Error fetching slot details', error });
    }
};

exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (error) {
        console.error('Error fetching slot details:', error);
        res.status(500).json({ message: 'Error fetching slot details', error });
    }
};

exports.storeBooking = async (req, res) => {
    const { slotId, roomId, clientName, clientContact } = req.body;
    try {
        const schedule = await Schedule.findOne({ 'room': roomId });
        const slot = schedule.completeSchedule.find(day => 
            day.slots.some(slot => slot._id.equals(slotId))
        ).slots.id(slotId);

        if (slot.extendedProps.booking) {
            return res.status(400).json({ message: 'Slot is already booked' });
        }

        const booking = new Booking({ room : roomId, clientName, clientContact, startTime: slot.start, endTime: slot.end });
        await booking.save();

        slot.extendedProps.booking = booking._id;
        slot.title = 'Booked';
        slot.extendedProps.status = 'booked';

        await schedule.save();

        res.status(201).json({ message: 'Booking created successfully', booking });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.storeReview = async (req, res) => {
    try {
        const review = new Review(req.body);
        await review.save();
        res.status(201).json(review);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Error creating review', error });
    }
};
