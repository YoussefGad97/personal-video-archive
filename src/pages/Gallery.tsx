import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import VideoGallery from '@/components/VideoGallery';
import HeroSection from '@/components/HeroSection';
import { Video } from '@/lib/types';


const Gallery: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [galleryKey, setGalleryKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    if (!isLoading && !user.isAuthenticated) {
      navigate('/');
    }
  }, [user, navigate, isLoading]);
  
  const handleVideoAdded = (newVideo: Video) => {
    console.log("Video added, refreshing gallery...", newVideo);
    // Force VideoGallery to re-render with new data by updating its key
    setGalleryKey(prevKey => prevKey + 1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
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
      <Navbar 
        onVideoAdded={handleVideoAdded}
        onSearch={handleSearch}
      />
      <HeroSection />
      <main>
        <VideoGallery 
          key={galleryKey}
          searchQuery={searchQuery}
        />
      </main>
    </div>
  );
};

export default Gallery;
