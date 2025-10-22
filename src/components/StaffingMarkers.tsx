import { CircleMarker, Popup } from 'react-leaflet';
import { Badge } from '@/components/ui/badge';
import { Plane, Users } from 'lucide-react';

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

interface StaffingMarkersProps {
  destinationStats: DestinationStats[];
}

// Helper function to get marker style based on staffing needs
const getMarkerStyle = (openShifts: number, upcomingFlights: number) => {
  const color = openShifts > 5 ? '#ef4444' : openShifts > 2 ? '#f59e0b' : '#10b981';
  const radius = Math.min(Math.max(8 + (upcomingFlights + openShifts) * 0.5, 8), 20);
  
  return {
    fillColor: color,
    color: 'white',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8,
    radius,
  };
};

export const StaffingMarkers = ({ destinationStats }: StaffingMarkersProps) => {
  return (
    <>
      {destinationStats.map((stat) => {
        const markerStyle = getMarkerStyle(stat.openShifts, stat.upcomingFlights);
        return (
          <CircleMarker
            key={stat.destination.id}
            center={[Number(stat.destination.latitude), Number(stat.destination.longitude)]}
            pathOptions={markerStyle}
            radius={markerStyle.radius}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className="font-semibold text-base mb-1">
                  {stat.destination.airport_code}
                </div>
                <div className="text-sm font-medium mb-2">
                  {stat.destination.city}, {stat.destination.state_province || stat.destination.country}
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Plane className="h-3 w-3" /> Flights:
                    </span>
                    <span className="font-medium">{stat.upcomingFlights}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" /> Open Shifts:
                    </span>
                    <span className="font-medium">{stat.openShifts}</span>
                  </div>
                </div>
                {stat.openShifts > 5 && (
                  <Badge variant="destructive" className="mt-2 w-full justify-center">
                    Critical Shortage
                  </Badge>
                )}
                {stat.openShifts > 2 && stat.openShifts <= 5 && (
                  <Badge className="mt-2 w-full justify-center bg-amber-500">
                    Moderate Shortage
                  </Badge>
                )}
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
};
