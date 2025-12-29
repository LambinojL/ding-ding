import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://enjtpqiyflrscvvaeapd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuanRwcWl5Zmxyc2N2dmFlYXBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NDk3NzgsImV4cCI6MjA4MjMyNTc3OH0.jHjpHPw9J4nhkspQ6HSpWa3lMnRg3i5xOSmhaMlpOqk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const tableBody = document.getElementById("applicantsTable");

// Load pending applicants
async function loadApplicants() {
  tableBody.innerHTML = `<tr><td colspan="7">Loading applicants...</td></tr>`;

  try {
    const { data, error } = await supabase
      .from("drivers")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7">No pending applicants.</td></tr>`;
      return;
    }

    tableBody.innerHTML = "";

    data.forEach(driver => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${driver.first_name} ${driver.last_name}</td>
        <td>${driver.age}</td>
        <td>${driver.address}</td>
        <td><a href="${driver.vehicle_picture}" target="_blank">View</a></td>
        <td><a href="${driver.license_file}" target="_blank">View</a></td>
        <td><a href="${driver.or_cr_file}" target="_blank">View</a></td>
        <td>
          <button class="approve-btn" data-id="${driver.id}">Approve</button>
          <button class="reject-btn" data-id="${driver.id}">Reject</button>
        </td>
      `;

      tableBody.appendChild(row);
    });

    document.querySelectorAll(".approve-btn").forEach(btn => {
      btn.addEventListener("click", () => updateStatus(btn.dataset.id, "approved"));
    });

    document.querySelectorAll(".reject-btn").forEach(btn => {
      btn.addEventListener("click", () => updateStatus(btn.dataset.id, "rejected"));
    });

  } catch (err) {
    console.error(err);
    tableBody.innerHTML = `<tr><td colspan="7">Failed to load applicants.</td></tr>`;
  }
}

// Update driver status
async function updateStatus(id, status) {
  const confirmAction = confirm(`Are you sure you want to ${status} this applicant?`);
  if (!confirmAction) return;

  const { error } = await supabase
    .from("drivers")
    .update({ status })
    .eq("id", id);

  if (error) {
    alert("Failed to update status");
    console.error(error);
    return;
  }

  loadApplicants();
}

// Initial load
loadApplicants();

// "+" button to add a new driver
document.getElementById("addApplicantBtn").addEventListener("click", () => {
  window.location.href = "../driver/driver-register.html";
});

