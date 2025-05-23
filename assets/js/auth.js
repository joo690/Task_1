// Image Preview Functionality
const profileImage = document.getElementById("profileImage");
const preview = document.getElementById("preview");
const uploadText = document.querySelector(".upload-text");

if (profileImage) {
  profileImage.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = "block";
        uploadText.style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  });
}

// Form Submissions
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

if (loginForm) {
  // Check if user is already logged in (only on login page)
  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      window.location.href = "index.html";
    }
  }
  // Run check on page load
  checkUser();

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to profile page
      window.location.href = "index.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const submitButton = signupForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Signing up...";

    try {
      const formData = new FormData(signupForm);
      const email = formData.get("email");
      const password = formData.get("password");
      const name = formData.get("name");
      const job = formData.get("job");
      const address = formData.get("address");
      const profileImageFile = formData.get("profileImage");

      console.log("Starting signup process...");

      // 1. Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
            job: job,
            address: address,
          },
        },
      });

      console.log("Auth response:", authData, authError);

      if (authError) {
        if (authError.message.includes("already registered")) {
          alert(
            "This email is already registered. Please try logging in instead."
          );
          window.location.href = "login.html";
          return;
        }
        throw authError;
      }
      if (!authData.user) throw new Error("No user data returned");

      // 2. Upload profile image if exists
      let profileImageUrl = null;
      if (profileImageFile && profileImageFile.size > 0) {
        console.log("Uploading profile image...");
        const fileExt = profileImageFile.name.split(".").pop();
        const fileName = `${authData.user.id}-${Math.random()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("profile-images")
          .upload(fileName, profileImageFile);

        console.log("Upload response:", uploadData, uploadError);

        if (uploadError) throw uploadError;

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("profile-images").getPublicUrl(fileName);

        profileImageUrl = publicUrl;
      }

      // 3. Update the profile with additional information
      console.log("Updating profile...");
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .update({
          name: name,
          job: job,
          address: address,
          profile_image: profileImageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", authData.user.id)
        .select();

      console.log("Profile update response:", profileData, profileError);

      if (profileError) throw profileError;

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(authData.user));

      alert("Signup successful! Please check your email for verification.");

      // Redirect to profile page
      window.location.href = "index.html";
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.message || "An error occurred during signup");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Sign Up";
    }
  });
}
