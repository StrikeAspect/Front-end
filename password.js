document.addEventListener("DOMContentLoaded", function () {
  const registrationForm = document.getElementById("password-recovery-form");
  const usernameInput = document.getElementById("username");
  const submissionStatus = document.getElementById("submission-status");

  // Funzione per validare la registrazione
  registrationForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let valid = true;

    // Reset messaggi di errore
    document.querySelectorAll(".error-message").forEach((error) => {
      error.textContent = "";
      error.style.display = "none";
    });

    // Controllo username/email
    if (!usernameInput.value.trim()) {
      document.getElementById("username-error").textContent =
        "Email obbligatorio";
      document.getElementById("username-error").style.display = "block";
      valid = false;
    } else if (usernameInput.value.includes("@")) {
      // Se contiene @ potrebbe essere un'email, valida il formato
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(usernameInput.value.trim())) {
        document.getElementById("username-error").textContent =
          "Formato email non valido";
        document.getElementById("username-error").style.display = "block";
        valid = false;
      }
    }

    // Se valido, invia
    if (valid) {
      // Send the email to the backend for password recovery
      fetch("/api/recover-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: usernameInput.value.trim() }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            submissionStatus.textContent =
              "Email di recupero password inviata. Controlla la tua casella di posta.";
            submissionStatus.style.color = "green";
            submissionStatus.style.display = "block";
            // Optionally, redirect to a confirmation page
            // window.location.href = "recovery-confirmation.html";
          } else {
            submissionStatus.textContent =
              data.message ||
              "Errore nell'invio dell'email di recupero password.";
            submissionStatus.style.color = "red";
            submissionStatus.style.display = "block";
          }
        })
        .catch((error) => {
          console.error("Error during password recovery:", error);
          submissionStatus.textContent =
            "Errore durante l'invio dell'email di recupero password.";
          submissionStatus.style.color = "red";
          submissionStatus.style.display = "block";
        });
    }
  });

  // Evita gli spazi nell'username o password
  usernameInput.addEventListener("input", function () {
    this.value = this.value.replace(/\s/g, ""); // Rimuovi spazi
  });
});
