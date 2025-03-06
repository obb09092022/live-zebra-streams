
import React from "react";
import { Channel } from "@/lib/channelsData";
import { useChannelContext } from "@/context/ChannelContext";
import { cn } from "@/lib/utils";

interface ChannelCardProps {
  channel: Channel;
  layout?: "grid" | "list";
  isAllCategory?: boolean;
}

const ChannelCard: React.FC<ChannelCardProps> = ({ 
  channel, 
  layout = "grid",
  isAllCategory = false
}) => {
  const { currentChannel, setCurrentChannel, setIsLoading } = useChannelContext();
  const isActive = currentChannel.id === channel.id;
  
  const handleChannelSelect = () => {
    if (!isActive) {
      setIsLoading(true);
      setCurrentChannel(channel);
    }
  };
  
  if (layout === "list") {
    return (
      <button
        onClick={handleChannelSelect}
        className={cn(
          "zebra-sidebar-item w-full text-left group transition-all duration-200 mb-2 bg-sidebar rounded-md hover:bg-beige/20 hover:text-white",
          isActive && "zebra-sidebar-item-active"
        )}
      >
        <div className="flex items-center w-full">
          <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 mr-3">
            <img 
              src={channel.logo} 
              alt={channel.name} 
              className="w-full h-full object-contain bg-black/20 p-1"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/48x48/black/white?text=TV";
              }}
            />
          </div>
          <div className="flex flex-col flex-1">
            <span className="truncate font-medium group-hover:text-white">{channel.name}</span>
            <span className="text-xs text-muted-foreground line-clamp-1">{channel.description}</span>
          </div>
        </div>
      </button>
    );
  }
  
  return (
    <button
      onClick={handleChannelSelect}
      className={cn(
        "zebra-card flex flex-col items-center p-2 hover:scale-105 transition-transform duration-200",
        isActive && "zebra-thumb-active",
        isAllCategory ? "w-[180px]" : "w-[140px]"
      )}
    >
      <div className={cn(
        "w-full rounded overflow-hidden bg-black/30 mb-2",
        isAllCategory ? "aspect-video" : "aspect-video"
      )}>
        <img 
          src={channel.logo} 
          alt={channel.name} 
          className="w-full h-full object-contain p-2"
          onError={(e) => {
            (e.target as HTMLImageElement).src = isAllCategory 
              ? "https://placehold.co/180x100/black/white?text=TV"
              : "https://placehold.co/140x80/black/white?text=TV";
          }}
        />
      </div>
      <span className={cn(
        "font-medium truncate w-full text-center",
        isAllCategory ? "text-base" : "text-sm"
      )}>
        {channel.name}
      </span>
      {isAllCategory && (
        <span className="text-xs text-muted-foreground mt-1 line-clamp-1">
          {channel.categories.join(" • ")}
        </span>
      )}
    </button>
  );
};

export default ChannelCard;
