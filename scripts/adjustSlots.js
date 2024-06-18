const mongoose = require('mongoose');
const Schedule = require('../models/Schedule'); // Вкажіть правильний шлях до моделі Schedule

mongoose.connect("mongodb://127.0.0.1:27017/crmDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function shiftScheduleSlotsBackOneDay() {
  try {
    const schedules = await Schedule.find();
    
    for (const schedule of schedules) {
      for (const day of schedule.completeSchedule) {
        for (const slot of day.slots) {
          // Зменшуємо дату на один день
          const slotStart = new Date(slot.start);
          const slotEnd = new Date(slot.end);

          slotStart.setDate(slotStart.getDate() - 1);
          slotEnd.setDate(slotEnd.getDate() - 1);

          slot.start = slotStart.toISOString();
          slot.end = slotEnd.toISOString();
        }
      }

      await schedule.save();
      console.log(`Schedule updated for roomId: ${schedule.roomId}`);
    }
    
    console.log('All schedules updated successfully');
  } catch (error) {
    console.error('Error updating schedules:', error);
  } finally {
    mongoose.disconnect();
  }
}

shiftScheduleSlotsBackOneDay();
