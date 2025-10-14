let bills = { 'Z': 0, 'U': 0, 'M': 0, 'B': 0, 'A': 0 };
let entries = [];
let editId = null;
let currentBill = null;

// Initialize calculator
document.addEventListener('DOMContentLoaded', function() {
    // Load current bill from session storage
    const billData = sessionStorage.getItem('currentBill');
    if (billData) {
        currentBill = JSON.parse(billData);
        bills = currentBill.totals;
        entries = currentBill.entries;
        
        // Update UI
        document.getElementById('billTitle').textContent = currentBill.name;
        document.getElementById('billInfo').textContent = 
            `Date: ${new Date(currentBill.date).toLocaleDateString()}${currentBill.description ? ` • ${currentBill.description}` : ''}`;
    }
    
    initParticipantBadges();
    updateDisplay();
    renderEntries();
});

// Initialize participant badges
function initParticipantBadges() {
    const container = document.getElementById('participantBadges');
    container.innerHTML = '';
    
    for (const [code, name] of Object.entries(nameMap)) {
        const badge = document.createElement('div');
        badge.className = 'participant-badge';
        badge.innerHTML = `
            <span>${name}</span>
            <span>(${code})</span>
        `;
        badge.dataset.code = code;
        badge.onclick = function() {
            this.classList.toggle('active');
            updateParticipantsInput();
        };
        container.appendChild(badge);
    }
}

// Update participants input
function updateParticipantsInput() {
    const activeBadges = document.querySelectorAll('.participant-badge.active');
    const participants = Array.from(activeBadges).map(badge => badge.dataset.code).join('');
    document.getElementById('participants').value = participants;
}

// Validate inputs
function validateInputs() {
    const price = parseFloat(document.getElementById('price').value);
    const participants = document.getElementById('participants').value;
    
    if (!price || price <= 0) {
        showNotification('Please enter a valid price', 'error');
        return false;
    }
    
    if (!participants) {
        showNotification('Please select at least one participant', 'error');
        return false;
    }
    
    return true;
}

// Add entry
function addEntry() {
    if (!validateInputs()) return;

    const price = parseFloat(document.getElementById('price').value);
    const participants = document.getElementById('participants').value;
    const description = document.getElementById('description').value;

    // Editing existing entry
    if(editId) {
        const entry = entries.find(e => e.id === editId);
        if(entry) {
            // remove old contribution
            const oldShare = entry.price / entry.participants.length;
            for(const c of entry.participants) bills[c] -= oldShare;

            // update entry
            entry.price = price;
            entry.participants = participants;
            entry.description = description;

            // add new contribution
            const newShare = price / participants.length;
            for(const c of participants) bills[c] += newShare;

            editId = null;
            document.getElementById('addBtn').innerHTML = '<span>➕</span> Add Entry';
            showNotification('Entry updated successfully');
        }
    } else {
        // Add new entry
        const share = price / participants.length;
        for(const c of participants) bills[c] += share;

        const id = Date.now().toString();
        entries.push({id, price, participants, description});
        showNotification('Entry added successfully');
    }

    updateDisplay();
    renderEntries();
    clearForm();
    updateCurrentBill();
}

// Render entries
function renderEntries() {
    const entriesList = document.getElementById('entriesList');
    entriesList.innerHTML = '';
    
    if (entries.length === 0) {
        entriesList.innerHTML = '<div class="text-center" style="padding: 20px; color: var(--gray);">No entries yet</div>';
        return;
    }
    
    entries.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'entry-item';
        entryDiv.setAttribute("data-id", entry.id);

        const names = entry.participants.split('').map(c => nameMap[c]).join(', ');
        entryDiv.innerHTML = `
            <div>
                <div><strong>₹${entry.price.toFixed(2)}</strong> - ${names}</div>
                <div style="font-size: 14px; color: #6c757d;">${entry.description || ''}</div>
            </div>
            <div class="action-btns">
                <button class="edit-btn" onclick="editEntry('${entry.id}')">✏️ Edit</button>
                <button class="delete-btn" onclick="deleteEntry('${entry.id}')">❌ Delete</button>
            </div>`;

        entriesList.appendChild(entryDiv);
    });
}

// Edit entry
function editEntry(id) {
    const entry = entries.find(e => e.id === id);
    if(entry) {
        document.getElementById('price').value = entry.price;
        document.getElementById('description').value = entry.description || '';
        
        // Set participant badges
        const badges = document.querySelectorAll('.participant-badge');
        badges.forEach(badge => {
            badge.classList.remove('active');
            if (entry.participants.includes(badge.dataset.code)) {
                badge.classList.add('active');
            }
        });
        updateParticipantsInput();
        
        editId = id;
        document.getElementById('addBtn').innerHTML = '<span>💾</span> Save Changes';
    }
}

// Delete entry
function deleteEntry(id) {
    if (confirm('Are you sure you want to delete this entry?')) {
        const entry = entries.find(e => e.id === id);
        if(entry) {
            const share = entry.price / entry.participants.length;
            for(const c of entry.participants) bills[c] -= share;
            entries = entries.filter(e => e.id !== id);
            updateDisplay();
            renderEntries();
            updateCurrentBill();
            showNotification('Entry deleted successfully');
        }
    }
}

// Update display
function updateDisplay() {
    let html = '<h3>Current Totals:</h3>';
    for(const [code, total] of Object.entries(bills)) {
        html += `<strong>${nameMap[code]}:</strong> ₹${total.toFixed(2)}<br>`;
    }
    document.getElementById('currentTotals').innerHTML = html;
}

// Show final totals
function showFinal() {
    let html = '<h3>Final Monthly Bills:</h3>';
    let totalSum = 0;
    for(const [code,total] of Object.entries(bills)) {
        html += `${nameMap[code]}: ₹${total.toFixed(2)}<br>`;
        totalSum += total;
    }
    html += `<hr><strong>Total Amount: ₹${totalSum.toFixed(2)}</strong><br>`;
    html += `<strong>Total Amount pay to Shah jee: ₹${totalSum.toFixed(2)}</strong>`;
    document.getElementById('finalTotals').innerHTML = html;
    
    // Update current bill with final totals
    if (currentBill) {
        currentBill.finalTotals = {...bills};
        updateCurrentBill();
    }
}

// Clear form
function clearForm() {
    document.getElementById('price').value = '';
    document.getElementById('description').value = '';
    
    const badges = document.querySelectorAll('.participant-badge');
    badges.forEach(badge => badge.classList.remove('active'));
    updateParticipantsInput();
}

// Filter log
function filterLog() {
    const query = document.getElementById('searchLog').value.toLowerCase();
    const items = document.querySelectorAll('.entry-item');
    
    items.forEach(item => {
        const text = item.innerText.toLowerCase();
        item.style.display = text.includes(query) ? 'flex' : 'none';
    });
}

// Update current bill in session storage
function updateCurrentBill() {
    if (currentBill) {
        currentBill.totals = {...bills};
        currentBill.entries = [...entries];
        sessionStorage.setItem('currentBill', JSON.stringify(currentBill));
    }
}

// Save bill
function saveBill() {
    if (!currentBill) {
        showNotification('No bill data to save', 'error');
        return;
    }
    
    if (entries.length === 0) {
        showNotification('Please add at least one entry before saving', 'error');
        return;
    }
    
    // Calculate total amount
    const totalAmount = entries.reduce((sum, entry) => sum + entry.price, 0);
    currentBill.totalAmount = totalAmount;
    
    // Save to local storage
    saveBill(currentBill);
    
    showNotification('Bill saved successfully!');
    
    // Clear session storage and redirect to home
    setTimeout(() => {
        sessionStorage.removeItem('currentBill');
        navigateTo('index.html');
    }, 1500);
}

// Reset current bill
function resetCurrentBill() {
    if (confirm('Are you sure you want to reset all entries? This cannot be undone.')) {
        bills = { 'Z':0,'U':0,'M':0,'B':0,'A':0 };
        entries = [];
        updateDisplay();
        renderEntries();
        updateCurrentBill();
        showNotification('All entries have been reset');
    }
}
