import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, AlertCircle, TrendingUp, Plane, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    openShifts: 0,
    pendingRequests: 0,
    upcomingFlights: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [employees, shifts, requests, flights] = await Promise.all([
        supabase.from('employees').select('*', { count: 'exact', head: true }),
        supabase.from('shifts').select('*', { count: 'exact', head: true }).eq('status', 'open'),
        supabase.from('requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('flights').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        totalEmployees: employees.count || 0,
        openShifts: shifts.count || 0,
        pendingRequests: requests.count || 0,
        upcomingFlights: flights.count || 4,
      });
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      description: 'Active staff members',
      icon: Users,
      color: 'text-primary',
    },
    {
      title: 'Open Shifts',
      value: stats.openShifts,
      description: 'Needs coverage',
      icon: Clock,
      color: 'text-accent',
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      description: 'Awaiting approval',
      icon: AlertCircle,
      color: 'text-destructive',
    },
    {
      title: 'Upcoming Flights',
      value: stats.upcomingFlights,
      description: 'Next 24 hours',
      icon: Plane,
      color: 'text-primary',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto p-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to LNB Airlines Staffing Portal
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title} className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/5">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">View Schedule</p>
                  <p className="text-sm text-muted-foreground">Check your upcoming shifts</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/5">
                <AlertCircle className="h-5 w-5 text-accent" />
                <div>
                  <p className="font-medium">Submit Request</p>
                  <p className="text-sm text-muted-foreground">Leave or shift swap requests</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/5">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">View Analytics</p>
                  <p className="text-sm text-muted-foreground">Department performance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and changes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">New employee onboarded</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10">
                  <Clock className="h-4 w-4 text-accent" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Shift coverage updated</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Plane className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Flight LNB101 scheduled</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
