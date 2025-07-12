const BASE_URL = 'http://localhost:8000'; // Your FastAPI backend URL

// ---------------------
// LOGIN FUNCTIONALITY
// ---------------------
const loginForm = document.getElementById("loginForm");
loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);

      // Role-based redirect
      if (email === "hello@rewear.com" && password === "admin123") {
        alert("Welcome, Admin!");
        window.location.href = "screen8.html"; // Admin dashboard
      } else {
        alert("Welcome to REWEAR!");
        window.location.href = "screen3.html"; // User homepage
      }
    } else {
      alert(data.detail || data.message || "Login failed.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Something went wrong. Please try again.");
  }
});

// ------------------------
// REGISTER FUNCTIONALITY
// ------------------------
const registerForm = document.getElementById("registerForm");
registerForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const username = document.getElementById("username").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  const formData = new FormData();
  formData.append("full_name", name);
  formData.append("username", username);
  formData.append("email", email);
  formData.append("password", password);

  try {
    const res = await fetch(`${BASE_URL}/create-profile/`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registered successfully!");
      window.location.href = "index.html";
    } else {
      alert(data.detail || data.message);
    }
  } catch (error) {
    console.error("Registration error:", error);
    alert("Something went wrong. Please try again.");
  }
});

// ------------------------
// OPTIONAL: Forgot Password
// ------------------------
const forgotPasswordBtn = document.getElementById("forgotPassword");
forgotPasswordBtn?.addEventListener("click", async () => {
  const email = prompt("Enter your email:");
  if (!email) return;

  try {
    const res = await fetch(`${BASE_URL}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    alert(data.message || "Check your email.");
  } catch (error) {
    console.error("Password reset error:", error);
    alert("Something went wrong.");
  }
});
