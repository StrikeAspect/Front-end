// Collegamento Dataset

async function loadTransactions() {
  try {
    // Fetch el JSON original
    const response = await fetch("database.json");
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const data = await response.json();

    // Asegurarse de que cada transacción tenga createdAt
    data.transactions = data.transactions.map((transaction) => {
      // Si no tiene createdAt, asignar la fecha actual
      if (!transaction.createdAt) {
        transaction.createdAt = new Date().toISOString();
      }
      return transaction;
    });

    // Ahora puedes usar estos datos con las fechas asignadas
    displayTransactions(data.transactions);
  } catch (error) {
    console.error("Error loading transaction data:", error);
  }
}

// Función para mostrar las transacciones
function displayTransactions(transactions) {
    const container = document.querySelector('.transactions');
    container.innerHTML = '';
    
    transactions.forEach(transaction => {
        const type = transaction.payment_direction === 'to_receive' ? 'positive' : 'negative';
        const progress = transaction.paid ? 100 : 0;
        const formattedAmount = (type === 'positive' ? '+' : '-') + transaction.amount + '€';
        
        const cardHTML = `
            <div class="transaction-card ${type} collapsed">
                <div class="status-indicator">
                    <div class="dot green"></div>
                </div>
                <div><img class="logo-pay" src="/IconPay/${transaction.payment_method}.png" alt=""></div>
                <div class="transaction-details">
                    <div class="person">${transaction.name}</div>
                    <div class="collapsible-content">
                        <div class="description">${transaction.description}</div>
                        <div class="progress-bar">
                            <div class="progress ${type}" data-progress="${progress}"></div>
                        </div>
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
        
        // Inizializza il collapse
        setupCardCollapse();
    }, 100);
}

// Cargar transacciones cuando la página se carga
document.addEventListener("DOMContentLoaded", loadTransactions);

// Funzione per gestire il collapse delle card
function setupCardCollapse() {
  const cards = document.querySelectorAll(".transaction-card");

  // Inizialmente tutte le card sono collapsed
  cards.forEach((card) => {
    card.classList.add("collapsed");
  });

  // Aggiungi event listener per il click su ogni card
  cards.forEach((card) => {
    card.addEventListener("click", function (event) {
      // Previeni il click se è un click su un link o un pulsante all'interno della card
      if (event.target.closest("a, button")) {
        return;
      }

      // Se la card è già espansa, la chiudi semplicemente
      if (this.classList.contains("expanded")) {
        this.classList.remove("expanded");
        this.classList.add("collapsed");
        return;
      }

      // Chiudi tutte le altre card
      cards.forEach((otherCard) => {
        if (otherCard !== this) {
          otherCard.classList.remove("expanded");
          otherCard.classList.add("collapsed");
        }
      });

      // Apri questa card
      this.classList.add("expanded");
      this.classList.remove("collapsed");
    });
  });
}

// Chiama la funzione dopo aver caricato le transazioni
document.addEventListener("DOMContentLoaded", () => {
  loadTransactions().then(() => {
    setupCardCollapse();
  });
});
