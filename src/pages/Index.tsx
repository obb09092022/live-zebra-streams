
import React from "react";
import { ChannelProvider } from "@/context/ChannelContext";
import Sidebar from "@/components/Sidebar";
import VideoPlayer from "@/components/VideoPlayer";
import ChannelCarousel from "@/components/ChannelCarousel";
import CategoriesMenu from "@/components/CategoriesMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <ChannelProvider>
      <div className="min-h-screen flex bg-background">
        <Sidebar />
        
        <main className={cn(
          "flex-1 pt-4 pb-8 px-2 sm:px-4 overflow-y-auto",
          isMobile ? "ml-0" : "ml-64"
        )}>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-xl font-bold text-white">TV Zebra</h1>
              <Link to="/admin" className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors">
                <Settings size={16} />
                <span>Admin</span>
              </Link>
            </div>
            
            {/* Categoria Menu fixo acima do player, apenas visível em desktop */}
            {!isMobile && (
              <div className="sticky top-0 z-20 bg-background pb-3 pt-1">
                <CategoriesMenu />
              </div>
            )}
            
            {/* Player fixo ao rolar a página */}
            <div className="sticky top-16 z-10 bg-background pt-2 pb-4">
              <VideoPlayer />
            </div>
            
            {/* Menu móvel permanece como menu flutuante */}
            {isMobile && <CategoriesMenu />}
            
            <ChannelCarousel />
          </div>
        </main>
      </div>
    </ChannelProvider>
  );
};

export default Index;
