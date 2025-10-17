// import { LineChartIcon } from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { Menu, X } from "lucide-react";

interface SidebarProps {
  onTutorialToggle: (show: boolean) => void;
}

interface Incident {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  date: string;
}

// Datos mock de incidentes
const mockIncidents: Incident[] = [
  {
    id: 1,
    title: "hola",
    description: "nada",
    category: "Bache",
    status: "Pendiente",
    date: "Hoy"
  },
  {
    id: 2,
    title: "Farola apagada",
    description: "Calle principal sin iluminación",
    category: "Alumbrado",
    status: "En progreso",
    date: "Ayer"
  },
  {
    id: 3,
    title: "Contenedor lleno",
    description: "Desbordamiento en el parque",
    category: "Basura",
    status: "Resuelto",
    date: "Hace 2 días"
  },
  {
    id: 4,
    title: "Bache grande",
    description: "Hueco profundo en la avenida",
    category: "Bache",
    status: "Pendiente",
    date: "Hace 3 días"
  },
  {
    id: 5,
    title: "Grafiti en pared",
    description: "Vandalismo en edificio público",
    category: "Graffiti",
    status: "Pendiente",
    date: "Hace 1 semana"
  }
];

const categories = ["Todas", "Bache", "Alumbrado", "Graffiti", "Accidente", "Inundación", "Basura", "Árbol caído", "Otro"];
const statuses = ["Todas", "Pendiente", "En progreso", "Resuelto"];

export default function Sidebar({ onTutorialToggle }: SidebarProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedStatus, setSelectedStatus] = useState("Todas");
  const isMobile = useMediaQuery('(max-width: 426px)');

  // Función para filtrar incidentes
  const filteredIncidents = mockIncidents.filter(incident => {
    const categoryMatch = selectedCategory === "Todas" || incident.category === selectedCategory;
    const statusMatch = selectedStatus === "Todas" || incident.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  // Función para obtener estilos de estado
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "En progreso":
        return "bg-blue-100 text-blue-800";
      case "Resuelto":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleBurgerMenu = () => {
    console.log(isEnabled);
    console.log(isMobile);
    
    setIsEnabled(!isEnabled);//verificar si esta visible mi menu hamburguesa cuando do 

  };
  return (
<>

{
    (!isMobile || isEnabled) && (
        <div className="w-80 h-full bg-white border-r border-gray-200 flex flex-col shadow-lg z-10 relative">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
       {isEnabled && isMobile && (
        <button onClick={handleBurgerMenu}> <X className="w-6 h-6 text-gray-500" /></button>
       )}
        <h1 className="text-xl font-semibold text-gray-900">
          La Voz ciudadana
        </h1>
        <button 
          onClick={() => onTutorialToggle(true)}
          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center justify-center transition-colors border border-gray-300"
        >
          <span className="text-lg font-medium">?</span>
        </button>
        <button className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors">
          <span className="text-lg font-medium">+</span>
        </button>
      </div>

      {/* FILTERS SECTION */}
      <div className="p-4 space-y-4 bg-white">
        {/* Category Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">CATEGORÍA</h3>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-2 py-1 text-xs rounded-full transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">ESTADO</h3>
          <div className="flex flex-wrap gap-1.5">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-2 py-1 text-xs rounded-full transition-colors ${
                  selectedStatus === status
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* INCIDENTS LIST SECTION */}
      <div className="flex-1 overflow-y-auto border-t border-gray-200 bg-white">
        <div className="divide-y divide-gray-200">
          {filteredIncidents.length > 0 ? (
            filteredIncidents.map((incident) => (
              <div key={incident.id} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusStyles(incident.status)}`}>
                    {incident.status}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {incident.category}
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{incident.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{incident.description}</p>
                <p className="text-xs text-gray-500">{incident.date}</p>
              </div>
            ))
          ) : (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500">No hay incidentes que coincidan con los filtros seleccionados</p>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER SECTION */}
      <div className="p-3 bg-gray-50 border-t border-gray-200 mt-auto">
        <p className="text-center text-xs text-gray-500">
          {filteredIncidents.length} incidente{filteredIncidents.length !== 1 ? 's' : ''} mostrado{filteredIncidents.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
    )
}
{
  (isMobile && isEnabled === false) && (
      <button
        className="absolute top-4 right-4 z-50 p-2 border border-gray-300 text-gray-500 rounded-md shadow-md bg-white"
        onClick={handleBurgerMenu}
      >
        <Menu className="w-6 h-6" />
      </button>
  )
}
  </>
  );
}