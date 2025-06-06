// Contact form submit handler
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = this.name.value.trim();
  const email = this.email.value.trim();
  const message = this.message.value.trim();

  if (!name || !email || !message) {
    alert('Please fill all fields.');
    return;
  }

  // Here you would integrate your backend API or email service
  // For demo: simulate success response
  setTimeout(() => {
    document.getElementById('form-status').textContent = 'Thank you! Your message has been sent.';
    this.reset();
  }, 500);
});
