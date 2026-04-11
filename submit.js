// =============================================
// submit.js — GrooveLink Event Submission
// Saves to Supabase, then calls Edge Function
// to send email notification
// =============================================

document.getElementById("eventForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const submitBtn = document.querySelector(".submit-btn");
  submitBtn.textContent = "Submitting...";
  submitBtn.disabled = true;

  const newEvent = {
    organiser:   document.getElementById("organiser").value.trim(),
    name:        document.getElementById("event-name").value.trim(),
    location:    document.getElementById("location").value.trim(),
    province:    document.getElementById("province").value,
    date:        document.getElementById("date").value,
    category:    document.getElementById("category").value,
    description: document.getElementById("description").value.trim(),
    link:        document.getElementById("event-link").value.trim() || null,
    approved:    false,
  };

  try {
    // Step 1: Save event to Supabase
    const { error } = await window._supabase.from("events").insert([newEvent]);
    if (error) throw error;

    // Step 2: Call Edge Function to send email notification
    // (fire and forget — don't block redirect if this fails)
    fetch("https://qkdtgcvmygpivdcikhic.supabase.co/functions/v1/notify-new-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrZHRnY3ZteWdwaXZkY2lraGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NzcwNDAsImV4cCI6MjA4OTQ1MzA0MH0.wGCRhq3coiQtI47fQVwfjA_45-t6ekzIoL6EbEQhIlk",
      },
      body: JSON.stringify({ record: newEvent }),
    }).catch(err => console.warn("Email notification failed:", err));

    // Success — redirect to thank you page
    window.location.href = "thankyou.html";
  } catch (err) {
    console.error("Submission error:", err);
    alert("Something went wrong submitting your event. Please try again.");
    submitBtn.textContent = "Submit Event";
    submitBtn.disabled = false;
  }
});