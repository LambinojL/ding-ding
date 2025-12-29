 import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

  const SUPABASE_URL = "https://enjtpqiyflrscvvaeapd.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuanRwcWl5Zmxyc2N2dmFlYXBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NDk3NzgsImV4cCI6MjA4MjMyNTc3OH0.jHjpHPw9J4nhkspQ6HSpWa3lMnRg3i5xOSmhaMlpOqk"; // replace with your anon key
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const driverNameEl = document.getElementById("driverName");
  const driverProfileEl = document.getElementById("driverProfile");
  const logoutBtn = document.getElementById("logoutBtn");

  // Check if driver is logged in
  async function loadDriverProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = "/driver/driver-login.html";
      return;
    }

    // Fetch driver details from 'drivers' table
    const { data: driver, error } = await supabase
      .from("drivers")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      driverProfileEl.innerHTML = `<p style="color:#dc2626;">Failed to load profile</p>`;
      console.error(error);
      return;
    }

    driverNameEl.textContent = driver.first_name + " " + driver.last_name;

    driverProfileEl.innerHTML = `
      <p><strong>Age:</strong> ${driver.age}</p>
      <p><strong>Address:</strong> ${driver.address}</p>
      <p><strong>Status:</strong> ${driver.status}</p>
      <p><strong>Vehicle:</strong> <a href="${driver.vehicle_picture}" target="_blank">View</a></p>
      <p><strong>License:</strong> <a href="${driver.license_file}" target="_blank">View</a></p>
      <p><strong>OR/CR:</strong> <a href="${driver.or_cr_file}" target="_blank">View</a></p>
    `;
  }

  logoutBtn.addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "/driver/driver-login.html";
  });

  loadDriverProfile();
   const navButtons = document.querySelectorAll('.bottom-nav button');
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons and add to clicked
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Redirect based on button ID
      switch (btn.id) {
        case 'navProfile':
          window.location.href = 'driver-dashboard.html';
          break;
        case 'navWallet':
          window.location.href = 'wallet.html';
          break;
        case 'navPickups':
          window.location.href = 'pickups.html';
          break;
        case 'navRecords':
          window.location.href = 'records.html';
          break;
        case 'navMission':
          window.location.href = 'mission.html';
          break;
      }
    });
  });