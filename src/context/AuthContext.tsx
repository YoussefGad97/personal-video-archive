
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { MOCK_CREDENTIALS, MOCK_USER } from '@/lib/mockData';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({ ...MOCK_USER });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('videoGalleryUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user data');
        localStorage.removeItem('videoGalleryUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (username === MOCK_CREDENTIALS.username && password === MOCK_CREDENTIALS.password) {
      const authenticatedUser = { username, isAuthenticated: true };
      setUser(authenticatedUser);
      localStorage.setItem('videoGalleryUser', JSON.stringify(authenticatedUser));
      toast({
        title: "Login successful",
        description: "Welcome to your video gallery!",
      });
      setIsLoading(false);
      return true;
    } 
    
    toast({
      title: "Login failed",
      description: "Invalid username or password",
      variant: "destructive",
    });
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser({ ...MOCK_USER });
    localStorage.removeItem('videoGalleryUser');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
