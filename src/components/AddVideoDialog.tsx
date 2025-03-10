
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { VideoFormData, Playlist, Video } from '@/lib/types';
import { MOCK_PLAYLISTS, MOCK_VIDEOS } from '@/lib/mockData';
import { v4 as uuid } from 'uuid';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const videoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  thumbnailUrl: z.string().url('Must be a valid URL'),
  videoUrl: z.string().url('Must be a valid URL'),
  duration: z.number().min(1, 'Duration must be at least 1 second'),
});

interface AddVideoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVideo: (video: VideoFormData) => void;
}

const AddVideoDialog: React.FC<AddVideoDialogProps> = ({ isOpen, onClose, onAddVideo }) => {
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
  const [durationMinutes, setDurationMinutes] = useState<string>('0');
  const [durationSeconds, setDurationSeconds] = useState<string>('0');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: '',
      description: '',
      thumbnailUrl: '',
      videoUrl: '',
      duration: 0,
      playlists: [],
    }
  });

  const onSubmit = (data: VideoFormData) => {
    try {
      // Calculate total duration in seconds
      const totalDuration = (parseInt(durationMinutes || '0') * 60) + parseInt(durationSeconds || '0');
      
      // Create the new video object with all required fields
      const newVideo: Video = {
        id: uuid(),
        title: data.title,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        videoUrl: data.videoUrl,
        duration: totalDuration,
        playlists: selectedPlaylists,
        dateAdded: new Date().toISOString().split('T')[0],
        views: 0
      };
      
      console.log("Adding new video:", newVideo);
      
      // Add the new video to the beginning of MOCK_VIDEOS array
      MOCK_VIDEOS.unshift(newVideo);
      
      // Call the callback to notify parent component
      onAddVideo(newVideo);
      
      // Reset form state
      reset();
      setSelectedPlaylists([]);
      setDurationMinutes('0');
      setDurationSeconds('0');
      
      // Close the dialog
      onClose();
      
      // Show success message
      toast.success('Video added successfully');
    } catch (error) {
      console.error("Error adding video:", error);
      toast.error('Failed to add video');
    }
  };

  const handlePlaylistToggle = (playlistId: string) => {
    setSelectedPlaylists(prev => 
      prev.includes(playlistId) 
        ? prev.filter(id => id !== playlistId) 
        : [...prev, playlistId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Add New Video</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new video to your gallery.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title')} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              {...register('description')}
              className="min-h-[80px]"
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
            <Input id="thumbnailUrl" {...register('thumbnailUrl')} />
            {errors.thumbnailUrl && <p className="text-sm text-destructive">{errors.thumbnailUrl.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="videoUrl">Video URL</Label>
            <Input id="videoUrl" {...register('videoUrl')} />
            {errors.videoUrl && <p className="text-sm text-destructive">{errors.videoUrl.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label>Duration</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-20"
              />
              <span>minutes</span>
              <Input
                type="number"
                min="0"
                max="59"
                value={durationSeconds}
                onChange={(e) => setDurationSeconds(e.target.value)}
                className="w-20"
              />
              <span>seconds</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Playlists</Label>
            <div className="grid grid-cols-2 gap-2">
              {MOCK_PLAYLISTS.map((playlist) => (
                <div key={playlist.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`playlist-${playlist.id}`}
                    checked={selectedPlaylists.includes(playlist.id)}
                    onCheckedChange={() => handlePlaylistToggle(playlist.id)}
                  />
                  <Label htmlFor={`playlist-${playlist.id}`} className="cursor-pointer">
                    {playlist.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Video</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVideoDialog;
