// =============================================
// contact.js — GrooveLink Contact Form
// Saves messages to Supabase messages table
// =============================================

document.getElementById("contactForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const submitBtn = document.querySelector(".submit-btn");
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;

  const message = {
    name:    document.getElementById("name").value.trim(),
    email:   document.getElementById("email").value.trim(),
    message: document.getElementById("message").value.trim(),
  };

  try {
    const { error } = await window._supabase.from("messages").insert([message]);
    if (error) throw error;

    // Success — redirect to thank you page
    window.location.href = "thankyou.html";
  } catch (err) {
    console.error("Contact form error:", err);
    alert("Something went wrong sending your message. Please try again.");
    submitBtn.textContent = "Send Message";
    submitBtn.disabled = false;
  }
});