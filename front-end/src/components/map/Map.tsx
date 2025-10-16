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
import { useState } from "react";

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

interface MapProps {
  center?: LatLngExpression;
  zoom?: number;
  className?: string;
}

// Componente para manejar marcadores dinámicos según zoom
function DynamicMarkers({ markers }: { markers: MarkerData[] }) {
  const [currentZoom, setCurrentZoom] = useState(13);

  useMapEvents({
    zoomend: (e) => {
      setCurrentZoom(e.target.getZoom());
    },
  });

  return (
    <>
      {markers
        .filter((marker) => currentZoom >= (marker.minZoom || 0))
        .map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            icon={MapIcon(marker.color)}
          >
            <Popup>{marker.popup}</Popup>
          </Marker>
        ))}
    </>
  );
}

const makersPrueba: MarkerData[] = [
  {
    position: [19.4326, -99.1332] as LatLngExpression,
    popup: "Ciudad de México",
    color: "#EF4444",
    minZoom: 15, // Se ve solo con zoom >= 10
  },
  {
    position: [34.0522, -118.2437] as LatLngExpression,
    popup: "Los Ángeles",
    color: "#3B82F6",
    minZoom: 15, // Se ve solo con zoom >= 8
  },
  {
    position: [40.7128, -74.006] as LatLngExpression,
    popup: "Nueva York",
    color: "#10B981",
    minZoom: 15, // Se ve solo con zoom >= 12
  },
];

export default function Map({
  center = [19.4326, -99.1332],
  zoom = 13,
  className = "w-full h-full",
}: MapProps) {
  return (
    <div className={className}>
      <MapContainer
        center={center}
        className="h-full w-full"
        scrollWheelZoom={true}
        zoom={zoom}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DynamicMarkers markers={makersPrueba} />
      </MapContainer>
    </div>
  );
}
