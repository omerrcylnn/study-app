import React, { useState, useEffect } from "react";
import api from "../axios";
import NavBar from "../components/NavBar";

export default function AllTasksPage() {
  const [activeTab, setActiveTab] = useState("today");
  const [todayTasks, setTodayTasks] = useState([]);
  const [pastTasks, setPastTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const[tomorrowTasks, setTomorrowTasks] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [todayRes, pastRes, upcomingRes, tomorrowRes,] = await Promise.all([
          api.get("/api/tasks/today"),
          api.get("/api/tasks/past"),
          api.get("/api/tasks/upcoming"),
          api.get("/api/tasks/tomorrow"),
        ]);
        setTodayTasks(todayRes.data);
        setPastTasks(pastRes.data);
        setUpcomingTasks(upcomingRes.data);
        setTomorrowTasks(tomorrowRes.data);
      } catch (err) {
        console.error("Görevleri çekerken hata:", err);
      }
    };

    fetchAll();
  }, []);

  const getActiveTasks = () => {
    switch (activeTab) {
      case "past": return pastTasks;
      case "today": return todayTasks;
      case "upcoming": return upcomingTasks;
      case "tomorrow": return tomorrowTasks;
      default: return [];
    }
  };

  const activeTasks = getActiveTasks();

  return (
    <>
      <NavBar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex space-x-2 mb-4">
          <button onClick={() => setActiveTab("past")} className={activeTab === "past" ? "bg-gray-800 text-white px-4 py-2 rounded" : "bg-gray-200 px-4 py-2 rounded"}>Geçmiş</button>
          <button onClick={() => setActiveTab("today")} className={activeTab === "today" ? "bg-gray-800 text-white px-4 py-2 rounded" : "bg-gray-200 px-4 py-2 rounded"}>Bugün</button>
          <button onClick={() => setActiveTab("tomorrow")} className={activeTab === "tomorrow" ? "bg-gray-800 text-white px-4 py-2 rounded" : "bg-gray-200 px-4 py-2 rounded"}>Yarın</button>
          <button onClick={() => setActiveTab("upcoming")} className={activeTab === "upcoming" ? "bg-gray-800 text-white px-4 py-2 rounded" : "bg-gray-200 px-4 py-2 rounded"}>Yaklaşan</button>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          {activeTasks.length === 0 ? (
            <p className="text-gray-400">Görev bulunamadı 📭</p>
          ) : (
            <ul className="space-y-2">
              {activeTasks.map((task) => (
                <li key={task.id} className="border-b pb-2">
                  <div className="font-semibold">{task.title}</div>
                  <div className="text-sm text-gray-500">{task.description}</div>
                  <div className="text-xs text-gray-400">Tarih: {task.due_date}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}