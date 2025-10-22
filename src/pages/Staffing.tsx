import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Plane, Users, MapPin } from 'lucide-react';
import { StaffingMap } from '@/components/StaffingMap';

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

const Staffing = () => {
  const [destinationStats, setDestinationStats] = useState<DestinationStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalFlights, setTotalFlights] = useState(0);
  const [totalOpenShifts, setTotalOpenShifts] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch all destinations
      const { data: destinations, error: destError } = await supabase
        .from('destinations')
        .select('*')
        .order('city');

      if (destError) {
        console.error('Error fetching destinations:', destError);
        setLoading(false);
        return;
      }

      // Fetch all flights
      const { data: flights, error: flightsError } = await supabase
        .from('flights')
        .select('*');

      if (flightsError) {
        console.error('Error fetching flights:', flightsError);
      }

      // Fetch all shifts
      const { data: shifts, error: shiftsError } = await supabase
        .from('shifts')
        .select('*')
        .eq('status', 'open');

      if (shiftsError) {
        console.error('Error fetching shifts:', shiftsError);
      }

      // Calculate stats for each destination
      const stats: DestinationStats[] = (destinations || []).map((dest) => {
        // Count flights to/from this destination
        const upcomingFlights = (flights || []).filter(
          (f) => f.origin === dest.city || f.destination === dest.city
        ).length;

        // Count open shifts at this location
        const openShifts = (shifts || []).filter(
          (s) => s.location === dest.city
        ).length;

        return {
          destination: dest,
          upcomingFlights,
          openShifts,
        };
      });

      setDestinationStats(stats);
      setTotalFlights(flights?.length || 0);
      setTotalOpenShifts(shifts?.length || 0);
      setLoading(false);
    };

    fetchData();
  }, []);

  const departmentWithMostShortages = destinationStats
    .sort((a, b) => b.openShifts - a.openShifts)[0]?.destination.city || 'N/A';

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto p-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Interactive Staffing Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time view of staffing needs and flight operations across 83 North American destinations
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Flights Today</CardTitle>
              <Plane className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFlights}</div>
              <p className="text-xs text-muted-foreground">
                Across all destinations
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Open Shifts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOpenShifts}</div>
              <p className="text-xs text-muted-foreground">
                Need immediate coverage
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Shortages</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departmentWithMostShortages}</div>
              <p className="text-xs text-muted-foreground">
                Requires attention
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>North America Destination Map</CardTitle>
            <CardDescription>
              Interactive map showing 83 destinations with flight and staffing data. 
              Red markers = high staffing needs, Yellow = moderate, Green = adequate.
              Marker size indicates activity level.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[600px] rounded-lg overflow-hidden border">
              {loading ? (
                <div className="h-full flex items-center justify-center bg-muted">
                  <p className="text-muted-foreground">Loading destinations...</p>
                </div>
              ) : (
                <StaffingMap destinationStats={destinationStats} />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Destinations by Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Top Destinations by Staffing Needs</CardTitle>
            <CardDescription>
              Locations with the highest number of open shifts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {destinationStats
                .filter((stat) => stat.openShifts > 0)
                .sort((a, b) => b.openShifts - a.openShifts)
                .slice(0, 9)
                .map((stat) => (
                  <Card key={stat.destination.id} className="transition-all hover:shadow-md">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-base">
                        <span>{stat.destination.airport_code}</span>
                        {stat.openShifts > 5 && <Badge variant="destructive">Critical</Badge>}
                        {stat.openShifts > 2 && stat.openShifts <= 5 && <Badge className="bg-amber-500">Moderate</Badge>}
                      </CardTitle>
                      <CardDescription>{stat.destination.city}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 pb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Flights:</span>
                        <span className="font-medium">{stat.upcomingFlights}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Open Shifts:</span>
                        <span className="font-medium">{stat.openShifts}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Staffing;
