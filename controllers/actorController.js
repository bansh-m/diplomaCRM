const Actor = require('../models/Actor');

exports.createActor = async (req, res) => {
    const { name, photo, age, contactNumber, address, rooms} = req.body;
    try {
        const actor = new Actor({
            name: name,
            photo: photo,
            age: age,
            contactNumber: contactNumber,
            address: address,
            rooms: rooms || []
        });
        await actor.save();
        res.redirect('/')
    } catch (error) {
        console.error("Error creating actor:", error);
        res.status(400).json({ message: "Failed to create new actor profile", error });
    }
};

exports.updateActor = async (req, res) => {
    try {
        const actor = await Actor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!actor) {
            return res.status(404).json({ message: "Actor not found." });
        }
        res.json(actor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteActor = async (req, res) => {
    try {
        const actor = await Actor.findByIdAndDelete(req.params.id);
        if (!actor) {
            return res.status(404).json({ message: "Actor not found." });
        }
        res.json({ message: "Actor deleted successfully." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
