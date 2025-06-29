// MainPage.js - Trello Stili + Tarih Filtreleme + DragDrop + Etiket Gruplama + Görev İşlemleri

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../axios";
import NavBar from "../components/NavBar";
import PomodoroTimer from "../components/PomodoroTimer";
import { toast } from "react-hot-toast";
import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from "moment";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import FocusOverlay from "../components/FocusOverlay";

import {
  DragDropContext,
  Droppable,
  Draggable
} from "@hello-pangea/dnd";

export default function MainPage() {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuth();
  const [columns, setColumns] = useState({
    "Ders": [],
    "İş": [],
    "Kişisel": [],
    "Yan Proje": [],
    "Öneri1": [],
    "Öneri2": [],
    "Öneri3":[],
    "Etiketsiz": []
  });
  const localizer = momentLocalizer(moment);
  const[calendarEvents, setCalendarEvents] = useState([]);

  const primaryLabels = ["Ders", "İş", "Kişisel","Yan Proje"];
  const extraLabels = ["Öneri1", "Öneri2" , "Öneri3", "Etiketsiz"];

  const [showFocusOverlay, setShowFocusOverlay] = useState(false);
  const [activeFilter, setActiveFilter] = useState("today");
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [label, setLabel] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [todayTasks, setTodayTasks] = useState([]);
  const [suggestedTask, setSuggestedTask] = useState(null);
  const [showExtraColumns, setShowExtraColumns]  = useState(false);
  const [pomodoroStats, setPomodoroStats] = useState({count: 0, totalMinutes:0});
  const [showCalendarView, setShowCalendarView] = useState(false);

  const getLabelColor = (label) => {
    switch (label) {
      case "Ders": return "bg-blue-100 text-blue-700";
      case "İş": return "bg-yellow-100 text-yellow-700";
      case "Kişisel": return "bg-pink-100 text-pink-700";
      case "Yan Proje": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-500";
    }
  };

  const visibleLabels = Object.entries(columns).filter(([label]) =>
    showExtraColumns ? true : primaryLabels.includes(label)
  );

  const handleTaskClick = (task) => {
    const confirmed = window.confirm(`"${task.title}"için odak modunu başlatmak ister misin?`);
    if(confirmed){
      setShowPomodoro(true);
      setShowFocusOverlay(true);
    };
  }

  const fetchPomodoroStats = async () => {
    try{
      const res = await api.get("/api/stats/today");
        setPomodoroStats(res.data);
    }
    catch(error){
      console.error("pomodoro statları çekerken hata:",error);
    }
  }

  const fetchTasks = async (filter = "today") => {
    try {
      const res = await api.get(`/api/tasks/${filter}`);
      const grouped = {
        "Ders": [],
        "İş": [],
        "Kişisel": [],
        "Yan Proje": [],
        "Öneri1": [],
        "Öneri2": [],
        "Öneri3":[],
        "Etiketsiz": []
      };
      res.data.forEach(task => {
        const label = task.label || "Etiketsiz";
        grouped[label] ? grouped[label].push(task) : grouped["Etiketsiz"].push(task);
      });
      setColumns(grouped);

      if (filter === "today" && res.data.length > 0) {
        const random = res.data[Math.floor(Math.random() * res.data.length)];
        setSuggestedTask(random);
      }

      const events = res.data.map(task =>({
        title: task.title,
        start: new Date(task.due_date),
        end: new Date(task.due_date),
        allDay: true,
        resource: task,
      }));
      setCalendarEvents(events);
    } catch (err) {
      console.error("Görevler alınırken hata:", err);
    }
  };

  const checkDailyLogin = async () => {
    try{
      const res = await api.post("/api/user/daily-login");
      console.log("gelen cevap:",res.data)
      if(res.data.status === 'claimed'){
        
        toast.success(`Günlük Giriş Bonusu Alındı`, {
          icon: "🏁",
          position: "top-center",
          duration: 3500,
        });
        setUser(res.data.user);
        setShowFocusOverlay(res.data.user);
      }
      else{
        console.log("günlük zaten giriş yapılmış");
      }
    }
    catch(err){
      console.error(console.log("günlük cp coin hatası:",err));
    }
  }

  useEffect(() => {
    
    console.log("useEffect çalıştı");
    fetchTasks();
    checkDailyLogin();
    fetchPomodoroStats();
  }, []);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    const sourceTasks = Array.from(columns[sourceCol]);
    const destTasks = Array.from(columns[destCol]);
    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (sourceCol === destCol) {
      sourceTasks.splice(destination.index, 0, movedTask);
      setColumns({ ...columns, [sourceCol]: sourceTasks });
    } else {
      movedTask.label = destCol;
      destTasks.splice(destination.index, 0, movedTask);
      setColumns({
        ...columns,
        [sourceCol]: sourceTasks,
        [destCol]: destTasks
      });
      api.put(`/api/tasks/${movedTask.id}`, { label: destCol }).catch(console.error);
    }
  };

  const toggleTask = async (taskId, newStatus) => {
    try {
      await api.put(`/api/tasks/${taskId}`, { completed: newStatus });

      const updatedTask = allTasks.find(t => t.id === taskId);
      if (newStatus) {
        toast.success(`✅ "${updatedTask?.title || "Görev"}" tamamlandı!`, {
          icon: "🏁",
          position: "top-center",
          duration: 3500,
        });
      } else {
        toast("🟡 Görev yeniden aktif!", {
          icon: "🔄",
          position: "top-center",
          duration: 3000,
        });
      }

      fetchTasks(activeFilter);
    } catch (err) {
      toast.error("❌ Görev güncellenemedi", {
        position: "top-center"
      });
      console.error("Görev güncellenemedi:", err);
    }
  };

  const handleEdit = (task) => {
    setTaskToEdit(task);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditDueDate(task.due_date || "");
    setEditLabel(task.label || "");
    setEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/api/tasks/${taskToEdit.id}`, {
        title: editTitle,
        description: editDescription,
        due_date: editDueDate,
        label: editLabel,
      });
      fetchTasks(activeFilter);
      setEditModalOpen(false);
      toast.success("✅ Görev başarıyla güncellendi!", {
        icon: "✏️",
        position: "top-center",
        duration: 3000,
      });
    } catch (err) {
      console.error("Düzenleme hatası:", err);
      alert("Görev düzenlenemedi.");
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm("Görevi silmek istediğinizden emin misiniz?")) return;
    try {
      await api.delete(`/api/tasks/${taskId}`);
      fetchTasks(activeFilter);
      toast.success(" Görev başarıyla silindi!", {
        icon: "✅",
        position: "top-center",
        duration: 3000,
      });
    } catch (err) {
      console.error("Görev silme hatası:", err);
    }
  };

  const allTasks = Object.values(columns).flat();
  const getProgress = () => {
    if (allTasks.length === 0) return 0;
    const completedCount = allTasks.filter(task => task.completed).length;
    return Math.round((completedCount / allTasks.length) * 100);
  };

  return (
    <>
      <NavBar />
        <main className="min-h-screen w-full bg-gradient-to-br from-indigo-100 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-500 px-4 py-10">
          <section className="max-w-6xl mx-auto space-y-6">

            <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 bg-white text-black dark:bg-[#111827] dark:text-white transition-colors duration-500">
            {/* Önerilen Görev */}
            {suggestedTask && (
              <div className="bg-amber-100/80 border-l-4 border-amber-500 text-amber-900 dark:bg-yellow-900/50 dark:border-yellow-500 dark:text-yellow-200 p-5 rounded-xl shadow-lg">
                <p className="font-semibold text-lg">🎯 Bugünlük Hedef:</p>
                <p className="text-xl">{suggestedTask.title}</p>
                {suggestedTask.description && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{suggestedTask.description}</p>
                )}
              </div>
            )}

            {/* Filtre Butonları */}
            <div className="flex justify-between align-center">
              <div className="flex space-x-2">  
                {["past", "today", "tomorrow", "upcoming"].map(f => (
                  <button
                    key={f}
                    onClick={() => { setActiveFilter(f); fetchTasks(f); }}
                    className={`px-4 py-2 rounded transition ${
                      activeFilter === f
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {f === "past" ? "Geçmiş" : f === "today" ? "Bugün" : f === "tomorrow" ? "Yarın" : "Yaklaşan"}
                  </button>
                ))}
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => setShowExtraColumns((prev) => !prev)}
                  className="px-6 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow"
                >
                  {showExtraColumns ? "Daha Az Göster" : "Tüm Kategorileri Göster"}
                </button>
                <button
                  onClick={() => setShowCalendarView(prev => !prev)}
                  className="px-6 py-2 bg-indigo-500 text-white rounded-xl shadow hover:bg-indigo-600"
                >
                  {showCalendarView ? "Kart Görünümü" : "Takvim Görünümü"}
                </button>
              </div>
            </div>

            {/* Görev İlerlemesi */}
            <div className="mb-4">
              <h3 className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                Görev Tamamlanma Oranı: {getProgress()}%
              </h3>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${getProgress()}%` }}
                ></div>
              </div>
            </div>

            {/* Görevler */}
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {visibleLabels.map(([label, tasks]) => (
                  <Droppable droppableId={label} key={label}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 shadow min-h-[200px]"
                      >
                        <h3 className="text-lg font-bold mb-2">{label}</h3>
                        {tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={(e) => {
                                  const tag = e.target.tagName.toLowerCase();
                                  if (!["button", "input", "label", "svg", "path"].includes(tag)) {
                                    handleTaskClick(task);
                                  }
                                }}
                                className={`group cursor-pointer bg-white dark:bg-gray-900 rounded-2xl p-4 mb-3 shadow-md border-l-4 transition-all duration-300 
                                  ${task.completed ? "border-green-500" : "border-yellow-500 hover:shadow-lg hover:bg-yellow-50 dark:hover:bg-gray-700"}`}
                              >
                                <div className="flex justify-between items-start">
                                  <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                                    {task.title}
                                  </h4>
                                  <span className="text-xs text-white bg-indigo-500 px-2 py-0.5 rounded-full">
                                    {task.label || "Genel"}
                                  </span>
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                  {task.description}
                                </p>

                                <div className="flex justify-between items-center mt-3 text-xs text-gray-400 dark:text-gray-500">
                                  <span>📅 {task.due_date}</span>
                                  <span className={`font-semibold ${task.completed ? "text-green-500" : "text-yellow-500"}`}>
                                    {task.completed ? "Tamamlandı" : "Devam Ediyor"}
                                  </span>
                                </div>

                                <div className="flex justify-between items-center mt-3">
                                  <label className="inline-flex items-center text-sm">
                                    <input
                                      type="checkbox"
                                      checked={task.completed}
                                      onChange={() => toggleTask(task.id, !task.completed)}
                                      className="mr-2 accent-green-600"
                                    />
                                    <span>{task.completed ? "Tamamlandı" : "İşaretle"}</span>
                                  </label>

                                  <div className="flex gap-2 text-sm opacity-0 group-hover:opacity-100 transition">
                                    <button
                                      onClick={() => handleEdit(task)}
                                      className="text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-400"
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      onClick={() => handleDelete(task.id)}
                                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </div>
                              </div>

                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </DragDropContext>

            {/* Pomodoro */}
            <div className="flex justify-center">
                <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-xl w-full max-w-md space-y-4">
                  <h2 className="text-xl font-semibold mb-3">Pomodoro İstatistikleri</h2>
                  {pomodoroStats.count === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 italic">Bugün henüz Pomodoro yapmadın. Hadi başlayalım! 🔥</p>
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300">
                        Bugün toplam <span className="font-bold text-indigo-600 dark:text-indigo-400">{pomodoroStats.count}</span> Pomodoro yaptın ({pomodoroStats.totalMinutes} dk). Aferin sana! 💪
                      </p>
                    )}
                </div>
            </div>            
            {/* Butonlar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setShowModal(true)}
                className="bg-indigo-600 text-white py-3 rounded-2xl shadow transition"
              >
                Görev Ekle
              </button>
              <button
                onClick={() => setShowPomodoro(true)}
                className="bg-green-600 text-white py-3 rounded-2xl rounded-2xl shadow transition"
              >
                Pomodoro Başlat
              </button>
              <button
                onClick={() => navigate("/stats")}
                className="bg-gray-800 text-white py-3 rounded-2xl rounded-2xl shadow transition"
              >
                İstatistikler
              </button>
            </div>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded-lg shadow-xl w-full max-w-md space-y-4">
                <h2 className="text-xl font-semibold">Yeni Görev Ekle</h2>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await api.post("/api/tasks", {
                        title,
                        description,
                        due_date: dueDate,
                        label,
                      });
                      await fetchTasks(activeFilter);
                      setTitle("");
                      setDescription("");
                      setDueDate("");
                      setLabel("");
                      setShowModal(false);
                      toast.success("🎉 Yeni görev eklendi!", {
                        icon: "🆕",
                        position: "top-center",
                        duration: 3000,
                      });
                    } catch (err) {
                      console.error("Görev ekleme hatası:", err);
                    }
                  }}
                  className="space-y-3"
                >
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Başlık"
                    required
                    className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded"
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Açıklama"
                    required
                    className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded"
                  />
                  <select
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded"
                  >
                    <option value="">Etiket Seç (isteğe bağlı)</option>
                    <option value="Ders">📘 Ders</option>
                    <option value="İş">💼 İş</option>
                    <option value="Kişisel">🧘‍♀️ Kişisel</option>
                    <option value="Yan Proje">🚀 Yan Proje</option>
                  </select>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-300 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                    >
                      Vazgeç
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Ekle
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Görev Düzenle Modal */}
          {editModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded-lg shadow-xl w-full max-w-md space-y-4">
                <h2 className="text-xl font-semibold">Görevi Düzenle</h2>
                <form onSubmit={handleUpdate} className="space-y-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                    className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded"
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded"
                  />
                  <select
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded"
                  >
                    <option value="">Etiket Seç (isteğe bağlı)</option>
                    <option value="Ders">📘 Ders</option>
                    <option value="İş">💼 İş</option>
                    <option value="Kişisel">🧘‍♀️ Kişisel</option>
                    <option value="Yan Proje">🚀 Yan Proje</option>
                  </select>
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setEditModalOpen(false)}
                      className="px-4 py-2 bg-gray-300 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                    >
                      Vazgeç
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Güncelle
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Pomodoro Modal */}
          {showPomodoro && (
            <FocusOverlay onClose={() => setShowPomodoro(false)}>
              <PomodoroTimer onStart={() => {}} /> {/* boş da olsa geçilmeli */}
            </FocusOverlay>
          )}

          {/* calendar view */}
          {showCalendarView && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
                <Calendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 500 }}
                  views={['month', 'week', 'agenda']}
                  onSelectEvent={(event) => handleTaskClick(event.resource)}
                  eventPropGetter={(event) => ({
                    style: {
                      backgroundColor: "#6366f1",
                      borderRadius: "8px",
                      color: "white",
                      padding: "4px",
                    },
                  })}
                />
              </div>
            )}
        </section>
      </main>
    </>
  );
}
