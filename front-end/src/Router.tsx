import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import App from './App';
import Login from './components/auth/Login';
import AdminPanel from './components/admin/AdminPanel';
import { useState } from 'react';

// Componente para manejar el login de admin
function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError("");

    try {
      // Aquí puedes agregar la lógica de autenticación real
      // Por ahora simulamos una validación básica
      if (email === "admin@voiciudadana.com" && password === "admin123") {
        // Login exitoso - redirigir al panel de admin
        console.log("Login exitoso");
        localStorage.setItem("adminLoggedIn", "true");
        navigate('/admin/panel');
      } else {
        setError("Credenciales inválidas. Verifica tu email y contraseña.");
      }
    } catch (err) {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Login 
      onLogin={handleLogin}
      isLoading={isLoading}
      error={error}
    />
  );
}

// Componente principal del Router
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal - App normal con fecha de nacimiento y sidebar */}
        <Route path="/" element={<App />} />
        
        {/* Ruta específica para el login de admin */}
        <Route path="/admin" element={<AdminLogin />} />
        
        {/* Ruta para el panel de administración */}
        <Route path="/admin/panel" element={<AdminPanel />} />
        
        {/* Ruta para redirigir cualquier ruta no encontrada al home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}