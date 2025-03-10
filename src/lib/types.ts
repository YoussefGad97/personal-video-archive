
export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number; // in seconds
  dateAdded: string;
  playlists: string[];
  views: number;
}

export interface Playlist {
  id: string;
  name: string;
  thumbnailUrl?: string;
  videoCount: number;
}

export interface User {
  username: string;
  isAuthenticated: boolean;
}

export type SortOption = 'newest' | 'oldest' | 'mostViewed' | 'title';

export interface FilterState {
  search: string;
  playlists: string[];
  sortBy: SortOption;
}

export interface VideoFormData {
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  playlists: string[];
}
