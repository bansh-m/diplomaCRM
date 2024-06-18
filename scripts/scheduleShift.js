const cron = require('node-cron');
const moment = require('moment');
const mongoose = require('mongoose');
const Schedule = require('../models/Schedule');


mongoose.connect("mongodb://127.0.0.1:27017/crmDB");


async function shiftSchedule() {
    try {
        const schedules = await Schedule.find({});
        if (!schedules.length) {
            console.log('No schedules found');
            return;
        }

        for (const schedule of schedules) {
            const today = moment().startOf('day');
            const dayTemplate = schedule.dayTemplate.slots;

            schedule.completeSchedule.shift();

            const lastDate = moment(schedule.completeSchedule[schedule.completeSchedule.length - 1].date).startOf('day');
            const newDate = lastDate.add(1, 'days');

            const newSlots = dayTemplate.map(templateSlot => {
                const start = newDate.clone().set({
                    hour: moment(templateSlot.start).hour(),
                    minute: moment(templateSlot.start).minute(),
                    second: 0,
                    millisecond: 0
                }).toDate();

                const end = newDate.clone().set({
                    hour: moment(templateSlot.end).hour(),
                    minute: moment(templateSlot.end).minute(),
                    second: 0,
                    millisecond: 0
                }).toDate();

                return {
                    ...templateSlot,
                    start: start,
                    end: end
                };
            });

            schedule.completeSchedule.push({
                date: newDate.toDate(),
                slots: newSlots
            });

            await schedule.save();
        }

        console.log('Schedules updated: old day removed and new day added');
    } catch (error) {
        console.error('Error updating schedule:', error);
    }
}


module.exports = {
    scheduleShift: () => {
        cron.schedule('0 0 * * *', () => {
            shiftSchedule();
        });
    },
    shiftSchedule
};

shiftSchedule().then(() => mongoose.disconnect());