import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import App from "./App";
import Login from "./components/auth/Login";
import AdminPanel from "./components/admin/AdminPanel";
import { APP_CONFIG } from "./config/constants";
import PrivateRoute from "./components/auth/PrivateRoute";
import NotFound from "./components/notFound/NotFound";
import { login, isAuthenticated } from "./services/authService";

// Componente para manejar el login de admin
function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  // Verificar si ya está autenticado al cargar el componente
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/admin/panel");
    }
  }, [navigate]);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError("");

    try {
      // Intentar login con el backend JWT
      await login({ email, password });

      // Si llegamos aquí, el login fue exitoso
      console.log("Login JWT exitoso");
      navigate("/admin/panel");
    } catch (error: any) {
      // Si falla el JWT, intentar con credenciales por defecto (fallback)
      if (
        email === APP_CONFIG.defaultCredentials.email &&
        password === APP_CONFIG.defaultCredentials.password
      ) {
        console.log("Login con credenciales por defecto");
        localStorage.setItem(APP_CONFIG.storageKeys.adminLoggedIn, "true");
        navigate("/admin/panel");
      } else {
        setError(error.message || "Credenciales inválidas.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return <Login onLogin={handleLogin} isLoading={isLoading} error={error} />;
}

// Componente principal del Router
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal - App normal con fecha de nacimiento y sidebar */}
        <Route path="/" element={<App />} />

        {/* Ruta de login (NO protegida) */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Rutas protegidas para admin */}
        <Route element={<PrivateRoute />}>
          <Route path="/admin/panel" element={<AdminPanel />} />
        </Route>

        {/* Ruta para redirigir cualquier ruta no encontrada al home */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
