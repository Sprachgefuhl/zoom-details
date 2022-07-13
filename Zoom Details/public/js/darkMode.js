let darkMode = localStorage.getItem('darkMode');
const darkModeToggle = document.getElementById('checkbox');

darkMode == 'enabled' && enableDarkMode();

function enableDarkMode() {
  document.body.classList.add('dark-mode');
  darkModeToggle.checked = true;
  localStorage.setItem('darkMode', 'enabled');
}

function disableDarkMode() {
  document.body.classList.remove('dark-mode');
  darkModeToggle.checked = false;
  localStorage.removeItem('darkMode');
}

darkModeToggle.addEventListener('click', () => {
  darkMode = localStorage.getItem('darkMode');
  darkMode == 'enabled' ? disableDarkMode() : enableDarkMode();
});