  import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

  const SUPABASE_URL = "https://enjtpqiyflrscvvaeapd.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuanRwcWl5Zmxyc2N2dmFlYXBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NDk3NzgsImV4cCI6MjA4MjMyNTc3OH0.jHjpHPw9J4nhkspQ6HSpWa3lMnRg3i5xOSmhaMlpOqk"; // replace with your anon key
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginMessage.className = "message";
    loginMessage.textContent = "Logging in...";

    const email = document.getElementById("driverEmail").value.trim();
    const password = document.getElementById("driverPassword").value.trim();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      loginMessage.className = "message success";
      loginMessage.textContent = "Login successful! Redirecting…";

      // Redirect to driver dashboard (create your driver-dashboard.html)
      setTimeout(() => {
        window.location.href = "/driver/driver-dashboard.html";
      }, 1000);

    } catch (err) {
      console.error(err);
      loginMessage.className = "message error";
      loginMessage.textContent = err.message || "Login failed.";
    }
  });