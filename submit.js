// =============================================
// submit.js — GrooveLink Event Submission
// Saves to Supabase (approved = false by default)
// You approve events in the Supabase dashboard
// =============================================

document.getElementById("eventForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const submitBtn = document.querySelector(".submit-btn");
  submitBtn.textContent = "Submitting...";
  submitBtn.disabled = true;

  const newEvent = {
    name:        document.getElementById("event-name").value.trim(),
    location:    document.getElementById("location").value.trim(),
    date:        document.getElementById("date").value,
    description: document.getElementById("description").value.trim(),
    link:        document.getElementById("event-link").value.trim() || null,
    category:    document.getElementById("category").value,
    province:    document.getElementById("province").value,
    approved:    false, // Pending your review — set to true in Supabase dashboard
  };

  try {
    const { error } = await window._supabase.from("events").insert([newEvent]);
    if (error) throw error;

    // Success — redirect to thank you page
    window.location.href = "thankyou.html";
  } catch (err) {
    console.error("Submission error:", err);
    alert("Something went wrong submitting your event. Please try again.");
    submitBtn.textContent = "Submit Event";
    submitBtn.disabled = false;
  }
});