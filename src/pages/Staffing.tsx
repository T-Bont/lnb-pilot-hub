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

  useEffect(() => {
    // Load Tableau visualization script
    const script = document.createElement('script');
    script.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
    script.async = true;
    
    const divElement = document.getElementById('viz1761676711385');
    if (divElement) {
      const vizElement = divElement.getElementsByTagName('object')[0];
      if (vizElement) {
        vizElement.style.width = '100%';
        vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';
        vizElement.parentNode?.insertBefore(script, vizElement);
      }
    }

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [loading]);

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
            <CardTitle>Staffing Dashboard</CardTitle>
            <CardDescription>
              Interactive Tableau dashboard showing staffing metrics and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg overflow-hidden border">
              {loading ? (
                <div className="h-[600px] flex items-center justify-center bg-muted">
                  <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
              ) : (
                <div className="tableauPlaceholder" id="viz1761676711385" style={{ position: 'relative' }}>
                  <noscript>
                    <a href="#">
                      <img 
                        alt="Sheet 1" 
                        src="https://public.tableau.com/static/images/LN/LNBDashboard/Sheet1/1_rss.png" 
                        style={{ border: 'none' }} 
                      />
                    </a>
                  </noscript>
                  <object className="tableauViz" style={{ display: 'none' }}>
                    <param name="host_url" value="https%3A%2F%2Fpublic.tableau.com%2F" />
                    <param name="embed_code_version" value="3" />
                    <param name="site_root" value="" />
                    <param name="name" value="LNBDashboard&#47;Sheet1" />
                    <param name="tabs" value="no" />
                    <param name="toolbar" value="yes" />
                    <param name="static_image" value="https://public.tableau.com/static/images/LN/LNBDashboard/Sheet1/1.png" />
                    <param name="animate_transition" value="yes" />
                    <param name="display_static_image" value="yes" />
                    <param name="display_spinner" value="yes" />
                    <param name="display_overlay" value="yes" />
                    <param name="display_count" value="yes" />
                    <param name="language" value="en-US" />
                    <param name="filter" value="publish=yes" />
                    <param name="filter" value="showOnboarding=true" />
                  </object>
                </div>
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
