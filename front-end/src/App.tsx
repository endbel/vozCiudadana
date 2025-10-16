import "./index.css";
import Sidebar from "./components/sidebar/Sidebar";
import Map from "./components/map/Map";

function App() {
  return (
    <div className="w-screen h-screen flex relative">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar />

      {/* Mapa ocupa el resto del espacio */}
      <div className="flex-1 relative z-0">
        <Map className="w-full h-full" />
      </div>
    </div>
  );
}

export default App;
