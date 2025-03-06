
import React from "react";
import { Maximize, Pause, Play, Volume, Volume2, VolumeX } from "lucide-react";

interface PlaybackControlsProps {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentChannelName: string;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleFullscreen: () => void;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  volume,
  isMuted,
  currentChannelName,
  onTogglePlay,
  onToggleMute,
  onVolumeChange,
  onToggleFullscreen
}) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onTogglePlay} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-zebra-500/80 text-white hover:bg-zebra-600/80 transition-colors"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={onToggleMute}
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
              onChange={onVolumeChange}
              className="w-20 h-1.5 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-white text-sm font-medium">
            {currentChannelName}
          </div>
          
          <button 
            onClick={onToggleFullscreen}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          >
            <Maximize size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaybackControls;
