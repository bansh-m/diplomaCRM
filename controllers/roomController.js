const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Schedule = require('../models/Schedule');

exports.createRoom = async (req, res) => {
    const { name, address, minPlayers, maxPlayers, thumbnail, actors, workingHoursStart, workingHoursEnd, sessionDuration, breakDuration} = req.body;
    try {
        const room = new Room({
            name: name,
            address: address,
            hasActors: actors && actors.length > 0,
            sessionDuration: sessionDuration,
            breakDuration: breakDuration,
            playerLimits: {
                min: minPlayers,
                max: maxPlayers
            },
            actors: actors || [],
            thumbnail: thumbnail
        });
        await room.save();
        
        const [startHours, startMinutes] = workingHoursStart.split(':').map(Number);
        const [endHours, endMinutes] = workingHoursEnd.split(':').map(Number);

        const dayTemplate = createDayTemplate(
            { hours: startHours, minutes: startMinutes },
            { hours: endHours, minutes: endMinutes },
            sessionDuration,
            breakDuration
        );

        const completeSchedule = [];
        for (let i = 0; i < 30; i++) {
            const day = new Date();
            day.setDate(day.getDate() + i);
            completeSchedule.push({
                date: day,
                slots: dayTemplate.map(slot => ({
                    start: new Date(day.getFullYear(), day.getMonth(), day.getDate(), slot.start.getHours(), slot.start.getMinutes()),
                    end: new Date(day.getFullYear(), day.getMonth(), day.getDate(), slot.end.getHours(), slot.end.getMinutes()),
                    status: slot.status,
                    booking: slot.booking
                }))
            });
        }

        const schedule = new Schedule({
            room: room._id,
            dayTemplate: {startTime: workingHoursStart, endTime: workingHoursEnd, sessionDuration, breakDuration, slots: dayTemplate},
            completeSchedule
        });

        await schedule.save();
        room.schedule = schedule._id;
        await room.save();
        res.redirect('/');

    } catch (error) {
        console.error("Error creating room:", error);
        res.status(400).json({ message: "Failed to create new room", error });
    }
};

function createDayTemplate(startTime, endTime, sessionDuration, breakDuration) {
    const timeSlots = [];
    const sessionDurationMs = sessionDuration * 60 * 1000;
    const breakDurationMs = breakDuration * 60 * 1000;

    const timeOffset = new Date().getTimezoneOffset();
    let currentStartTime = new Date();
    currentStartTime.setHours(startTime.hours, startTime.minutes, 0, 0);
    currentStartTime = new Date(currentStartTime.getTime() - timeOffset * 60 * 1000);

    let currentEndTime = new Date(currentStartTime.getTime() + sessionDurationMs);

    while (currentEndTime.getHours() < endTime.hours || 
           (currentEndTime.getHours() === endTime.hours && currentEndTime.getMinutes() <= endTime.minutes)) {
        timeSlots.push({
            start: new Date(currentStartTime),
            end: new Date(currentEndTime),
            status: 'free',
            booking: null
        });

        currentStartTime = new Date(currentEndTime.getTime() + breakDurationMs);
        currentEndTime = new Date(currentStartTime.getTime() + sessionDurationMs);
    }
    return timeSlots;
}

exports.createSchedule = async (req, res) => {
    try {
        const { roomId, startTime } = req.body; // час початку від користувача
        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(404).send('Room not found');
        }

        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + room.sessionDuration); // додавання тривалості сесії до часу початку

        const schedule = await Schedule.findOne({ room: roomId });
        if (!schedule) {
            // Створити новий розклад, якщо він ще не існує
            const newSchedule = new Schedule({
                room: roomId,
                timeslots: [{ start: startTime, end: endTime }]
            });
            await newSchedule.save();
        } else {
            // Додати новий часовий слот до існуючого розкладу
            schedule.timeslots.push({ start: startTime, end: endTime });
            await schedule.save();
        }

        res.status(201).send('Schedule slot created successfully');
    } catch (error) {
        console.error('Failed to create schedule slot:', error);
        res.status(500).send('Error creating schedule slot');
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
        res.render('room', { room, bookings, calendar: true});
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
