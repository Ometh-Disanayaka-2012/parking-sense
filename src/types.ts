export interface ParkingSpot {
  id?: string;
  lat: number;
  lng: number;
  createdAt: number;
  taken?: boolean; // new
}