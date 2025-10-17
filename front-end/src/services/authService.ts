import axios from "axios";

// Tipos para autenticación
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Funciones para manejo de tokens
export const getToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

export const setToken = (token: string): void => {
  localStorage.setItem("accessToken", token);
};

export const removeToken = (): void => {
  localStorage.removeItem("accessToken");
};

// Función para verificar si el token es válido
export const isTokenValid = (token: string): boolean => {
  if (!token) return false;

  try {
    // Decodificar el JWT para verificar expiración
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;

    return payload.exp > currentTime;
  } catch {
    return false;
  }
};

// Función para verificar autenticación
export const isAuthenticated = (): boolean => {
  const token = getToken();
  return token ? isTokenValid(token) : false;
};

// Función para login
export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_BASE_URL}/auth/login`,
      credentials
    );
    const { accessToken } = response.data;

    setToken(accessToken);
    return response.data;
  } catch (error: any) {
    // Limpiar token en caso de error
    removeToken();
    throw new Error(error.response?.data?.message || "Error en el login");
  }
};

// Función para logout
export const logout = (): void => {
  removeToken();
  // Opcional: llamar al endpoint de logout del backend
  axios.post(`${API_BASE_URL}/auth/logout`);
};

// Función para obtener información del usuario desde el token
export const getUserFromToken = (): any | null => {
  const token = getToken();
  if (!token || !isTokenValid(token)) return null;

  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

// Función para refresh del token (si implementas refresh tokens)
export const refreshToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`);
    const { accessToken } = response.data;

    setToken(accessToken);
    return accessToken;
  } catch {
    logout(); // Si no se puede renovar, cerrar sesión
    return null;
  }
};
