document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  // Funzione per abilitare il password toggle
  function setupPasswordToggle(passwordField) {
    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "password-toggle";
    toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
    toggleBtn.title = "Mostra/nascondi password";

    // Posiziona il pulsante accanto all'input della password
    const parent = passwordField.parentNode;
    parent.style.position = "relative";
    parent.appendChild(toggleBtn);

    // Aggiungi evento click
    toggleBtn.addEventListener("click", () => {
      if (passwordField.type === "password") {
        passwordField.type = "text";
        toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
      } else {
        passwordField.type = "password";
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
      }
    });
  }

  // Inizializza il toggle per la password
  setupPasswordToggle(passwordInput);

  // Funzione per validare il login
  loginForm.addEventListener("submit", function (e) {
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
    } else if (usernameInput.value.includes('@')) {
      // Se contiene @ potrebbe essere un'email, valida il formato
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(usernameInput.value.trim())) {
        document.getElementById("username-error").textContent =
          "Formato email non valido";
        document.getElementById("username-error").style.display = "block";
        valid = false;
      }
    }

    // Controllo password
    if (!passwordInput.value.trim()) {
      document.getElementById("password-error").textContent =
        "Password obbligatoria";
      document.getElementById("password-error").style.display = "block";
      valid = false;
    }

    // Se valido, invia
    if (valid) {
      alert("Login eseguito con successo!");
    }
  });

  // Evita gli spazi nell'username o password
  [usernameInput, passwordInput].forEach((input) => {
    input.addEventListener("input", function () {
      this.value = this.value.replace(/\s/g, ""); // Rimuovi spazi
    });
  });
});
