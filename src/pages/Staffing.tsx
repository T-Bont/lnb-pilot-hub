import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin } from 'lucide-react';
import { StaticStaffingMap } from '@/components/StaticStaffingMap';

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
  openShifts: number;
}

const Staffing = () => {
  const [destinationStats, setDestinationStats] = useState<DestinationStats[]>([]);
  const [loading, setLoading] = useState(true);
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

      // Fetch all open shifts
      const { data: shifts, error: shiftsError } = await supabase
        .from('shifts')
        .select('*')
        .eq('status', 'open');

      if (shiftsError) {
        console.error('Error fetching shifts:', shiftsError);
      }

      // Calculate stats for each destination
      const stats: DestinationStats[] = (destinations || []).map((dest) => {
        // Count open shifts at this airport
        const openShifts = (shifts || []).filter(
          (s) => s.airport_code === dest.airport_code
        ).length;

        return {
          destination: dest,
          openShifts,
        };
      });

      setDestinationStats(stats);
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
            Real-time view of open shifts across 7 key North American destinations
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-2">
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
              Interactive map showing 7 key destinations with staffing data. 
              Red markers = high staffing needs, Yellow = moderate, Green = adequate.
              Click or hover markers for details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[600px] rounded-lg overflow-hidden border">
              {loading ? (
                <div className="h-full flex items-center justify-center bg-muted">
                  <p className="text-muted-foreground">Loading destinations...</p>
                </div>
              ) : (
                <StaticStaffingMap destinationStats={destinationStats} />
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
