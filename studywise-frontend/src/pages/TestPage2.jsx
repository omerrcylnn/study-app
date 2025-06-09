import React, { useEffect, useState } from 'react';

export default function DarkModeTestPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center transition-colors duration-500 bg-white text-black dark:bg-black dark:text-white">
      <h1 className="text-3xl font-bold mb-4">🌓 Dark Mode Test</h1>
      <p className="mb-4">Tema: <strong>{isDark ? 'Koyu' : 'Açık'}</strong></p>
      <button
        onClick={() => setIsDark(!isDark)}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        Tema Değiştir
      </button>
    </div>
  );
}