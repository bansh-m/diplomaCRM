function validateForm() {
    var minPlayers = parseInt(document.getElementById('minPlayers').value, 10);
    var maxPlayers = parseInt(document.getElementById('maxPlayers').value, 10);

    if (minPlayers > maxPlayers) {
        alert('Minimum number of players cannot be greater than maximum.');
        return false; // Запобігає відправленню форми
    }
    return true; // Дозволяє відправити форму
}