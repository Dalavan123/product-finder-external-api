import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'light'
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme'); // light = default
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button
      className='btn'
      type='button'
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-pressed={theme === 'dark'}
      title={theme === 'dark' ? 'Byt till ljust läge' : 'Byt till mörkt läge'}
      style={{ marginLeft: 'auto' }}
    >
      {theme === 'dark' ? '☀️ Ljust läge' : '🌙 Mörkt läge'}
    </button>
  );
}
