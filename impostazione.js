// Function to update the form dynamically
function updateForm(user) {
  // Update the header
  document.getElementById("user-name").textContent = user.name;
  document.getElementById("user-email").textContent = user.email;

  // Update the input fields
  document.getElementById("full-name").value = user.name;
  document.getElementById("email").value = user.email;

  // Save the initial email and name for comparison
  localStorage.setItem("userEmail", user.email);
  localStorage.setItem("userName", user.name);
}

// Function to handle "Save Changes" button click
async function saveChanges() {
  const fullName = document.getElementById("full-name").value;
  const email = document.getElementById("email").value;
  const oldEmail = localStorage.getItem("userEmail"); // Get stored original email
  const oldName = localStorage.getItem("userName"); // Get stored original name

  // Check if the name and email fields are not empty
  if (!fullName || !email) {
    alert("Please fill out all fields.");
    return;
  }

  let nameChanged = fullName !== oldName;
  let emailChanged = email !== oldEmail;

  try {
    if (emailChanged) {
      // Send the email change request to the backend
      const response = await fetch("/api/change-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newEmail: email }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.success) {
        // Email change request was successful
        localStorage.setItem("pendingEmail", email); // Save new email temporarily
        alert("Email change request sent. Please check your email to confirm.");
        // Do not update the header here. Wait for confirmation.
      } else {
        // Email change request failed
        alert(
          data.message || "Email change request failed. Please try again later."
        );
        // Optionally, you could revert the email field to the old value here
        document.getElementById("email").value = oldEmail;
      }
    }
    if (nameChanged) {
      // Send the name change request to the backend
      const response = await fetch("/api/change-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newName: fullName }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.success) {
        // Name change request was successful
        localStorage.setItem("userName", fullName); // Save new name
        // Update the header dynamically
        document.getElementById("user-name").textContent = fullName;
        alert("Name changed successfully!");
      } else {
        // Name change request failed
        alert(
          data.message || "Name change request failed. Please try again later."
        );
        // Optionally, you could revert the name field to the old value here
        document.getElementById("full-name").value = oldName;
      }
    }
    if (!emailChanged && !nameChanged) {
      alert("No changes were made.");
    }
    if (!emailChanged && nameChanged) {
      const response = await fetch("/api/change-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newName: fullName }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.success) {
        // Name change request was successful
        localStorage.setItem("userName", fullName); // Save new name
        // Update the header dynamically
        document.getElementById("user-name").textContent = fullName;
        alert("Name changed successfully!");
      } else {
        // Name change request failed
        alert(
          data.message || "Name change request failed. Please try again later."
        );
        // Optionally, you could revert the name field to the old value here
        document.getElementById("full-name").value = oldName;
      }
    }
  } catch (error) {
    console.error("Error changing name or email:", error);
    alert(
      "An error occurred while changing the name or email. Please try again later."
    );
    // Optionally, you could revert the name and email fields to the old values here
    document.getElementById("full-name").value = oldName;
    document.getElementById("email").value = oldEmail;
  }
}

// Example user data
const user = {
  name: "John Doe",
  email: "john.doe@example.com",
};

// Call the function to update the form
updateForm(user);

// Ensure the "Save Changes" button works correctly
document
  .getElementById("save-changes-btn")
  .addEventListener("click", (event) => {
    event.preventDefault(); // Prevent form submission
    saveChanges();
  });

// Fix the event listener for the "Change Password" button
document
  .getElementById("change-password-btn")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default button behavior
    window.location.href = "password.html"; // Redirect to password.html
  });
document.addEventListener("DOMContentLoaded", function () {
  // Get modal elements
  const modal = document.getElementById("tfa-modal");
  const enableBtn = document.getElementById("enable-2fa-btn");
  const closeModal = document.querySelector(".close-modal");
  const verifyBtn = document.getElementById("verify-code-btn");
  const otpResultModal = document.getElementById("otp-result-modal");
  const closeResultModal = document.getElementById("close-result-modal");
  const otpResultTitle = document.getElementById("otp-result-title");
  const otpResultMessage = document.getElementById("otp-result-message");
  const otpResultButton = document.getElementById("otp-result-button");
  const tfaStatus = document.getElementById("tfa-status");
  // Show modal when Enable 2FA button is clicked
  enableBtn.addEventListener("click", function (e) {
    e.preventDefault();
    modal.style.display = "flex";
    // Here you would typically make an API call to get a QR code
    // For demo purposes, we'll just show a placeholder
    fetch("/api/generate-qr")
      .then((response) => response.json())
      .then((data) => {
        const qrCodeContainer = document.getElementById("qr-code");
        qrCodeContainer.innerHTML = ""; // Clear previous content
        const qrCodeImage = document.createElement("img");
        qrCodeImage.src = data.qrCodeUrl; // Assuming the backend returns a URL
        qrCodeImage.alt = "QR Code";
        qrCodeContainer.appendChild(qrCodeImage);
      })
      .catch((error) => {
        console.error("Error generating QR code:", error);
        document.getElementById("qr-code").textContent =
          "Error generating QR code";
      });
  });
  // Close modal when X is clicked
  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
  });
  // Close modal when clicking outside
  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
  // Handle verification
  verifyBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const code = document.getElementById("verification-code").value.trim();
    const errorMsg = document.getElementById("verification-error");
    if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
      errorMsg.style.display = "block";
      return;
    }
    errorMsg.style.display = "none";
    // Here you would verify the code with your server
    // For demo, we'll simulate success
    fetch("/api/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ otp: code }),
    })
      .then((response) => response.json())
      .then((data) => {
        modal.style.display = "none";
        otpResultModal.style.display = "flex";
        if (data.success) {
          otpResultTitle.textContent = "Success!";
          otpResultMessage.textContent = "2FA enabled successfully!";
          otpResultButton.textContent = "Logout";
          otpResultButton.onclick = function () {
            window.location.href = "login.html";
          };
          // Hide the button and show the message
          enableBtn.style.display = "none";
          tfaStatus.textContent = "Disable 2FA";
          tfaStatus.style.display = "block";
          tfaStatus.style.cursor = "pointer";
          tfaStatus.onclick = function () {
            // Handle disable 2FA logic here
            alert("2FA disabled (simulated).");
            // You would typically send a request to your backend to disable 2FA
            enableBtn.style.display = "block";
            tfaStatus.style.display = "none";
          };
        } else {
          otpResultTitle.textContent = "Failed!";
          otpResultMessage.textContent = "Invalid OTP. Please try again.";
          otpResultButton.textContent = "Back to Settings";
          otpResultButton.onclick = function () {
            otpResultModal.style.display = "none";
          };
        }
      })
      .catch((error) => {
        console.error("Error verifying OTP:", error);
        otpResultTitle.textContent = "Error!";
        otpResultMessage.textContent =
          "An error occurred during OTP verification.";
        otpResultButton.textContent = "Back to Settings";
        otpResultButton.onclick = function () {
          otpResultModal.style.display = "none";
        };
      });
  });
  closeResultModal.addEventListener("click", function () {
    otpResultModal.style.display = "none";
  });
});
