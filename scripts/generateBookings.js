const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Schedule = require('../models/Schedule');

mongoose.connect("mongodb://127.0.0.1:27017/crmDB");

async function getRoomSlots(roomId) {
  const schedule = await Schedule.findOne({ roomId });
  if (!schedule || !schedule.dayTemplate || !schedule.dayTemplate.slots) {
    throw new Error('Schedule or dayTemplate not found');
  }

  return schedule.dayTemplate.slots.map(slot => ({
    start: slot.start,
    end: slot.end,
  }));
}

function isSameTime(slotTime, bookingTime) {
  return slotTime.getHours() === bookingTime.getHours() &&
    slotTime.getMinutes() === bookingTime.getMinutes();
}

async function createRandomBookings() {
  const roomId = '66502c6b01688ea1c8969cf7';
  const clientNames = [
    'Іван',
    'Олена',
    'Марія',
    'Олександр',
    'Юлія',
    'Андрій',
    'Катерина',
    'Михайло',
    'Наталія',
    'Вікторія',
    'Сергій',
    'Ганна',
    'Дмитро',
    'Тетяна',
    'Василь',
    'Ірина',
    'Юрій',
    'Оксана',
    'Петро',
    'Людмила',
    'Володимир',
    'Світлана',
    'Борис',
    'Леся',
    'Євген'
  ];
  const clientContacts = [
    'example1@gmail.com',
    '+380501234567',
    'random.email@yahoo.com',
    '+380671234567',
    'contact123@mail.com',
    '+380931234567',
    'info456@ukr.net',
    '+380501234568',
    'test789@gmail.com',
    '+380671234568',
    'sample.email@outlook.com',
    '+380931234568',
    'email001@example.com',
    '+380501234569',
    'hello123@domain.com',
    '+380671234569',
    'mail456@website.com',
    '+380931234569',
    'admin789@service.com',
    '+380501234570',
    'user001@random.com',
    '+380671234570',
    'contact789@provider.com',
    '+380931234570',
    'service123@webmail.com'
  ];

  const slots = await getRoomSlots(roomId);
  const bookings = [];
  const currentDate = new Date();

  function setSameDateWithNewTime(date, time) {
    const newDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      time.getUTCHours(), time.getUTCMinutes(), 0, 0));
    return newDate;
  }

  // for (let dayOffset = -30; dayOffset < 0; dayOffset++) { // Всі дні з -30 до -1 (минулий місяць)
  //   for (const slot of slots) {
  //     if (Math.random() > 0.5) { // 50% шанс на створення бронювання
  //       const randomClient = Math.floor(Math.random() * clientNames.length);
  //       const startTime = new Date(currentDate);
  //       startTime.setDate(currentDate.getDate() + dayOffset);
  //       startTime.setHours(new Date(slot.start).getHours());
  //       startTime.setMinutes(new Date(slot.start).getMinutes());

  //       const endTime = new Date(currentDate);
  //       endTime.setDate(currentDate.getDate() + dayOffset);
  //       endTime.setHours(new Date(slot.end).getHours());
  //       endTime.setMinutes(new Date(slot.end).getMinutes());

  //       const booking = new Booking({
  //         roomId,
  //         startTime,
  //         endTime,
  //         clientName: clientNames[randomClient],
  //         clientContact: clientContacts[randomClient],
  //       });

  //       bookings.push(booking);
  //     }
  //   }
  // }

  for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
    for (const slot of slots) {
      if (Math.random() > 0.5) {
        const randomClient = Math.floor(Math.random() * clientNames.length);

        const bookingDate = new Date(currentDate);
        bookingDate.setUTCDate(currentDate.getUTCDate() + dayOffset);

        const startTime = setSameDateWithNewTime(bookingDate, slot.start);
        const endTime = setSameDateWithNewTime(bookingDate, slot.end);

        const booking = new Booking({
          roomId,
          startTime,
          endTime,
          clientName: clientNames[randomClient],
          clientContact: clientContacts[randomClient],
        });

        bookings.push(booking);

        const schedule = await Schedule.findOne({ roomId });
        const scheduleDay = schedule.completeSchedule.find(day =>
          new Date(day.date).toISOString().split('T')[0] === startTime.toISOString().split('T')[0]
        );

        if (scheduleDay) {
          const scheduleSlot = scheduleDay.slots.find(s =>
            s.start.getTime() === startTime.getTime() &&
            s.end.getTime() === endTime.getTime()
          );

          if (scheduleSlot) {
            scheduleSlot.extendedProps = scheduleSlot.extendedProps || {};
            scheduleSlot.extendedProps.booking = booking._id;
            scheduleSlot.title = 'Booked';
            scheduleSlot.extendedProps.status = 'booked';
            await schedule.save();
          }
        }
      }
    }
  }

  for (const booking of bookings) {
    await booking.save();
  }

  console.log('Bookings created successfully');
  mongoose.disconnect();
}

createRandomBookings().catch((error) => console.error(error));
