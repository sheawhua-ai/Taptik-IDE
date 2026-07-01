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
  Trash2,
  X,
  Hash,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MaterialStationProps {
  activeProject: any;
}

const MOCK_TAGS = ['封面首选', '宠物换粮', '双十一备用', '已获授权', '产品实拍', '用户返图', '精修素材'];

export const MaterialStation: React.FC<MaterialStationProps> = ({
  activeProject,
}) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const categories = [
    { id: 'all', label: '全部素材', icon: ImageIcon },
    { id: 'smart_high_ctr', label: '高点击率素材', icon: Sparkles },
    { id: 'smart_recent', label: '最近常用', icon: FolderOpen },
    { id: 'review', label: '待验收', icon: CheckCircle2 },
    { id: 'risk', label: '高风险', icon: ShieldAlert },
  ];

  // Mock dynamic data based on categories
  const mockData = Array.from({ length: 15 }).map((_, i) => {
    const itemTags = [MOCK_TAGS[i % MOCK_TAGS.length]];
    if (i % 2 === 0) itemTags.push(MOCK_TAGS[(i + 1) % MOCK_TAGS.length]);
    if (i % 5 === 0) itemTags.push(MOCK_TAGS[(i + 2) % MOCK_TAGS.length]);
    
    return {
      id: i,
      name: `IMG_89${i}3_幼犬.HEIC`,
      size: '4.2 MB',
      location: i % 2 === 0 ? 'local' : 'cloud',
      status: i % 3 === 0 ? 'unused' : 'used',
      isRisk: i === 2 || i === 7,
      needsReview: i === 4 || i === 5,
      tags: Array.from(new Set(itemTags)) // deduplicate
    };
  });

  const filteredData = mockData.filter(item => {
    if (activeCategory === 'smart_high_ctr') return item.id % 2 === 0;
    if (activeCategory === 'smart_recent') return item.id % 3 === 0;
    if (activeCategory === 'risk' && !item.isRisk) return false;
    if (activeCategory === 'review' && !item.needsReview) return false;
    
    if (activeTag && !item.tags.includes(activeTag)) return false;
    
    return true;
  });

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
        
        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
          <button className="w-full py-2.5 bg-neutral-900 text-white rounded-lg text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-sm flex items-center justify-center gap-2 mb-6">
            <Upload size={16} /> 上传素材
          </button>
          
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-neutral-400 mb-2 px-2">分类</div>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setActiveTag(null);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-colors ${
                  activeCategory === cat.id && !activeTag
                    ? 'bg-indigo-50 text-indigo-700 font-bold' 
                    : 'text-neutral-600 hover:bg-neutral-100 font-medium'
                }`}
              >
                <div className="flex items-center gap-2">
                  <cat.icon size={16} className={activeCategory === cat.id && !activeTag ? 'text-indigo-500' : 'text-neutral-400'} />
                  {cat.label}
                </div>
                {cat.id === 'review' && <span className="bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded text-[10px] font-bold">2</span>}
                {cat.id === 'risk' && <span className="bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded text-[10px] font-bold">2</span>}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <div className="h-16 border-b border-neutral-100 flex items-center justify-between px-8 bg-white shrink-0">
          <div className="flex items-center gap-6">
            <h2 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
              {activeTag ? (
                <>
                  <span>标签探索</span>
                  <span className="text-neutral-300">/</span>
                  <span className="text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md text-[13px] border border-indigo-100">#{activeTag}</span>
                </>
              ) : (
                categories.find(c => c.id === activeCategory)?.label
              )}
            </h2>
            <div className="relative w-80">
              <Sparkles size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" />
              <input 
                type="text" 
                placeholder="输入你想要的画面或氛围，例如：双十一晚上的暖色调小狗..." 
                className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <span className="text-[12px] text-neutral-500">共 {filteredData.length} 个素材</span>
          </div>
        </div>

        {/* Grid Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
          {filteredData.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-400">
              <ImageIcon size={48} className="mb-4 opacity-20" />
              <p className="text-[14px] font-medium">当前分类下没有素材</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredData.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedItem(item)} 
                  className="group cursor-pointer flex flex-col"
                >
                  <div className="aspect-square bg-neutral-100 rounded-xl relative overflow-hidden mb-3 border border-neutral-200 group-hover:border-indigo-300 transition-colors">
                     <div className="absolute inset-0 flex items-center justify-center text-neutral-300 group-hover:scale-105 transition-transform duration-500">
                       <ImageIcon size={32} />
                     </div>
                     
                     {/* Minimal Status Tags */}
                     <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {item.status === 'unused' && (
                          <span className="bg-white/90 backdrop-blur-md text-neutral-800 text-[10px] px-2 py-1 rounded font-bold shadow-sm w-fit">
                            未使用
                          </span>
                        )}
                        {item.isRisk && (
                          <span className="bg-rose-500 text-white text-[10px] px-2 py-1 rounded font-bold shadow-sm w-fit">
                            风险
                          </span>
                        )}
                        {item.needsReview && (
                          <span className="bg-orange-500 text-white text-[10px] px-2 py-1 rounded font-bold shadow-sm w-fit">
                            待审
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
                      {item.name}
                    </div>
                    <div className="text-[11px] text-neutral-500 flex items-center gap-2">
                      <span>{item.size}</span>
                      <span className="w-1 h-1 rounded-full bg-neutral-300" />
                      <span>{item.location === 'local' ? '本地' : '云端'}</span>
                    </div>
                    <div className="mt-1.5 flex gap-1 flex-wrap">
                      {item.tags.slice(0, 2).map(tag => (
                         <span key={tag} className="text-[10px] text-neutral-400 bg-neutral-50 px-1.5 py-0.5 rounded border border-neutral-100">
                           {tag}
                         </span>
                      ))}
                      {item.tags.length > 2 && (
                         <span className="text-[10px] text-neutral-400 bg-neutral-50 px-1.5 py-0.5 rounded border border-neutral-100">
                           +{item.tags.length - 2}
                         </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Simplified Detail Drawer */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm z-20"
              onClick={() => setSelectedItem(null)}
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
                <button onClick={() => setSelectedItem(null)} className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors">
                  <Plus size={20} className="rotate-45" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-[#fafafa]">
                <div className="aspect-square bg-neutral-100 rounded-xl flex items-center justify-center mb-6 border border-neutral-200">
                   <ImageIcon size={48} className="text-neutral-300" />
                </div>

                <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-4 mb-6">
                   <h4 className="text-[14px] font-bold text-neutral-900 break-all">{selectedItem.name}</h4>
                   
                   <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-[12px]">
                     <div>
                       <div className="text-neutral-500 mb-1">文件大小</div>
                       <div className="font-medium text-neutral-900">{selectedItem.size}</div>
                     </div>
                     <div>
                       <div className="text-neutral-500 mb-1">分辨率</div>
                       <div className="font-medium text-neutral-900">1920x1080</div>
                     </div>
                     <div>
                       <div className="text-neutral-500 mb-1">位置</div>
                       <div className="font-medium text-neutral-900 flex items-center gap-1">
                         {selectedItem.location === 'local' ? <FolderOpen size={14} className="text-neutral-400"/> : <Cloud size={14} className="text-neutral-400"/>}
                         {selectedItem.location === 'local' ? '本地源' : '云端同步'}
                       </div>
                     </div>
                     <div>
                       <div className="text-neutral-500 mb-1">状态</div>
                       <div className={`font-medium ${selectedItem.status === 'unused' ? 'text-emerald-600' : 'text-neutral-900'}`}>
                         {selectedItem.status === 'unused' ? '未使用' : '已使用'}
                       </div>
                     </div>
                   </div>

                   <div className="pt-4 border-t border-neutral-100">
                     <div className="flex items-center justify-between mb-2">
                       <div className="text-neutral-500 text-[12px]">当前标签</div>
                     </div>
                     <div className="flex gap-2 flex-wrap mb-4">
                       {selectedItem.tags.map((tag: string) => (
                         <span key={tag} className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg text-[11px] font-medium border border-indigo-100 flex items-center gap-1 group cursor-pointer hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-colors">
                           {tag} <X size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                         </span>
                       ))}
                       <button className="border border-dashed border-neutral-300 text-neutral-500 px-2 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 hover:border-indigo-400 hover:text-indigo-600 transition-colors bg-white">
                         <Plus size={10} /> 添加标签
                       </button>
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
