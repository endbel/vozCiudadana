import L from "leaflet";

export const MapIcon = (color: string = "#EF4444"): L.DivIcon => {
  const tailwindClass = `
    <div class="w-9 h-9 bg-red-600 text-white rounded-full border-2 shadow-xl flex items-center justify-center" style="border-color: ${color}">
      📍
    </div>
  `;

  return L.divIcon({
    html: tailwindClass,
    className: "custom-leaflet-icon",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};
