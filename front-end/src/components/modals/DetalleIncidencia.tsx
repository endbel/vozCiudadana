import React from 'react';

type IncidentStatus = 'Pendiente' | 'En Progreso' | 'Resuelto';

type Incident = {
  category: string;
  title: string;
  status: IncidentStatus;
  reportedAt: string;
  location: string;
  description: string;
};

type DetalleIncidenciaProps = {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident | null;
};

const statusStyles: Record<IncidentStatus, string> = {
  'Pendiente': 'bg-yellow-100 text-yellow-800',
  'En Progreso': 'bg-blue-100 text-blue-800',
  'Resuelto': 'bg-green-100 text-green-800',
};


const DetalleIncidencia: React.FC<DetalleIncidenciaProps> = ({ isOpen, onClose, incident }) => {
  if (!isOpen || !incident) {
    return null;
  }

  const badgeClasses = statusStyles[incident.status] || 'bg-gray-100 text-gray-800';

  return (
    <div
      className="fixed inset-0 bg-black/50 bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md relative animate-fade-in-up p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Detalles del Incidente</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors text-3xl font-light leading-none">
            &times;
          </button>
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{incident.category}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{incident.title}</p>
            <span className={`inline-block mt-4 px-3 py-1 text-sm font-medium rounded-full ${badgeClasses}`}>
              {incident.status}
            </span>
          </div>
          <div className="border-t border-gray-200"></div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <span className="text-xl mt-0.5">📅</span>
              <div>
                <p className="text-sm text-gray-600">Reportado</p>
                <p className="text-sm text-gray-800 font-medium">{incident.reportedAt}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl mt-0.5">📍</span>
              <div>
                <p className="text-sm text-gray-600">Ubicación</p>
                <p className="text-sm text-gray-800 font-medium font-mono">{incident.location}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200"></div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Descripción</h3>
            <p className="text-gray-600 text-base">{incident.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleIncidencia;