import "./index.css";
import Sidebar from "./components/sidebar/Sidebar";
import Map from "./components/map/Map";
import { useEffect, useState } from "react";
import { calculateAge } from "./lib/calculateAge";
// import StepCards from "./components/steps"

function App() {
  const [birthDate, setBirthDate] = useState<string | null>(null);
  const [age, setAge] = useState<number | null>(null);

  useEffect(() => {
    const storedBirthDate = localStorage.getItem("userBirthDate");
    if (storedBirthDate) {
      setBirthDate(storedBirthDate);
      setAge(calculateAge(storedBirthDate));
    }
  }, [birthDate]);

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
