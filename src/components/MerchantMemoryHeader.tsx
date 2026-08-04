import React, { useState, useEffect } from "react";
import { Zap, Users, Target, MoreHorizontal, ArrowLeftRight } from "lucide-react";
import { MerchantProfileDrawer } from "./merchant/MerchantProfileDrawer";

interface MerchantMemoryHeaderProps {
  hasData: boolean;
  onboardingData: any;
  activeProjectId: string;
  projectName: string;
  setWorkflowTab: (tab: any) => void;
}

export function MerchantMemoryHeader({
  hasData,
  onboardingData,
  activeProjectId,
  projectName,
  setWorkflowTab,
}: MerchantMemoryHeaderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConnectionError, setIsConnectionError] = useState(false); // Can be driven by props in real app

  useEffect(() => {
    const handleOpenDrawer = () => setIsDrawerOpen(true);
    window.addEventListener('open-merchant-profile-drawer', handleOpenDrawer);
    return () => window.removeEventListener('open-merchant-profile-drawer', handleOpenDrawer);
  }, []);

  if (!hasData) return null;

  return (
    <>
      <div className="h-[64px] shrink-0 px-6 flex items-center justify-between bg-white border-b border-neutral-200 z-10 relative">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setIsDrawerOpen(true)}
        >
          <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white font-bold text-[14px] group-hover:bg-primary-600 transition-colors shadow-sm">
            {onboardingData?.name?.[0] || '特'}
          </div>
          
          <div className="flex items-center gap-4">
            <h1 className="text-[15px] font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
              {onboardingData?.name || '特唯普宠物食品'}
            </h1>
            
            <div className="w-px h-3 bg-neutral-300"></div>
            
            <div className="text-[13px] text-neutral-500 font-medium">
              宠物食品 · 幼犬主粮
            </div>
            
            {isConnectionError && (
              <span className="ml-2 px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 text-[11px] font-bold rounded-md">
                商家资料未完整连接
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 rounded-lg transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
      <MerchantProfileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        projectName={projectName}
        onboardingData={onboardingData}
      />
    </>
  );
}
