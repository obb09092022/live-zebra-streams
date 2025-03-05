import React, { useRef } from "react";
import { useChannelContext } from "@/context/ChannelContext";
import ChannelCard from "./ChannelCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const ChannelCarousel: React.FC = () => {
  const { filteredChannels, selectedCategory } = useChannelContext();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isAllCategory = selectedCategory === "Todos";
  
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = isAllCategory ? 400 : 300;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      
      scrollContainerRef.current.scrollTo({
        left: direction === "left" 
          ? currentScroll - scrollAmount 
          : currentScroll + scrollAmount,
        behavior: "smooth"
      });
    }
  };
  
  return (
    <div className="relative mt-4 px-4">
      <h3 className="text-lg font-medium mb-3">
        {isAllCategory ? "Todos os Canais" : `Canais: ${selectedCategory}`}
      </h3>
      
      <div className="relative group">
        <div 
          ref={scrollContainerRef}
          className={cn(
            "flex gap-4 overflow-x-auto scrollbar-hide pb-6 scroll-smooth",
            isAllCategory ? "pl-1 pr-4" : "gap-3 pb-4"
          )}
        >
          {filteredChannels.length > 0 ? (
            filteredChannels.map(channel => (
              <ChannelCard 
                key={channel.id} 
                channel={channel} 
                isAllCategory={isAllCategory}
              />
            ))
          ) : (
            <div className="text-center py-4 w-full text-muted-foreground">
              Nenhum canal encontrado nesta categoria.
            </div>
          )}
        </div>
        
        {filteredChannels.length > (isAllCategory ? 2 : 3) && (
          <>
            <button 
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-zebra-dark/90 text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
              disabled={scrollContainerRef.current?.scrollLeft === 0}
            >
              <ChevronLeft size={20} />
            </button>
            
            <button 
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-zebra-dark/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ChannelCarousel;
