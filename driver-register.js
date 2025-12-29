import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://enjtpqiyflrscvvaeapd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuanRwcWl5Zmxyc2N2dmFlYXBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NDk3NzgsImV4cCI6MjA4MjMyNTc3OH0.jHjpHPw9J4nhkspQ6HSpWa3lMnRg3i5xOSmhaMlpOqk"; // replace with your anon key
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const driverForm = document.getElementById("driverForm");
const driverMessage = document.getElementById("driverMessage");
const registerDriverBtn = document.getElementById("registerDriverBtn");

driverForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  driverMessage.className = "message";
  driverMessage.textContent = "Registering driver...";
  registerDriverBtn.disabled = true;

  const firstName = document.getElementById("driverFirstName").value.trim();
  const lastName = document.getElementById("driverLastName").value.trim();
  const age = document.getElementById("driverAge").value.trim();
  const address = document.getElementById("driverAddress").value.trim();
  const email = document.getElementById("driverEmail").value.trim();
  const password = document.getElementById("driverPassword").value.trim();
  const vehicleFile = document.getElementById("vehiclePicture").files[0];
  const licenseFile = document.getElementById("licenseFile").files[0];
  const orCrFile = document.getElementById("orCrFile").files[0];

  if (!firstName || !lastName || !age || !address || !email || !password) {
    driverMessage.className = "message error";
    driverMessage.textContent = "Please fill in all required fields.";
    registerDriverBtn.disabled = false;
    return;
  }

  try {
    // 1️⃣ Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/driver-login.html`,
        data: { role: "driver" },
      },
    });
    if (authError) throw authError;

    // Wait until user is confirmed (or simulate auth session)
    const userId = authData.user.id;

    // 2️⃣ Upload files safely (RLS will now allow it)
    async function uploadFile(file, folder) {
      if (!file) return null;
      const path = `${folder}/${userId}-${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("driver-uploads")
        .upload(path, file);
      if (error) throw new Error(`Failed to upload ${folder}: ${error.message}`);
      return supabase.storage
        .from("driver-uploads")
        .getPublicUrl(data.path).data.publicUrl;
    }

    const vehicleUrl = await uploadFile(vehicleFile, "vehicles");
    const licenseUrl = await uploadFile(licenseFile, "licenses");
    const orCrUrl = await uploadFile(orCrFile, "orcr");

    // 3️⃣ Save driver profile
    const { error: insertError } = await supabase.from("drivers").insert({
      user_id: userId,
      first_name: firstName,
      last_name: lastName,
      age: parseInt(age),
      address,
      vehicle_picture: vehicleUrl,
      license_file: licenseUrl,
      or_cr_file: orCrUrl,
      status: "pending",
    });
    if (insertError) throw insertError;

    driverMessage.className = "message success";
    driverMessage.textContent = "Driver registered! Please check your email to verify.";
    driverForm.reset();
  } catch (err) {
    console.error(err);
    driverMessage.className = "message error";
    driverMessage.textContent = err.message || "Registration failed.";
  } finally {
    registerDriverBtn.disabled = false;
  }
});
