import "./index.css";
import Sidebar from "./components/sidebar/Sidebar";
import Map from "./components/map/Map";
// import StepCards from "./components/steps"

function App() {
  return (
    <div className="w-screen h-screen flex">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar />

      {/* Mapa ocupa el resto del espacio */}
      <div className="flex-1 relative">
        <Map className="w-full h-full" />
      </div>

      {/* <div>
        <StepCards />
      </div> */}
    </div>
  );
}

export default App;
