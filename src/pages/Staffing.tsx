import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Badge } from '@/components/ui/badge';

interface Department {
  id: string;
  name: string;
  num_employees: number;
  budget: number;
  location: string;
}

const locationCoords: Record<string, [number, number]> = {
  'New York': [40.7128, -74.006],
  'Los Angeles': [34.0522, -118.2437],
  'Chicago': [41.8781, -87.6298],
  'Dallas': [32.7767, -96.797],
  'Miami': [25.7617, -80.1918],
};

const Staffing = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching departments:', error);
      } else {
        setDepartments(data || []);
      }
      setLoading(false);
    };

    fetchDepartments();
  }, []);

  const getStaffingLevel = (numEmployees: number) => {
    if (numEmployees < 40) return { label: 'Critical', color: 'destructive', size: 25 };
    if (numEmployees < 70) return { label: 'Low', color: 'default', size: 20 };
    if (numEmployees < 100) return { label: 'Adequate', color: 'secondary', size: 15 };
    return { label: 'Optimal', color: 'default', size: 10 };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto p-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Staffing Dashboard</h1>
          <p className="text-muted-foreground">
            View staffing levels and coverage across locations
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Staffing Coverage Map</CardTitle>
            <CardDescription>
              Red markers indicate critical staffing shortages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] rounded-lg overflow-hidden border">
              <MapContainer
                center={[39.8283, -98.5795]}
                zoom={4}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {departments.map((dept) => {
                  const coords = locationCoords[dept.location];
                  const level = getStaffingLevel(dept.num_employees);
                  
                  if (!coords) return null;

                  return (
                    <CircleMarker
                      key={dept.id}
                      center={coords}
                      radius={level.size}
                      pathOptions={{
                        fillColor: level.label === 'Critical' ? '#ef4444' : 
                                   level.label === 'Low' ? '#f59e0b' : 
                                   level.label === 'Adequate' ? '#3b82f6' : '#10b981',
                        fillOpacity: 0.7,
                        color: 'white',
                        weight: 2,
                      }}
                    >
                      <Popup>
                        <div className="p-2">
                          <p className="font-semibold">{dept.location}</p>
                          <p className="text-sm">{dept.name}</p>
                          <p className="text-sm">Employees: {dept.num_employees}</p>
                          <Badge variant={level.color as any} className="mt-1">
                            {level.label}
                          </Badge>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => {
            const level = getStaffingLevel(dept.num_employees);
            return (
              <Card key={dept.id} className="transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{dept.name}</span>
                    <Badge variant={level.color as any}>{level.label}</Badge>
                  </CardTitle>
                  <CardDescription>{dept.location}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Employees:</span>
                    <span className="font-medium">{dept.num_employees}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Budget:</span>
                    <span className="font-medium">
                      ${dept.budget?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Staffing;
