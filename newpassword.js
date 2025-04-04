document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("password-recovery-form");
  const newPasswordInput = document.getElementById("new-password");
  const confirmPasswordInput = document.getElementById("confirm-new-password");
  const submissionStatus = document.getElementById("submission-status");
  const passwordStrengthMeter = document.getElementById("password-strength"); // Get the password strength meter element

  // Add password toggle functionality
  function setupPasswordToggle(passwordField) {
    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "password-toggle";
    toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
    toggleBtn.title = "Mostra/nascondi password";

    // Position the button next to the password input
    const parent = passwordField.parentNode;
    parent.style.position = "relative";
    parent.appendChild(toggleBtn);

    // Add click event
    toggleBtn.addEventListener("click", function (e) {
      e.preventDefault(); // Prevent form submission
      if (passwordField.type === "password") {
        passwordField.type = "text";
        this.innerHTML = '<i class="fas fa-eye-slash"></i>';
        this.classList.add("visible");
      } else {
        passwordField.type = "password";
        this.innerHTML = '<i class="fas fa-eye"></i>';
        this.classList.remove("visible");
      }
    });
  }

  // Initialize password toggles for both fields
  setupPasswordToggle(newPasswordInput);
  setupPasswordToggle(confirmPasswordInput);

  // Funzione per validare la password live
  newPasswordInput.addEventListener("input", function () {
    validatePassword(this.value);
    updatePasswordStrength(this.value); // Update the password strength meter
  });

  // Conferma password
  confirmPasswordInput.addEventListener("input", function () {
    if (this.value !== newPasswordInput.value) {
      showError("confirm-password-error", "Le password non corrispondono");
    } else {
      hideError("confirm-password-error");
    }
  });

  // Validazione totale al submit del form
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Blocca il submit sempre all'inizio
    let valid = true;

    // Controllo campo Nuova Password
    if (!newPasswordInput.value.trim()) {
      showError("password-error", "La password è obbligatoria");
      valid = false;
    } else if (!isPasswordValid(newPasswordInput.value)) {
      showError("password-error", "La password non rispetta i requisiti");
      valid = false;
    } else {
      hideError("password-error");
    }

    // Controllo conferma password
    if (!confirmPasswordInput.value.trim()) {
      showError(
        "confirm-password-error",
        "La conferma password è obbligatoria"
      );
      valid = false;
    } else if (confirmPasswordInput.value !== newPasswordInput.value) {
      showError("confirm-password-error", "Le password non corrispondono");
      valid = false;
    } else {
      hideError("confirm-password-error");
    }

    // Se tutto è valido, procedi con il reset della password
    if (valid) {
      // Send the new password to the backend for reset
      fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword: newPasswordInput.value }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            submissionStatus.textContent = "Password reimpostata con successo!";
            submissionStatus.style.color = "green";
            submissionStatus.style.display = "block";
            form.reset(); // Resetta il modulo
            // Optionally, redirect to the login page
            window.location.href = "login.html";
          } else {
            submissionStatus.textContent =
              data.message || "Errore nel reimpostare la password.";
            submissionStatus.style.color = "red";
            submissionStatus.style.display = "block";
          }
        })
        .catch((error) => {
          console.error("Error during password reset:", error);
          submissionStatus.textContent =
            "Errore durante il reimpostazione della password.";
          submissionStatus.style.color = "red";
          submissionStatus.style.display = "block";
        });
    }
  });

  // Funzione per verificare se una password soddisfa i requisiti
  function isPasswordValid(password) {
    const hasMinLength = password.length >= 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumbers = (password.match(/\d/g) || []).length >= 2;

    return hasMinLength && hasSpecialChar && hasUppercase && hasNumbers;
  }

  // Validazione live password
  function validatePassword(password) {
    const lengthReq = document.getElementById("req-length");
    const specialReq = document.getElementById("req-special");
    const uppercaseReq = document.getElementById("req-uppercase");
    const numbersReq = document.getElementById("req-numbers");

    // Requisiti
    password.length >= 8
      ? lengthReq.classList.add("fulfilled")
      : lengthReq.classList.remove("fulfilled");

    /[!@#$%^&*(),.?":{}|<>]/.test(password)
      ? specialReq.classList.add("fulfilled")
      : specialReq.classList.remove("fulfilled");

    /[A-Z]/.test(password)
      ? uppercaseReq.classList.add("fulfilled")
      : uppercaseReq.classList.remove("fulfilled");

    (password.match(/\d/g) || []).length >= 2
      ? numbersReq.classList.add("fulfilled")
      : numbersReq.classList.remove("fulfilled");
  }
  // Update password strength indicator
  function updatePasswordStrength(password) {
    const requirements = document.querySelectorAll(".requirement.fulfilled");

    if (password.length === 0) {
      passwordStrengthMeter.textContent = "";
      passwordStrengthMeter.className = "password-strength-meter";
      return;
    }

    if (requirements.length === 4) {
      passwordStrengthMeter.textContent = "Password: Forte";
      passwordStrengthMeter.className = "password-strength-meter strong";
    } else if (requirements.length >= 2) {
      passwordStrengthMeter.textContent = "Password: Media";
      passwordStrengthMeter.className = "password-strength-meter medium";
    } else {
      passwordStrengthMeter.textContent = "Password: Debole";
      passwordStrengthMeter.className = "password-strength-meter weak";
    }
  }

  // Funzione per mostrare un errore
  function showError(id, message) {
    const error = document.getElementById(id);
    error.textContent = message;
    error.style.display = "block";
  }

  // Funzione per nascondere un errore
  function hideError(id) {
    const error = document.getElementById(id);
    error.style.display = "none";
  }
});
