
import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { useChannelContext } from "@/context/ChannelContext";
import { Maximize, Pause, Play, Volume, Volume2, VolumeX } from "lucide-react";

const VideoPlayer: React.FC = () => {
  const { currentChannel, isLoading, setIsLoading } = useChannelContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [prevVolume, setPrevVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    const setupHls = () => {
      setIsLoading(true);
      
      if (hls) {
        hls.destroy();
      }

      if (Hls.isSupported()) {
        hls = new Hls({
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          liveSyncDuration: 3,
          liveMaxLatencyDuration: 10,
        });
        
        hls.loadSource(currentChannel.streamUrl);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
          video.play().catch(error => {
            console.error("Autoplay was prevented:", error);
            setIsPlaying(false);
          });
        });
        
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            console.error("HLS.js fatal error:", data);
            setIsLoading(false);
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // For Safari, which has native HLS support
        video.src = currentChannel.streamUrl;
        video.addEventListener("loadedmetadata", () => {
          setIsLoading(false);
          video.play().catch(error => {
            console.error("Autoplay was prevented:", error);
            setIsPlaying(false);
          });
        });
      }
    };

    setupHls();

    video.addEventListener('play', () => setIsPlaying(true));
    video.addEventListener('pause', () => setIsPlaying(false));
    
    return () => {
      if (hls) {
        hls.destroy();
      }
      
      video.removeEventListener('play', () => setIsPlaying(true));
      video.removeEventListener('pause', () => setIsPlaying(false));
    };
  }, [currentChannel, setIsLoading]);

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
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => {
          console.error(`Error attempting to exit full-screen mode: ${err.message}`);
        });
      } else {
        videoRef.current.requestFullscreen().catch(err => {
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

  return (
    <div className="zebra-player-container group">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full border-4 border-zebra-500 border-t-transparent animate-spin"></div>
            <p className="text-white font-medium">Carregando canal...</p>
          </div>
        </div>
      )}
      
      <video 
        ref={videoRef}
        className="w-full h-full object-cover animate-channel-switch"
        playsInline
        autoPlay
        controls={false}
      />
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={togglePlay} 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-zebra-500/80 text-white hover:bg-zebra-600/80 transition-colors"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleMute}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
              >
                {volume === 0 ? <VolumeX size={16} /> : volume < 0.5 ? <Volume2 size={16} /> : <Volume size={16} />}
              </button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1.5 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-white text-sm font-medium">
              {currentChannel.name}
            </div>
            
            <button 
              onClick={toggleFullscreen}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            >
              <Maximize size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
