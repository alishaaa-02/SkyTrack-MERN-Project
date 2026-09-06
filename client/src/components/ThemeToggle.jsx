export default function ThemeToggle({ darkMode, toggleTheme }) {
  return (
    <button className="themeToggle" type="button" onClick={toggleTheme} aria-label="Toggle dark theme">
      {darkMode ? '☀ Light' : '🌙 Dark'}
    </button>
  );
}
