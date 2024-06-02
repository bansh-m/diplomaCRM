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
        var roomId = schedule.roomId;
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
        editable: true,
        selectable: true,
        height: 'auto',
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
            fetchSlotDetails(slotId, roomId)
                .then(data => {
                    showBookingModal(data, roomId);
                })
                .catch(error => console.error('Error fetching slot details:', error));
        }
    });

    calendar.render();
});

function fetchSlotDetails(slotId, roomId) {
    return fetch(`/booking/${roomId}/${slotId}`)
        .then(response => response.json());
}

function createBooking(slotId, roomId, clientName, clientContact) {
    return fetch(`/booking/${roomId}/${slotId}/book`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ clientName, clientContact })
    })
        .then(response => response.json());
}

function updateBooking(slotId, roomId, clientName, clientContact) {
    return fetch(`/booking/${roomId}/${slotId}/book`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ clientName, clientContact })
    })
        .then(response => response.json());
}

function deleteBooking(slotId, roomId) {
    return fetch(`/booking/${roomId}/${slotId}/book`, {
        method: 'DELETE'
    })
        .then(response => response.json());
}

function showBookingModal(slotData, roomId) {
    var booking = slotData.extendedProps.booking;
    document.getElementById('startTime').innerText = new Date(slotData.start).toLocaleString(undefined, { timeZone: 'UTC', timeZoneName: 'short' });
    document.getElementById('endTime').innerText = new Date(slotData.end).toLocaleString(undefined, { timeZone: 'UTC', timeZoneName: 'short' });
    document.getElementById('clientName').value = booking ? booking.clientName : '';
    document.getElementById('clientContact').value = booking ? booking.clientContact : '';
    document.getElementById('slotModalLabel').innerText = booking ? 'Booking Details' : 'New Booking';

    var slotModal = new bootstrap.Modal(document.getElementById('slotModal'));

    document.getElementById('saveBooking').onclick = function () {
        if (booking) {
            updateBooking(slotData._id, roomId, document.getElementById('clientName').value, document.getElementById('clientContact').value)
                .then(() => {
                    slotModal.hide();
                    window.location.reload();
                })
                .catch(error => console.error('Error updating booking:', error));
        } else {
            createBooking(slotData._id, roomId, document.getElementById('clientName').value, document.getElementById('clientContact').value)
                .then(() => {
                    slotModal.hide();
                    window.location.reload();
                })
                .catch(error => console.error('Error creating booking:', error));
        }
    };

    document.getElementById('deleteBooking').onclick = function () {
        if (booking) {
            deleteBooking(slotData._id, roomId).then(() => {
                slotModal.hide();
                window.location.reload();
            })
                .catch(error => console.error('Error deleting booking:', error));
        } else {
            alert('There is no booking to delete!');
            slotModal.hide();
        }
    }


    slotModal.show();
}
