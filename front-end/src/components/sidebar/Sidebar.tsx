// import { LineChartIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import ReportCard from "./ReportCard";

interface SidebarProps {
  onTutorialToggle: (show: boolean) => void;
  onOpenModal: () => void;
  reports?: Report[];
  onReportClick?: (report: Report) => void;
}

export interface Report {
  id: string | number;
  title: string;
  description: string;
  category: string;
  date: string;
  images?: File[] | string[]; // Permite tanto Files como URLs
  lat?: number;
  long?: number;
}

import { CATEGORIES } from "../../config/constants";

const categories = CATEGORIES;

export default function Sidebar({
  onTutorialToggle,
  onOpenModal,
  reports = [],
  onReportClick,
}: SidebarProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const isMobile = useMediaQuery("(max-width: 426px)");

  // Función para filtrar incidentes
  // Filtrar reportes según la categoría seleccionada
  const filteredReports =
    selectedCategory === "Todas"
      ? reports
      : reports.filter((report) => report.category === selectedCategory);

  const handleBurgerMenu = () => {
    console.log(isEnabled);
    console.log(isMobile);

    setIsEnabled(!isEnabled); //verificar si esta visible mi menu hamburguesa cuando do
  };
  return (
    <>
      {(!isMobile || isEnabled) && (
        <motion.div
          initial={{ x: -320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -320, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-80 h-full bg-white border-r border-gray-200 flex flex-col shadow-lg z-10 relative"
        >
          {/* HEADER SECTION */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            {isEnabled && isMobile && (
              <button onClick={handleBurgerMenu}>
                {" "}
                <X className="w-6 h-6 text-gray-500" />
              </button>
            )}
            <h1 className="text-xl font-semibold text-gray-900">
              La Voz Ciudadana
            </h1>
            <motion.button
              onClick={() => onTutorialToggle(true)}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center justify-center transition-colors border border-gray-300 cursor-pointer"
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg font-medium">?</span>
            </motion.button>
            <motion.button
              onClick={onOpenModal}
              className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
              whileHover={{
                y: -4,
                scale: 1.08,
                boxShadow: "0px 8px 24px rgba(0,0,0,0.18)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <span className="text-lg font-medium">+</span>
            </motion.button>
          </div>

          {/* FILTERS SECTION */}
          <div className="p-4 space-y-4 bg-white">
            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                CATEGORÍA
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    whileHover={{ y: -4, scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className={`px-2 py-1 text-xs rounded-full transition-colors cursor-pointer ${
                      selectedCategory === category
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </motion.button>
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
                <div className="p-4 text-center">
                  <p className="text-sm text-gray-500">
                    No hay incidentes que coincidan con los filtros
                    seleccionados
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* FOOTER SECTION */}
          <div className="p-3 bg-gray-50 border-t border-gray-200 mt-auto">
            <p className="text-center text-xs text-gray-500">
              {filteredReports.length} incidente
              {filteredReports.length !== 1 ? "s" : ""} mostrado
              {filteredReports.length !== 1 ? "s" : ""}
            </p>
          </div>
        </motion.div>
      )}
      {isMobile && isEnabled === false && (
        <button
          className="absolute top-4 right-4 z-50 p-2 border border-gray-300 text-gray-500 rounded-md shadow-md bg-white"
          onClick={handleBurgerMenu}
        >
          <Menu className="w-6 h-6" />
        </button>
      )}
    </>
  );
}
