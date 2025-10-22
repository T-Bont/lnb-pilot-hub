import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { StaffingMarkers } from './StaffingMarkers';

interface Destination {
  id: string;
  name: string;
  city: string;
  state_province: string | null;
  country: string;
  airport_code: string;
  latitude: number;
  longitude: number;
}

interface DestinationStats {
  destination: Destination;
  upcomingFlights: number;
  openShifts: number;
}

interface StaffingMapProps {
  destinationStats: DestinationStats[];
}

export const StaffingMap = ({ destinationStats }: StaffingMapProps) => {
  return (
    <MapContainer
      center={[45, -100]}
      zoom={4}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <StaffingMarkers destinationStats={destinationStats} />
    </MapContainer>
  );
};
