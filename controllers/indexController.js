const Room = require('../models/Room');

exports.showRooms = async (req, res) => {
    try {
        const rooms = await Room.find({});
        res.render('index', { rooms });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving rooms", error });
    }
};
