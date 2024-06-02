function validateForm() {
    let minPlayers = parseInt(document.getElementById('minPlayers').value, 10);
    let maxPlayers = parseInt(document.getElementById('maxPlayers').value, 10);

    if (minPlayers > maxPlayers) {
        alert('Minimum number of players cannot be greater than maximum.');
        return false;
    }
    return true;
}