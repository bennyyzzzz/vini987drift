const STORAGE_KEY = 'vinidrift-theme';
const root = document.documentElement;
const btnMode = document.querySelector('.btn-mode');
const modeLabel = document.querySelector('.btn-mode .layer-01');

function applyTheme(theme) {
  const isLight = theme === 'light';
  root.classList.toggle('light-mode', isLight);
  if (modeLabel) modeLabel.textContent = isLight ? 'LIGHT MODE' : 'DARK MODE';
}

// Aplica o tema salvo (ou "dark" como padrão) assim que o script roda
const savedTheme = localStorage.getItem(STORAGE_KEY);
applyTheme(savedTheme === 'light' ? 'light' : 'dark');

if (btnMode) {
  btnMode.setAttribute('role', 'button');
  btnMode.setAttribute('tabindex', '0');

  const toggleTheme = () => {
    const nextTheme = root.classList.contains('light-mode') ? 'dark' : 'light';
    applyTheme(nextTheme);
    localStorage.setItem(STORAGE_KEY, nextTheme);
  };

  btnMode.addEventListener('click', toggleTheme);
  btnMode.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  });
}