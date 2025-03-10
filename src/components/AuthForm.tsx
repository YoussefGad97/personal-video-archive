
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, User } from 'lucide-react';

const AuthForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(username, password);
    
    if (success) {
      navigate('/gallery');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-radial from-accent to-background">
      <div className="w-full max-w-md p-6 animate-scale-in">
        <Card className="glass-panel shadow-xl border border-white/20 overflow-hidden">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold">Personal Video Gallery</CardTitle>
            <CardDescription className="text-muted-foreground">
              Please sign in to access your video collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
                  <User size={16} />
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="transition duration-300 focus:ring-2 focus:ring-primary/30"
                  placeholder="Enter your username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                  <Lock size={16} />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="transition duration-300 focus:ring-2 focus:ring-primary/30"
                  placeholder="Enter your password"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full transition-all duration-300 bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            For demo purposes, use: admin / password123
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthForm;
