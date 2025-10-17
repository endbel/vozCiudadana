import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createReport, getReportsByZone } from "../lib/api/reports";
import { ImageService } from "../services/imageService";
import { Validators } from "../utils/validators";
import { FIXED_LOCATION } from "../config/constants";
import type { Report } from "../components/sidebar/Sidebar";

export interface CreateReportForm {
  title: string;
  description: string;
  category: string;
  images: File[];
  lat?: number;
  long?: number;
}

interface UseReportsReturn {
  reports: Report[];
  loading: boolean;
  error: string | null;
  fetchReports: (lat?: number, lng?: number) => Promise<void>;
  createNewReport: (reportForm: CreateReportForm) => Promise<boolean>;
  refreshReports: () => Promise<void>;
}

export function useReports(): UseReportsReturn {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtiene reportes por zona geográfica
   */
  const fetchReports = async (lat?: number, lng?: number) => {
    setLoading(true);
    setError(null);

    try {
      // Usar coordenadas proporcionadas o las fijas por defecto
      const [latitude, longitude] =
        lat && lng ? [lat, lng] : (FIXED_LOCATION as [number, number]);

      const fetchedReports = await getReportsByZone(latitude, longitude);
      setReports(fetchedReports);
    } catch (err) {
      const errorMessage = "Error al cargar los reportes";
      setError(errorMessage);
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Crea un nuevo reporte
   */
  const createNewReport = async (
    reportForm: CreateReportForm
  ): Promise<boolean> => {
    try {
      // Validar datos del formulario
      const validation = Validators.validateReportForm(reportForm);
      if (!validation.isValid) {
        toast.error("Errores en el formulario", {
          description: validation.errors.join(", "),
        });
        return false;
      }

      // Procesar imágenes (comprimir y convertir a Data URLs)
      let imageDataUrls: string[] = [];
      if (reportForm.images && reportForm.images.length > 0) {
        imageDataUrls = await ImageService.processImages(reportForm.images);
      }

      // Preparar datos para el backend
      const [lat, lng] = FIXED_LOCATION as [number, number];
      const reportData = {
        title: reportForm.title,
        description: reportForm.description,
        category: reportForm.category,
        lat,
        long: lng,
        images: imageDataUrls,
      };

      // Crear el reporte
      await createReport(reportData);

      // Recargar reportes para mostrar el nuevo
      await fetchReports(lat, lng);

      // Mostrar mensaje de éxito
      toast.success("¡Reporte creado exitosamente!", {
        description: "Tu reporte ha sido enviado y está siendo procesado.",
      });

      return true;
    } catch (err) {
      // Manejo de errores
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error desconocido al crear el reporte, revisa el contenido enviado.";

      toast.error("Error al crear el reporte", {
        description: errorMessage,
        duration: 5000,
      });

      console.error("Error creating report:", err);
      return false;
    }
  };

  /**
   * Recarga los reportes usando las coordenadas actuales
   */
  const refreshReports = async () => {
    const [lat, lng] = FIXED_LOCATION as [number, number];
    await fetchReports(lat, lng);
  };

  // Cargar reportes automáticamente al montar el hook
  useEffect(() => {
    const [lat, lng] = FIXED_LOCATION as [number, number];
    fetchReports(lat, lng);
  }, []);

  return {
    reports,
    loading,
    error,
    fetchReports,
    createNewReport,
    refreshReports,
  };
}
