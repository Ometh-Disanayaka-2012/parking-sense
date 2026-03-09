import MapView from "./components/MapView";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

function App() {
  return (
    <div>
      <h2>ParkSense 🚗</h2>
      <MapView />
    </div>
  );
}

export default App;