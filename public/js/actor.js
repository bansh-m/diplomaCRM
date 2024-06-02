let actor = JSON.parse(actions.getAttribute('actor'));

document.getElementById('editBtn').addEventListener('click', function() {
    document.getElementById('actorName').disabled = false;
    document.getElementById('actorAge').disabled = false;
    document.getElementById('actorContact').disabled = false;
    document.getElementById('editBtn').classList.add('d-none');
    document.getElementById('saveBtn').classList.remove('d-none');
});

document.getElementById('saveBtn').addEventListener('click', function() {
    // Add your save logic here
    // For example, send an AJAX request to save the changes to the server

    // After saving, disable the inputs and toggle the buttons back
    document.getElementById('actorName').disabled = true;
    document.getElementById('actorAge').disabled = true;
    document.getElementById('actorContact').disabled = true;
    document.getElementById('editBtn').classList.remove('d-none');
    document.getElementById('saveBtn').classList.add('d-none');
});


document.getElementById('deleteBtn').addEventListener('click', function() {
    if(confirm("Confirm action")) {
        return fetch(`/actors/${actor._id}`, {
            method: 'DELETE'
        })
        .then(response => {
            response.json();
            window.location.href = '/';
        })
    }
})