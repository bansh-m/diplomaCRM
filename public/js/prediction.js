let predictionChart; // Зберігання посилання на графік

async function fetchRooms() {
    const response = await axios.get('/api/rooms');
    return response.data;
}

async function fetchPredictions(roomId) {
    const response = await axios.get(`/predictions/predict?room_id=${roomId}`);
    return response.data;
}

async function trainModel(roomId) {
    const response = await axios.post('/predictions/train', { room_id: roomId });
    return response.data;
}

async function populateRoomSelect() {
    const rooms = await fetchRooms();
    const roomSelect = document.getElementById('roomSelect');
    rooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room._id;
        option.text = room.name;
        roomSelect.appendChild(option);
    });
}

async function renderPredictions(roomId) {
    const predictions = await fetchPredictions(roomId);
    const predictionContainer = document.getElementById('predictions');
    predictionContainer.innerHTML = '';
    predictions.forEach(prediction => {
        const dateDiv = document.createElement('div');
        dateDiv.innerHTML = `<h3>Date: ${prediction.date}</h3>`;
        
        const percentageDiv = document.createElement('div');
        percentageDiv.innerHTML = `<p>Occupied Percentage: ${prediction.occupied_percentage.toFixed(2)}%</p>`;

        const slotsDiv = document.createElement('div');
        prediction.slots.forEach(slot => {
            const slotDiv = document.createElement('div');
            slotDiv.innerHTML = `<p>Time Slot: ${slot.time_slot}, Probability of Booking: ${(slot.probability_of_booking * 100).toFixed(2)}%</p>`;
            slotsDiv.appendChild(slotDiv);
        });

        dateDiv.appendChild(percentageDiv);
        dateDiv.appendChild(slotsDiv);
        predictionContainer.appendChild(dateDiv);
    });

    const labels = predictions.map(prediction => prediction.date);
    const data = predictions.map(prediction => prediction.occupied_percentage);

    const ctx = document.getElementById('predictionChart').getContext('2d');
    
    if (predictionChart) {
        predictionChart.destroy(); // Знищити існуючий графік, якщо він є
    }

    predictionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Predicted Booking Percentage',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

document.getElementById('predictButton').addEventListener('click', async () => {
    const roomId = document.getElementById('roomSelect').value;
    await renderPredictions(roomId);
});

document.getElementById('trainButton').addEventListener('click', async () => {
    const roomId = document.getElementById('roomSelect').value;
    await trainModel(roomId);
    alert('Model trained successfully!');
});

populateRoomSelect();
