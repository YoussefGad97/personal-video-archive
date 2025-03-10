
import React from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Playlist } from '@/lib/types';
import { MOCK_PLAYLISTS } from '@/lib/mockData';

interface PlaylistSectionProps {
  onSelectPlaylist: (playlistId: string) => void;
  selectedPlaylists: string[];
}

const PlaylistSection: React.FC<PlaylistSectionProps> = ({ onSelectPlaylist, selectedPlaylists }) => {
  const playlists = MOCK_PLAYLISTS;

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-4">Playlists</h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 pb-4">
          {playlists.map((playlist) => (
            <PlaylistCard 
              key={playlist.id} 
              playlist={playlist} 
              onClick={() => onSelectPlaylist(playlist.id)} 
              isSelected={selectedPlaylists.includes(playlist.id)}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

interface PlaylistCardProps {
  playlist: Playlist;
  onClick: () => void;
  isSelected: boolean;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onClick, isSelected }) => {
  return (
    <div 
      className={`group relative flex-shrink-0 w-[200px] cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
        isSelected ? 'ring-2 ring-primary rounded-xl' : ''
      }`}
      onClick={onClick}
    >
      <div className="overflow-hidden rounded-xl">
        <div className="relative aspect-square">
          <img 
            src={playlist.thumbnailUrl || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=3174&auto=format&fit=crop'} 
            alt={playlist.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/0 group-hover:from-black/80 transition-all duration-300" />
          <div className="absolute bottom-0 p-4 w-full">
            <h3 className="text-white font-medium truncate mb-1">{playlist.name}</h3>
            <p className="text-white/80 text-sm">{playlist.videoCount} videos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistSection;
