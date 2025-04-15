document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('darkModeToggle');
  const body = document.body;

  // Load saved preference
  const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
  if (darkModeEnabled) {
    body.classList.add('dark-mode');
    toggle.checked = true;
  }

  // Listen for toggle changes
  toggle.addEventListener('change', () => {
    if (toggle.checked) {
      body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
    } else {
      body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');
    }
  });
});
