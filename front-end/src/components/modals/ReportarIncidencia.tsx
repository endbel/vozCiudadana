import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ReportarIncidenciaProps {
  onClose: () => void;
  onSubmit?: (report: {
    title: string;
    description: string;
    category: string;
    images: File[];
  }) => void;
}

const categorias = [
  { field: "Bache", label: "POTHOLE" },
  { field: "Alumbrado", label: "STREET_LIGHT" },
  { field: "Graffiti", label: "GRAFFITI" },
  { field: "Accidente", label: "ACCIDENT" },
  { field: "Inundación", label: "FLOOD" },
  { field: "Basura", label: "GARBAGE" },
  { field: "Árbol caído", label: "FALLEN_TREE" },
  { field: "Otro", label: "OTHER" },
];

export default function ReportarIncidencia({
  onClose,
  onSubmit,
}: ReportarIncidenciaProps) {
  const [categoria, setCategoria] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validar que no se excedan 3 imágenes
    const totalImages = images.length + files.length;
    if (totalImages > 3) {
      alert("Solo puedes subir un máximo de 3 imágenes");
      return;
    }

    // Validar tipo de archivo (solo imágenes)
    const validFiles = files.filter((file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        alert(`${file.name} no es una imagen válida`);
      }
      return isImage;
    });

    // Validar tamaño (máximo 5MB por imagen)
    const validSizeFiles = validFiles.filter((file) => {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert(`${file.name} es muy grande. Máximo 5MB por imagen`);
        return false;
      }
      return true;
    });

    if (validSizeFiles.length === 0) return;

    // Crear previsualizaciones
    const newPreviews: string[] = [];
    validSizeFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        if (newPreviews.length === validSizeFiles.length) {
          setImagesPreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setImages((prev) => [...prev, ...validSizeFiles]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagesPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        title: titulo,
        description: descripcion,
        category: categoria,
        images,
      });
    }
    onClose(); // Cerrar modal después de enviar
  };

  return (
    <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"

      onClick={onClose}
    >
      <main //este es el contenedor principal del modal
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative flex flex-col max-h-[90vh] animate-modalFadeIn"

        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute left-1/2 -top-7 -translate-x-1/2 bg-neutral-900 text-white rounded-full w-11 h-11 flex items-center justify-center text-2xl shadow-lg hover:bg-neutral-700 transition focus:outline-none border-4 border-white"
          aria-label="Cerrar"
        >
          &times;
        </button>
        <h2 className="text-center text-3xl font-bold arial mb-7 mt-2 text-gray-800 tracking-tight flex-shrink-0 ">
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
                  key={cat.label}
                  type="button"
                  className={`border rounded-lg py-2 px-2 font-semibold text-sm transition-all focus:outline-none shadow-sm ${
                    categoria === cat.label
                      ? "bg-blue-100 border-blue-600 text-blue-700 ring-2 ring-blue-200"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50"
                  }`}
                  onClick={() => setCategoria(cat.label)}
                >
                  {cat.field}
                </button>
              ))}
            </div>
            <div className="font-semibold text-gray-700 ">
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

            {/* Sección de subida de imágenes */}
            <div>
              <div className="block mb-2 text-sm font-medium text-gray-700">
                Imágenes (Máximo 3){" "}
                <span className="text-gray-500">- Opcional</span>
              </div>

              {/* Vista previa de imágenes */}
              {imagesPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {imagesPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input de archivos */}
              {images.length < 3 && (
                <div className="relative">
                  <input
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                    <div className="text-gray-600">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400 mb-2"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="text-sm font-medium">
                        Haz clic para subir imágenes
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, JPEG hasta 5MB cada una
                      </p>
                      <p className="text-xs text-gray-500">
                        {images.length}/3 imágenes subidas
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {images.length >= 3 && (
                <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm font-medium">
                    ✓ Has alcanzado el límite máximo de 3 imágenes
                  </p>
                </div>
              )}
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
