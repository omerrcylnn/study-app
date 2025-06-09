// GoalsPage.js - Stil ve kullanıcı deneyimi geliştirilmiş versiyon

import React, { useState, useEffect } from "react";
import api from "../axios";
import NavBar from "../components/NavBar";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [notes, setNotes] = useState("");

  const fetchGoals = async () => {
    try {
      const res = await api.get("/api/goals");
      setGoals(res.data);
    } catch (err) {
      console.error("Hedefler alınamadı:", err);
    }
  };

  const addGoal = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/goals", { text: newGoal });
      setGoals(prev => [...prev, res.data]);
      setNewGoal("");
    } catch (err) {
      console.error("Hedef eklenemedi:", err);
    }
  };

  const toggleGoal = async (goal) => {
    try {
      const updated = { ...goal, completed: !goal.completed };
      await api.put(`/api/goals/${goal.id}`, updated);
      setGoals(prev =>
        prev.map(g => (g.id === goal.id ? { ...g, completed: updated.completed } : g))
      );
    } catch (err) {
      console.error("Hedef güncellenemedi:", err);
    }
  };

  const deleteGoal = async (goalId) => {
    if (!confirm("Bu hedefi silmek istiyor musun?")) return;
    try {
      await api.delete(`/api/goals/${goalId}`);
      setGoals(prev => prev.filter(g => g.id !== goalId));
    } catch (err) {
      console.error("Silinemedi:", err);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <>
      <NavBar />
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <h2 className="text-3xl font-bold text-gray-800">🎯 Hedeflerim</h2>

        {/* Ekleme Alanı */}
        <form onSubmit={addGoal} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Yeni hedef yaz..."
            className="flex-grow border border-gray-300 rounded-xl p-3 w-full"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Ekle
          </button>
        </form>

        {/* Hedef Listesi */}
        <ul className="space-y-3">
          {goals.length === 0 ? (
            <p className="text-gray-400 italic">Henüz bir hedefin yok 💡</p>
          ) : (
            goals.map((goal) => (
              <li
                key={goal.id}
                className={`flex items-center justify-between p-4 rounded-xl shadow-sm border-l-4 ${
                  goal.completed ? "border-green-500 bg-green-50" : "border-blue-500 bg-white"
                } transition hover:scale-[1.01]`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={goal.completed}
                    onChange={() => toggleGoal(goal)}
                    className="w-5 h-5 accent-green-500"
                  />
                  <span
                    className={`text-lg ${
                      goal.completed ? "line-through text-gray-500" : "text-gray-800"
                    }`}
                  >
                    {goal.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-red-500 hover:text-red-700 text-xl"
                >
                  🗑️
                </button>
              </li>
            ))
          )}
        </ul>

        {/* Notlar */}
        <div className="mt-10 bg-white rounded-xl p-5 shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">📝 Kişisel Notlar</h3>
          <textarea
            rows="6"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-4"
            placeholder="Bugün aklında ne var? Planlar, düşünceler, alıntılar..."
          />
        </div>
      </div>
    </>
  );
}