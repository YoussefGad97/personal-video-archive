
import React, { useEffect, useRef, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Video } from '@/lib/types';
import { formatDuration } from '@/lib/mockData';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  X, 
  Maximize, 
  ChevronLeft, 
  ChevronRight,
  PictureInPicture,
  RotateCcw
} from 'lucide-react';

interface VideoPlayerProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPictureInPicture, setIsPictureInPicture] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [hasError, setHasError] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen || !videoRef.current) return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipTime(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipTime(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.1));
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyF':
          e.preventDefault();
          enterFullscreen();
          break;
        case 'KeyP':
          e.preventDefault();
          togglePictureInPicture();
          break;
        case 'KeyR':
          e.preventDefault();
          restartVideo();
          break;
        case 'Escape':
          if (isFullscreen) {
            exitFullscreen();
          } else {
            handleDialogClose();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, volume]);

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
      console.log('Video metadata loaded:', {
        duration: videoElement.duration,
        videoWidth: videoElement.videoWidth,
        videoHeight: videoElement.videoHeight,
        src: videoElement.src
      });
      
      setDuration(videoElement.duration);
      
      // Autoplay when opened
      if (isOpen) {
        videoElement.play()
          .then(() => {
            console.log('Video autoplay successful');
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log('Video autoplay failed:', error);
            setIsPlaying(false);
          });
      }
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      videoElement.currentTime = 0;
    };
    
    const handleLoadStart = () => {
      console.log('Video load started');
      setIsLoading(true);
    };
    
    const handleCanPlay = () => {
      console.log('Video can play');
      setIsLoading(false);
      setIsBuffering(false);
    };
    
    const handleWaiting = () => {
      console.log('Video waiting/buffering');
      setIsBuffering(true);
    };
    
    const handlePlaying = () => {
      console.log('Video playing');
      setIsBuffering(false);
    };

    const handleError = (e: Event) => {
      console.error('Video error:', e);
      setIsLoading(false);
      setIsBuffering(false);
      setHasError(true);
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handlePictureInPictureChange = () => {
      setIsPictureInPicture(!!document.pictureInPictureElement);
    };
    
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('loadstart', handleLoadStart);
    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('waiting', handleWaiting);
    videoElement.addEventListener('playing', handlePlaying);
    videoElement.addEventListener('error', handleError);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('enterpictureinpicture', handlePictureInPictureChange);
    document.addEventListener('leavepictureinpicture', handlePictureInPictureChange);
    
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
      videoElement.removeEventListener('loadstart', handleLoadStart);
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('waiting', handleWaiting);
      videoElement.removeEventListener('playing', handlePlaying);
      videoElement.removeEventListener('error', handleError);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('enterpictureinpicture', handlePictureInPictureChange);
      document.removeEventListener('leavepictureinpicture', handlePictureInPictureChange);
      playerContainer?.removeEventListener('mousemove', showControlsTemporarily);
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isOpen, isPlaying]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    try {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error('Error playing video:', error);
            setIsPlaying(false);
          });
      }
      
      setIsControlsVisible(true);
      
      // Reset auto-hide timer
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setIsControlsVisible(false);
        }
      }, 3000);
    } catch (error) {
      console.error('Error toggling play:', error);
    }
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

  const handleVolumeChange = (newVolume: number) => {
    if (!videoRef.current) return;
    
    try {
      setVolume(newVolume);
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    } catch (error) {
      console.error('Error changing volume:', error);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (!videoRef.current) return;
    
    try {
      setPlaybackRate(rate);
      videoRef.current.playbackRate = rate;
    } catch (error) {
      console.error('Error changing playback rate:', error);
    }
  };

  const togglePictureInPicture = async () => {
    if (!videoRef.current) return;
    
    try {
      if (isPictureInPicture) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (error) {
      console.error('Picture-in-picture error:', error);
    }
  };

  const restartVideo = () => {
    if (!videoRef.current) return;
    
    videoRef.current.currentTime = 0;
    setProgress(0);
    setCurrentTime(0);
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const time = pos * duration;
    
    setHoverTime(time);
    setHoverPosition(pos * 100);
  };

  const handleProgressLeave = () => {
    setHoverTime(null);
    setHoverPosition(null);
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
            preload="metadata"
            crossOrigin="anonymous"
          />
          
          {/* Loading/Buffering overlay */}
          {(isLoading || isBuffering) && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-lg font-medium mb-2">
                  {isLoading ? 'Loading video...' : 'Buffering...'}
                </div>
                <Progress value={undefined} className="w-64" />
              </div>
            </div>
          )}
          
          {/* Error overlay */}
          {hasError && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-lg font-medium mb-2">Error Loading Video</div>
                <div className="text-sm text-red-300 mb-4">
                  Unable to load this video. Please check the URL or try again.
                </div>
                <Button 
                  onClick={() => {
                    setHasError(false);
                    if (videoRef.current) {
                      videoRef.current.load();
                    }
                  }}
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-black"
                >
                  Retry
                </Button>
              </div>
            </div>
          )}
          
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
            <div className="relative mb-4">
              <div 
                className="w-full h-2 bg-white/20 rounded-full cursor-pointer relative"
                onClick={handleProgressClick}
                onMouseMove={handleProgressHover}
                onMouseLeave={handleProgressLeave}
              >
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
                {/* Hover preview */}
                {hoverTime !== null && (
                  <div 
                    className="absolute top-0 h-full w-1 bg-white rounded-full pointer-events-none"
                    style={{ left: `${hoverPosition}%` }}
                  />
                )}
              </div>
              {/* Hover time tooltip */}
              {hoverTime !== null && (
                <div 
                  className="absolute -top-8 bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none"
                  style={{ left: `${hoverPosition}%`, transform: 'translateX(-50%)' }}
                >
                  {formatDuration(Math.floor(hoverTime))}
                </div>
              )}
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
                
                <Button variant="ghost" size="icon" onClick={restartVideo} className="text-white hover:bg-white/20">
                  <RotateCcw className="h-4 w-4" />
                  <span className="sr-only">Restart</span>
                </Button>
                
                {/* Volume control */}
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/20">
                    {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`
                    }}
                  />
                </div>
                
                <span className="text-white text-sm">
                  {formatDuration(Math.floor(currentTime))} / {formatDuration(Math.floor(duration))}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Playback speed */}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-white hover:bg-white/20 text-sm"
                  >
                    {playbackRate}x
                  </Button>
                  {showSettings && (
                    <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-2 min-w-[120px]">
                      <div className="text-white text-xs mb-2">Playback Speed</div>
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                        <button
                          key={rate}
                          onClick={() => {
                            handlePlaybackRateChange(rate);
                            setShowSettings(false);
                          }}
                          className={`block w-full text-left px-2 py-1 text-sm rounded hover:bg-white/20 ${
                            playbackRate === rate ? 'text-primary' : 'text-white'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <Button variant="ghost" size="icon" onClick={togglePictureInPicture} className="text-white hover:bg-white/20">
                  <PictureInPicture className="h-5 w-5" />
                </Button>
                
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
            {video.description && (
              <DialogDescription className="text-muted-foreground mt-2">
                {video.description}
              </DialogDescription>
            )}
          </DialogHeader>
          
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Added on {new Date(video.dateAdded).toLocaleDateString()}</span>
              <span>Duration: {formatDuration(video.duration)}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>{video.views} views</span>
              <span>Quality: Auto</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;
