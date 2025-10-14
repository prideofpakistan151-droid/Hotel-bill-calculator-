// Storage functions for bills
function getBills() {
    const bills = localStorage.getItem('hostelBills');
    return bills ? JSON.parse(bills) : [];
}

function saveBill(bill) {
    const bills = getBills();
    
    // Check if bill already exists (for updating)
    const existingIndex = bills.findIndex(b => b.id === bill.id);
    
    if (existingIndex >= 0) {
        bills[existingIndex] = bill;
    } else {
        bills.push(bill);
    }
    
    localStorage.setItem('hostelBills', JSON.stringify(bills));
    return bill;
}

function getBillById(id) {
    const bills = getBills();
    return bills.find(bill => bill.id === id);
}

function deleteBillById(id) {
    const bills = getBills();
    const updatedBills = bills.filter(bill => bill.id !== id);
    localStorage.setItem('hostelBills', JSON.stringify(updatedBills));
    return updatedBills;
}
