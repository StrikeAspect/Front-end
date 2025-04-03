// Collegamento Dataset

async function loadTransactions() {
    try {
        // Fetch el JSON original
        const response = await fetch('database.json');
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        
        const data = await response.json();
        
        // Asegurarse de que cada transacción tenga createdAt
        data.transactions = data.transactions.map(transaction => {
            // Si no tiene createdAt, asignar la fecha actual
            if (!transaction.createdAt) {
                transaction.createdAt = new Date().toISOString();
            }
            return transaction;
        });
        
        // Ahora puedes usar estos datos con las fechas asignadas
        displayTransactions(data.transactions);
        
    } catch (error) {
        console.error('Error loading transaction data:', error);
    }
}


// Función para mostrar las transacciones
function displayTransactions(transactions) {
    const container = document.querySelector('.transactions');
    container.innerHTML = '';
    
    transactions.forEach(transaction => {
        // Determinar si es positiva o negativa basado en payment_direction
        const type = transaction.payment_direction === 'to_receive' ? 'positive' : 'negative';
        
        // Calcular progreso basado en paid
        const progress = transaction.paid ? 100 : 0;
        
        // Formatear el monto con signo + o - según corresponda
        const formattedAmount = (type === 'positive' ? '+' : '-') + transaction.amount + '€';
        
        // Crear HTML para la tarjeta
        const cardHTML = `
            <div class="transaction-card ${type}">
                <div class="status-indicator">
                    <div class="dot green"></div>
                </div>
                <div><img class="logo-pay" src="/IconPay/${transaction.payment_method}.png" alt=""></div>
                <div class="transaction-details">
                    <div class="person">${transaction.name}</div>
                    <div class="description">${transaction.description}</div>
                    <div class="progress-bar">
                        <div class="progress ${type}" data-progress="${progress}"></div>
                    </div>
                </div>
                <div class="amount ${type}">${formattedAmount}</div>
            </div>
        `;
        
        container.innerHTML += cardHTML;
    });
    
    // Animar barras de progreso
    setTimeout(() => {
        document.querySelectorAll('.progress').forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = `${progress}%`;
        });
    }, 100);
}

// Cargar transacciones cuando la página se carga
document.addEventListener('DOMContentLoaded', loadTransactions);
