
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
          "absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white z-20 transition-all duration-300",
          showControls || isLoading ? "opacity-100" : "opacity-0",
          "hover:bg-black/60"
        )}
        aria-label="Canal anterior"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button 
        onClick={onNextChannel}
        className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white z-20 transition-all duration-300",
          showControls || isLoading ? "opacity-100" : "opacity-0",
          "hover:bg-black/60"
        )}
        aria-label="Próximo canal"
      >
        <ChevronRight size={24} />
      </button>
    </>
  );
};

export default ChannelNavButtons;
