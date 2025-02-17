import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <FiSun /> : <FiMoon />}
    </button>
  );
};

export default ThemeToggle; 