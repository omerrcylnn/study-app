import { useState } from "react";
import axios from "axios";
import api from "../axios";
import { Navigate, useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleNavigateRegister = () => {
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getCsrfTokenFromCookie = () => {
    const name = "XSRF-TOKEN=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const parts = decodedCookie.split(";");
    for (let i = 0; i < parts.length; i++) {
      let c = parts[i].trim();
      if (c.indexOf(name) === 0) {
        return c.substring(name.length);
      }
    }
    return null;
  };

  const BASE_URL = "https://api.studyspark.xyz"

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. CSRF token al
      await axios.get(`${BASE_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });

      // 2. Cookie'den token çek
      const csrfToken = getCsrfTokenFromCookie();

      // 3. Register isteği
      await api.post(
        "/register",
        formData,
        {
          withCredentials: true,
          headers: {
            "X-XSRF-TOKEN": csrfToken,
          },
        }
      );

      alert("✅ Kayıt başarılı!");
      setFormData({ name: "", email: "", password: "" });
    } catch (error) {
      console.error("❌ Kayıt hatası:", error.response?.data || error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
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
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full border p-2 rounded"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Şifre"
        className="w-full border p-2 rounded"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <div className="flex justify-center p-4 gap-4">
        <button
        type="submit"
        className="w-50 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Kayıt Ol
      </button>
      <button
          type="button"
          onClick={handleNavigateRegister}
          className="w-50 bg-green-400 text-white py-2 px-4 rounded"
        >
          Giriş Yap
        </button>
      </div>
    </form>
  );
}