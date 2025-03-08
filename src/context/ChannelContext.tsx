
import React, { createContext, useContext, useState, useEffect } from "react";
import { Channel, categories } from "@/lib/channelsData";
import { useChannelsApi } from "@/hooks/useChannelsApi";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
  addChannel: (channel: Omit<Channel, "id">) => Promise<boolean>;
  updateChannel: (channel: Channel) => Promise<boolean>;
  deleteChannel: (id: number) => Promise<boolean>;
  refreshChannels: () => Promise<void>;
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
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [availableCategories, setAvailableCategories] = useState<string[]>(categories);
  
  const { fetchChannels, addChannel: apiAddChannel, updateChannel: apiUpdateChannel, 
          deleteChannel: apiDeleteChannel, fetchCategories } = useChannelsApi();
  const { toast } = useToast();

  // Carregar canais e categorias do Supabase
  const loadChannelsAndCategories = async () => {
    setIsLoading(true);
    try {
      // Carregar canais
      const channelsData = await fetchChannels();
      setChannels(channelsData);
      
      // Carregar categorias
      const categoriesData = await fetchCategories();
      setAvailableCategories(categoriesData);

      // Definir canal atual (primeiro da lista ou salvo anteriormente)
      if (channelsData.length > 0) {
        const savedChannelId = localStorage.getItem("zebra-last-channel");
        if (savedChannelId) {
          const channel = channelsData.find(c => c.id === parseInt(savedChannelId));
          if (channel) {
            setCurrentChannel(channel);
          } else {
            setCurrentChannel(channelsData[0]);
          }
        } else {
          setCurrentChannel(channelsData[0]);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os canais e categorias. Tentando usar dados locais.",
        variant: "destructive"
      });

      // Se falhar, tentar usar dados do localStorage
      const savedChannels = localStorage.getItem("zebra-channels");
      if (savedChannels) {
        setChannels(JSON.parse(savedChannels));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar canais quando forem modificados no Supabase
  useEffect(() => {
    // Função para atualizar canais ao vivo
    const setupRealtimeSubscription = async () => {
      const channel = supabase
        .channel('schema-db-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'channels' },
          async (payload) => {
            console.log('Mudança detectada:', payload);
            // Recarregar os canais
            await loadChannelsAndCategories();
          }
        )
        .subscribe();

      // Limpar inscrição quando o componente for desmontado
      return () => {
        supabase.removeChannel(channel);
      };
    };

    setupRealtimeSubscription();
  }, []);

  // Carregar canais na inicialização
  useEffect(() => {
    loadChannelsAndCategories();
  }, []);

  // Filter channels based on selected category
  const filteredChannels = selectedCategory === "Todos" 
    ? channels 
    : channels.filter(channel => channel.categories.includes(selectedCategory));
  
  // Função para adicionar novo canal
  const addChannel = async (channel: Omit<Channel, "id">): Promise<boolean> => {
    try {
      const newChannel = await apiAddChannel(channel);
      
      if (newChannel) {
        // Canal já será atualizado pelo realtime
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Erro ao adicionar canal:", error);
      return false;
    }
  };
  
  // Função para atualizar canal existente
  const updateChannel = async (updatedChannel: Channel): Promise<boolean> => {
    try {
      const result = await apiUpdateChannel(updatedChannel.id, updatedChannel);
      
      if (result) {
        // Se o canal atual for o que está sendo atualizado, atualize-o também
        if (currentChannel && currentChannel.id === updatedChannel.id) {
          setCurrentChannel(updatedChannel);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Erro ao atualizar canal:", error);
      return false;
    }
  };
  
  // Função para excluir canal
  const deleteChannel = async (id: number): Promise<boolean> => {
    try {
      // Não permitir excluir se só tiver um canal
      if (channels.length <= 1) {
        toast({
          title: "Operação não permitida",
          description: "Não é possível excluir o único canal disponível",
          variant: "destructive"
        });
        return false;
      }
      
      const success = await apiDeleteChannel(id);
      
      if (success) {
        // Se o canal atual for o que está sendo excluído, mude para o primeiro canal
        if (currentChannel && currentChannel.id === id) {
          const firstAvailableChannel = channels.find(c => c.id !== id);
          if (firstAvailableChannel) {
            setCurrentChannel(firstAvailableChannel);
          }
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Erro ao excluir canal:", error);
      return false;
    }
  };

  // Função para atualizar a lista de canais
  const refreshChannels = async (): Promise<void> => {
    await loadChannelsAndCategories();
  };
  
  // Salvar último canal assistido no localStorage
  useEffect(() => {
    if (currentChannel) {
      localStorage.setItem("zebra-last-channel", currentChannel.id.toString());
    }
  }, [currentChannel]);
  
  return (
    <ChannelContext.Provider
      value={{
        channels,
        currentChannel: currentChannel || {} as Channel, // Garante que sempre tem um valor
        setCurrentChannel,
        isLoading,
        setIsLoading,
        selectedCategory,
        setSelectedCategory,
        filteredChannels,
        availableCategories,
        addChannel,
        updateChannel,
        deleteChannel,
        refreshChannels
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
};
