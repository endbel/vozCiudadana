import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Trash2, Upload, X } from "lucide-react";
import { useState } from "react";

interface ReportarIncidenciaProps {
  onClose: () => void;
  onSubmit?: (report: {
    title: string;
    description: string;
    category: string;
    images: File[];
  }) => void;
}

import {
  CATEGORY_MAPPING,
  IMAGE_CONFIG,
  TEXT_LIMITS,
} from "../../config/constants";
import { ImageService } from "../../services/imageService";

const categorias = CATEGORY_MAPPING;

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

    // Usar el servicio de validación de imágenes
    const validation = ImageService.validateImageFiles(files, images.length);

    if (!validation.valid) {
      // Mostrar errores
      validation.errors.forEach((error) => alert(error));
      return;
    }

    if (validation.validFiles.length === 0) return;

    // Crear previsualizaciones
    const newPreviews: string[] = [];
    validation.validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        if (newPreviews.length === validation.validFiles.length) {
          setImagesPreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setImages((prev) => [...prev, ...validation.validFiles]);
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
            Reportar Incidente
          </motion.h2>

          <div className="overflow-y-auto pr-2 space-y-5">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 px-5 py-4 flex items-center gap-3 shadow-sm"
            >
              <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-blue-700 font-semibold text-sm block">
                  Ubicación seleccionada
                </span>
                <span className="text-blue-900 text-xs font-mono">
                  40.416800, -3.703800
                </span>
              </div>
            </motion.div>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* Categoría */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <label className="font-semibold text-gray-700 text-sm mb-3 block">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categorias.map((cat) => (
                    <motion.button
                      key={cat.label}
                      type="button"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`border-2 rounded-xl py-2.5 px-3 font-semibold text-sm transition-all shadow-sm ${
                        categoria === cat.label
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 border-transparent text-white shadow-lg shadow-blue-500/30"
                          : "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                      onClick={() => setCategoria(cat.label)}
                    >
                      {cat.field}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Título */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <label className="font-semibold text-gray-700 text-sm mb-2 block">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 bg-gray-50 hover:bg-white transition-colors"
                  placeholder="Ej: Bache en avenida principal"
                  required
                />
              </motion.div>

              {/* Descripción */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <label className="font-semibold text-gray-700 text-sm mb-2 block">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  maxLength={TEXT_LIMITS.description}
                  className="w-full h-24 border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 bg-gray-50 hover:bg-white resize-none transition-colors"
                  placeholder="Añade detalles adicionales sobre el incidente..."
                  required
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {descripcion.length} / {TEXT_LIMITS.description}
                </div>
              </motion.div>

              {/* Sección de imágenes */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                <label className="font-semibold text-gray-700 text-sm mb-3 block">
                  Imágenes{" "}
                  <span className="text-gray-500 font-normal">
                    (Máximo 3 - Opcional)
                  </span>
                </label>

                {/* Vista previa de imágenes */}
                {imagesPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {imagesPreviews.map((preview, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="relative group"
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                        />
                        <motion.button
                          type="button"
                          onClick={() => removeImage(index)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors border-2 border-white"
                        >
                          <Trash2 className="w-3 h-3" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Input de archivos */}
                {images.length < IMAGE_CONFIG.maxFiles && (
                  <div className="relative">
                    <input
                      type="file"
                      id="images"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <motion.div
                      whileHover={{ scale: 1.02, borderColor: "#3b82f6" }}
                      className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-blue-50 transition-all cursor-pointer"
                    >
                      <Upload className="mx-auto w-10 h-10 text-gray-400 mb-2" />
                      <p className="text-sm font-semibold text-gray-700">
                        Haz clic para subir imágenes
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, JPEG hasta 5MB cada una
                      </p>
                      <p className="text-xs text-blue-600 font-medium mt-2">
                        {images.length}/{IMAGE_CONFIG.maxFiles} imágenes subidas
                      </p>
                    </motion.div>
                  </div>
                )}

                {images.length >= IMAGE_CONFIG.maxFiles && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl"
                  >
                    <p className="text-green-700 text-sm font-semibold">
                      ✓ Has alcanzado el límite máximo de{" "}
                      {IMAGE_CONFIG.maxFiles} imágenes
                    </p>
                  </motion.div>
                )}
              </motion.div>

              <motion.button
                type="submit"
                disabled={!categoria || !titulo || !descripcion}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
              >
                Enviar Reporte
              </motion.button>
            </form>
          </div>
        </motion.main>
      </motion.div>
    </AnimatePresence>
  );
}
