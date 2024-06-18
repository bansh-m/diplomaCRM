const mongoose = require('mongoose');
const Schedule = require('../models/Schedule');

mongoose.connect("mongodb://127.0.0.1:27017/crmDB");

async function clearBookings() {
  try {
    const schedules = await Schedule.find();

    for (const schedule of schedules) {
      for (const scheduleDay of schedule.completeSchedule) {
        for (const slot of scheduleDay.slots) {
          if (slot.extendedProps && slot.extendedProps.booking) {
            slot.extendedProps.status = 'free';
            slot.extendedProps.booking = null;
            slot.title = 'Available';
          }
        }
      }
      await schedule.save();
    }

    console.log('All bookings cleared successfully');
  } catch (error) {
    console.error('Error clearing bookings:', error);
  } finally {
    mongoose.disconnect();
  }
}

clearBookings();