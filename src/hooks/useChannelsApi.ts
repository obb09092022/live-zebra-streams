
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Channel } from '@/lib/channelsData';

export interface ChannelFromDB {
  id: number;
  name: string;
  stream_url: string;
  logo: string;
  description: string | null;
  categories: string[];
  created_at?: string;
  updated_at?: string;
}

// Função para converter canal do formato DB para o formato do app
export function convertFromDB(channel: ChannelFromDB): Channel {
  return {
    id: channel.id,
    name: channel.name,
    streamUrl: channel.stream_url,
    logo: channel.logo,
    description: channel.description || '',
    categories: channel.categories
  };
}

// Função para converter canal do formato do app para o formato DB
export function convertToDB(channel: Omit<Channel, 'id'>): Omit<ChannelFromDB, 'id' | 'created_at' | 'updated_at'> {
  return {
    name: channel.name,
    stream_url: channel.streamUrl,
    logo: channel.logo,
    description: channel.description,
    categories: channel.categories
  };
}

export function useChannelsApi() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Buscar todos os canais
  const fetchChannels = async (): Promise<Channel[]> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .order('id');

      if (error) throw error;

      // Converter do formato DB para o formato do app
      return (data || []).map(convertFromDB);
    } catch (error) {
      console.error('Erro ao buscar canais:', error);
      toast({
        title: 'Erro ao buscar canais',
        description: 'Não foi possível carregar os canais. Tente novamente mais tarde.',
        variant: 'destructive'
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Adicionar um novo canal
  const addChannel = async (channel: Omit<Channel, 'id'>): Promise<Channel | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('channels')
        .insert(convertToDB(channel))
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Canal adicionado',
        description: `O canal ${channel.name} foi adicionado com sucesso.`
      });

      return convertFromDB(data);
    } catch (error) {
      console.error('Erro ao adicionar canal:', error);
      toast({
        title: 'Erro ao adicionar canal',
        description: 'Não foi possível adicionar o canal. Verifique os dados e tente novamente.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar um canal existente
  const updateChannel = async (id: number, channel: Omit<Channel, 'id'>): Promise<Channel | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('channels')
        .update(convertToDB(channel))
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Canal atualizado',
        description: `O canal ${channel.name} foi atualizado com sucesso.`
      });

      return convertFromDB(data);
    } catch (error) {
      console.error('Erro ao atualizar canal:', error);
      toast({
        title: 'Erro ao atualizar canal',
        description: 'Não foi possível atualizar o canal. Verifique os dados e tente novamente.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Excluir um canal
  const deleteChannel = async (id: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('channels')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Canal excluído',
        description: 'O canal foi excluído com sucesso.'
      });

      return true;
    } catch (error) {
      console.error('Erro ao excluir canal:', error);
      toast({
        title: 'Erro ao excluir canal',
        description: 'Não foi possível excluir o canal. Tente novamente mais tarde.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar categorias
  const fetchCategories = async (): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('name')
        .order('id');

      if (error) throw error;

      return data.map(category => category.name);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      toast({
        title: 'Erro ao buscar categorias',
        description: 'Não foi possível carregar as categorias. Tente novamente mais tarde.',
        variant: 'destructive'
      });
      return [];
    }
  };

  return {
    isLoading,
    fetchChannels,
    addChannel,
    updateChannel,
    deleteChannel,
    fetchCategories
  };
}
