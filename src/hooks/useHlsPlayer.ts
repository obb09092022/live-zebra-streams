
import { useEffect, useState, RefObject, useCallback } from "react";
import Hls from "hls.js";
import { Channel } from "@/lib/channelsData";

interface UseHlsPlayerProps {
  videoRef: RefObject<HTMLVideoElement>;
  currentChannel: Channel;
  setIsLoading: (loading: boolean) => void;
}

export function useHlsPlayer({ videoRef, currentChannel, setIsLoading }: UseHlsPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const setupHls = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Verificar se a URL do stream existe
    if (!currentChannel || !currentChannel.streamUrl) {
      console.error("Stream URL is missing", currentChannel);
      setIsLoading(false);
      return;
    }

    let hls: Hls | null = null;
    
    setIsLoading(true);
    console.log("Loading channel:", currentChannel.name, currentChannel.streamUrl);
    
    if (hls) {
      hls.destroy();
    }

    if (Hls.isSupported()) {
      hls = new Hls({
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        liveSyncDuration: 3,
        liveMaxLatencyDuration: 10,
        enableWorker: true,
        lowLatencyMode: true,
      });
      
      hls.loadSource(currentChannel.streamUrl);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("Manifest parsed successfully");
        setIsLoading(false);
        video.play().catch(error => {
          console.error("Autoplay was prevented:", error);
          setIsPlaying(false);
        });
      });
      
      hls.on(Hls.Events.ERROR, (_, data) => {
        console.error("HLS.js error:", data);
        if (data.fatal) {
          console.error("Fatal HLS.js error:", data);
          setIsLoading(false);
          
          // Tentar recuperar de erros fatais
          switch(data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log("Network error, trying to recover...");
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log("Media error, trying to recover...");
              hls?.recoverMediaError();
              break;
            default:
              console.log("Fatal error, cannot recover");
              break;
          }
        }
      });

      // Retornar a destruição do Hls
      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = currentChannel.streamUrl;
      video.addEventListener("loadedmetadata", () => {
        console.log("Native HLS support - metadata loaded");
        setIsLoading(false);
        video.play().catch(error => {
          console.error("Autoplay was prevented:", error);
          setIsPlaying(false);
        });
      });
      
      video.addEventListener("error", (e) => {
        console.error("Video error:", video.error);
        setIsLoading(false);
      });
      
      // Retornar a limpeza
      return () => {
        video.removeEventListener("loadedmetadata", () => {});
        video.removeEventListener("error", () => {});
      };
    } else {
      console.error("HLS is not supported in this browser and no native support");
      setIsLoading(false);
    }
  }, [currentChannel, setIsLoading, videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const cleanup = setupHls();
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      if (cleanup) cleanup();
    };
  }, [currentChannel, setupHls, videoRef]);

  return { isPlaying, setIsPlaying };
}
