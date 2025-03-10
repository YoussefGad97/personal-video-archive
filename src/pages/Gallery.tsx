
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import VideoGallery from '@/components/VideoGallery';

const Gallery: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !user.isAuthenticated) {
      navigate('/');
    }
  }, [user, navigate, isLoading]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-48 bg-secondary rounded mb-4"></div>
          <div className="h-6 w-24 bg-secondary/70 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!user.isAuthenticated) {
    return null; // Will redirect via the useEffect
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <VideoGallery />
      </main>
    </div>
  );
};

export default Gallery;
