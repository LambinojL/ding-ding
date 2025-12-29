import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://enjtpqiyflrscvvaeapd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuanRwcWl5Zmxyc2N2dmFlYXBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NDk3NzgsImV4cCI6MjA4MjMyNTc3OH0.jHjpHPw9J4nhkspQ6HSpWa3lMnRg3i5xOSmhaMlpOqk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Elements
const registerBtn = document.getElementById("registerBtn");
const message = document.getElementById("message");
const emailModal = document.getElementById("emailModal");
const closeModal = document.getElementById("closeModal");

registerBtn.addEventListener("click", async () => {
  // Get values
  const firstName = document.getElementById("firstName").value.trim();
  const middleName = document.getElementById("middleName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const age = document.getElementById("age").value.trim();
  const address = document.getElementById("address").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!firstName || !lastName || !age || !address || !email || !password) {
    message.textContent = "Please fill in all required fields";
    return;
  }

  message.textContent = "Creating account...";
  registerBtn.disabled = true;

  // 1️⃣ Create auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    message.textContent = error.message;
    registerBtn.disabled = false;
    return;
  }

  const userId = data.user.id;

  // 2️⃣ Insert profile data
  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId,
    first_name: firstName,
    middle_name: middleName,
    last_name: lastName,
    age: parseInt(age),
    address,
    email,
  });

  registerBtn.disabled = false;

  if (profileError) {
    message.textContent = "Account created, but profile save failed.";
    console.error(profileError);
    return;
  }

  // 3️⃣ Show verification modal
  emailModal.style.display = "flex";
});

// Close modal → go to login page
closeModal.addEventListener("click", () => {
  window.location.href = "login.html";
});
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: "http://localhost:5500/welcome.html"
  }
});
