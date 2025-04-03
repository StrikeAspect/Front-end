// Function to update the form dynamically
function updateForm(user) {
  // Update the header
  document.querySelector(".header h2").textContent = user.name;
  document.querySelector(".header p").textContent = user.email;

  // Update the input fields
  document.getElementById("full-name").value = user.name;
  document.getElementById("email").value = user.email;

  // Save the initial email for comparison
  localStorage.setItem("userEmail", user.email);
}

// Function to handle "Save Changes" button click
function saveChanges() {
  const fullName = document.getElementById("full-name").value;
  const email = document.getElementById("email").value;
  const oldEmail = localStorage.getItem("userEmail"); // Get stored original email

  // Check if the name and email fields are not empty
  if (!fullName || !email) {
    alert("Please fill out all fields.");
    return;
  }

  // Update the header dynamically
  document.querySelector(".header h2").textContent = fullName;
  document.querySelector(".header p").textContent = email;

  // Check if the email has changed
  if (email !== oldEmail) {
    localStorage.setItem("pendingEmail", email); // Save new email temporarily
    window.location.href = "after.html"; // Redirect to after.html
  } else {
    alert("Changes saved successfully!");
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
  // Show modal when Enable 2FA button is clicked
  enableBtn.addEventListener("click", function (e) {
    e.preventDefault();
    modal.style.display = "flex";
    // Here you would typically make an API call to get a QR code
    // For demo purposes, we'll just show a placeholder
    document.getElementById("qr-code").innerHTML =
      "In a real app, a QR code image would appear here";
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
    alert("2FA enabled successfully!");
    modal.style.display = "none";
    enableBtn.textContent = "Disable 2FA";
    enableBtn.style.backgroundColor = "#f44336";
  });
});
