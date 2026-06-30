import React, { useState } from "react";
import {
  Image as ImageIcon,
  Upload,
  FolderOpen,
  Cloud,
  Search,
  CheckCircle2,
  ShieldAlert,
  MoreVertical,
  Plus,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MaterialStationProps {
  activeProject: any;
}

export const MaterialStation: React.FC<MaterialStationProps> = ({
  activeProject,
}) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: '全部素材', icon: ImageIcon },
    { id: 'local', label: '本地源', icon: FolderOpen },
    { id: 'cloud', label: '云端同步', icon: Cloud },
    { id: 'review', label: '待验收', icon: CheckCircle2 },
    { id: 'risk', label: '高风险', icon: ShieldAlert },
  ];

  return (
    <div className="flex-1 flex h-full bg-white overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-neutral-100 bg-[#fafafa] flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-neutral-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white shadow-sm">
              <ImageIcon size={16} />
            </div>
            <h2 className="text-[15px] font-bold text-neutral-900">素材库</h2>
          </div>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <button className="w-full py-2.5 bg-neutral-900 text-white rounded-lg text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-sm flex items-center justify-center gap-2 mb-6">
            <Upload size={16} /> 上传素材
          </button>
          
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-neutral-400 mb-2 px-2">分类</div>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-colors ${
                  activeCategory === cat.id 
                    ? 'bg-indigo-50 text-indigo-700 font-bold' 
                    : 'text-neutral-600 hover:bg-neutral-100 font-medium'
                }`}
              >
                <div className="flex items-center gap-2">
                  <cat.icon size={16} className={activeCategory === cat.id ? 'text-indigo-500' : 'text-neutral-400'} />
                  {cat.label}
                </div>
                {cat.id === 'review' && <span className="bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded text-[10px] font-bold">12</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <div className="h-16 border-b border-neutral-100 flex items-center justify-between px-8 bg-white shrink-0">
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="搜索素材名称、标签..." 
              className="w-full pl-9 pr-4 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3">
             <span className="text-[12px] text-neutral-500">共 18,240 个项目</span>
          </div>
        </div>

        {/* Grid Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((item, i) => (
              <div 
                key={i} 
                onClick={() => setActiveDrawer('material_detail')} 
                className="group cursor-pointer flex flex-col"
              >
                <div className="aspect-square bg-neutral-100 rounded-xl relative overflow-hidden mb-3 border border-neutral-200 group-hover:border-indigo-300 transition-colors">
                   <div className="absolute inset-0 flex items-center justify-center text-neutral-300 group-hover:scale-105 transition-transform duration-500">
                     <ImageIcon size={32} />
                   </div>
                   
                   {/* Minimal Status Tags */}
                   <div className="absolute top-2 left-2">
                      {i % 3 === 0 && (
                        <span className="bg-white/90 backdrop-blur-md text-neutral-800 text-[10px] px-2 py-1 rounded font-bold shadow-sm">
                          未使用
                        </span>
                      )}
                      {i === 2 && (
                        <span className="bg-rose-500 text-white text-[10px] px-2 py-1 rounded font-bold shadow-sm">
                          风险
                        </span>
                      )}
                   </div>
                   <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="w-6 h-6 bg-white/90 backdrop-blur-md rounded flex items-center justify-center text-neutral-700 hover:text-indigo-600 shadow-sm">
                       <MoreVertical size={14} />
                     </button>
                   </div>
                </div>
                <div>
                  <div className="text-[13px] font-bold text-neutral-900 mb-0.5 truncate group-hover:text-indigo-600 transition-colors">
                    IMG_89{i}3_幼犬.HEIC
                  </div>
                  <div className="text-[11px] text-neutral-500 flex items-center gap-2">
                    <span>4.2 MB</span>
                    <span className="w-1 h-1 rounded-full bg-neutral-300" />
                    <span>{i % 2 === 0 ? '本地' : '云端'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Simplified Detail Drawer */}
      <AnimatePresence>
        {activeDrawer === 'material_detail' && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm z-20"
              onClick={() => setActiveDrawer(null)}
            />
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[400px] bg-white border-l border-neutral-200 z-30 shadow-2xl flex flex-col"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-100 shrink-0 bg-white">
                <h3 className="text-[15px] font-bold text-neutral-900">
                  素材详情
                </h3>
                <button onClick={() => setActiveDrawer(null)} className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors">
                  <Plus size={20} className="rotate-45" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-[#fafafa]">
                <div className="aspect-square bg-neutral-100 rounded-xl flex items-center justify-center mb-6 border border-neutral-200">
                   <ImageIcon size={48} className="text-neutral-300" />
                </div>

                <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4 mb-6">
                   <h4 className="text-[14px] font-bold text-neutral-900 break-all">IMG_8923_幼犬进食.HEIC</h4>
                   
                   <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-[12px]">
                     <div>
                       <div className="text-neutral-500 mb-1">文件大小</div>
                       <div className="font-medium text-neutral-900">4.2 MB</div>
                     </div>
                     <div>
                       <div className="text-neutral-500 mb-1">分辨率</div>
                       <div className="font-medium text-neutral-900">1920x1080</div>
                     </div>
                     <div>
                       <div className="text-neutral-500 mb-1">位置</div>
                       <div className="font-medium text-neutral-900 flex items-center gap-1"><FolderOpen size={14} className="text-neutral-400"/> 本地源</div>
                     </div>
                     <div>
                       <div className="text-neutral-500 mb-1">状态</div>
                       <div className="font-medium text-emerald-600">未使用</div>
                     </div>
                   </div>

                   <div className="pt-4 border-t border-neutral-100">
                     <div className="text-neutral-500 text-[12px] mb-2">AI 标签</div>
                     <div className="flex gap-2 flex-wrap">
                       <span className="bg-neutral-100 px-2 py-1 rounded-lg text-[11px] font-medium">封面首选</span>
                       <span className="bg-neutral-100 px-2 py-1 rounded-lg text-[11px] font-medium">宠物换粮</span>
                     </div>
                   </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <button className="w-full py-2.5 bg-neutral-900 text-white rounded-lg text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-sm">
                    插入至当前项目
                  </button>
                  <button className="w-full py-2.5 bg-white border border-neutral-200 text-rose-600 rounded-lg text-[13px] font-bold hover:bg-rose-50 transition-colors shadow-sm flex items-center justify-center gap-2">
                    <Trash2 size={16} /> 移除素材
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
