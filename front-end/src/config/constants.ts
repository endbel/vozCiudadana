import type { LatLngExpression } from "leaflet";

// Ubicaciones por defecto
export const DEFAULT_LOCATION: LatLngExpression = [-26.080199, -58.277251];
export const FIXED_LOCATION: LatLngExpression = [
  -26.080103959386527, -58.27712643314597,
];

// Configuración del mapa
export const MAP_DEFAULTS = {
  zoom: 16,
  radiusInMeters: 300,
  minZoom: 15,
};

// Categorías de reportes
export const CATEGORIES = [
  "Todas",
  "Bache",
  "Alumbrado",
  "Graffiti",
  "Accidente",
  "Inundación",
  "Basura",
  "Árbol caído",
  "Otro",
];

// Mapeo de categorías para el backend
export const CATEGORY_MAPPING = [
  { field: "Bache", label: "POTHOLE" },
  { field: "Alumbrado", label: "STREET_LIGHT" },
  { field: "Graffiti", label: "GRAFFITI" },
  { field: "Accidente", label: "ACCIDENT" },
  { field: "Inundación", label: "FLOOD" },
  { field: "Basura", label: "GARBAGE" },
  { field: "Árbol caído", label: "FALLEN_TREE" },
  { field: "Otro", label: "OTHER" },
];

// Configuración de imágenes
export const IMAGE_CONFIG = {
  maxFiles: 3,
  maxSizeMB: 0.3,
  maxWidthOrHeight: 1280,
  quality: 0.6,
  fileType: "image/jpeg" as const,
  acceptedTypes: "image/*",
};

// Límites de texto
export const TEXT_LIMITS = {
  description: 200,
  minAge: 13,
  maxAge: 120,
};

// Configuración de la aplicación
export const APP_CONFIG = {
  storageKeys: {
    userBirthDate: "userBirthDate",
    adminLoggedIn: "adminLoggedIn",
  },
  defaultCredentials: {
    email: "admin@voiciudadana.com",
    password: "admin123",
  },
  updateInterval: 300000, // 5 minutos en ms
};
