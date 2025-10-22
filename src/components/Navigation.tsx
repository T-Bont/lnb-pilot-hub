import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Home, BarChart3, MessageSquare, LogOut, Plane } from 'lucide-react';

export const Navigation = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b bg-card shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Plane className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">LNB Airlines</span>
              <span className="text-xs text-muted-foreground">Staffing Portal</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant={isActive('/dashboard') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/dashboard" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </Button>
            
            <Button
              variant={isActive('/staffing') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/staffing" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Staffing</span>
              </Link>
            </Button>
            
            <Button
              variant={isActive('/chatbot') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/chatbot" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Chatbot</span>
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="ml-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
