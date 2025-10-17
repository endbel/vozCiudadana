import "./index.css";
import Sidebar, { type Report } from "./components/sidebar/Sidebar";
import Map from "./components/map/Map";
import { useEffect, useState, useMemo } from "react";
import { calculateAge } from "./lib/calculateAge";
import { compressImage } from "./lib/compressUpload";
import { fileToDataURL } from "./lib/fileUtils";
import FechaDeNacimiento from "./components/auth/FechaDeNacimiento";
import ReportarIncidencia from "./components/modals/ReportarIncidencia";
import DetalleIncidencia from "./components/modals/DetalleIncidencia";
import StepCards from "./components/Steps";
import { UseNavigator } from "./hooks/useNavigator";
import { latLng, type LatLngExpression } from "leaflet";
import LoadingSpinner from "./components/loading/LoadinSpinner";
import NotFound from "./components/notFound/NotFound";
import { createReport, getReportsByZone } from "./lib/api/reports";

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
        const [lat, long] = locationFormated as [number, number];
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

        // Calcular el tamaño total del payload
        const payloadSize = new Blob([JSON.stringify(reportData)]).size;
        console.log(
          `Tamaño del payload: ${payloadSize} bytes (${(
            payloadSize / 1024
          ).toFixed(2)} KB)`
        );

        await createReport(reportData);

        // Recargar reportes desde la base de datos para obtener los datos actualizados
        const [lat, long] = locationFormated as [number, number];
        const updatedReports = await getReportsByZone(lat, long);
        setReports(updatedReports);

        // Cerrar el modal
        setIsModalCreateOpen(false);
      } catch (error) {
        console.error("Error procesando el reporte:", error);
        // Aquí puedes agregar una notificación de error al usuario
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
      {/* Botón para mostrar tutorial
      <button
        onClick={() => setShowTutorial(true)}
        className="absolute top-4 left-4 z-10 w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors"
      >
        <span className="text-lg font-medium">?</span>
      </button> */}
      {/* Contenido principal */}
      {/* <div className="flex-1 flex items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-800">La Voz Ciudadana</h1>
        </div> */}
      {/* StepCards superpuesto cuando showTutorial es true */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50">
          <div className="max-w-lg w-full mx-4">
            <StepCards onClose={() => setShowTutorial(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
