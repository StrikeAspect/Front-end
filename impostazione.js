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
  .querySelector(".change-btn")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default button behavior
    window.location.href = "password.html"; // Redirect to password.html
  });
