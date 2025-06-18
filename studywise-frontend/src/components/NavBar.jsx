import React from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const BASE_URL = "https://api.studyspark.xyz";

  const handleLogout = async () => {
    try {
      await axios.get(`${BASE_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });

      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];

      await axios.post(
        `${BASE_URL}/logout`,
        {},
        {
          withCredentials: true,
          headers: {
            "X-XSRF-TOKEN": decodeURIComponent(token),
          },
        }
      );

      logout();
      navigate("/login");
    } catch (error) {
      console.log("Çıkış Hatası:", error);
    }
  };

  return (
  <nav className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm px-6 py-3 flex items-center justify-between transition-colors duration-300">
    
    {/* Sol: Logo */}
    <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
      <Link to="/mainpage">StudyWise</Link>
    </div>

    {/* Orta: Navigasyon Linkleri */}
    <div className="hidden md:flex gap-6 text-sm font-medium">
      <Link to="/mainpage" className="text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
        Görevler
      </Link>
      <Link to="/achievements" className="text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
        Başarımlar
      </Link>
      <Link to="/goals" className="text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
        Hedefler & Notlar
      </Link>
    </div>

    {/* Sağ: Tema + Kullanıcı */}
    <div className="flex items-center gap-4">
      <ThemeToggle />

      {/* Kullanıcı Bilgisi */}
      {user && (
        <div className="flex items-center gap-2 relative group">
          <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">{user.name}</span>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Lv. {user.level}</span>

          {/* Hover XP Tooltip */}
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-3 py-1 opacity-0 group-hover:opacity-100 transition duration-300 z-50 shadow-lg whitespace-nowrap">
            {
              (() => {
                const xp = user.xp;
                const level = user.level;
                const nextXp = 100 * (level + 1);
                const remaining = nextXp - xp;
                return `XP: ${xp} / ${nextXp} • ${remaining} XP kaldı`;
              })()
            }
          </div>
        </div>
      )}

      {/* Çıkış Butonu */}
      <button
        onClick={handleLogout}
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-xl transition shadow-sm"
      >
        Çıkış
      </button>
    </div>
  </nav>
);
}