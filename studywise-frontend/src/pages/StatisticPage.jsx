import React, { useEffect, useState } from "react";
import api from "../axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LabelList,
} from "recharts";

const COLORS = ["#10B981", "#EF4444"];

export default function StatisticPage() {
  const [todayStats, setTodayStats] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [focusBreakRatio, setFocusBreakRatio] = useState([]);
  const [labelStats, setLabelStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [todayRes, weeklyRes, pieRes, labelRes] = await Promise.all([
          api.get("/api/stats/today"),
          api.get("/api/stats/weekly"),
          api.get("/api/stats/focus-break-ratio"),
          api.get("/api/stats/by-label"), // 👈 yeni endpoint
        ]);
        setTodayStats(todayRes.data);
        setWeeklyStats(weeklyRes.data);
        setFocusBreakRatio([...pieRes.data]);
        setLabelStats(labelRes.data);
      } catch (err) {
        console.error("İstatistik verileri çekilemedi:", err);
      }
    };

    fetchStats();
  }, []);

  const totalSeconds = focusBreakRatio.reduce((sum, item) => sum + item.seconds, 0);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">📊 Pomodoro İstatistikleri</h1>

      {/* Bugünkü toplam */}
      {todayStats && (
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">📅 Bugün</h2>
          <p className="text-lg">
            {todayStats.count} pomodoro tamamladın – toplam {todayStats.totalMinutes} dakika odaklandın 💪
          </p>
        </div>
      )}

      {/* Haftalık graf */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-2">🗓️ Haftalık Pomodoro Dağılımı</h2>
        <ResponsiveContainer width="100%" height={300}>
           <BarChart data={weeklyStats} barSize={40} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip formatter={(value) => [`${value} pomodoro`, "Toplam"]} />
            <Bar dataKey="count" fill="#3B82F6" radius={[10, 10, 0, 0]}>
              <LabelList dataKey="count" position="top" fill="#000" fontSize={14} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Focus vs Break */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-2">⏱️ Odak / Mola Süresi Dağılımı</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={focusBreakRatio}
              dataKey="seconds"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
            >
              {focusBreakRatio.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${Math.round(value / 60)} dakika`, "Süre"]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        {totalSeconds > 0 && (
          <p className="mt-4 text-center text-gray-600 italic">
            Toplam süre: {(totalSeconds / 60).toFixed(1)} dakika
          </p>
        )}
      </div>

      {/* Etikete göre görev durumu */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-2">🏷️ Etikete Göre Görev Başarı Oranı</h2>
        <ResponsiveContainer width="100%" height={300}>
           <BarChart data={labelStats} barSize={40} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            <XAxis dataKey="label" />
            <YAxis unit="%" />
            <Tooltip formatter={(value) => [`%${value.toFixed(1)}`, "Tamamlanma"]} />
            <Bar dataKey="completion_rate" fill="#10B981" radius={[10, 10, 0, 0]}>
              <LabelList dataKey="completion_rate" position="top" formatter={(val) => `${val}%`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}