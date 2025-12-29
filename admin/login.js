import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://enjtpqiyflrscvvaeapd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuanRwcWl5Zmxyc2N2dmFlYXBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NDk3NzgsImV4cCI6MjA4MjMyNTc3OH0.jHjpHPw9J4nhkspQ6HSpWa3lMnRg3i5xOSmhaMlpOqk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("message");

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    message.textContent = "Please fill in all fields";
    return;
  }

  message.textContent = "Logging in...";
  loginBtn.disabled = true;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  loginBtn.disabled = false;

  if (error) {
    message.textContent = error.message;
    return;
  }

  // ✅ LOGIN SUCCESS
  console.log("Session:", data.session);
  window.location.href = "admin/admin-dashboard.html";
});
