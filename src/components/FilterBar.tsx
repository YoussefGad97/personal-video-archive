
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Playlist, SortOption } from '@/lib/types';
import { MOCK_PLAYLISTS } from '@/lib/mockData';
import { Filter, ArrowDownAZ, ArrowDownZA, Clock, CalendarDays, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FilterBarProps {
  onFilterChange: (playlists: string[]) => void;
  onSortChange: (sortBy: SortOption) => void;
  selectedPlaylists: string[];
  currentSort: SortOption;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  onFilterChange, 
  onSortChange, 
  selectedPlaylists, 
  currentSort 
}) => {
  const [playlists, setPlaylists] = useState<Playlist[]>(MOCK_PLAYLISTS);

  const handlePlaylistToggle = (playlistId: string) => {
    let newSelectedPlaylists: string[];
    
    if (selectedPlaylists.includes(playlistId)) {
      newSelectedPlaylists = selectedPlaylists.filter(id => id !== playlistId);
    } else {
      newSelectedPlaylists = [...selectedPlaylists, playlistId];
    }
    
    onFilterChange(newSelectedPlaylists);
  };

  const clearFilters = () => {
    onFilterChange([]);
  };

  const getSortIcon = (sortType: SortOption) => {
    switch (sortType) {
      case 'title':
        return <ArrowDownAZ className="h-4 w-4" />;
      case 'newest':
        return <CalendarDays className="h-4 w-4" />;
      case 'oldest':
        return <Clock className="h-4 w-4" />;
      case 'mostViewed':
        return <Eye className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getSortLabel = (sortType: SortOption) => {
    switch (sortType) {
      case 'title':
        return 'Title (A-Z)';
      case 'newest':
        return 'Newest First';
      case 'oldest':
        return 'Oldest First';
      case 'mostViewed':
        return 'Most Viewed';
      default:
        return '';
    }
  };

  return (
    <div className="py-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground mr-1">Filter by:</span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Filter className="h-3.5 w-3.5" />
                <span>Playlists</span>
                {selectedPlaylists.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1">
                    {selectedPlaylists.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 animate-fade-in">
              <DropdownMenuLabel>Select Playlists</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {playlists.map(playlist => (
                <DropdownMenuItem 
                  key={playlist.id}
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => handlePlaylistToggle(playlist.id)}
                >
                  <span>{playlist.name}</span>
                  {selectedPlaylists.includes(playlist.id) && (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
              ))}
              {selectedPlaylists.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={clearFilters} className="text-muted-foreground justify-center">
                    Clear filters
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                {getSortIcon(currentSort)}
                <span>{getSortLabel(currentSort)}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 animate-fade-in">
              <DropdownMenuItem 
                onClick={() => onSortChange('title')}
                className="flex items-center gap-2 cursor-pointer"
              >
                <ArrowDownAZ className="h-4 w-4" />
                <span>Title (A-Z)</span>
                {currentSort === 'title' && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onSortChange('newest')}
                className="flex items-center gap-2 cursor-pointer"
              >
                <CalendarDays className="h-4 w-4" />
                <span>Newest First</span>
                {currentSort === 'newest' && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onSortChange('oldest')}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Clock className="h-4 w-4" />
                <span>Oldest First</span>
                {currentSort === 'oldest' && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onSortChange('mostViewed')}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Eye className="h-4 w-4" />
                <span>Most Viewed</span>
                {currentSort === 'mostViewed' && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Active filters display */}
      {selectedPlaylists.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {selectedPlaylists.map(playlistId => {
            const playlist = playlists.find(p => p.id === playlistId);
            if (!playlist) return null;
            
            return (
              <Badge 
                key={playlist.id} 
                variant="outline"
                className="bg-accent/50 hover:bg-accent cursor-pointer transition-all"
                onClick={() => handlePlaylistToggle(playlist.id)}
              >
                {playlist.name}
                <span className="ml-1 text-muted-foreground">×</span>
              </Badge>
            );
          })}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 text-xs text-muted-foreground hover:text-foreground"
            onClick={clearFilters}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
