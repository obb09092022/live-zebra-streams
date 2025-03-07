
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Settings, Tv } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return null; // Don't render sidebar on mobile
  }
  
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
      
      <div className="flex-1"></div>
      
      <div className="p-4 border-t border-sidebar-border">
        {!isCollapsed && (
          <Link 
            to="/controle" 
            className="flex items-center gap-2 text-sidebar-foreground hover:text-white transition-colors"
          >
            <Settings size={18} />
            <span>Painel de Controle</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
