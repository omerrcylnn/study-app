import React, { useEffect, useState } from "react";
import api from "../axios";

export default function AchievementPage() {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await api.get("/api/user/achievements");
        setAchievements(res.data);
      } catch (err) {
        console.error("Başarılar alınamadı:", err);
      }
    };
    fetchAchievements();
  }, []);

  const earnedCount = achievements.filter((a) => a.earned).length;
  const total = achievements.length;
  const progressPercent = total ? Math.round((earnedCount / total) * 100) : 0;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">🏆 Başarılarım</h1>

      {/* Genel İlerleme */}
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-sm text-gray-700 mb-1">
          {earnedCount} / {total} başarı kazanıldı ({progressPercent}%)
        </p>
        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
          <div
            className="bg-green-500 h-4 transition-all duration-700 ease-in-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Başarı Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {achievements.map((ach, idx) => {
          const isEarned = ach.earned;
          const progress = ach.progress || 0;
          const target = ach.target || 1;
          const percent = Math.min(100, Math.round((progress / target) * 100));

          return (
            <div
              key={idx}
              className={`p-5 rounded-xl border shadow group relative transition-all duration-300 ${
                isEarned
                  ? "bg-green-100 border-green-400 animate-pulse-once"
                  : "bg-gray-100 border-gray-300 grayscale hover:grayscale-0"
              }`}
            >
              {/* Simge */}
              <div className="text-5xl mb-2">{ach.icon}</div>

              {/* Başlık ve açıklama */}
              <h2 className="text-lg font-semibold text-gray-800">{ach.name}</h2>
              <p className="text-sm text-gray-600">{ach.description}</p>

              {/* Progress veya Kazanım bilgisi */}
              {isEarned ? (
                <p className="text-xs text-green-700 mt-3">
                  🎉 Kazanıldı:{" "}
                  <span className="font-medium">
                    {new Date(ach.earned_at).toLocaleString()}
                  </span>
                </p>
              ) : (
                <div className="mt-3">
                  <div className="w-full bg-gray-300 h-2 rounded-full">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-700 ease-in-out"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {progress} / {target} tamamlandı ({percent}%)
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}