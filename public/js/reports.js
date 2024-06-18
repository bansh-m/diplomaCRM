function sortTable(columnIndex, ascending) {
    const table = document.getElementById("reportsTable");
    const rows = Array.from(table.rows).slice(1); // Exclude header row
    const sortedRows = rows.sort((a, b) => {
        const aText = a.cells[columnIndex].innerText;
        const bText = b.cells[columnIndex].innerText;
        if (ascending) {
            return aText.localeCompare(bText, undefined, { numeric: true });
        } else {
            return bText.localeCompare(aText, undefined, { numeric: true });
        }
    });
    const tableBody = document.getElementById('reportsTableBody');
    tableBody.innerHTML = ''; // Clear previous rows
    sortedRows.forEach(row => tableBody.appendChild(row));
}

async function fetchReviews(roomId) {
    const response = await axios.get(`/reviews?room_id=${roomId}`);
    return response.data;
}

async function showReviews(roomId) {
    const reviews = await fetchReviews(roomId);
    const reviewsContent = document.getElementById('reviewsContent');
    reviewsContent.innerHTML = ''; // Clear existing content

    reviews.forEach(review => {
        const reviewDiv = document.createElement('div');
        reviewDiv.innerHTML = `
            <div class="review">
                <h5>${review.clientName} (${review.clientEmail})</h5>
                <p><strong>Difficulty:</strong> ${review.difficulty}</p>
                <p><strong>Actor Performance:</strong> ${review.actorPerformance}</p>
                <p><strong>Overall Rating:</strong> ${review.overallRating}</p>
                <p><strong>Comment:</strong> ${review.comment || 'No comment'}</p>
                <p><strong>Date:</strong> ${new Date(review.createdAt).toLocaleDateString()}</p>
                <hr>
            </div>
        `;
        reviewsContent.appendChild(reviewDiv);
    });
    
    const reviewsModal = new bootstrap.Modal(document.getElementById('reviewsModal'));
    reviewsModal.show();
}