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
    await fetch(`${SUPABASE_URL}/functions/v1/notify-new-event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ record: newEvent }),
    });

    // Success — redirect to thank you page
    window.location.href = "thankyou.html";
  } catch (err) {
    console.error("Submission error:", err);
    alert("Something went wrong submitting your event. Please try again.");
    submitBtn.textContent = "Submit Event";
    submitBtn.disabled = false;
  }
});