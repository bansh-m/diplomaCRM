const Room = require('../models/Room');
const Booking = require('../models/Booking');

exports.createRoom = async (req, res) => {
    const { name, address, duration, minPlayers, maxPlayers, thumbnail, actors } = req.body;
    try {
        const room = new Room({
            name: name,
            address: address,
            hasActors: actors && actors.length > 0,
            duration: duration,
            playerLimits: {
                min: minPlayers,
                max: maxPlayers
            },
            actors: actors || [],
            thumbnail: thumbnail
        });
        await room.save();
        res.redirect('/');
    } catch (error) {
        console.error("Error creating room:", error);
        res.status(400).json({ message: "Failed to create new room", error });
    }
};

exports.showRoom = async(req, res) => {
    try {
        const room = await Room.findById(req.params.id)
                               .populate('actors');

        if (!room) {
            return res.status(404).send('Room not found');
        }
        const bookings = await Booking.find({ room: room._id }).populate('user', 'name');
        res.render('room', { room, bookings});
    } catch (error) {
        console.error('Error fetching room details:', error);
        res.status(500).send('Error fetching room details');
    }
};

exports.updateRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!room) {
            return res.status(404).json({ message: "Room not found." });
        }
        res.json(room);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        if (!room) {
            return res.status(404).json({ message: "Room not found." });
        }
        res.json({ message: "Room deleted successfully." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
