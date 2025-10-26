
import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatDuration } from '@/lib/mockData';
import { Video } from '@/lib/types';
import { Play, Clock } from 'lucide-react';

interface VideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    setIsHovering(true);
    
    hoverTimeoutRef.current = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
      }
    }, 800);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Card 
      className="video-card overflow-hidden border-0 bg-transparent shadow-none hover:shadow-lg transition-all duration-500"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(video)}
    >
      <div className="video-thumbnail rounded-xl overflow-hidden relative">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isHovering ? 'opacity-0' : 'opacity-100'}`}
          loading="lazy"
        />
        
        {/* Preview video that appears on hover */}
        <video
          ref={videoRef}
          src={video.videoUrl}
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
        />
        
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{formatDuration(video.duration)}</span>
        </div>
        
        {/* Hover overlay with play button */}
        <div className={`thumbnail-overlay ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-black/30 backdrop-blur-xs rounded-full p-3 transition-transform duration-300 hover:scale-110">
            <Play className="h-12 w-12 text-white" fill="white" />
          </div>
        </div>
      </div>
      
      <CardContent className="px-2 pt-3 pb-1">
        <h3 className="font-medium line-clamp-1 text-base">{video.title}</h3>
        {video.description && (
          <p className="text-muted-foreground text-sm mt-1 line-clamp-1">{video.description}</p>
        )}
        
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>{new Date(video.dateAdded).toLocaleDateString()}</span>
          <span>{video.views} views</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
