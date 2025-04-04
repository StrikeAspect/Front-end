document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registration-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const privacyCheckbox = document.getElementById("privacy-policy");
  const termsCheckbox = document.getElementById("terms-conditions");
  const registerButton = document.getElementById("register-button");
  const submissionStatus = document.getElementById("submission-status");

  // List of disposable email domains
  const disposableDomains = [
    "mailinator.com",
    "tempmail.com",
    "throwawaymail.com",
    "guerrillamail.com",
    "yopmail.com",
    "10minutemail.com",
    "trashmail.com",
    "sharklasers.com",
    "temp-mail.org",
  ];

  // Live password validation
  passwordInput.addEventListener("input", function () {
    validatePasswordLive(this.value);
  });

  // Password matching validation
  confirmPasswordInput.addEventListener("input", function () {
    if (this.value !== passwordInput.value) {
      document.getElementById("confirm-password-error").textContent =
        "Le password non corrispondono";
      document.getElementById("confirm-password-error").style.display = "block";
    } else {
      document.getElementById("confirm-password-error").style.display = "none";
    }
  });

  // Validate password strength in real-time
  function validatePasswordLive(password) {
    const lengthReq = document.getElementById("req-length");
    const specialReq = document.getElementById("req-special");
    const uppercaseReq = document.getElementById("req-uppercase");
    const numbersReq = document.getElementById("req-numbers");
    const usernameReq = document.getElementById("req-username");

    // Check minimum length
    if (password.length >= 8) {
      lengthReq.classList.add("fulfilled");
    } else {
      lengthReq.classList.remove("fulfilled");
    }

    // Check special character
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      specialReq.classList.add("fulfilled");
    } else {
      specialReq.classList.remove("fulfilled");
    }

    // Check uppercase letter
    if (/[A-Z]/.test(password)) {
      uppercaseReq.classList.add("fulfilled");
    } else {
      uppercaseReq.classList.remove("fulfilled");
    }

    // Check for two numbers
    if ((password.match(/\d/g) || []).length >= 2) {
      numbersReq.classList.add("fulfilled");
    } else {
      numbersReq.classList.remove("fulfilled");
    }

    // Check doesn't contain email or username
    const username = nameInput.value.toLowerCase().trim();
    const email = emailInput.value.toLowerCase().trim();
    const passwordLower = password.toLowerCase();

    if (
      username === "" ||
      email === "" ||
      (!passwordLower.includes(username) &&
        !passwordLower.includes(email.split("@")[0]))
    ) {
      usernameReq.classList.add("fulfilled");
    } else {
      usernameReq.classList.remove("fulfilled");
    }

    // Update strength meter
    updatePasswordStrength(password);
  }

  // Update password strength indicator
  function updatePasswordStrength(password) {
    const strengthMeter = document.getElementById("password-strength");
    const requirements = document.querySelectorAll(".requirement.fulfilled");

    if (password.length === 0) {
      strengthMeter.textContent = "";
      strengthMeter.className = "password-strength-meter";
      return;
    }

    if (requirements.length === 5) {
      strengthMeter.textContent = "Password: Forte";
      strengthMeter.className = "password-strength-meter strong";
    } else if (requirements.length >= 3) {
      strengthMeter.textContent = "Password: Media";
      strengthMeter.className = "password-strength-meter medium";
    } else {
      strengthMeter.textContent = "Password: Debole";
      strengthMeter.className = "password-strength-meter weak";
    }
  }
  // Prevent spaces in the password input
  passwordInput.addEventListener("input", function () {
    this.value = this.value.replace(/\s/g, ""); // Remove spaces
    validatePasswordLive(this.value); // Re-validate password
  });

  // Replace the email input event handler with this improved version
  emailInput.addEventListener("keydown", function (e) {
    // Prevent space key from being entered at all
    if (e.key === " " || e.keyCode === 32) {
      e.preventDefault();
      return false;
    }
  });

  // Still handle paste events to remove any spaces
  emailInput.addEventListener("paste", function (e) {
    // Small delay to let the paste complete
    setTimeout(() => {
      if (this.value.includes(" ")) {
        const cursorPosition = this.selectionStart;
        const originalValue = this.value;
        const newValue = originalValue.replace(/\s/g, "");

        this.value = newValue;

        // Adjust cursor position
        const spacesRemoved =
          originalValue.slice(0, cursorPosition).length -
          newValue.slice(0, cursorPosition).length;
        this.setSelectionRange(
          cursorPosition - spacesRemoved,
          cursorPosition - spacesRemoved
        );
      }

      validateEmail(this.value);
    }, 0);
  });

  // Email validation
  function validateEmail(email) {
    if (!email) return "L'email è obbligatoria";

    if (email.includes(" ")) {
      return "L'email non può contenere spazi";
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return "Formato email non valido";
    }

    const domain = email.split("@")[1];
    if (disposableDomains.includes(domain)) {
      return "Gli indirizzi email temporanei non sono ammessi";
    }

    return "";
  }

  // Password validation
  function validatePassword(password) {
    const errors = [];

    if (password.includes(" ")) {
      errors.push("La password non può contenere spazi");
    }

    if (password.length < 8) {
      errors.push("Minimo 8 caratteri");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Almeno un carattere speciale");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Almeno una lettera maiuscola");
    }

    if ((password.match(/\d/g) || []).length < 2) {
      errors.push("Almeno due numeri");
    }

    const username = nameInput.value.toLowerCase().trim();
    const email = emailInput.value.toLowerCase().trim();
    const passwordLower = password.toLowerCase();

    if (username && passwordLower.includes(username)) {
      errors.push("Non può contenere il tuo nome");
    }

    if (email && passwordLower.includes(email.split("@")[0])) {
      errors.push("Non può contenere la tua email");
    }

    return errors;
  }

  // Form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let isValid = true;

    // Clear previous errors
    document.querySelectorAll(".error-message").forEach((el) => {
      el.textContent = "";
      el.style.display = "none";
    });

    // Validate name
    if (!nameInput.value.trim()) {
      document.getElementById("name-error").textContent =
        "Il nome è obbligatorio";
      document.getElementById("name-error").style.display = "block";
      isValid = false;
    }

    // Validate email
    const emailError = validateEmail(emailInput.value);
    if (emailError) {
      document.getElementById("email-error").textContent = emailError;
      document.getElementById("email-error").style.display = "block";
      isValid = false;
    }

    // Validate password
    const passwordErrors = validatePassword(passwordInput.value);
    if (passwordErrors.length > 0) {
      document.getElementById("password-error").innerHTML = passwordErrors
        .map((error) => `<div>${error}</div>`)
        .join("");
      document.getElementById("password-error").style.display = "block";
      isValid = false;
    }

    // Validate password confirmation
    if (confirmPasswordInput.value !== passwordInput.value) {
      document.getElementById("confirm-password-error").textContent =
        "Le password non corrispondono";
      document.getElementById("confirm-password-error").style.display = "block";
      isValid = false;
    }

    // Validate terms and privacy
    if (!privacyCheckbox.checked) {
      document.getElementById("privacy-error").textContent =
        "Devi accettare la Privacy Policy";
      document.getElementById("privacy-error").style.display = "block";
      isValid = false;
    }

    if (!termsCheckbox.checked) {
      document.getElementById("terms-error").textContent =
        "Devi accettare i Termini e Condizioni";
      document.getElementById("terms-error").style.display = "block";
      isValid = false;
    }

    // Validate captcha
    const recaptchaResponse = grecaptcha.getResponse();
    if (recaptchaResponse.length === 0) {
      document.getElementById("captcha-error").textContent =
        "Completa la verifica captcha";
      document.getElementById("captcha-error").style.display = "block";
      isValid = false;
    } else {
      document.getElementById("captcha-error").style.display = "none";
    }
    // If form is valid, submit
    if (isValid) {
      // Show loading state
      registerButton.disabled = true;
      submissionStatus.textContent = "Registrazione in corso...";
      submissionStatus.className = "submission-status loading";

      // Prepare data for sending
      const formData = {
        name: nameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        recaptchaResponse: recaptchaResponse,
        turnstileResponse: turnstileResponse.value,
        privacyPolicy: privacyCheckbox.checked,
        termsConditions: termsCheckbox.checked,
      };

      // Send data to backend
      fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Handle successful registration
          submissionStatus.textContent =
            "Registrazione completata! Controlla la tua email per verificare l'account.";
          submissionStatus.className = "submission-status success";
          form.reset();
          window.location.href = "after.html";
        })
        .catch((error) => {
          // Handle errors
          console.error(
            "There has been a problem with your fetch operation:",
            error
          );
          submissionStatus.textContent =
            "Errore durante la registrazione. Riprova più tardi.";
          submissionStatus.className = "submission-status error";
        })
        .finally(() => {
          registerButton.disabled = false;
        });
    }
  });

  // Add password toggle functionality
  function setupPasswordToggle(passwordField, confirmPasswordField) {
    // Create and add toggle buttons for both password fields
    const fields = [
      { input: passwordField, container: passwordField.parentNode },
      {
        input: confirmPasswordField,
        container: confirmPasswordField.parentNode,
      },
    ];

    fields.forEach((field) => {
      // Create toggle button
      const toggleBtn = document.createElement("button");
      toggleBtn.type = "button";
      toggleBtn.className = "password-toggle";
      toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
      toggleBtn.title = "Mostra/nascondi password";

      // Add toggle button to DOM
      field.container.style.position = "relative";
      field.container.appendChild(toggleBtn);

      // Add click event
      toggleBtn.addEventListener("click", function () {
        if (field.input.type === "password") {
          field.input.type = "text";
          toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
          field.input.type = "password";
          toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
        }
      });
    });
  }

  // Initialize password toggles
  setupPasswordToggle(passwordInput, confirmPasswordInput);
});
