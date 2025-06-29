import axios from "axios";

// CSRF token'ı çeken yardımcı fonksiyon
function getCsrfTokenDefault() {
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
}

const api = axios.create({
  baseURL: "https://api.studyspark.xyz",
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

// response interceptor 
api.interceptors.response.use(
    response => response,
    error => {
        if(error.response && error.response.status === 401){
            localStorage.removeItem("user");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);


// Interceptor: Her istekten önce CSRF token'ı header'a ekle
api.interceptors.request.use(config => {
    const token = getCsrfTokenDefault();
    if (token) {
        config.headers["X-XSRF-TOKEN"] = token;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default api;