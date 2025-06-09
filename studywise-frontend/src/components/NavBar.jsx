import React from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const BASE_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:8000"
      : "https://study-app-1-oa2e.onrender.com";

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
    <nav className="bg-white dark:bg-gray-900 shadow-md rounded-b-2xl px-6 py-4 flex justify-between items-center transition-colors duration-300">
      {/* Sol: Logo */}
      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
        <Link to="/mainpage">StudyWise</Link>
      </div>

      {/* Orta: Navigasyon Linkleri */}
      <div className="flex space-x-4 text-sm font-medium">
        <Link to="/mainpage" className="hover:text-blue-600 dark:hover:text-blue-400 text-gray-800 dark:text-gray-200">Görevler</Link>
        <Link to="/achievements" className="hover:text-blue-600 dark:hover:text-blue-400 text-gray-800 dark:text-gray-200">Başarımlar</Link>
        <Link to="/goals" className="hover:text-blue-600 dark:hover:text-blue-400 text-gray-800 dark:text-gray-200">Hedefler & Notlar</Link>
      </div>

      {/* Sağ: Tema + Kullanıcı */}
      <div className="flex items-center space-x-4 relative group">
        <ThemeToggle />

        {/* Kullanıcı adı */}
        <span className="text-gray-700 dark:text-gray-200 font-medium">
          {user?.name || "Kullanıcı"}
        </span>

        {/* Seviye göstergesi + Hover Tooltip */}
        {user && (
          <div className="relative flex items-center">
            <span className="ml-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              Lv. {user.level}
            </span>

            {/* Tooltip */}
            <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50 shadow-lg">
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
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition duration-300"
        >
          Çıkış Yap
        </button>
      </div>
    </nav>
  );
}