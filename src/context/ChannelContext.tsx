
import React, { createContext, useContext, useState, useEffect } from "react";
import { Channel, channels } from "@/lib/channelsData";

interface ChannelContextType {
  channels: Channel[];
  currentChannel: Channel;
  setCurrentChannel: (channel: Channel) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
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
  const [currentChannel, setCurrentChannel] = useState<Channel>(channels[0]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Load last watched channel from localStorage on first render
    const savedChannelId = localStorage.getItem("zebra-last-channel");
    if (savedChannelId) {
      const channel = channels.find(c => c.id === parseInt(savedChannelId));
      if (channel) {
        setCurrentChannel(channel);
      }
    }
  }, []);
  
  // Save current channel to localStorage whenever it changes
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
        setIsLoading
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
};
