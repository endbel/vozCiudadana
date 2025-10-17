import axios from "axios";
import { getToken, logout } from "../../services/authService";

axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:3001";
axios.defaults.headers.common["Content-Type"] = "application/json";

// Interceptor para agregar el token a las requests
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores de autenticación
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Token expirado o inválido - cerrando sesión");
      logout();
      window.location.href = "/admin";
    }
    return Promise.reject(error);
  }
);
