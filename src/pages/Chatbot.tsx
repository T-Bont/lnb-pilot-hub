import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Clock } from 'lucide-react';

const Chatbot = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto p-6">
        <Card className="mx-auto max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <MessageSquare className="h-8 w-8 text-secondary-foreground" />
            </div>
            <CardTitle>AI Chatbot</CardTitle>
            <CardDescription>
              Intelligent assistant for staffing requests and queries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/5 p-12 text-center">
              <Clock className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Coming Soon
              </h3>
              <p className="text-sm text-muted-foreground">
                The AI chatbot feature is currently under development. This will allow you to:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>• Submit leave requests via natural language</li>
                <li>• Ask about shift availability</li>
                <li>• Get instant answers to staffing questions</li>
                <li>• Request shift swaps with colleagues</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Chatbot;
