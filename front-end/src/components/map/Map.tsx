import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapIcon } from "./MapIcon";
import { useState, useRef, useEffect } from "react";
import type { Report } from "../sidebar/Sidebar";

interface MarkerData {
  position: LatLngExpression;
  popup: string;
  color: string;
  minZoom?: number; // Zoom mínimo para mostrar el marcador
}

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Crear el ícono por defecto para el marcador "Yo"
const defaultIcon = new L.Icon.Default();

interface MapProps {
  center: LatLngExpression;
  zoom?: number;
  className?: string;
  reports: Report[];
}

// Componente para manejar marcadores dinámicos según zoom
function DynamicMarkers({ markers }: { markers: MarkerData[] }) {
  const [currentZoom, setCurrentZoom] = useState(15);
  const isMountedRef = useRef(true);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Limpiar el mapa cuando el componente se desmonte
      if (mapRef.current) {
        try {
          mapRef.current.off();
          mapRef.current = null;
        } catch (error) {
          console.warn("Error cleaning up map events:", error);
        }
      }
    };
  }, []);

  const map = useMapEvents({
    zoomend: (e) => {
      // Solo actualizar si el componente sigue montado
      if (isMountedRef.current) {
        setCurrentZoom(e.target.getZoom());
      }
    },
  });

  // Guardar referencia del mapa para limpieza
  useEffect(() => {
    if (map && isMountedRef.current) {
      mapRef.current = map;
    }
  }, [map]);

  return (
    <>
      {markers
        .filter((marker) => currentZoom >= (marker.minZoom || 0))
        .map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            icon={marker.popup === "Yo" ? defaultIcon : MapIcon(marker.color)}
          >
            <Popup>{marker.popup}</Popup>
          </Marker>
        ))}
    </>
  );
}

export default function Map({
  center,
  zoom = 16,
  className = "w-full h-full",
  reports,
}: MapProps) {
  const formatedData: MarkerData[] = reports.map((report) => ({
    position: [report.lat, report.long] as LatLngExpression,
    popup: report.title,
    color: "#EF4444",
    minZoom: 15,
  }));
  return (
    <div className={className}>
      <MapContainer
        key="main-map" // Clave estable para evitar remontajes
        center={center}
        className="h-full w-full"
        scrollWheelZoom={true}
        zoom={zoom}
        whenReady={() => {
          // Callback cuando el mapa está listo
          console.log("Map is ready");
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DynamicMarkers
          markers={[
            ...formatedData,
            {
              position: [-26.080103959386527, -58.27712643314597],
              popup: "Yo",
              color: "#EF4444",
              minZoom: 15,
            },
          ]}
        />
      </MapContainer>
    </div>
  );
}
