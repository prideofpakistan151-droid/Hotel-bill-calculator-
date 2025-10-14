// Navigation functions
function navigateTo(page) {
    window.location.href = page;
}

function goBack() {
    window.history.back();
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = 'notification';
    
    if (type === 'error') {
        notification.classList.add('error');
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Name mapping for participants
const nameMap = {
    'Z': 'Zeshan', 
    'U': 'Umam',
    'M': 'Rasool', 
    'B': 'Abdullah', 
    'A': 'Aziz'
};
