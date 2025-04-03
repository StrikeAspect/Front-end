function toggleDatePicker() {
    var datePicker = document.getElementById('datePicker');
    if (datePicker.style.display === 'none') {
        datePicker.style.display = 'block';
    } else {
        datePicker.style.display = 'none';
    }
}

function setDate() {
    var day = document.getElementById('day').value;
    var month = document.getElementById('month').value;
    var year = document.getElementById('year').value;
    var hour = document.getElementById('hour').value;
    var minute = document.getElementById('minute').value;

    var dateTime = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
    document.getElementById('date').value = dateTime;
    document.getElementById('datePicker').style.display = 'none';
}

document.getElementById('reminderForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const date = document.getElementById('date').value;
    const frequency = document.getElementById('frequency').value;
    const paymentType = document.getElementById('paymentType').value;
    const description = document.getElementById('description').value;

    console.log({
        title,
        date,
        frequency,
        paymentType,
        description
    });

    alert('Reminder creato con successo!');
});

document.addEventListener("DOMContentLoaded", () => {
  const dateField = document.getElementById("date");

  dateField.addEventListener("click", () => {
    dateField.showPicker(); // Mostra il selettore di data/ora
  });
});