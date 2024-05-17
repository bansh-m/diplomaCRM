const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Schedule = require('../models/Schedule');

exports.createRoom = async (req, res) => {
    try {
        const { name, address, description, minPlayers, maxPlayers, thumbnail, actors, workingHoursStart, workingHoursEnd, sessionDuration, breakDuration} = req.body;
        
        const room = new Room({
            name: name,
            address: address,
            description: description,
            hasActors: actors && actors.length > 0,
            sessionDuration: sessionDuration,
            breakDuration: breakDuration,
            playerLimits: {
                min: minPlayers,
                max: maxPlayers
            },
            actors: actors || [],
            thumbnail: thumbnail,
            schedule: null
        });
        
        const [startHours, startMinutes] = workingHoursStart.split(':').map(Number);
        const [endHours, endMinutes] = workingHoursEnd.split(':').map(Number);

        const dayTemplate = createDayTemplate(
            { hours: startHours, minutes: startMinutes },
            { hours: endHours, minutes: endMinutes },
            sessionDuration,
            breakDuration
        );

        const timeSlots = [];
        for (let i = 0; i < 14; i++) {
            const day = new Date();
            day.setDate(day.getDate() + i);
            timeSlots.push({
                date: day,
                slots: dayTemplate.map(slot => ({
                    title: slot.title,
                    start: new Date(day.getFullYear(), day.getMonth(), day.getDate(), slot.start.getHours(), slot.start.getMinutes()),
                    end: new Date(day.getFullYear(), day.getMonth(), day.getDate(), slot.end.getHours(), slot.end.getMinutes()),
                    extendedProps: slot.extendedProps
                }))
            });
        }

        const schedule = new Schedule({
            room: room._id,
            dayTemplate: { startTime: workingHoursStart, endTime: workingHoursEnd, sessionDuration, breakDuration, slots: dayTemplate},
            completeSchedule: timeSlots
        });

        room.schedule = schedule._id;
        await room.save();
        await schedule.save();
        res.redirect('/');

    } catch (error) {
        console.error("Error creating room:", error);
        res.status(400).json({ message: "Failed to create new room", error });
    }
};

exports.getRoom = async(req, res) => {
    try {
        const room = await Room.findById(req.params.id).populate('actors');

        if (!room) {
            return res.status(404).send('Room not found');
        }

        const schedule = await Schedule.findOne({ room: room._id });
        
        if (!schedule) {
            return res.status(404).send('Schedule not found');
        }

        res.render('room', { room, schedule: JSON.stringify(schedule), calendar: true});

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

function createDayTemplate(startTime, endTime, sessionDuration, breakDuration) {
    const timeSlots = [];
    const sessionDurationMs = sessionDuration * 60 * 1000;
    const breakDurationMs = breakDuration * 60 * 1000;


    let currentStartTime = new Date();
    currentStartTime.setUTCHours(startTime.hours, startTime.minutes, 0, 0);

    let currentEndTime = new Date(currentStartTime.getTime() + sessionDurationMs);

    while (currentStartTime.getUTCHours() < endTime.hours || 
           (currentStartTime.getUTCHours() === endTime.hours && currentStartTime.getUTCMinutes() < endTime.minutes)) {
        timeSlots.push({
            title: 'Available',
            start: new Date(currentStartTime),
            end: new Date(currentEndTime),
            extendedProps: {
                status: 'free',
                booking: null
            }
        });

        currentStartTime = new Date(currentEndTime.getTime() + breakDurationMs);
        currentEndTime = new Date(currentStartTime.getTime() + sessionDurationMs);
    }

    return timeSlots;
}
