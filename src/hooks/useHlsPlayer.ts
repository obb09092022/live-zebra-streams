
import { useEffect, useState, RefObject } from "react";
import Hls from "hls.js";
import { Channel } from "@/lib/channelsData";

interface UseHlsPlayerProps {
  videoRef: RefObject<HTMLVideoElement>;
  currentChannel: Channel;
  setIsLoading: (loading: boolean) => void;
}

export function useHlsPlayer({ videoRef, currentChannel, setIsLoading }: UseHlsPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

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
  }, [currentChannel, setIsLoading, videoRef]);

  return { isPlaying, setIsPlaying };
}
