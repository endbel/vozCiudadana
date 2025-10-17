import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APP_CONFIG, CATEGORY_MAPPING } from "../../config/constants";
import { getAllReports } from "../../lib/api/reports";
import { isAuthenticated, logout } from "../../services/authService";

interface Report {
  id: string | number;
  title: string;
  description: string;
  category: string;
  date?: string;
  images?: File[] | string[];
  lat?: number;
  long?: number;
}
// Utilidad para mapear el valor del backend al nombre en español
const getCategoryName = (category: string) => {
  const found = CATEGORY_MAPPING.find((c) => c.label === category);
  return found ? found.field : category;
};
export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState("Todas");

  useEffect(() => {
    // Verificar autenticación JWT o fallback
    const jwtAuthenticated = isAuthenticated();
    const fallbackAuthenticated =
      localStorage.getItem(APP_CONFIG.storageKeys.adminLoggedIn) === "true";

    if (jwtAuthenticated || fallbackAuthenticated) {
      setIsLoggedIn(true);
    } else {
      navigate("/admin");
    }
  }, [navigate]);

  useEffect(() => {
    async function fetchReports() {
      try {
        // Puedes ajustar la lat/long si quieres filtrar por zona
        const res = await getAllReports();
        setReports(res);
      } catch {
        setReports([]);
      }
    }
    fetchReports();
  }, []);

  const handleLogout = () => {
    // Logout JWT y limpiar almacenamiento local
    logout();
    localStorage.removeItem(APP_CONFIG.storageKeys.adminLoggedIn);
    setIsLoggedIn(false);
    navigate("/");
  };

  const filteredReports: Report[] = reports.filter((r: Report) => {
    const matchesText = filter
      ? r.title.toLowerCase().includes(filter.toLowerCase()) ||
        r.category.toLowerCase().includes(filter.toLowerCase()) ||
        r.description.toLowerCase().includes(filter.toLowerCase())
      : true;
    const matchesCategory =
      categoryFilter === "Todas" || r.category === categoryFilter;
    return matchesText && matchesCategory;
  });

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Panel de Administración - Voz Ciudadana
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Bienvenido/a
            </h2>
            <p className="text-gray-600">
              Aquí puedes revisar y filtrar los reportes ciudadanos.
            </p>
          </div>

          {/* Filtro */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <input
              type="text"
              placeholder="Filtrar por título, categoría o descripción..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Todas">Todas</option>
              <option value="POTHOLE">Bache</option>
              <option value="STREET_LIGHT">Alumbrado</option>
              <option value="GRAFFITI">Graffiti</option>
              <option value="ACCIDENT">Accidente</option>
              <option value="FLOOD">Inundación</option>
              <option value="GARBAGE">Basura</option>
              <option value="FALLEN_TREE">Árbol caído</option>
              <option value="OTHER">Otro</option>
            </select>
            <span className="text-sm text-gray-500">
              Total: {filteredReports.length} reportes
            </span>
          </div>

          {/* Tabla de incidencias */}
          <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
            <div className="overflow-y-auto max-h-[calc(100vh-290px)]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Título
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Categoría
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Descripción
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Imágenes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredReports.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-center text-gray-400"
                      >
                        No hay reportes que coincidan con el filtro.
                      </td>
                    </tr>
                  ) : (
                    filteredReports.map((report: Report, idx: number) => (
                      <tr
                        key={report.id || idx}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-semibold text-gray-800">
                          {report.title}
                        </td>
                        <td className="px-4 py-3 text-xs text-blue-700 font-bold">
                          {report.category
                            ? getCategoryName(report.category)
                            : "Desconocida"}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {report.description}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {report.date || "-"}
                        </td>
                        <td className="px-4 py-3">
                          {report.images &&
                          Array.isArray(report.images) &&
                          report.images.length > 0 ? (
                            <div className="flex gap-2">
                              {(report.images as (string | File)[])
                                .slice(0, 3)
                                .map((img: string | File, i: number) => (
                                  <img
                                    key={i}
                                    src={
                                      typeof img === "string"
                                        ? img
                                        : URL.createObjectURL(img)
                                    }
                                    alt={`img-${i}`}
                                    className="w-12 h-12 object-cover rounded-lg border"
                                  />
                                ))}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">
                              Sin imágenes
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
