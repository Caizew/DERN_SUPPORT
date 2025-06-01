const baseURL = "http://localhost:3001";

async function register() {
  const username = document.getElementById("regUsername").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const role = document.getElementById("regRole").value;

  if (!username || !password || !role) {
    alert("Please fill out all fields, including role.");
    return;
  }

  try {
    const response = await fetch(`${baseURL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role }),
    });

    if (response.ok) {
      alert("Registration successful! You can now log in.");
      document.getElementById("registerForm").reset();
    } else {
      const errorData = await response.json();
      alert("Registration failed: " + (errorData.message || "Try again."));
    }
  } catch (error) {
    console.error("Register error:", error);
    alert("An error occurred during registration.");
  }
}

async function login() {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  try {
    const response = await fetch(`${baseURL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      alert("Login failed. Check username/password.");
      return;
    }

    const data = await response.json();
    if (data.success) {
      // Redirect based on role:
      switch (data.role) {
        case "individual":
        case "business":
          // Both “Jismoniy shaxs” and “Biznes mijoz” go to user dashboard:
          window.location.href = `user.html?user=${encodeURIComponent(
            username
          )}`;
          break;
        case "technician":
          // “Texnik mutaxassis” goes to technician dashboard:
          window.location.href = `tech.html?user=${encodeURIComponent(
            username
          )}`;
          break;
        case "admin":
          // “Admin (boshqaruvchi)” goes to admin panel:
          window.location.href = `admin.html?user=${encodeURIComponent(
            username
          )}`;
          break;
        default:
          alert("Unknown role. Please contact support.");
      }
    } else {
      alert("Invalid credentials.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("An error occurred during login.");
  }
}
