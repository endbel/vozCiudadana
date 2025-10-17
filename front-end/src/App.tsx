import "./index.css";
import Sidebar from "./components/sidebar/Sidebar";
import Map from "./components/map/Map";
import { useEffect, useState } from "react";
import { calculateAge } from "./lib/calculateAge";
import FechaDeNacimiento from "./components/auth/FechaDeNacimiento";
// import StepCards from "./components/steps"

function App() {
  const [age, setAge] = useState<number | null>(null);

  useEffect(() => {
    const storedBirthDate = localStorage.getItem("userBirthDate");
    if (storedBirthDate) {
      setAge(calculateAge(storedBirthDate));
    }
  }, []);

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
      {/* Sidebar fijo a la izquierda */}
      <Sidebar />

      {/* Mapa ocupa el resto del espacio */}
      <div className="flex-1 relative z-0">
        <Map className="w-full h-full" />
      </div>

      {/* <div>
        <StepCards />
      </div> */}
    </div>
  );
}

export default App;
