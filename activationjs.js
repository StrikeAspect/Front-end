document.addEventListener("DOMContentLoaded", function () {
    function getURLParameter(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    function updateActivationStatus(isSuccess, message) {
        const status = document.getElementById("activation-status");
        const messageElement = document.getElementById("activation-message");
        const nextActionButton = document.getElementById("next-action-button");

        if (isSuccess) {
            status.textContent = "Activation Successful";
            messageElement.textContent = "Your account has been activated successfully. You can now log in.";
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
                window.location.href = "support.html"; // Redirect to support page
            };
        }
    }

    const token = getURLParameter("token");

    if (token) {
        activateAccount(token); // Simulate activation logic
    } else {
        updateActivationStatus(false, "No activation token provided.");
    }

    function activateAccount(token) {
        // Simulate an AJAX request to your server to activate the account
        setTimeout(() => {
            if (token === "valid-token") { // Simulated token check
                updateActivationStatus(true);
            } else {
                updateActivationStatus(false, "The activation token is invalid or has expired.");
            }
        }, 1000);
    }
});
