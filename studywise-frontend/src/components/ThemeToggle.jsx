import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    if (isDark) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
    }, []);

  return (
    <button
        onClick={() => {
            const isDark = document.documentElement.classList.toggle("dark");
            localStorage.setItem("theme", isDark ? "dark" : "light");
        }}
        className="ml-2 p-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded"
        >
        🌙 / ☀️
    </button>);
}