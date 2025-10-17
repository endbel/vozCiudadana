import "./index.css";
import Sidebar, { type Report } from "./components/sidebar/Sidebar";
import Map from "./components/map/Map";
import { useEffect, useState } from "react";
import { calculateAge } from "./lib/calculateAge";
import FechaDeNacimiento from "./components/auth/FechaDeNacimiento";
import ReportarIncidencia from "./components/modals/ReportarIncidencia";
import DetalleIncidencia from "./components/modals/DetalleIncidencia";
// import StepCards from "./components/steps"

interface CreateReportForm {
  title: string;
  description: string;
  category: string;
  image: File | null;
}

function App() {
  const [age, setAge] = useState<number | null>(null);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reports, setReports] = useState<Report[]>([
    {
      id: "1",
      title: "Bache en la calle principal",
      description: "Hay un bache muy grande que puede dañar los vehículos",
      category: "Bache",
      date: "2024-01-15",
      image: null
    },
    {
      id: "2",
      title: "Alumbrado público dañado",
      description: "Las luces de la calle están apagadas desde hace una semana",
      category: "Alumbrado",
      date: "2024-01-14",
      image: null
    }
  ]);

  useEffect(() => {
    const storedBirthDate = localStorage.getItem("userBirthDate");
    if (storedBirthDate) {
      setAge(calculateAge(storedBirthDate));
    }
  }, []);

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
  };

  const handleSubmit = (reportForm: CreateReportForm) => {
    if (reportForm) {
      // Crear un nuevo reporte con ID y datos adicionales
      const newReport: Report = {
        id: Date.now().toString(),
        title: reportForm.title,
        description: reportForm.description,
        category: reportForm.category,
        date: new Date().toISOString().split('T')[0],
        image: reportForm.image
      };
      
      console.log("Reporte enviado:", newReport);
      
      // Agregar el reporte a la lista
      setReports([...reports, newReport]);
      
      // Cerrar el modal
      setIsModalCreateOpen(false);
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
        onOpenModal={() => setIsModalCreateOpen(!isModalCreateOpen)}
        reports={reports}
        onReportClick={handleReportClick}
      />

      {/* Mapa ocupa el resto del espacio */}
      <div className="flex-1 relative z-0">
        <Map className="w-full h-full" />
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
          onClose={() => setIsDetailModalOpen(false)}
          incident={{
            category: selectedReport.category,
            title: selectedReport.title,
            status: 'Pendiente' as const, // Valor por defecto
            reportedAt: selectedReport.date,
            location: "Ubicación no especificada", // Valor por defecto
            description: selectedReport.description
          }}
        />
      )}
    </div>
  );
}

export default App;
