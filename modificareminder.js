const jsonFilePath = "database.json";

async function loadReminders() {
    try {
        const response = await fetch(jsonFilePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.transactions;
    } catch (error) {
        console.error("Error loading reminders:", error);
        return [];
    }
}

async function saveReminders(reminders) {
    try {
        const response = await fetch(jsonFilePath, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ transactions: reminders }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error saving reminders:", error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const reminderForm = document.getElementById("reminderForm");
    let reminders = await loadReminders();

    function populateForm(reminder) {
        document.getElementById("reminderId").value = reminder.id;
        document.getElementById("title").value = reminder.name;
        document.getElementById("number").value = reminder.amount;
        document.querySelector(`input[name="transactionType"][value="${reminder.payment_direction === "to_pay" ? "Uscite" : "Entrate"}"]`).checked = true;
        document.getElementById("date").value = reminder.expiration_datetime.slice(0, 16);
        document.getElementById("frequency").value = reminder.repetition;
        document.getElementById("paymentType").value = reminder.payment_method;
        document.getElementById("description").value = reminder.description;
        document.querySelector(`input[name="status"][value="${reminder.is_active}"]`).checked = true;
    }

    reminderForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const reminderId = parseInt(document.getElementById("reminderId").value);
        const title = document.getElementById("title").value;
        const number = parseFloat(document.getElementById("number").value);
        const transactionType = document.querySelector('input[name="transactionType"]:checked').value;
        const date = document.getElementById("date").value;
        const frequency = document.getElementById("frequency").value;
        const paymentType = document.getElementById("paymentType").value;
        const description = document.getElementById("description").value;
        const status = document.querySelector('input[name="status"]:checked').value === "true";

        if (reminderId) {
            const index = reminders.findIndex((rem) => rem.id === reminderId);
            if (index !== -1) {
                reminders[index] = {
                    id: reminderId,
                    name: title,
                    amount: number,
                    payment_direction: transactionType === "Uscite" ? "to_pay" : "to_receive",
                    expiration_datetime: date + ":00.000Z",
                    repetition: frequency,
                    payment_method: paymentType,
                    description: description,
                    is_active: status,
                };
            }
        } else {
            const id = Date.now();
            reminders.push({
                id: id,
                name: title,
                amount: number,
                payment_direction: transactionType === "Uscite" ? "to_pay" : "to_receive",
                expiration_datetime: date + ":00.000Z",
                repetition: frequency,
                payment_method: paymentType,
                description: description,
                is_active: status,
            });
        }

        await saveReminders(reminders);
        alert("Reminder modificato con successo!");
    });

    const urlParams = new URLSearchParams(window.location.search);
    const reminderId = parseInt(urlParams.get("id"));
    if (reminderId) {
        const reminder = reminders.find((rem) => rem.id === reminderId);
        if (reminder) {
            populateForm(reminder);
        }
    }
});