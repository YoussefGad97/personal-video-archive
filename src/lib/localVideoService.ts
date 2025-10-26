import { Video } from './types';

const STORAGE_KEY = 'personal-video-archive-videos';

// Generate a simple ID for local storage
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Get all videos from localStorage
export const getAllVideos = async (): Promise<Video[]> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const videos = JSON.parse(stored);
    return Array.isArray(videos) ? videos : [];
  } catch (error) {
    console.error('Error loading videos from localStorage:', error);
    return [];
  }
};

// Add a new video to localStorage
export const addVideo = async (video: Omit<Video, 'id'>): Promise<Video> => {
  try {
    const videos = await getAllVideos();
    const newVideo: Video = {
      ...video,
      id: generateId(),
    };
    
    videos.unshift(newVideo); // Add to beginning of array
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
    return newVideo;
  } catch (error) {
    console.error('Error adding video to localStorage:', error);
    throw new Error('Failed to add video');
  }
};

// Delete a video from localStorage
export const deleteVideo = async (videoId: string): Promise<void> => {
  try {
    const videos = await getAllVideos();
    const filteredVideos = videos.filter(video => video.id !== videoId);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredVideos));
  } catch (error) {
    console.error('Error deleting video from localStorage:', error);
    throw new Error('Failed to delete video');
  }
};

// Update a video in localStorage
export const updateVideo = async (
  videoId: string,
  updates: Partial<Video>
): Promise<void> => {
  try {
    const videos = await getAllVideos();
    const videoIndex = videos.findIndex(video => video.id === videoId);
    
    if (videoIndex === -1) {
      throw new Error('Video not found');
    }
    
    videos[videoIndex] = { ...videos[videoIndex], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  } catch (error) {
    console.error('Error updating video in localStorage:', error);
    throw new Error('Failed to update video');
  }
};

// Update video views count
export const incrementVideoViews = async (videoId: string): Promise<void> => {
  try {
    const videos = await getAllVideos();
    const videoIndex = videos.findIndex(video => video.id === videoId);
    
    if (videoIndex !== -1) {
      videos[videoIndex].views = (videos[videoIndex].views || 0) + 1;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
    }
  } catch (error) {
    console.error('Error incrementing views:', error);
    // Don't throw error for view count updates
  }
};
