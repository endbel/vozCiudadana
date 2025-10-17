import type { LatLngExpression } from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { toast, Toaster } from "sonner";
import FechaDeNacimiento from "./components/auth/FechaDeNacimiento";
import LoadingSpinner from "./components/loading/LoadinSpinner";
import Map from "./components/map/Map";
import DetalleIncidencia from "./components/modals/DetalleIncidencia";
import ReportarIncidencia from "./components/modals/ReportarIncidencia";
import NotFound from "./components/notFound/NotFound";
import Sidebar, { type Report } from "./components/sidebar/Sidebar";
import StepCards from "./components/steps";
import { UseNavigator } from "./hooks/useNavigator";
import "./index.css";
import { createReport, getReportsByZone } from "./lib/api/reports";
import { calculateAge } from "./lib/calculateAge";
import { compressImage } from "./lib/compressUpload";
import { fileToDataURL } from "./lib/fileUtils";

export interface CreateReportForm {
  title: string;
  description: string;
  category: string;
  images: File[];
  lat?: number;
  long?: number;
}

function App() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [age, setAge] = useState<number | null>(null);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const { location, error, loading } = UseNavigator();

  // Estabilizar la ubicación para evitar remontajes del mapa
  const locationFormated = useMemo(() => {
    // Ubicación por defecto (Ciudad de Formosa - Argentina)
    const defaultLocation: LatLngExpression = [-26.080199, -58.277251];

    try {
      // Solo usar la ubicación del GPS si está disponible y es válida
      if (
        location &&
        typeof location.lat === "number" &&
        typeof location.long === "number" &&
        !isNaN(location.lat) &&
        !isNaN(location.long)
      ) {
        return [location.lat, location.long] as LatLngExpression;
      }

      return defaultLocation;
    } catch (err) {
      console.warn("Error processing location, using default:", err);
      return defaultLocation;
    }
  }, [location]);

  useEffect(() => {
    const storedBirthDate = localStorage.getItem("userBirthDate");
    if (storedBirthDate) {
      setAge(calculateAge(storedBirthDate));
    }
  }, []);

  // Efecto separado para cargar reportes basado en la ubicación
  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Usar la ubicación formateada que ya maneja los defaults
        // const [lat, long] = locationFormated as [number, number];
        const res = await getReportsByZone(
          -26.080103959386527,
          -58.27712643314597
        );
        setReports(res);
      } catch (error) {
        console.error("Error fetching reports by zone:", error);
      }
    };

    // Solo cargar reportes si tenemos una ubicación válida
    if (locationFormated) {
      fetchReports();
    }
  }, [locationFormated]); // Se ejecuta cuando cambia la ubicación

  // Solo mostrar loading en la primera carga
  if (loading && !location) {
    return <LoadingSpinner />;
  }

  // Solo mostrar error si es crítico y no hay ubicación de respaldo
  if (error && !location && !loading) {
    console.error("Critical location error:", error);
    return <NotFound />;
  }

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
    console.log("Report seleccionado:", report);
  };

  const handleSubmit = async (reportForm: CreateReportForm) => {
    if (reportForm) {
      try {
        // Comprimir todas las imágenes antes de crear el reporte
        const compressedImages = await Promise.all(
          reportForm.images.map(async (image) => {
            try {
              return await compressImage(image);
            } catch (error) {
              console.warn(`Error comprimiendo imagen ${image.name}:`, error);
              // Si falla la compresión, usar la imagen original
              return image;
            }
          })
        );

        // Convertir las imágenes comprimidas a Data URLs para el backend
        const imageDataUrls = await Promise.all(
          compressedImages.map(async (image) => {
            try {
              return await fileToDataURL(image);
            } catch (error) {
              console.warn(
                `Error convirtiendo imagen ${image.name} a DataURL:`,
                error
              );
              throw error;
            }
          })
        );

        // Preparar datos para el backend
        console.log(reportForm);

        const reportData = {
          title: reportForm.title,
          description: reportForm.description,
          category: reportForm.category,
          lat: -26.080103959386527,
          long: -58.27712643314597,
          images: imageDataUrls, // Usar las Data URLs
        };

        await createReport(reportData);

        // Recargar reportes desde la base de datos para obtener los datos actualizados
        const [lat, long] = locationFormated as [number, number];
        const updatedReports = await getReportsByZone(lat, long);
        setReports(updatedReports);

        // Mostrar éxito y cerrar modal
        toast.success("¡Reporte creado exitosamente!", {
          description: "Tu reporte ha sido enviado y está siendo procesado.",
        });
        setIsModalCreateOpen(false);
      } catch {
        // Extraer mensaje de error del backend
        const errorMessage =
          "Error desconocido al crear el reporte, revisa el contenido enviado.";

        // Mostrar toast de error con mensaje descriptivo
        toast.error("Error al crear el reporte", {
          description: errorMessage,
          duration: 5000,
        });
      }
    }
  };

  if (!age) {
    return (
      <FechaDeNacimiento
        onDateSelect={(date) => {
          localStorage.setItem("userBirthDate", date);
          setAge(calculateAge(date));
        }}
      />
    );
  }

  return (
    <div className="w-screen h-screen flex relative">
      <Sidebar
        onTutorialToggle={setShowTutorial}
        onOpenModal={() => setIsModalCreateOpen(!isModalCreateOpen)}
        reports={reports}
        onReportClick={handleReportClick}
      />
      {/* Mapa ocupa el resto del espacio */}
      <div className="flex-1 relative z-0">
        <Map
          className="w-full h-full"
          center={locationFormated}
          reports={reports}
        />
      </div>
      {/* <div>
        <StepCards />
      </div> */}
      {/* Modal para crear reportes */}
      {isModalCreateOpen && (
        <ReportarIncidencia
          onClose={() => setIsModalCreateOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
      {/* Modal para ver detalles */}
      {isDetailModalOpen && selectedReport && (
        <DetalleIncidencia
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedReport(null);
          }}
          incident={{
            category: selectedReport.category,
            title: selectedReport.title,
            reportedAt: selectedReport.date,
            location:
              selectedReport.lat?.toString() +
              " / " +
              selectedReport.long?.toString(), // Valor por defecto
            description: selectedReport.description,
          }}
          images={
            selectedReport.images && Array.isArray(selectedReport.images)
              ? selectedReport.images.map((img) =>
                  typeof img === "string" ? img : URL.createObjectURL(img)
                )
              : []
          }
        />
      )}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50">
          <div className="max-w-lg w-full mx-4">
            <StepCards onClose={() => setShowTutorial(false)} />
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <Toaster position="top-right" richColors expand={true} duration={4000} />
    </div>
  );
}

export default App;
