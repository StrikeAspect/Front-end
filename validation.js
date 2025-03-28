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

  // Email validation
  function validateEmail(email) {
    if (!email) return "L'email è obbligatoria";

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
    const turnstileResponse = document.querySelector(
      '[name="cf-turnstile-response"]'
    );
    if (!turnstileResponse || !turnstileResponse.value) {
      document.getElementById("captcha-error").textContent =
        "Completa la verifica captcha";
      document.getElementById("captcha-error").style.display = "block";
      isValid = false;
    }

    // Validate reCAPTCHA
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

      // Simulate form submission (in real app, this would be an API call)
      setTimeout(function () {
        submissionStatus.textContent =
          "Registrazione completata! Controlla la tua email per verificare l'account.";
        submissionStatus.className = "submission-status success";

        // Reset form after successful submission
        form.reset();
      }, 2000);
    }
  });
});
