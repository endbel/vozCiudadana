import imageCompression from "browser-image-compression";

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.3, // Reducido para evitar el límite del servidor
    maxWidthOrHeight: 1280, // Resolución menor para mejor compresión
    useWebWorker: true, // Usar Web Worker para no bloquear el hilo principal
    initialQuality: 0.6, // Calidad menor para mejor compresión
    fileType: "image/jpeg", // Formato consistente para mejor compresión
  };
  try {
    const compressedFile = await imageCompression(file, options);
    console.log(
      `Imagen comprimida: ${file.size} bytes -> ${compressedFile.size} bytes`
    );
    console.log("Tipo de archivo comprimido:", compressedFile instanceof File); // Verificación
    console.log("Propiedades del archivo:", {
      name: compressedFile.name,
      size: compressedFile.size,
      type: compressedFile.type,
    });
    return compressedFile;
  } catch (error) {
    console.error("Error al comprimir la imagen:", error);
    throw error;
  }
}
