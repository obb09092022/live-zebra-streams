
import React, { createContext, useContext, useState, useEffect } from "react";
import { Channel, channels as initialChannels, categories } from "@/lib/channelsData";

interface ChannelContextType {
  channels: Channel[];
  currentChannel: Channel;
  setCurrentChannel: (channel: Channel) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  filteredChannels: Channel[];
  availableCategories: string[];
  addChannel: (channel: Omit<Channel, "id">) => boolean;
}

const ChannelContext = createContext<ChannelContextType | undefined>(undefined);

export const useChannelContext = () => {
  const context = useContext(ChannelContext);
  if (!context) {
    throw new Error("useChannelContext must be used within a ChannelProvider");
  }
  return context;
};

export const ChannelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [channels, setChannels] = useState<Channel[]>(() => {
    // Tentar carregar canais do localStorage
    const savedChannels = localStorage.getItem("zebra-channels");
    return savedChannels ? JSON.parse(savedChannels) : initialChannels;
  });
  
  const [currentChannel, setCurrentChannel] = useState<Channel>(() => {
    // Carregar último canal assistido
    const savedChannelId = localStorage.getItem("zebra-last-channel");
    if (savedChannelId) {
      const channel = channels.find(c => c.id === parseInt(savedChannelId));
      if (channel) {
        return channel;
      }
    }
    return channels[0];
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  
  // Filter channels based on selected category
  const filteredChannels = selectedCategory === "Todos" 
    ? channels 
    : channels.filter(channel => channel.categories.includes(selectedCategory));
  
  // Função para adicionar novo canal
  const addChannel = (channel: Omit<Channel, "id">): boolean => {
    try {
      // Verificar limite de 1000 canais
      if (channels.length >= 1000) {
        console.error("Limite de 1000 canais atingido");
        return false;
      }
      
      // Gerar novo ID (o maior ID atual + 1)
      const newId = Math.max(...channels.map(c => c.id), 0) + 1;
      
      const newChannel: Channel = {
        ...channel,
        id: newId
      };
      
      setChannels(prev => {
        const updatedChannels = [...prev, newChannel];
        // Salvar no localStorage
        localStorage.setItem("zebra-channels", JSON.stringify(updatedChannels));
        return updatedChannels;
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao adicionar canal:", error);
      return false;
    }
  };
  
  // Salvar canais no localStorage quando forem alterados
  useEffect(() => {
    localStorage.setItem("zebra-channels", JSON.stringify(channels));
  }, [channels]);
  
  // Salvar último canal assistido no localStorage
  useEffect(() => {
    localStorage.setItem("zebra-last-channel", currentChannel.id.toString());
  }, [currentChannel]);
  
  return (
    <ChannelContext.Provider
      value={{
        channels,
        currentChannel,
        setCurrentChannel,
        isLoading,
        setIsLoading,
        selectedCategory,
        setSelectedCategory,
        filteredChannels,
        availableCategories: categories,
        addChannel
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
};
