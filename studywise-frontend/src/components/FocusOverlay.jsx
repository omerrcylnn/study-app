import React, {useState} from "react";

const lofiTracks = [
        { name: "Lofi 1 🎵", src: "/lofi1.mp3" },
        { name: "Rainy Day ☔", src: "/lofi2.mp3" },
        { name: "Cafe Vibes ☕", src: "/lofi3.mp3" },
        { name: "Chill Beats 🌙", src: "/lofi4.mp3" },
    ];

export default function FocusOverlay ({children , onClose}){
    const [selectedTrack, setSelectedTrack] = useState(lofiTracks[0].src);

    return ( 
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center text-white">
            <h2 className="text-4xl font-bold mb-4">Odaklanma Zamanı 🎧</h2>
            <p className="mb-6 text-lg">Rahatsız edilme, derin çalışıyorsun.</p>
            <select
                value={selectedTrack}
                onChange={(e) => setSelectedTrack(e.target.value)}
                className="mb-4 p-2 rounded bg-white text-black"
            >
                {lofiTracks.map((track, i) => (
                <option key={i} value={track.src}>
                    {track.name}
                </option>
                ))}
            </select>
            {/* İsteğe bağlı: Müzik seçici */}
            <audio key={selectedTrack} controls loop className="mb-4">
                <source src={selectedTrack} type="audio/mpeg" />
                Tarayıcınız ses çalmayı desteklemiyor.
            </audio>
            <div className="bg-white bg-opacity-10 p-6 rounded-xl border border-white/20">
                {children}
            </div>
            <button
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-red-600 rounded hover:bg-red-700 transition"
            >
                Odak Modunu Kapat
            </button>
        </div>
    );
}