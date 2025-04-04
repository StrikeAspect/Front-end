document.addEventListener("DOMContentLoaded", function () {
  function getURLParameter(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function updateActivationStatus(isSuccess, message) {
    const status = document.getElementById("activation-status");
    const messageElement = document.getElementById("activation-message");
    const nextActionButton = document.getElementById("next-action-button");
    const loadingIndicator = document.getElementById("loading-indicator");

    loadingIndicator.style.display = "none"; // Hide loading indicator
    nextActionButton.style.display = "block"; // Show the button

    if (isSuccess) {
      status.textContent = "Activation Successful";
      messageElement.textContent =
        "Your account has been activated successfully. You can now log in.";
      status.style.color = "green";
      nextActionButton.textContent = "Prosegui";
      nextActionButton.onclick = function () {
        window.location.href = "login.html"; // Redirect to login page
      };
    } else {
      status.textContent = "Activation Failed";
      messageElement.textContent = message;
      status.style.color = "red";
      nextActionButton.textContent = "Prosegui";
      nextActionButton.onclick = function () {
        window.location.href = "registrazione.html"; // Redirect to home page
      }
    }
  }

  function activateAccount(token) {
    const loadingIndicator = document.getElementById("loading-indicator");
    const nextActionButton = document.getElementById("next-action-button");
    loadingIndicator.style.display = "block"; // Show loading indicator
    nextActionButton.style.display = "none"; // Hide the button

    // Replace with your actual API endpoint
    const apiUrl = "/api/activate";

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          updateActivationStatus(true);
        } else {
          updateActivationStatus(false, data.message || "Activation failed.");
        }
      })
      .catch((error) => {
        console.error("Error during activation:", error);
        updateActivationStatus(false, "An error occurred during activation.");
      });
  }

  const token = getURLParameter("token");

  if (token) {
    activateAccount(token);
  } else {
    updateActivationStatus(false, "No activation token provided.");
  }
});
