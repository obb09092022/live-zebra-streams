
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
          "zebra-sidebar-item w-full text-left",
          isActive && "zebra-sidebar-item-active"
        )}
      >
        <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
          <img 
            src={channel.logo} 
            alt={channel.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/32x32/black/white?text=TV";
            }}
          />
        </div>
        <span className="truncate">{channel.name}</span>
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
