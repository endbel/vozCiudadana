import type { LatLngExpression } from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { Toaster } from "sonner";
import FechaDeNacimiento from "./components/auth/FechaDeNacimiento";
import LoadingSpinner from "./components/loading/LoadinSpinner";
import Map from "./components/map/Map";
import DetalleIncidencia from "./components/modals/DetalleIncidencia";
import ReportarIncidencia from "./components/modals/ReportarIncidencia";
import NotFound from "./components/notFound/NotFound";
import Sidebar, { type Report } from "./components/sidebar/Sidebar";
import StepCards from "./components/Steps";
import { DEFAULT_LOCATION, APP_CONFIG } from "./config/constants";
import { useReports, type CreateReportForm } from "./hooks/useReports";
import { UseNavigator } from "./hooks/useNavigator";
import { calculateAge } from "./lib/calculateAge";
import "./index.css";

function App() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [age, setAge] = useState<number | null>(null);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Usar el hook personalizado para reportes
  const { reports, createNewReport } = useReports();
  const { location, error, loading } = UseNavigator();

  // Estabilizar la ubicación para evitar remontajes del mapa
  const locationFormated = useMemo(() => {
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

      return DEFAULT_LOCATION;
    } catch (err) {
      console.warn("Error processing location, using default:", err);
      return DEFAULT_LOCATION;
    }
  }, [location]);

  useEffect(() => {
    const storedBirthDate = localStorage.getItem(
      APP_CONFIG.storageKeys.userBirthDate
    );
    if (storedBirthDate) {
      setAge(calculateAge(storedBirthDate));
    }
  }, []);

  // Los reportes se cargan automáticamente en useReports hook

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
    const success = await createNewReport(reportForm);
    if (success) {
      setIsModalCreateOpen(false);
    }
  };

  if (!age) {
    return (
      <FechaDeNacimiento
        onDateSelect={(date) => {
          localStorage.setItem(APP_CONFIG.storageKeys.userBirthDate, date);
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
            images:
              selectedReport.images && Array.isArray(selectedReport.images)
                ? selectedReport.images.map((img) =>
                    typeof img === "string" ? img : URL.createObjectURL(img)
                  )
                : [],
          }}
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
