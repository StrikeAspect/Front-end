// Function to set progress based on status
function updateProgressBars() {
    // Get all transaction cards
    const cards = document.querySelectorAll('.transaction-card');
    
    cards.forEach(card => {
        // Get the progress element for this card
        const progressBar = card.querySelector('.progress');
        
        // Get the status of the card (you can define your own status logic)
        // For example, we'll use a random status value between 0-100 for demonstration
        let status = Math.floor(Math.random() * 101);
        
        // Set the width of the progress bar based on status
        progressBar.style.width = status + '%';
        
        // You can also add the status percentage as text if needed
        const description = card.querySelector('.description');
        description.textContent = `Status: ${status}%`;
    });
}

// Initial update
updateProgressBars();

// Update every 3 seconds (for demonstration)
setInterval(updateProgressBars, 3000);

// Define possible card statuses and their corresponding progress values
const STATUS_MAP = {
    'pending': 25,
    'processing': 50, 
    'completed': 100,
    'failed': 100  // For failed transactions, show full but with different color
};

// Function to update progress based on card status
function updateCardProgress(card, status) {
    // Get the progress element for this card
    const progressBar = card.querySelector('.progress');
    const description = card.querySelector('.description');
    
    // Get progress value from status map (default to 0 if status not found)
    const progressValue = STATUS_MAP[status] || 0;
    
    // Update progress bar width
    progressBar.style.width = progressValue + '%';
    
    // Update description text to show status
    description.textContent = `Status: ${status}`;
    
    // For failed status, we can change the color
    if (status === 'failed' && card.classList.contains('negative')) {
        progressBar.style.backgroundColor = '#ff3333';
    } else {
        progressBar.style.backgroundColor = '#fff';
    }
}



function initProgressBars() {
    const cards = document.querySelectorAll('.transaction-card');
    
    cards.forEach(card => {
        // Get status from data attribute
        const status = card.getAttribute('data-status') || 'pending';
        updateCardProgress(card, status);
        
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initProgressBars);

