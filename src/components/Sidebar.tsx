
import React, { useState } from "react";
import { useChannelContext } from "@/context/ChannelContext";
import ChannelCard from "./ChannelCard";
import { ChevronLeft, ChevronRight, Tv } from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar: React.FC = () => {
  const { channels } = useChannelContext();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <div 
      className={cn(
        "fixed top-0 left-0 h-full bg-sidebar z-20 transition-all duration-300 ease-in-out border-r border-sidebar-border flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center p-4 gap-3 h-16 border-b border-sidebar-border">
        {!isCollapsed && (
          <Tv className="w-6 h-6 text-zebra" />
        )}
        <h1 className={cn(
          "font-bold text-xl text-white transition-all duration-300",
          isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
        )}>
          TV Zebra
        </h1>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-6 h-6 flex items-center justify-center rounded-full bg-sidebar-accent/50 text-white hover:bg-sidebar-accent ml-auto"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
      
      <div className="overflow-y-auto flex-1">
        <div className="p-2">
          {channels.map(channel => (
            <ChannelCard 
              key={channel.id} 
              channel={channel} 
              layout="list" 
            />
          ))}
        </div>
      </div>
      
      <div className="p-2 text-xs text-center text-sidebar-foreground/50 border-t border-sidebar-border">
        {!isCollapsed && (
          <span>© 2023 TV Zebra</span>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
