document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',  // або 'timeGridWeek' для тижневого перегляду
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        editable: true,  // дозволяє переміщення подій
        selectable: true,  // дозволяє вибір дат
        selectMirror: true,
        dayMaxEvents: true,  // дозволяє більше подій на день
        select: function(arg) {
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
        eventClick: function(arg) {
            // Функція для обробки кліку на подію
            if (confirm('Are you sure you want to delete this event?')) {
                arg.event.remove();
            }
        },
        events: [
            // Тут можна додати події, які вже заплановані
            { title: 'Event 1', start: '2020-09-10', end: '2020-09-12' }
        ]
    });
    calendar.render();
});

