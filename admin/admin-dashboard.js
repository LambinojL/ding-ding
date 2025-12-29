import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://enjtpqiyflrscvvaeapd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuanRwcWl5Zmxyc2N2dmFlYXBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NDk3NzgsImV4cCI6MjA4MjMyNTc3OH0.jHjpHPw9J4nhkspQ6HSpWa3lMnRg3i5xOSmhaMlpOqk"; // replace with your anon key
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Dashboard elements
const applicationCountEl = document.getElementById("applicationCount");
const driverList = document.getElementById("driverList");

// Load dashboard data
async function loadDashboard() {
  driverList.innerHTML = `<p class="info-text">Loading drivers...</p>`;
  applicationCountEl.textContent = "—";

  try {
    const { data: drivers, error } = await supabase
      .from("drivers")
      .select("*");

    if (error) throw error;

    // Count pending applicants
    const pendingDrivers = drivers.filter(d => d.status === "pending");
    const approvedDrivers = drivers.filter(d => d.status === "approved");

    // Show count on Applicants card
    applicationCountEl.textContent = pendingDrivers.length;

    // Approved drivers preview (optional)
    if (approvedDrivers.length === 0) {
      driverList.innerHTML = `<p class="info-text">No approved drivers.</p>`;
    } else {
      driverList.innerHTML = "";

      approvedDrivers.slice(0, 3).forEach(driver => {
        const card = document.createElement("div");
        card.className = "driver-card";
        card.innerHTML = `
          <img src="${driver.vehicle_picture || "https://via.placeholder.com/50"}">
          <div>
            <strong>${driver.first_name} ${driver.last_name}</strong>
            <span>Age: ${driver.age}</span>
            <span>${driver.address}</span>
          </div>
        `;
        driverList.appendChild(card);
      });
    }

  } catch (err) {
    console.error(err);
    applicationCountEl.textContent = "0";
    driverList.innerHTML = `<p style="color:#ef4444;">Failed to load data.</p>`;
  }
}

// Initial load
loadDashboard();

// Clickable card navigation
document.getElementById("applicantsCard").addEventListener("click", () => {
  window.location.href = "applicant.html";
});
document.getElementById("driversCard").addEventListener("click", () => {
  window.location.href = "drivers.html";
});
document.getElementById("customersCard").addEventListener("click", () => {
  window.location.href = "customers.html";
});

// "+" button
document.getElementById("addApplicantBtn").addEventListener("click", (e) => {
  e.stopPropagation();
  window.location.href = "../driver/driver-register.html";
});
