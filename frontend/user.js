const baseURL = "http://localhost:3001";

window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("user");
  if (!username) {
    // If no user in query, redirect back to login
    window.location.href = "index.html";
    return;
  }

  // Display welcome message
  document.getElementById("welcome").textContent = "Hello, " + username + "!";

  // Store username globally for submitRequest
  window.currentUser = username;
});

async function submitRequest() {
  const message = document.getElementById("requestMessage").value.trim();

  if (!message) {
    alert("Please describe your issue.");
    return;
  }

  try {
    const response = await fetch(`${baseURL}/api/submit-request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: window.currentUser, message }),
    });

    if (response.ok) {
      alert("Your request has been submitted.");
      document.getElementById("requestForm").reset();
    } else {
      const errorData = await response.json();
      alert("Submission failed: " + (errorData.error || "Try again."));
    }
  } catch (error) {
    console.error("Submit error:", error);
    alert("An error occurred when submitting your request.");
  }
}

function logout() {
  // Simply redirect to login page
  window.location.href = "index.html";
}
