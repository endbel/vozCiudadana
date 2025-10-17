import { useState } from "react";

const steps = [
  {
    title: "¡Bienvenido!",
    content:
      "Esta aplicación te permite reportar incidentes en tu comunidad de forma anónima y ver los reportados por otros usuarios.",
    image: "👋",
    tip: "Consejo: No necesitas crear una cuenta para usar la app",
  },
  {
    title: "Explora el mapa",
    content:
      "El mapa muestra todos los incidentes reportados. Puedes arrastrarlo con el mouse o dedo, y hacer zoom con la rueda del mouse o pellizcar.",
    image: "🗺️",
    tip: "Usa los botones +, - y Reset para controlar el zoom",
  },
  {
    title: "Ver Incidentes",
    content:
      "Haz clic en cualquier marcador del mapa o en un incidente de la lista lateral para ver sus detalles completos.",
    image: "👀",
    tip: "Los colores indican diferentes categorías",
  },
  {
    title: "Filtrar Incidentes",
    content:
      "Usa los filtros de categoría y estado en la barra lateral para encontrar incidentes específicos.",
    image: "🔍",
    tip: "Combina filtros para búsquedas más precisas",
  },
  {
    title: "Reportar un Incidente",
    content:
      "Haz clic en cualquier lugar del mapa o presiona el botón + en la esquina superior de la barra lateral.",
    image: "📍",
    tip: "La ubicación se marcará automáticamente",
  },
  {
    title: "Completar el Formulario",
    content:
      'Selecciona una categoría, escribe un título descriptivo y añade detalles del incidente. Luego presiona "Reportar".',
    image: "📝",
    tip: "Sé específico para ayudar a resolver el problema",
  },
  {
    title: "¡Listo para Empezar!",
    content:
      "Ya estás preparado para usar la aplicación. Tu reporte ayudará a mejorar la comunidad.",
    image: "✅",
    tip: "En móvil, usa el menú hamburguesa para acceder a la lista",
  },
];

interface StepCardsProps {
  onClose: () => void;
}

interface StepCardsProps {
  onClose: () => void;
}

export default function StepCards({ onClose }: StepCardsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  // Removed unused showTutorial state

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Si es el último paso, cerrar el tutorial
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  // Removed unused showTutorial check

  return (
    <div className="flex justify-center items-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg h-[500px] flex flex-col">
        {/* Header */}
        <header className="bg-blue-600 text-white px-8 py-4 text-base font-medium rounded-t-xl flex justify-between items-center">
          <span>
            Tutorial {currentStep + 1} de {steps.length}
          </span>
          <button
            onClick={onClose}
            className="text-white text-xl font-bold hover:text-gray-200 transition"
          >
            ×
          </button>
        </header>

        {/* section */}
        <section className="flex-1 p-8 flex flex-col justify-between items-center min-h-0">
          <div className="flex flex-col items-center space-y-4 flex-1 justify-center">
            <div className="text-6xl mb-2 animate-bounce">
              {steps[currentStep].image}
            </div>
            <h1 className="text-xl font-bold text-gray-800 text-center">
              {steps[currentStep].title}
            </h1>
            <p className="text-gray-700 leading-relaxed text-center text-sm line-clamp-4 overflow-hidden">
              {steps[currentStep].content}
            </p>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 italic border-l-4 border-blue-500 pl-3 text-center">
              {steps[currentStep].tip}
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="flex justify-between items-center px-8 py-4 bg-gray-50 rounded-b-xl">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
          >
            Anterior
          </button>
          <button
            onClick={nextStep}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            {currentStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
          </button>
        </footer>
      </div>
    </div>
  );
}
