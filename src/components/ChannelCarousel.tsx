
import React from "react";
import { useChannelContext } from "@/context/ChannelContext";
import ChannelCard from "./ChannelCard";
import { cn } from "@/lib/utils";

const ChannelCarousel: React.FC = () => {
  const { filteredChannels, selectedCategory } = useChannelContext();
  const isAllCategory = selectedCategory === "Todos";
  
  return (
    <div className="relative px-2">
      <h3 className="text-lg font-medium mb-3 sticky top-0 bg-background py-2">
        {isAllCategory ? "Todos os Canais" : `Canais: ${selectedCategory}`}
      </h3>
      
      <div className="space-y-2 overflow-y-auto">
        {filteredChannels.length > 0 ? (
          filteredChannels.map(channel => (
            <ChannelCard 
              key={channel.id} 
              channel={channel} 
              layout="list"
              isAllCategory={isAllCategory}
            />
          ))
        ) : (
          <div className="text-center py-4 w-full text-muted-foreground">
            Nenhum canal encontrado nesta categoria.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelCarousel;
