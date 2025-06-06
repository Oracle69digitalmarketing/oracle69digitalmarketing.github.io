document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
    };

    if (!data.name || !data.email || !data.message) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      alert(result.message || "Message sent successfully");
      if (response.ok) form.reset();
    } catch (err) {
      alert("Failed to send message. Try again later.");
    }
  });
});
