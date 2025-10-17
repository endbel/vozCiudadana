import { useState } from "react";

interface ReportarIncidenciaProps {
  onClose: () => void;
  onSubmit?: (report: {title: string, description: string, category: string, image: File | null}) => void;
}

const categorias = [
  "Bache",
  "Alumbrado",
  "Graffiti",
  "Accidente",
  "Inundación",
  "Basura",
  "Árbol caído",
  "Otro",
];

export default function ReportarIncidencia({ onClose, onSubmit }: ReportarIncidenciaProps) {
  const [categoria, setCategoria] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [image, setImage] = useState<File | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({title: titulo, description: descripcion, category: categoria, image});
    }
    onClose(); // Cerrar modal después de enviar
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
          Reportar Incidente
        </h2>
        <div className="overflow-y-auto pr-4 -mr-4">
          <div className="mb-6">
            <div className="rounded-xl bg-blue-50 border border-blue-200 px-5 py-3 flex flex-col">
              <span className="text-blue-700 font-semibold text-base">
                📍 Ubicación seleccionada:
              </span>
              <span className="text-blue-800 text-sm mt-1 font-mono">
                40.416800, -3.703800
              </span>
            </div>
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="font-semibold text-gray-700">
              Categoría <span className="text-red-500">*</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-7">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`border rounded-lg py-2 px-2 font-semibold text-sm transition-all focus:outline-none shadow-sm ${
                    categoria === cat
                      ? "bg-blue-100 border-blue-600 text-blue-700 ring-2 ring-blue-200"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50"
                  }`}
                  onClick={() => setCategoria(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="font-semibold text-gray-700">
              Título <span className="text-red-500">*</span>
            </div>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-400 bg-gray-50"
              placeholder="Ej: Bache en avenida principal"
              required
            />
            
            <div>
              <div className="font-semibold text-gray-700 mb-2">
                Descripción <span className="text-red-500">*</span>
              </div>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                maxLength={200}
                className="w-full h-24 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-400 bg-gray-50 resize-none"
                placeholder="Añade detalles adicionales sobre el incidente..."
                required
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {descripcion.length} / 200
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-bold text-lg shadow-md mt-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
              disabled={!categoria || !titulo || !descripcion}
            >
              Enviar
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}