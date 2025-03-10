
import { Video, Playlist, User } from './types';

// Sample user data
export const MOCK_USER: User = {
  username: 'admin',
  isAuthenticated: false
};

// Sample credentials for development only
// In a real app, this would never be stored in the frontend
export const MOCK_CREDENTIALS = {
  username: 'admin',
  password: 'password123'
};

// Sample playlists
export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: 'p1',
    name: 'Favorites',
    thumbnailUrl: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?q=80&w=3270&auto=format&fit=crop',
    videoCount: 5
  },
  {
    id: 'p2',
    name: 'Music',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2970&auto=format&fit=crop',
    videoCount: 3
  },
  {
    id: 'p3',
    name: 'Tutorials',
    thumbnailUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2970&auto=format&fit=crop',
    videoCount: 4
  },
  {
    id: 'p4',
    name: 'Travel',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=3270&auto=format&fit=crop',
    videoCount: 2
  }
];

// Sample videos
export const MOCK_VIDEOS: Video[] = [
  {
    id: 'v1',
    title: 'Beautiful Sunset Time Lapse',
    description: 'A breathtaking time lapse of a sunset over the ocean.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1616036740257-9449ea1f6605?q=80&w=3386&auto=format&fit=crop',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    duration: 187,
    dateAdded: '2023-11-15',
    playlists: ['p1', 'p4'],
    views: 142
  },
  {
    id: 'v2',
    title: 'Guitar Tutorial for Beginners',
    description: 'Learn the basics of playing guitar with this comprehensive tutorial.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=3270&auto=format&fit=crop',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    duration: 654,
    dateAdded: '2023-10-28',
    playlists: ['p3'],
    views: 89
  },
  {
    id: 'v3',
    title: 'Concert Highlights: The Weeknd',
    description: 'Watch the best moments from The Weeknd\'s latest concert tour.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=3174&auto=format&fit=crop',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    duration: 421,
    dateAdded: '2023-12-05',
    playlists: ['p1', 'p2'],
    views: 278
  },
  {
    id: 'v4',
    title: 'New York City Travel Guide',
    description: 'A comprehensive guide to visiting New York City on a budget.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=3270&auto=format&fit=crop',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    duration: 842,
    dateAdded: '2023-09-17',
    playlists: ['p4'],
    views: 156
  },
  {
    id: 'v5',
    title: 'Piano Sonata No. 14 "Moonlight"',
    description: 'Beethoven\'s Piano Sonata No. 14, performed by Lang Lang.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=3270&auto=format&fit=crop',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    duration: 975,
    dateAdded: '2023-11-30',
    playlists: ['p1', 'p2'],
    views: 312
  },
  {
    id: 'v6',
    title: 'React Hooks Explained',
    description: 'A detailed explanation of React Hooks with practical examples.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=3270&auto=format&fit=crop',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    duration: 728,
    dateAdded: '2023-10-10',
    playlists: ['p3'],
    views: 201
  },
  {
    id: 'v7',
    title: 'Tokyo Street Food Tour',
    description: 'Exploring the best street food in Tokyo, Japan.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=3387&auto=format&fit=crop',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    duration: 534,
    dateAdded: '2023-12-15',
    playlists: ['p1', 'p4'],
    views: 178
  },
  {
    id: 'v8',
    title: 'Florence + The Machine Live',
    description: 'Full concert of Florence + The Machine at Glastonbury 2022.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=3270&auto=format&fit=crop',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    duration: 1254,
    dateAdded: '2023-08-22',
    playlists: ['p2'],
    views: 289
  },
  {
    id: 'v9',
    title: 'Advanced CSS Techniques',
    description: 'Learn advanced CSS techniques for modern web design.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=3432&auto=format&fit=crop',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    duration: 495,
    dateAdded: '2023-11-05',
    playlists: ['p3'],
    views: 134
  },
  {
    id: 'v10',
    title: 'Northern Lights Time Lapse',
    description: 'Beautiful time lapse footage of the Northern Lights in Norway.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?q=80&w=3270&auto=format&fit=crop',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    duration: 267,
    dateAdded: '2023-12-28',
    playlists: ['p1'],
    views: 324
  }
];

// Helper function to get videos by playlist
export const getVideosByPlaylist = (playlistId: string): Video[] => {
  return MOCK_VIDEOS.filter(video => video.playlists.includes(playlistId));
};

// Helper function to format duration (seconds to MM:SS)
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
