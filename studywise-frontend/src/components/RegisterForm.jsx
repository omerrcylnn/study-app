import { useState } from "react";
import axios from "axios";
import api from "../axios";

export default function RegisterForm() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const getCsrfTokenFromCookie = () => {
        const name = "XSRF-TOKEN=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const parts = decodedCookie.split(';');
        for (let i = 0; i < parts.length; i++) {
            let c = parts[i].trim();
            if (c.indexOf(name) === 0) {
            return c.substring(name.length);
            }
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // 1. CSRF cookie’yi al
            await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
            withCredentials: true,
            });

            // 2. Token’ı cookie'den oku
            const csrfToken = getCsrfTokenFromCookie();

            // 3. Header'a elle ekle
            await api.post(
            "/register",
            formData,
            {
                headers: {
                "X-XSRF-TOKEN": csrfToken,
                },
            }
            );

            alert("Kayıt başarılı!");
            setFormData({ name: "", email: "", password: "" });
        } catch (error) {
            console.error("Kayıt hatası:", error.response?.data || error.message);
        }
    };




    return (
        <form onSubmit={handleSubmit}
            className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md space-y-4"
        >
            <h2 className="text-2xl font-bold text-center text-blue-600">Kayıt Ol</h2>
            <input
                    type="text"
                    name="name"
                    placeholder="İsim"
                    className="w-full border p-2 rounded"
                    value={formData.name}
                    onChange={handleChange}
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full border p-2 rounded"
                    value={formData.email}
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Şifre"
                    className="w-full border p-2 rounded"
                    value={formData.password}
                    onChange={handleChange}
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                Kayıt Ol
            </button>
        </form>
    );
}