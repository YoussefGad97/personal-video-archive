
import React, { useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import VideoPlayer from './VideoPlayer';
import FilterBar from './FilterBar';
import PlaylistSection from './PlaylistSection';
import { Video, SortOption } from '@/lib/types';
import { MOCK_VIDEOS } from '@/lib/mockData';

interface VideoGalleryProps {
  searchQuery?: string;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ searchQuery = '' }) => {
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Sync search query from props to local state
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Apply filters when selections change
  useEffect(() => {
    let result = [...videos];
    
    // Filter by search query
    if (localSearchQuery) {
      const query = localSearchQuery.toLowerCase();
      result = result.filter(
        video => 
          video.title.toLowerCase().includes(query) || 
          video.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by playlists
    if (selectedPlaylists.length > 0) {
      result = result.filter(
        video => video.playlists.some(playlist => selectedPlaylists.includes(playlist))
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'mostViewed':
        result.sort((a, b) => b.views - a.views);
        break;
    }
    
    setFilteredVideos(result);
  }, [videos, selectedPlaylists, sortBy, localSearchQuery]);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  const handlePlayerClose = () => {
    setIsPlayerOpen(false);
  };

  const handlePlaylistSelect = (playlistId: string) => {
    if (selectedPlaylists.includes(playlistId)) {
      setSelectedPlaylists(selectedPlaylists.filter(id => id !== playlistId));
    } else {
      setSelectedPlaylists([...selectedPlaylists, playlistId]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <PlaylistSection 
        onSelectPlaylist={handlePlaylistSelect} 
        selectedPlaylists={selectedPlaylists} 
      />
      
      <FilterBar 
        onFilterChange={setSelectedPlaylists}
        onSortChange={setSortBy}
        selectedPlaylists={selectedPlaylists}
        currentSort={sortBy}
      />
      
      <div className="py-4">
        <h2 className="text-2xl font-bold mb-6">
          {selectedPlaylists.length > 0 ? 'Filtered Videos' : 'All Videos'}
          <span className="text-muted-foreground ml-2 text-sm font-normal">
            {filteredVideos.length} videos
          </span>
        </h2>
        
        {filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No videos match your filters.</p>
            <button 
              className="mt-4 text-primary hover:underline"
              onClick={() => {
                setSelectedPlaylists([]);
                setLocalSearchQuery('');
              }}
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map(video => (
              <VideoCard key={video.id} video={video} onClick={handleVideoClick} />
            ))}
          </div>
        )}
      </div>
      
      <VideoPlayer 
        video={selectedVideo} 
        isOpen={isPlayerOpen} 
        onClose={handlePlayerClose} 
      />
    </div>
  );
};

export default VideoGallery;
