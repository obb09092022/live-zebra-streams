
import React, { useRef, useState } from "react";
import { useChannelContext } from "@/context/ChannelContext";
import { cn } from "@/lib/utils";
import { useHlsPlayer } from "@/hooks/useHlsPlayer";
import LoadingOverlay from "./player/LoadingOverlay";
import ChannelNavButtons from "./player/ChannelNavButtons";
import PlaybackControls from "./player/PlaybackControls";

const VideoPlayer: React.FC = () => {
  const { currentChannel, isLoading, setIsLoading, channels, setCurrentChannel } = useChannelContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [volume, setVolume] = useState(1);
  const [prevVolume, setPrevVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  
  // Use the custom hook for HLS video setup
  const { isPlaying, setIsPlaying } = useHlsPlayer({
    videoRef,
    currentChannel,
    setIsLoading
  });

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => {
          console.error("Play was prevented:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => {
          console.error(`Error attempting to exit full-screen mode: ${err.message}`);
        });
      } else {
        containerRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to request full-screen mode: ${err.message}`);
        });
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        setVolume(prevVolume);
        videoRef.current.volume = prevVolume;
      } else {
        setPrevVolume(volume);
        setVolume(0);
        videoRef.current.volume = 0;
      }
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const navigateToChannel = (direction: 'next' | 'prev') => {
    const currentIndex = channels.findIndex(c => c.id === currentChannel.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex < channels.length - 1 ? currentIndex + 1 : 0;
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : channels.length - 1;
    }
    
    setCurrentChannel(channels[newIndex]);
  };

  // Track fullscreen state changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "zebra-player-container group w-full h-full",
        isFullscreen && "fixed inset-0 bg-black z-50 rounded-none"
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Loading overlay */}
      <LoadingOverlay isLoading={isLoading} />
      
      {/* Channel navigation buttons */}
      <ChannelNavButtons 
        showControls={showControls}
        isLoading={isLoading}
        onPrevChannel={() => navigateToChannel('prev')}
        onNextChannel={() => navigateToChannel('next')}
      />
      
      {/* Video element */}
      <video 
        ref={videoRef}
        className={cn(
          "w-full h-full object-contain", 
          isFullscreen && "max-h-screen"
        )}
        playsInline
        autoPlay
        controls={false}
      />
      
      {/* Playback controls */}
      <PlaybackControls 
        isPlaying={isPlaying}
        volume={volume}
        isMuted={isMuted}
        currentChannelName={currentChannel.name}
        onTogglePlay={togglePlay}
        onToggleMute={toggleMute}
        onVolumeChange={handleVolumeChange}
        onToggleFullscreen={toggleFullscreen}
      />
    </div>
  );
};

export default VideoPlayer;
