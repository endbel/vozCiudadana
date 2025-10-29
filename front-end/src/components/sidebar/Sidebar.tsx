// import { LineChartIcon } from "lucide-react};
import { AnimatePresence, motion } from "framer-motion";
import { HelpCircle, Menu, Plus, X } from "lucide-react";
import { useState } from "react";
import { CATEGORY_MAPPING } from "../../config/constants";
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
  images?: File[] | string[];
  lat?: number;
  long?: number;
}

const categories = CATEGORY_MAPPING;

export default function Sidebar({
  onTutorialToggle,
  onOpenModal,
  reports = [],
  onReportClick,
}: SidebarProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const isMobile = useMediaQuery("(max-width: 426px)");

  const filteredReports =
    selectedCategory === "Todas"
      ? reports
      : reports.filter((report) => report.category === selectedCategory);

  const handleBurgerMenu = () => {
    setIsEnabled(!isEnabled);
  };

  return (
    <>
      <AnimatePresence>
        {(!isMobile || isEnabled) && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-80 h-full bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 flex flex-col shadow-xl z-10 relative"
          >
            {/* HEADER SECTION */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
              {isEnabled && isMobile && (
                <motion.button
                  onClick={handleBurgerMenu}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </motion.button>
              )}
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                La Voz Ciudadana
              </h1>
              <div className="flex gap-2">
                <motion.button
                  onClick={() => onTutorialToggle(true)}
                  className="w-9 h-9 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-xl flex items-center justify-center transition-all shadow-sm border border-gray-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <HelpCircle className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={onOpenModal}
                  className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl flex items-center justify-center transition-all shadow-md"
                  whileHover={{
                    scale: 1.05,
                    y: -2,
                    boxShadow: "0px 8px 24px rgba(59, 130, 246, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* FILTERS SECTION */}
            <div className="p-4 space-y-3 bg-white/50 backdrop-blur-sm">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
                Filtrar por categoría
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const isSelected = selectedCategory === category.label;

                  return (
                    <motion.button
                      key={category.label}
                      onClick={() => setSelectedCategory(category.label)}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                      }}
                      className={`
                        relative px-3 py-1.5 rounded-full text-xs font-semibold
                        transition-all duration-200 cursor-pointer
                        shadow-sm
                        ${
                          isSelected
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-400 ring-offset-1"
                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
                        }
                      `}
                    >
                      {category.field}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* INCIDENTS LIST SECTION */}
            <div className="flex-1 overflow-y-auto border-t border-gray-200 bg-gradient-to-b from-white/30 to-gray-50/50">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="divide-y divide-gray-200"
                >
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report, index) => (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ReportCard report={report} onClick={onReportClick} />
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-8 text-center"
                    >
                      <div className="text-5xl mb-3">🔍</div>
                      <p className="text-sm font-medium text-gray-600">
                        No hay incidentes
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        en esta categoría
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* FOOTER SECTION */}
            <motion.div
              className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 mt-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-xs font-medium text-gray-600">
                  {filteredReports.length} incidente
                  {filteredReports.length !== 1 ? "s" : ""} mostrado
                  {filteredReports.length !== 1 ? "s" : ""}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isMobile && !isEnabled && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 left-4 z-50 p-3 border border-gray-300 text-gray-600 rounded-xl shadow-lg bg-white/90 backdrop-blur-sm hover:bg-white transition-all"
          onClick={handleBurgerMenu}
        >
          <Menu className="w-5 h-5" />
        </motion.button>
      )}
    </>
  );
}
