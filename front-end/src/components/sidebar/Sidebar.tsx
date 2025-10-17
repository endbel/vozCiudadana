// import { LineChartIcon } from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { Menu, X } from "lucide-react";
import ReportCard from "./ReportCard";

export interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  image?: File | null;
}

export interface SidebarProps {
  onOpenModal: () => void;
  reports?: Report[];
  onReportClick?: (report: Report) => void;
}

export default function Sidebar({ onOpenModal, reports = [], onReportClick }: SidebarProps) {

  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const isMobile = useMediaQuery('(max-width: 426px)');
  
  const handleBurgerMenu = () => {
    console.log(isEnabled);
    console.log(isMobile);
    
    setIsEnabled(!isEnabled);//verificar si esta visible mi menu hamburguesa cuando do 

  };

  // Filtrar reportes según la categoría seleccionada
  const filteredReports = selectedCategory === "Todas" 
    ? reports 
    : reports.filter(report => report.category === selectedCategory);

  // Lista de categorías disponibles
  const categories = ["Todas", "Bache", "Alumbrado", "Graffiti", "Accidente", "Inundación", "Basura", "Árbol caído", "Otro"];
  return (
<>

{
    (!isMobile || isEnabled) && (
        <div className="w-80 h-full bg-white border-r border-gray-200 flex flex-col shadow-lg z-10 relative">
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
       {isEnabled && isMobile && (
        <button onClick={handleBurgerMenu}> <X className="w-6 h-6 text-gray-500" /></button>
       )}
        <h1 className="text-xl font-semibold text-gray-900">
          La Voz ciudadana
        </h1>
        <button
          className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors"
        onClick={onOpenModal}
        >
          <span className="text-lg font-medium">+</span>
        </button>
      </div>

      {/* FILTERS */}
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
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* INCIDENTS LIST SECTION */}
      <div className="flex-1 overflow-y-auto border-t border-gray-200 bg-white">
        <div className="divide-y divide-gray-200">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onClick={onReportClick}
              />
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              <div className="mb-3">📝</div>
              <p className="text-sm">
                {selectedCategory === "Todas" 
                  ? "No hay incidentes reportados" 
                  : `No hay incidentes en "${selectedCategory}"`
                }
              </p>
              <p className="text-xs mt-1">
                {selectedCategory === "Todas" 
                  ? "¡Crea tu primer reporte!" 
                  : "Selecciona otra categoría o crea un nuevo reporte"
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER SECTION */}
      <div className="p-3 bg-gray-50 border-t border-gray-200 mt-auto">
        <p className="text-center text-xs text-gray-500">
          {filteredReports.length} incidente{filteredReports.length !== 1 ? 's' : ''} mostrado{filteredReports.length !== 1 ? 's' : ''}
          {selectedCategory !== "Todas" && (
            <span className="text-blue-600"> en "{selectedCategory}"</span>
          )}
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