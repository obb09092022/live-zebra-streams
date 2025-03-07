
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
        
        <main className="flex-1 pt-4 pb-8 px-2 sm:px-4 overflow-y-auto">
          <div className="max-w-full mx-auto">
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
            
            {/* Player fixo ao rolar a página - agora ocupa toda a largura */}
            <div className="fixed top-16 left-0 right-0 z-10 bg-background pt-2 pb-4 px-4 h-[60vh]">
              <div className="max-w-full mx-auto h-full">
                <VideoPlayer />
              </div>
            </div>
            
            {/* Menu móvel - botão para mostrar/esconder */}
            {isMobile && (
              <div className="mb-4 mt-[60vh]">
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
            <div className="mt-[calc(60vh+2rem)] pt-4 border-t border-border/30">
              <ChannelCarousel />
            </div>
          </div>
        </main>
      </div>
    </ChannelProvider>
  );
};

export default Index;
