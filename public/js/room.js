let room = JSON.parse(actions.getAttribute('room'));

document.getElementById('editBtn').addEventListener('click', function() {
    document.getElementById('roomName').disabled = false;
    document.getElementById('roomAddress').disabled = false;
    document.getElementById('roomDuration').disabled = false;
    document.getElementById('roomPlayerLimits').disabled = false;
    document.getElementById('roomDescription').disabled = false;
    document.getElementById('editBtn').classList.add('d-none');
    document.getElementById('saveBtn').classList.remove('d-none');
});

document.getElementById('saveBtn').addEventListener('click', function() {
    // Add your save logic here
    // For example, send an AJAX request to save the changes to the server

    // After saving, disable the inputs and toggle the buttons back
    document.getElementById('roomName').disabled = true;
    document.getElementById('roomAddress').disabled = true;
    document.getElementById('roomDuration').disabled = true;
    document.getElementById('roomPlayerLimits').disabled = true;
    document.getElementById('roomDescription').disabled = true;
    document.getElementById('editBtn').classList.remove('d-none');
    document.getElementById('saveBtn').classList.add('d-none');
});

document.getElementById('deleteBtn').addEventListener('click', function() {
    if(confirm("Confirm action")) {
        return fetch(`/rooms/${room._id}`, {
            method: 'DELETE'
        })
        .then(response => {
            response.json();
            window.location.href = '/home';
        })
    }
});