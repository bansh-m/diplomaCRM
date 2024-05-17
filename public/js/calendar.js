document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    var scheduleData = calendarEl.getAttribute('data-schedule');

    if (!scheduleData) {
        console.error('No schedule data found on the calendar element.');
        return;
    }

    try {
        var schedule = JSON.parse(scheduleData);
        var completeSchedule = schedule.completeSchedule.flatMap(daySlot =>
            daySlot.slots.map(slot => ({
                title: slot.extendedProps.status === 'booked' ? 'Booked' : 'Available',
                start: slot.start,
                end: slot.end,
                extendedProps: {
                    status: slot.extendedProps.status,
                    booking: slot.extendedProps.booking,
                    slotId: slot._id
                }
            }))
        );
        var startTime = schedule.dayTemplate.startTime;
        var endTime = schedule.dayTemplate.endTime;
    } catch (e) {
        console.error('Error parsing schedule data:', e);
        return;
    }

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        editable: false,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        slotMinTime: startTime,
        slotMaxTime: (parseInt(endTime.split(':')[0]) + 1) + ':00:00',
        height: 'auto',
        slotLabelFormat: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        },
        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        },
        timeZone: 'UTC',
        events: completeSchedule,

        select: function (arg) {
            // Функція для обробки створення нових подій
            var title = prompt('Event Title:');
            if (title) {
                calendar.addEvent({
                    title: title,
                    start: arg.start,
                    end: arg.end,
                    allDay: arg.allDay
                });
            }
            calendar.unselect();
        },

        eventClick: function (arg) {
            var slotId = arg.event._def.extendedProps.slotId;
            fetch(`/rooms/slots/${slotId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.extendedProps.booking) {
                        // Якщо бронювання існує, заповнюємо форму інформацією про бронювання
                        document.getElementById('clientName').value = data.booking.clientName;
                        document.getElementById('clientContact').value = data.booking.clientContact;
                        document.getElementById('slotId').value = slotId;
                        var modalTitle = `Booking Details for ${data.booking.clientName}`;
                        document.getElementById('slotModalLabel').innerText = modalTitle;
                    } else {
                        document.getElementById('clientName').value = '';
                        document.getElementById('clientContact').value = '';
                        document.getElementById('slotId').value = slotId;
                        var modalTitle = 'New Booking';
                        document.getElementById('slotModalLabel').innerText = modalTitle;
                    }
                    var slotModal = new bootstrap.Modal(document.getElementById('slotModal'));
                    slotModal.show();
                })
                .catch(error => console.error('Error fetching slot details:', error));
        }
    });

    calendar.render();
});
