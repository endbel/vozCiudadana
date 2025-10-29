import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  MapPin,
  X,
} from "lucide-react";
import React, { useState } from "react";

type Incident = {
  category: string;
  title: string;
  reportedAt: string;
  location: string;
  description: string;
  images?: string[];
};

type DetalleIncidenciaProps = {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident | null;
};

const DetalleIncidencia: React.FC<DetalleIncidenciaProps> = ({
  isOpen,
  onClose,
  incident,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  React.useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
    }
  }, [isOpen, incident]);

  if (!isOpen || !incident) {
    return null;
  }

  const validImages =
    incident.images?.filter((img) => img && img.trim() !== "") || [];
  const hasImages = validImages.length > 0;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + validImages.length) % validImages.length
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.main
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="absolute -top-4 -right-4 bg-red-500 hover:bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-colors border-4 border-white z-10"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </motion.button>

          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center text-3xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
          >
            Detalles del Incidente
          </motion.h2>

          <div className="flex-1 overflow-y-auto pr-2 space-y-5">
            {/* Categoría y Título */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100"
            >
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                {incident.category}
              </p>
              <p className="text-xl font-bold text-gray-900">
                {incident.title}
              </p>
            </motion.div>

            {/* Ubicación y Reportado */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-3"
            >
              <div className="bg-pink-50 rounded-xl p-3 border border-pink-100">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-pink-600" />
                  <p className="text-xs font-semibold text-pink-700">
                    Ubicación
                  </p>
                </div>
                <p className="text-xs text-gray-700 font-mono">
                  {incident.location}
                </p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <p className="text-xs font-semibold text-blue-700">
                    Reportado
                  </p>
                </div>
                <p className="text-xs text-gray-700 font-medium">
                  {incident.reportedAt}
                </p>
              </div>
            </motion.div>

            {/* Descripción */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="bg-gray-50 rounded-2xl p-4 border border-gray-200"
            >
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-gray-700" />
                <h3 className="text-base font-bold text-gray-800">
                  Descripción
                </h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {incident.description}
              </p>
            </motion.div>

            {/* Carrusel de imágenes */}
            {hasImages && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                  🖼️ Imágenes
                </h3>
                <div className="relative">
                  {/* Imagen principal */}
                  <div className="relative w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={validImages[currentImageIndex]}
                      alt={`Imagen ${currentImageIndex + 1} del incidente`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y0ZjRmNCIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pgo8L3N2Zz4K";
                      }}
                    />

                    {/* Botones de navegación */}
                    {validImages.length > 1 && (
                      <>
                        <motion.button
                          onClick={prevImage}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          onClick={nextImage}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </motion.button>
                      </>
                    )}

                    {/* Contador de imágenes */}
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full font-semibold">
                      {currentImageIndex + 1} / {validImages.length}
                    </div>
                  </div>

                  {/* Thumbnails */}
                  {validImages.length > 1 && (
                    <div className="flex space-x-2 mt-3 overflow-x-auto pb-2">
                      {validImages.map((image: string, index: number) => (
                        <motion.button
                          key={index}
                          onClick={() => goToImage(index)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shadow-sm ${
                            index === currentImageIndex
                              ? "border-blue-500 ring-2 ring-blue-300"
                              : "border-gray-300 hover:border-blue-400"
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZjRmNGY0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjgiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7inJg8L3RleHQ+PC9zdmc+";
                            }}
                          />
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.main>
      </motion.div>
    </AnimatePresence>
  );
};

export default DetalleIncidencia;
