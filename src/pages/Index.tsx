
import React from "react";
import { ChannelProvider } from "@/context/ChannelContext";
import Sidebar from "@/components/Sidebar";
import VideoPlayer from "@/components/VideoPlayer";
import ChannelCarousel from "@/components/ChannelCarousel";
import CategoriesMenu from "@/components/CategoriesMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
            {isMobile && (
              <div className="flex items-center justify-between mb-3">
                <h1 className="text-xl font-bold text-white">TV Zebra</h1>
              </div>
            )}
            
            <VideoPlayer />
            
            {isMobile && <CategoriesMenu />}
            
            <ChannelCarousel />
          </div>
        </main>
      </div>
    </ChannelProvider>
  );
};

export default Index;
