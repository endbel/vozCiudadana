import { useState } from "react";
import "./index.css";
import StepCards from "./components/steps";

function App() {
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <div className="w-screen h-screen flex relative bg-gray-100">
      {/* Botón para mostrar tutorial */}
      <button 
        onClick={() => setShowTutorial(true)}
        className="absolute top-4 left-4 z-10 w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors"
      >
        <span className="text-lg font-medium">?</span>
      </button>

      {/* Contenido principal */}
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800">La Voz Ciudadana</h1>
      </div>

      {/* StepCards superpuesto cuando showTutorial es true */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="max-w-lg w-full mx-4">
            <StepCards onClose={() => setShowTutorial(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
