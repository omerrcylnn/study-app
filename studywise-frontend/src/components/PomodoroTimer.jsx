import React, { useState, useRef, useEffect } from "react";
import api from "../axios";
import toast from "react-hot-toast";

export default function PomodoroTimer({onStart}) {
  const FOCUS_DURATION = 10;
  const BREAK_DURATION = 5;

  const [time, setTime] = useState(FOCUS_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  const sessionLoggedRef = useRef(false); // ✅ Tek kayıt için

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const savePomodoroSession = async (type, duration) => {
  const now = new Date();
  const end = new Date(now.getTime() + duration * 1000);
    try {
        const res = await api.post("/api/pomodoro", {
        type,
        start_time: now.toISOString(),
        end_time: end.toISOString(),
        duration,
        });

        toast.success(
        type === "focus"
            ? "🎯 Pomodoro Tamamlandı. Ödüllerin Verildi!"
            : "☕ Mola bitti, yeniden odaklan!",
        {
            position: "top-center",
            duration: 4000,
        }
        );
        setUser(res.data.user);
    } catch (err) {
        console.error("❌ Kayıt hatası:", err);
    }
    };

  // Timer effect
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setTime(0);
          if (!sessionLoggedRef.current) {
            const type = isBreak ? "break" : "focus";
            const duration = isBreak ? BREAK_DURATION : FOCUS_DURATION;

            savePomodoroSession(type, duration);
            sessionLoggedRef.current = true;
            audioRef.current?.play();

            setTimeout(() => {
              if (isBreak) {
                // mola bitti → pomodoroya geç ama çalıştırma
                setIsBreak(false);
                setTime(FOCUS_DURATION);
                setIsRunning(false);
              } else {
                // focus bitti → mola otomatik başlasın
                setIsBreak(true);
                setTime(BREAK_DURATION);
                setIsRunning(true);
              }
              sessionLoggedRef.current = false; // reset
            }, 500); // küçük gecikmeyle sırayı bozmadan
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isBreak]);

  const handleStartPause = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    } else {
      setIsRunning(true);
      sessionLoggedRef.current = false; // her yeni start'ta sıfırla
    }
    if(typeof onStart === "function") onStart();
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsBreak(false);
    setTime(FOCUS_DURATION);
    sessionLoggedRef.current = false;
  };

  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold bg-emerald-900">
        {isBreak ? "Mola Zamanı 🧘" : "Odaklan 🚀"}
      </h2>
       <div className="text-6xl font-mono text-emerald-100 bg-emerald-900 px-6 py-4 rounded-xl tracking-widest shadow-lg">
        {formatTime(time)}
       </div>
      <div className="space-x-2">
        <button
          onClick={handleStartPause}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {isRunning ? "Duraklat" : "Başlat"}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Sıfırla
        </button>
      </div>
      <audio ref={audioRef} src="/ding.mp3" preload="auto" />
    </div>
  );
}