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

export default function StepCards() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  if (!showTutorial) return null;

  return (
    <div className="flex justify-center items-center bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg aspect-square flex flex-col rounded-md">
        {/* Header */}
        <header className="bg-blue-600 text-white px-8 py-4 text-base font-medium rounded-t-xl flex justify-between items-center">
          <span>
            Tutorial {currentStep + 1} de {steps.length}
          </span>
          <button
            onClick={() => setShowTutorial(false)}
            className="text-white text-xl font-bold hover:text-gray-200 transition"
          >
            ×
          </button>
        </header>

        {/* Main */}
        <main className="flex-1 p-10 space-y-6 flex flex-col justify-center items-center">
          <div className="text-[8rem] mb-4 animate-bounce">
            {steps[currentStep].image}
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            {steps[currentStep].title}
          </h1>
          <p className="text-gray-700 leading-relaxed text-center">
            {steps[currentStep].content}
          </p>
          <p className="text-md text-gray-600 italic border-l-4 border-blue-500 pl-3">
            {steps[currentStep].tip}
          </p>
        </main>

        {/* Footer */}
        <footer className="flex justify-between items-center px-10 py-6 bg-gray-50 rounded-b-xl">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
          >
            Anterior
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
          </button>
        </footer>
      </div>
    </div>
  );
}
