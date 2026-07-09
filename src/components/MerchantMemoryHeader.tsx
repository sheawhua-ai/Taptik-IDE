import React, { useState, useEffect } from "react";
import { Zap, Users, Target } from "lucide-react";
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

  useEffect(() => {
    const handleOpenDrawer = () => setIsDrawerOpen(true);
    window.addEventListener('open-merchant-profile-drawer', handleOpenDrawer);
    return () => window.removeEventListener('open-merchant-profile-drawer', handleOpenDrawer);
  }, []);

  if (!hasData) return null;

  return (
    <>
      <div className="h-[88px] shrink-0 px-8 flex items-center justify-between bg-white border-b border-neutral-200 z-10 relative">
        <div 
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => setIsDrawerOpen(true)}
        >
          <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center text-white font-bold text-[18px] group-hover:scale-105 transition-transform shadow-md">
            {onboardingData?.name?.[0] || '特'}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-[18px] font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
                {onboardingData?.name || '特唯普宠物食品'}
              </h1>
              <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[11px] font-bold rounded">
                商家知识库已连接
              </span>
            </div>
            <div className="flex items-center gap-3 text-[12px] text-neutral-500 font-medium">
              <span className="flex items-center gap-1"><Users size={12}/> 宠物食品行业 / 品牌方</span>
              <span className="flex items-center gap-1"><Target size={12}/> 核心品类：幼犬主粮</span>
              <span className="flex items-center gap-1 text-primary-600 ml-2 hover:text-primary-700 bg-primary-50 px-2.5 py-1 rounded-md transition-colors">查看商家画像</span>
            </div>
          </div>
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
