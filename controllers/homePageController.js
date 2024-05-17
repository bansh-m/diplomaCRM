const Actor = require('../models/Actor');
const Room = require('../models/Room');

module.exports = async (req, res) => {
    try {
        const [rooms, actors] = await Promise.all([
            Room.find({}),
            Actor.find({})
        ]);
        res.render('index', { rooms, actors });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving rooms", error });
    }
};
