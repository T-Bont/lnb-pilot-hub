import { useState } from 'react';
import mapImage from '@/assets/north-america-map.jpg';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

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

interface StaticStaffingMapProps {
  destinationStats: DestinationStats[];
}

// Convert lat/long to percentage position on the map
const getMarkerPosition = (lat: number, lng: number) => {
  // Map bounds (fine-tuned for North America view)
  const minLat = 14;
  const maxLat = 54;
  const minLng = -128;
  const maxLng = -68;
  
  // Convert to percentage (inverted for Y axis)
  const x = ((lng - minLng) / (maxLng - minLng)) * 100;
  const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
  
  return { x: `${x}%`, y: `${y}%` };
};

export const StaticStaffingMap = ({ destinationStats }: StaticStaffingMapProps) => {
  const [hoveredDestination, setHoveredDestination] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);

  const getMarkerColor = (openShifts: number) => {
    if (openShifts > 5) return 'bg-red-500';
    if (openShifts > 2) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const getMarkerSize = (flights: number) => {
    if (flights > 10) return 'w-6 h-6';
    if (flights > 5) return 'w-5 h-5';
    return 'w-4 h-4';
  };

  return (
    <div className="relative w-full h-full">
      <img 
        src={mapImage} 
        alt="North America Map" 
        className="w-full h-full object-cover rounded-lg"
      />
      
      {destinationStats.map((stat) => {
        const position = getMarkerPosition(stat.destination.latitude, stat.destination.longitude);
        const isActive = hoveredDestination === stat.destination.id || selectedDestination === stat.destination.id;
        
        return (
          <div key={stat.destination.id} className="absolute" style={{ left: position.x, top: position.y }}>
            {/* Marker */}
            <button
              className={`${getMarkerColor(stat.openShifts)} ${getMarkerSize(stat.upcomingFlights)} rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-125 cursor-pointer relative z-10`}
              onMouseEnter={() => setHoveredDestination(stat.destination.id)}
              onMouseLeave={() => setHoveredDestination(null)}
              onClick={() => setSelectedDestination(
                selectedDestination === stat.destination.id ? null : stat.destination.id
              )}
              aria-label={`${stat.destination.city} - ${stat.openShifts} open shifts`}
            />
            
            {/* Tooltip */}
            {isActive && (
              <Card className="absolute left-4 top-0 transform -translate-y-1/2 w-64 z-20 shadow-xl">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg">{stat.destination.airport_code}</span>
                      {stat.openShifts > 5 && <Badge variant="destructive">Critical</Badge>}
                      {stat.openShifts > 2 && stat.openShifts <= 5 && <Badge className="bg-amber-500">Moderate</Badge>}
                      {stat.openShifts <= 2 && <Badge variant="secondary">Good</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {stat.destination.city}, {stat.destination.state_province || stat.destination.country}
                    </p>
                    <div className="space-y-1 pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Flights:</span>
                        <span className="font-medium">{stat.upcomingFlights}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Open Shifts:</span>
                        <span className="font-medium">{stat.openShifts}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );
      })}
    </div>
  );
};
