const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Schedule = require('../models/Schedule');

exports.getSlotDetails = async (req, res) => {
    try {
        const { slotId, roomId} = req.params;
        const schedule = await Schedule.findOne({ 'roomId': roomId }).populate('completeSchedule.slots.extendedProps.booking');

        if (!schedule) {
            console.error(`No schedule found for slot ID: ${slotId}`);
            return res.status(404).json({ message: 'Slot not found' });
        }

        const slot = schedule.completeSchedule
            .flatMap(day => day.slots)
            .find(slot => slot._id.toString() === slotId);

        if (!slot) {
            console.error(`Slot not found within schedule for slot ID: ${slotId}`);
            return res.status(404).json({ message: 'Slot not found' });
        }
        res.json(slot);

    } catch (error) {
        console.error('Error fetching slot details:', error);
        res.status(500).json({ message: 'Error fetching slot details', error });
    }
};

exports.createBooking = async (req, res) => {
    const { slotId, roomId } = req.params;
    const { clientName, clientContact } = req.body;
    try {
        const schedule = await Schedule.findOne({ 'roomId': roomId });
        const slot = schedule.completeSchedule.find(day => 
            day.slots.some(slot => slot._id.equals(slotId))
        ).slots.id(slotId);

        if (slot.extendedProps.booking) {
            return res.status(400).json({ message: 'Slot is already booked' });
        }

        const booking = new Booking({ roomId : roomId, clientName, clientContact, startTime: slot.start, endTime: slot.end });
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

exports.updateBooking = async (req, res) => {
    const { roomId, slotId} = req.params;
    const { clientName, clientContact } = req.body;

    try {
        const schedule = await Schedule.findOne({ 'roomId': roomId });
        const slot = schedule.completeSchedule.find(day => 
            day.slots.some(slot => slot._id.equals(slotId))
        ).slots.id(slotId);

        if (!slot.extendedProps.booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const booking = await Booking.findById(slot.extendedProps.booking);
        booking.clientName = clientName;
        booking.clientContact = clientContact;

        await booking.save();

        res.status(200).json({ message: 'Booking updated successfully', booking });
    
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteBooking = async (req, res) => {
    const { slotId, roomId} = req.params;

    try {
        const schedule = await Schedule.findOne({ 'roomId': roomId });
        const slot = schedule.completeSchedule.find(day => 
            day.slots.some(slot => slot._id.equals(slotId))
        ).slots.id(slotId);

        if (!slot.extendedProps.booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        await Booking.findByIdAndDelete(slot.extendedProps.booking);

        slot.extendedProps.booking = null;
        slot.title = 'Available';
        slot.extendedProps.status = 'free';

        await schedule.save();

        res.status(200).json({ message: 'Booking deleted successfully' });
        
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getSchedule = async (req, res) => {
    try {
        const { roomId } = req.params;
    
        const schedule = await Schedule.findOne({ 'roomId': roomId });
        if (!schedule) {
            console.error(`No schedule found for room ${roomId}`);
            return res.status(404).json({ message: 'Schedule not found' });
        }

        res.json(schedule);

    } catch (error) {
        console.error('Error fetching schedule details:', error);
        res.status(500).json({ message: 'Error fetching schedule details', error });
    }
};

