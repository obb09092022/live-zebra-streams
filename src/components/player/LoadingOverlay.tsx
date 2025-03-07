
import React from "react";

interface LoadingOverlayProps {
  isLoading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  if (!isLoading) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full border-4 border-zebra-500 border-t-transparent animate-spin"></div>
        <p className="text-white font-medium">Carregando canal...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
