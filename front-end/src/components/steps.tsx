import { useState } from "react";

const steps = [
  {
    title: "¡Bienvenido!",
    content:
      "Esta aplicación te permite reportar incidentes en tu comunidad de forma anónima y ver los reportados por otros usuarios.",
    tip: "Consejo: No necesitas crear una cuenta para usar la app",
  },
  // ...otros pasos
];

export default function StepCards() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl aspect-square flex flex-col rounded-md">
        {/* Header */}
        <header className="bg-blue-600 text-white px-8 py-4 text-base font-medium rounded-t-xl">
          Tutorial {currentStep + 1} de {steps.length}
        </header>

        {/* Main */}
        <main className="flex-1 p-10 space-y-6 flex flex-col justify-center items-center">
            <div className="text-[8rem] mb-4 animate-bounce">
                👋
            </div>
          <h1 className="text-2xl font-bold text-gray-800">
            {steps[currentStep].title}
          </h1>
          <p className="text-gray-700 leading-relaxed">
            {steps[currentStep].content}
          </p>
          <p className="text-sm text-gray-600 italic border-l-4 border-blue-500 pl-3">
            {steps[currentStep].tip}
          </p>
        </main>

        {/* Footer */}
        <footer className="flex justify-between items-center px-10 py-6 bg-gray-50 border-t rounded-b-xl">
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
