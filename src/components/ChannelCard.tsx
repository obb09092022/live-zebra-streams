
import React from "react";
import { Channel } from "@/lib/channelsData";
import { useChannelContext } from "@/context/ChannelContext";
import { cn } from "@/lib/utils";

interface ChannelCardProps {
  channel: Channel;
  layout?: "grid" | "list";
}

const ChannelCard: React.FC<ChannelCardProps> = ({ channel, layout = "grid" }) => {
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
        "zebra-card flex flex-col items-center p-1 w-[140px] hover:scale-105 transition-transform duration-200",
        isActive && "zebra-thumb-active"
      )}
    >
      <div className="w-full aspect-video rounded overflow-hidden bg-black/30 mb-2">
        <img 
          src={channel.logo} 
          alt={channel.name} 
          className="w-full h-full object-contain p-2"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/140x80/black/white?text=TV";
          }}
        />
      </div>
      <span className="text-sm font-medium truncate w-full text-center">{channel.name}</span>
    </button>
  );
};

export default ChannelCard;
