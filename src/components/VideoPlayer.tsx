
import React, { useEffect, useRef, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Video } from '@/lib/types';
import { formatDuration } from '@/lib/mockData';
import { Play, Pause, Volume2, VolumeX, X, Maximize, ChevronLeft, ChevronRight } from 'lucide-react';

interface VideoPlayerProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (!videoElement) return;
    
    const handleTimeUpdate = () => {
      if (videoElement.duration) {
        setProgress((videoElement.currentTime / videoElement.duration) * 100);
        setCurrentTime(videoElement.currentTime);
      }
    };
    
    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
      
      // Autoplay when opened
      if (isOpen) {
        videoElement.play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      videoElement.currentTime = 0;
    };
    
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('ended', handleEnded);
    
    // Auto-hide controls
    const showControlsTemporarily = () => {
      setIsControlsVisible(true);
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setIsControlsVisible(false);
        }
      }, 3000);
    };
    
    const playerContainer = videoElement.parentElement;
    playerContainer?.addEventListener('mousemove', showControlsTemporarily);
    
    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('ended', handleEnded);
      playerContainer?.removeEventListener('mousemove', showControlsTemporarily);
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isOpen, isPlaying]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
    setIsControlsVisible(true);
    
    // Reset auto-hide timer
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (!isPlaying) {
        setIsControlsVisible(false);
      }
    }, 3000);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  const enterFullscreen = () => {
    if (!videoRef.current) return;
    
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleDialogClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onClose();
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;
    
    videoRef.current.currentTime += seconds;
  };

  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] p-0 bg-background/95 backdrop-blur-md overflow-hidden animate-scale-in">
        <div className="relative aspect-video max-h-[80vh]" onDoubleClick={enterFullscreen}>
          <video
            ref={videoRef}
            src={video.videoUrl}
            className="w-full h-full object-contain bg-black"
            onClick={togglePlay}
          />
          
          {/* Video controls overlay */}
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 flex flex-col justify-end p-4 ${isControlsVisible ? 'opacity-100' : 'opacity-0'}`}
          >
            {/* Title bar */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-medium text-lg line-clamp-1">{video.title}</h3>
                <Button variant="ghost" size="icon" onClick={handleDialogClose} className="text-white hover:bg-white/20">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Progress bar */}
            <div 
              className="w-full h-1 bg-white/20 rounded-full cursor-pointer mb-4"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-primary rounded-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Control buttons */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-white/20">
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                
                <Button variant="ghost" size="icon" onClick={() => skipTime(-10)} className="text-white hover:bg-white/20">
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only">Back 10s</span>
                </Button>
                
                <Button variant="ghost" size="icon" onClick={() => skipTime(10)} className="text-white hover:bg-white/20">
                  <ChevronRight className="h-5 w-5" />
                  <span className="sr-only">Forward 10s</span>
                </Button>
                
                <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/20">
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                
                <span className="text-white text-sm">
                  {formatDuration(Math.floor(currentTime))} / {formatDuration(Math.floor(duration))}
                </span>
              </div>
              
              <div>
                <Button variant="ghost" size="icon" onClick={enterFullscreen} className="text-white hover:bg-white/20">
                  <Maximize className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <DialogHeader>
            <DialogTitle>{video.title}</DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              {video.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <div>Added on {new Date(video.dateAdded).toLocaleDateString()}</div>
            <div>{video.views} views</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;
