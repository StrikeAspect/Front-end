document.addEventListener("DOMContentLoaded", function () {
  const registrationForm = document.getElementById("password-recovery-form");
  const usernameInput = document.getElementById("username");

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
      window.location.href = "after.html"; // Redirect after validation
    }
  });

  // Evita gli spazi nell'username o password
  [usernameInput, passwordInput].forEach((input) => {
    input.addEventListener("input", function () {
      this.value = this.value.replace(/\s/g, ""); // Rimuovi spazi
    });
  });
});
