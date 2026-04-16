// =============================================
// submit.js — GrooveLink Event Submission
// Saves to Supabase with image URL and organiser
// contact details for verification
// =============================================

document.getElementById("eventForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const submitBtn = document.querySelector(".submit-btn");
  submitBtn.textContent = "Submitting...";
  submitBtn.disabled = true;

  const newEvent = {
    name:                 document.getElementById("event-name").value.trim(),
    location:             document.getElementById("location").value.trim(),
    province:             document.getElementById("province").value,
    date:                 document.getElementById("date").value,
    category:             document.getElementById("category").value,
    description:          document.getElementById("description").value.trim(),
    link:                 document.getElementById("event-link").value.trim() || null,
    image_url:            document.getElementById("image-url").value.trim() || null,
    organiser:            document.getElementById("organiser").value.trim(),
    organiser_email:      document.getElementById("organiser-email").value.trim(),
    organiser_phone:      document.getElementById("organiser-phone").value.trim() || null,
    organiser_instagram:  document.getElementById("organiser-instagram").value.trim() || null,
    organiser_facebook:   document.getElementById("organiser-facebook").value.trim() || null,
    approved:             false,
    rejected:             false,
  };

  try {
    // Save to Supabase
    const { error } = await window._supabase.from("events").insert([newEvent]);
    if (error) throw error;

    // Send email notification (fire and forget)
    fetch("https://qkdtgcvmygpivdcikhic.supabase.co/functions/v1/notify-new-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrZHRnY3ZteWdwaXZkY2lraGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NzcwNDAsImV4cCI6MjA4OTQ1MzA0MH0.wGCRhq3coiQtI47fQVwfjA_45-t6ekzIoL6EbEQhIlk", // ← replace with your anon key
      },
      body: JSON.stringify({ record: newEvent }),
    }).catch(err => console.warn("Email notification failed:", err));

    // Redirect to thank you page
    window.location.href = "thankyou.html";
  } catch (err) {
    console.error("Submission error:", err);
    alert("Something went wrong submitting your event. Please try again.");
    submitBtn.textContent = "Submit Event";
    submitBtn.disabled = false;
  }
});