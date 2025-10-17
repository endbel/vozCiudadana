import { useEffect, useState } from "react";
type LocationState = {
  lat: number | null;
  long: number | null;
};

export const UseNavigator = () => {
  const [location, setLocation] = useState<LocationState>({
    lat: null,
    long: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPosition = () => {
    if (!navigator.geolocation) {
      setError("Geolocalización no soportada por este navegador.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position.coords);

        setLocation({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
        setError(null);
        setLoading(false);
      },
      (geoError) => {
        if (loading) setLoading(false);
        setError(geoError.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000, // 10 segundos para obtener la ubicación
        maximumAge: 0, // No usar caché de posiciones anteriores
      }
    );
  };

  useEffect(() => {
    fetchPosition();

    const intervalId = setInterval(fetchPosition, 300000); // Actualiza cada 300 segundos
    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar
  }, []);

  return { location, error, loading };
};
