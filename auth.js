const BASE_URL = 'http://localhost:8000'; // FastAPI backend

// LOGIN
const loginForm = document.getElementById("loginForm");
loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (res.ok) {
    // ✅ Admin user check
    if (email === "hello@rewear.com" && password === "admin123") {
      alert("Welcome, Admin!");
      localStorage.setItem("token", data.token);  // optional but good to keep
      window.location.href = "screen8.html";      // redirect to admin dashboard
    } else {
      alert("Login successful!");
      localStorage.setItem("token", data.token);
      window.location.href = "dashboard.html";    // redirect to user dashboard
    }
  } else {
    alert(data.detail || data.message || "Login failed. Please check your credentials.");
  }
});

// REGISTER
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
});

// FORGOT PASSWORD (optional logic)
const forgotPasswordBtn = document.getElementById("forgotPassword");
forgotPasswordBtn?.addEventListener("click", async () => {
  const email = prompt("Enter your email:");
  if (!email) return;

  const res = await fetch(`${BASE_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  alert(data.message || "Check your email");
});
