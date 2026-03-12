// src/components/MapView.tsx

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap
} from "react-leaflet";

import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

import { db } from "../firebase";
import { ParkingSpot } from "../types";

import L from "leaflet";


// ---------------- Marker Icons ----------------

const greenIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const redIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828843.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});


// ---------------- Default Center ----------------

const center: [number, number] = [6.9271, 79.8612]; // Colombo


// ---------------- Add Spot ----------------

function AddSpot() {
  useMapEvents({
    async click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      await addDoc(collection(db, "spots"), {
        lat,
        lng,
        createdAt: Date.now(),
        taken: false
      });
    }
  });

  return null;
}


// ---------------- User Location ----------------

function UserLocation() {
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", (e) => {
      map.setView(e.latlng, 15);
    });
  }, [map]);

  return null;
}


// ---------------- Main Component ----------------

export default function MapView() {

  const [spots, setSpots] = useState<ParkingSpot[]>([]);


  // Real-time Firestore listener
  useEffect(() => {

    const unsubscribe = onSnapshot(collection(db, "spots"), (snapshot) => {

      const data = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ParkingSpot[];

      setSpots(data);

    });

    return () => unsubscribe();

  }, []);


  // Mark parking taken
  const markTaken = async (id: string) => {

    const ref = doc(db, "spots", id);

    await updateDoc(ref, {
      taken: true
    });

  };


  // Delete parking
  const deleteSpot = async (id: string) => {

    const ref = doc(db, "spots", id);

    await deleteDoc(ref);

  };


  return (

    <MapContainer
      center={center}
      zoom={15}
      style={{ width: "100%", height: "90vh" }}
    >

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      <AddSpot />

      <UserLocation />

      {spots.map((spot) => (

        <Marker
          key={spot.id}
          position={[spot.lat, spot.lng]}
          icon={spot.taken ? redIcon : greenIcon}
        >

          <Popup>

            <div>

              <p>Parking Spot</p>

              {!spot.taken && (
                <button onClick={() => markTaken(spot.id!)}>
                  Mark Taken
                </button>
              )}

              <br />

              <button onClick={() => deleteSpot(spot.id!)}>
                Delete
              </button>

            </div>

          </Popup>

        </Marker>

      ))}

    </MapContainer>

  );
}