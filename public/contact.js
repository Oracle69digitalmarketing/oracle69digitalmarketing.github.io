document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const responseEl = document.getElementById("formResponse");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    responseEl.textContent = "Sending...";

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      responseEl.textContent = "Please fill all fields.";
      return;
    }

    grecaptcha.ready(() => {
      grecaptcha.execute("6LdFz7gUAAAAAPafjsOr4xhhWBiHATY3ayPhWnH9", { action: "submit" }).then(async (token) => {
        try {
          const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message, recaptcha: token }),
          });

          const data = await res.json();
          responseEl.textContent = data.message;

          if (res.ok) form.reset();
        } catch (err) {
          responseEl.textContent = "Error sending message.";
        }
      });
    });
  });
});
