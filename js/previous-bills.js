document.addEventListener('DOMContentLoaded', function() {
    loadBills();
});

function loadBills() {
    const bills = getBills();
    const billsList = document.getElementById('billsList');
    const emptyState = document.getElementById('emptyState');
    
    if (bills.length === 0) {
        billsList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    billsList.style.display = 'block';
    emptyState.style.display = 'none';
    
    // Sort bills by date (newest first)
    bills.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    billsList.innerHTML = '';
    
    bills.forEach(bill => {
        const billCard = document.createElement('div');
        billCard.className = 'bill-card';
        billCard.onclick = () => viewBillDetail(bill.id);
        
        // Calculate participant codes used in this bill
        const participantCodes = new Set();
        bill.entries.forEach(entry => {
            entry.participants.split('').forEach(code => participantCodes.add(code));
        });
        
        billCard.innerHTML = `
            <div class="bill-header">
                <div>
                    <div class="bill-name">${bill.name}</div>
                    <div class="bill-date">${new Date(bill.date).toLocaleDateString()}</div>
                </div>
                <div class="bill-total">₹${bill.totalAmount ? bill.totalAmount.toFixed(2) : '0.00'}</div>
            </div>
            ${bill.description ? `<div class="bill-description">${bill.description}</div>` : ''}
            <div class="bill-participants">
                ${Array.from(participantCodes).map(code => 
                    `<span class="participant-tag">${nameMap[code]}</span>`
                ).join('')}
            </div>
            <div style="margin-top: 10px; font-size: 14px; color: var(--gray);">
                ${bill.entries.length} entries
            </div>
        `;
        
        billsList.appendChild(billCard);
    });
}

function viewBillDetail(billId) {
    navigateTo(`bill-detail.html?id=${billId}`);
}
