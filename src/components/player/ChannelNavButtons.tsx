
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChannelNavButtonsProps {
  showControls: boolean;
  isLoading: boolean;
  onPrevChannel: () => void;
  onNextChannel: () => void;
}

const ChannelNavButtons: React.FC<ChannelNavButtonsProps> = ({
  showControls,
  isLoading,
  onPrevChannel,
  onNextChannel
}) => {
  return (
    <>
      <button 
        onClick={onPrevChannel}
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 flex items-center justify-center text-white z-20 transition-all duration-300",
          showControls || isLoading ? "opacity-100" : "opacity-0",
          "hover:bg-black/80 hover:scale-110"
        )}
        aria-label="Canal anterior"
      >
        <ChevronLeft size={28} />
      </button>
      
      <button 
        onClick={onNextChannel}
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 flex items-center justify-center text-white z-20 transition-all duration-300",
          showControls || isLoading ? "opacity-100" : "opacity-0",
          "hover:bg-black/80 hover:scale-110"
        )}
        aria-label="Próximo canal"
      >
        <ChevronRight size={28} />
      </button>
    </>
  );
};

export default ChannelNavButtons;
