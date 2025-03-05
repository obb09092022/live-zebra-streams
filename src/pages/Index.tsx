
import React from "react";
import { ChannelProvider } from "@/context/ChannelContext";
import Sidebar from "@/components/Sidebar";
import VideoPlayer from "@/components/VideoPlayer";
import ChannelCarousel from "@/components/ChannelCarousel";

const Index = () => {
  return (
    <ChannelProvider>
      <div className="min-h-screen flex bg-background">
        <Sidebar />
        
        <main className="flex-1 ml-64 pt-4 pb-8 px-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <VideoPlayer />
            <ChannelCarousel />
          </div>
        </main>
      </div>
    </ChannelProvider>
  );
};

export default Index;
