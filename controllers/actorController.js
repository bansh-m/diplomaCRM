const Actor = require('../models/Actor');

exports.createActor = async (req, res) => {
    try {
        const actor = new Actor(req.body);
        await actor.save();
        res.status(201).json(actor);
    } catch (error) {
        res.status(400).json({ message: error.message });
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
