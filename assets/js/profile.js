// Check if user is logged in
async function checkAuth() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  return user;
}

// Load user profile data
async function loadProfile() {
  try {
    const user = await checkAuth();
    if (!user) return;

    // Get profile data from profiles table
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) throw error;

    // Update profile information
    if (profile) {
      // Update name
      const nameElement = document.querySelector(".info h1");
      if (nameElement) nameElement.textContent = profile.name || "No Name";

      // Update location
      const locationElement = document.querySelector(".location");
      if (locationElement)
        locationElement.textContent = profile.address || "No Location";

      // Update job title
      const jobElement = document.querySelector(".job-title");
      if (jobElement) jobElement.textContent = profile.job || "No Job Title";

      // Update profile image
      const avatarImg = document.querySelector(".avatar img");
      if (avatarImg && profile.profile_image) {
        avatarImg.src = profile.profile_image;
        avatarImg.alt = `${profile.name}'s Profile Picture`;
      }
    }
  } catch (error) {
    console.error("Error loading profile:", error);
    alert("Error loading profile data");
  }
}

// Handle logout
async function handleLogout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Clear local storage
    localStorage.removeItem("user");

    // Redirect to login page
    window.location.href = "login.html";
  } catch (error) {
    console.error("Error logging out:", error);
    alert("Error logging out");
  }
}

// Add logout button event listener
document.addEventListener("DOMContentLoaded", () => {
  loadProfile();

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
});
