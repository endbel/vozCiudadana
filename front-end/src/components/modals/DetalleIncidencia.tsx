import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Incident = {
  category: string;
  title: string;
  reportedAt: string;
  location: string;
  description: string;
  images?: string[]; // URLs de las imágenes
};

type DetalleIncidenciaProps = {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident | null;
};


const DetalleIncidencia: React.FC<DetalleIncidenciaProps> = ({ isOpen, onClose, incident }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !incident) {
    return null;
  }

  // Imágenes de ejemplo si no hay imágenes proporcionadas
  const images = incident.images || [
    '/api/placeholder/400/300',
    '/api/placeholder/400/300',
    '/api/placeholder/400/300'
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50 p-4"
      onClick={onClose}
    >
      <main 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-fade-in flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute left-1/2 -top-7 -translate-x-1/2 bg-neutral-900 text-white rounded-full w-11 h-11 flex items-center justify-center text-2xl shadow-lg hover:bg-neutral-700 transition focus:outline-none border-4 border-white"
          aria-label="Cerrar"
        >
          &times;
        </button>
        <h2 className="text-center text-3xl font-extrabold mb-7 mt-2 text-gray-800 tracking-tight flex-shrink-0">
          Detalles del Incidente
        </h2>
        
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Categoría y Título */}
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{incident.category}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{incident.title}</p>
          </div>

          <div className="border-t border-gray-200"></div>

          {/* Ubicación y Reportado lado a lado */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-pink-600 text-lg">📍</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ubicación</p>
                <p className="text-sm text-gray-800 font-medium font-mono">{incident.location}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-lg">📅</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Reportado</p>
                <p className="text-sm text-gray-800 font-medium">{incident.reportedAt}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200"></div>

          {/* Descripción */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Descripción</h3>
            <p className="text-gray-600 text-base">{incident.description}</p>
          </div>

          {/* Carrusel de imágenes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Imágenes</h3>
            <div className="relative">
              {/* Imagen principal */}
              <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={images[currentImageIndex]} 
                  alt={`Imagen ${currentImageIndex + 1} del incidente`}
                  className="w-full h-full object-cover"
                />
                
                {/* Botones de navegación */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Contador de imágenes */}
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex space-x-2 mt-3 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex 
                          ? 'border-blue-500' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetalleIncidencia;