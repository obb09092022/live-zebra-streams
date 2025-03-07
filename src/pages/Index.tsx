
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
        {/* Sidebar is now hidden completely */}
        
        <main className="flex-1 overflow-y-auto">
          {/* Header fixo */}
          <div className="fixed top-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border/30 px-4 py-3">
            <div className="max-w-full mx-auto flex items-center justify-between">
              <h1 className="text-xl font-bold text-white">TV Zebra</h1>
              <Link to="/controle" className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors">
                <Settings size={16} />
                <span>Controle</span>
              </Link>
            </div>
            
            {/* Categoria Menu fixo, apenas visível em desktop */}
            {!isMobile && (
              <div className="pt-2 pb-3">
                <CategoriesMenu />
              </div>
            )}
          </div>
          
          {/* Espaço para compensar o header fixo */}
          <div className={!isMobile ? "pt-28" : "pt-16"}></div>
          
          {/* Player fixo */}
          <div className="fixed top-[calc(var(--header-height))] left-0 right-0 z-20 bg-background pt-2 pb-4 px-4 h-[60vh]">
            <div className="max-w-full mx-auto h-full">
              <VideoPlayer />
            </div>
          </div>
            
          {/* Menu móvel - botão para mostrar/esconder */}
          {isMobile && (
            <div className="fixed top-16 left-0 right-0 z-25 bg-background px-4 py-2">
              <button 
                className="w-full py-2 bg-sidebar-accent rounded-md text-white flex items-center justify-center"
                onClick={() => {
                  const menuEl = document.getElementById('mobile-categories');
                  if (menuEl) {
                    menuEl.classList.toggle('hidden');
                  }
                }}
              >
                Mostrar/Esconder Categorias
              </button>
              <div id="mobile-categories" className="hidden mt-2">
                <CategoriesMenu />
              </div>
            </div>
          )}
            
          {/* Channel list now starts below the fixed player */}
          <div className="mt-[calc(60vh+var(--header-height))] pt-4 border-t border-border/30 px-4 pb-8">
            <ChannelCarousel />
          </div>
        </main>
      </div>
    </ChannelProvider>
  );
};

export default Index;
