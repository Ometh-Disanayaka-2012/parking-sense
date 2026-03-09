// src/components/MapView.tsx
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { ParkingSpot } from "../types";
import L from "leaflet";

// --------------------- Marker icon ---------------------
const greenIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

// --------------------- Center map ---------------------
const defaultCenter: [number, number] = [6.9271, 79.8612]; // Colombo

// --------------------- Add Spot Component ---------------------
function AddSpot({ refresh }: { refresh: () => void }) {
  useMapEvents({
    async click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      await addDoc(collection(db, "spots"), {
        lat,
        lng,
        createdAt: Date.now()
      });

      refresh();
    }
  });

  return null;
}

// --------------------- User Location Component ---------------------
function UserLocation() {
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", (e) => {
      map.setView(e.latlng, map.getZoom());
    });
  }, [map]);

  return null;
}

// --------------------- Main MapView ---------------------
export default function MapView() {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);

  // Real-time listener with auto-remove after 5 min
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "spots"), (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as ParkingSpot))
        .filter(spot => Date.now() - spot.createdAt < 5 * 60 * 1000); // 5 minutes
      setSpots(data);
    });

    return () => unsubscribe();
  }, []);

  // Refresh function for AddSpot
  const refresh = () => {}; // listener already handles real-time updates

  return (
    <MapContainer
      center={defaultCenter}
      zoom={15}
      style={{ width: "100%", height: "90vh" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      <AddSpot refresh={refresh} />
      <UserLocation />

      {spots.map(spot => (
        <Marker
          key={spot.id}
          position={[spot.lat, spot.lng]}
          icon={greenIcon}
        />
      ))}
    </MapContainer>
  );
}