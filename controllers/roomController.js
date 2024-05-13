const Room = require('../models/Room');

exports.createRoom = async (req, res) => {
    const { name, address, hasActors, duration, minPlayers, maxPlayers, thumbnail } = req.body;

    try {
        const newRoom = new Room({
            name: name,
            address: address,
            hasActors: hasActors === 'true',  // перевірка, чи строка 'true' є логічним true
            duration: duration,
            playerLimits: {
                min: minPlayers,
                max: maxPlayers
            },
            thumbnail: thumbnail || '/img/default_image.png'  // Використання замовчуваного зображення, якщо не вказано
        });

        await newRoom.save();  // Зберігання нової кімнати в базі даних
        res.redirect('/');  // Перенаправлення користувача на головну сторінку або на сторінку списку кімнат
    } catch (error) {
        console.error("Error creating room:", error);
        res.status(400).json({ message: "Failed to create new room", error });
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
