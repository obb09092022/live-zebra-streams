
import React, { useState } from "react";
import { useChannelContext } from "@/context/ChannelContext";
import { Menu, X, Newspaper, Film, Award, BookOpen, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface CategoryIconProps {
  category: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ category }) => {
  switch (category) {
    case "Notícias":
      return <Newspaper className="w-5 h-5" />;
    case "Esportes":
      return <Play className="w-5 h-5" />;
    case "Entretenimento":
      return <Film className="w-5 h-5" />;
    case "Cultura":
      return <Award className="w-5 h-5" />;
    case "Educacional":
      return <BookOpen className="w-5 h-5" />;
    default:
      return <Play className="w-5 h-5" />;
  }
};

const CategoriesMenu: React.FC = () => {
  const { availableCategories, selectedCategory, setSelectedCategory } = useChannelContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };
  
  if (isMobile) {
    return (
      <div className="relative z-30">
        <button 
          onClick={toggleMenu}
          className="fixed bottom-4 right-4 z-40 bg-zebra rounded-full p-3 shadow-lg"
        >
          {isMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
        </button>
        
        {isMenuOpen && (
          <div className="fixed inset-0 z-30 bg-black/70" onClick={toggleMenu}>
            <div 
              className="fixed bottom-16 right-4 bg-sidebar p-2 rounded-lg shadow-lg w-48" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col space-y-1">
                {availableCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={cn(
                      "zebra-sidebar-item",
                      selectedCategory === category && "zebra-sidebar-item-active"
                    )}
                  >
                    {category !== "Todos" && <CategoryIcon category={category} />}
                    <span>{category}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="bg-sidebar rounded-lg overflow-hidden mb-4">
      <h3 className="text-sm font-medium p-3 border-b border-sidebar-border">Categorias</h3>
      <div className="p-2">
        {availableCategories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategorySelect(category)}
            className={cn(
              "zebra-sidebar-item mb-1 last:mb-0",
              selectedCategory === category && "zebra-sidebar-item-active"
            )}
          >
            {category !== "Todos" && <CategoryIcon category={category} />}
            <span>{category}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoriesMenu;
