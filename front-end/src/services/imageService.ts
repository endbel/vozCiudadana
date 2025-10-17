import imageCompression from "browser-image-compression";
import { IMAGE_CONFIG } from "../config/constants";

export class ImageService {
  /**
   * Comprime una imagen individual
   */
  static async compressImage(file: File): Promise<File> {
    const options = {
      maxSizeMB: IMAGE_CONFIG.maxSizeMB,
      maxWidthOrHeight: IMAGE_CONFIG.maxWidthOrHeight,
      useWebWorker: true,
      initialQuality: IMAGE_CONFIG.quality,
      fileType: IMAGE_CONFIG.fileType,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      console.log(
        `Imagen comprimida: ${file.size} bytes -> ${compressedFile.size} bytes`
      );
      return compressedFile;
    } catch (error) {
      console.error("Error al comprimir la imagen:", error);
      throw error;
    }
  }

  /**
   * Comprime múltiples imágenes
   */
  static async compressImages(files: File[]): Promise<File[]> {
    return Promise.all(
      files.map(async (file) => {
        try {
          return await this.compressImage(file);
        } catch (error) {
          console.warn(`Error comprimiendo imagen ${file.name}:`, error);
          // Si falla la compresión, usar la imagen original
          return file;
        }
      })
    );
  }

  /**
   * Convierte un archivo a Data URL
   */
  static fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Convierte múltiples archivos a Data URLs
   */
  static async filesToDataURLs(files: File[]): Promise<string[]> {
    return Promise.all(
      files.map(async (file) => {
        try {
          return await this.fileToDataURL(file);
        } catch (error) {
          console.warn(
            `Error convirtiendo imagen ${file.name} a DataURL:`,
            error
          );
          throw error;
        }
      })
    );
  }

  /**
   * Proceso completo: comprimir y convertir a Data URLs
   */
  static async processImages(files: File[]): Promise<string[]> {
    // Primero comprimir las imágenes
    const compressedImages = await this.compressImages(files);

    // Luego convertir a Data URLs
    const imageDataUrls = await this.filesToDataURLs(compressedImages);

    return imageDataUrls;
  }

  /**
   * Valida si el archivo es una imagen válida
   */
  static validateImageFile(file: File): { valid: boolean; error?: string } {
    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      return { valid: false, error: `${file.name} no es una imagen válida` };
    }

    // Validar tamaño (máximo 5MB por imagen)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `${file.name} es muy grande. Máximo 5MB por imagen`,
      };
    }

    return { valid: true };
  }

  /**
   * Valida múltiples archivos de imagen
   */
  static validateImageFiles(
    files: File[],
    currentCount: number = 0
  ): {
    valid: boolean;
    validFiles: File[];
    errors: string[];
  } {
    const errors: string[] = [];
    const validFiles: File[] = [];

    // Validar que no se excedan el máximo de imágenes
    const totalImages = currentCount + files.length;
    if (totalImages > IMAGE_CONFIG.maxFiles) {
      errors.push(
        `Solo puedes subir un máximo de ${IMAGE_CONFIG.maxFiles} imágenes`
      );
      return { valid: false, validFiles: [], errors };
    }

    // Validar cada archivo individualmente
    files.forEach((file) => {
      const validation = this.validateImageFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else if (validation.error) {
        errors.push(validation.error);
      }
    });

    return {
      valid: errors.length === 0,
      validFiles,
      errors,
    };
  }
}
