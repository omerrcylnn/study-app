import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const BASE_URL = "https://api.studyspark.xyz";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNavigateRegister = () => {
    navigate("/register");
  };

  const getCsfrTokenDefault = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.get(`${BASE_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });

      const csrfToken = getCsfrTokenDefault();

      const res = await axios.post(`${BASE_URL}/login`, formData, {
        withCredentials: true,
        headers: {
          "X-XSRF-TOKEN": csrfToken,
        },
      });

      console.log("Tüm response:", res);
      console.log("res.data:", res.data);
      console.log("res.data.user:", res.data.user);

      login(res.data.user);
      navigate("/mainpage");
    } catch (error) {
      console.error("Login hatası:", error);
      setError("Giriş başarısız. Bilgileri kontrol et.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-xl font-semibold">Giriş Yap</h2>

      {error && <p className="text-red-500">{error}</p>}

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Şifre"
        value={formData.password}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <div className="flex justify-center gap-4">
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Giriş Yap
        </button>
        <button
          type="button"
          onClick={handleNavigateRegister}
          className="bg-green-400 text-white py-2 px-4 rounded"
        >
          Kayıt Ol
        </button>
      </div>
    </form>
  );
}