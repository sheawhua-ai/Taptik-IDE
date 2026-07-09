import React, { useState } from "react";
import {
  Image as ImageIcon, Upload, FolderOpen, FolderPlus, Archive, Cloud,
  Search, CheckCircle2, ShieldAlert, MoreVertical, Plus, Trash2, X, Hash,
  Sparkles, LayoutDashboard, Type, Palette, Wand2, Target, CheckSquare,
  Check, Droplet, Fingerprint, Eraser, HardDrive, FileWarning, EyeOff, FileText, Share2, CornerDownRight, RotateCcw, BoxSelect, SearchCode, FolderSearch, Briefcase, Camera, ImageOff, Scissors
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MaterialStationProps {
  activeProject: any;
}

const OP_STATUS = [
  { id: 'pending_index', label: '待索引', icon: SearchCode, count: 24 },
  { id: 'unused', label: '未使用', icon: FolderOpen, count: 120 },
  { id: 'used_in_draft', label: '已用于草稿', icon: FileText, count: 15 },
  { id: 'published', label: '已发布留痕', icon: Cloud, count: 342 },
  { id: 'pending_review', label: '待验收', icon: CheckCircle2, count: 8 },
  { id: 'risky', label: '高风险', icon: ShieldAlert, count: 3 },
  { id: 'missing_local', label: '本地丢失', icon: FileWarning, count: 12 },
  { id: 'oss_pending_clean', label: '服务器缓存待清理', icon: Eraser, count: 45 },
];

const BUSINESS_POOLS = [
  { id: 'cover_pool', label: '封面池', icon: LayoutDashboard },
  { id: 'product_base', label: '产品底图', icon: BoxSelect },
  { id: 'user_feedback', label: '用户反馈', icon: Share2 },
  { id: 'store_scene', label: '门店/场景', icon: FolderOpen },
  { id: 'unboxing', label: '开箱/试用', icon: FolderOpen },
  { id: 'comparison', label: '对比测评', icon: FolderOpen },
  { id: 'koc_return', label: 'KOC 回传', icon: Share2 },
  { id: 'employee_reshoot', label: '员工补拍', icon: Camera },
];

const MOCK_DATA = Array.from({ length: 20 }).map((_, i) => {
  const isMissing = i === 3 || i === 12;
  const isRisky = i === 2;
  const isOSS = i === 1;
  const isDraft = i === 5;
  const isPublished = i === 7;
  
  return {
    id: i,
    name: isMissing ? `LOST_IMG_89${i}3.HEIC` : `IMG_89${i}3_喂食场景.HEIC`,
    size: '4.2 MB',
    resolution: '3024x4032',
    format: 'HEIC',
    localPath: isMissing ? '/Volumes/Macintosh HD/Users/work/小红书素材/已归档/...' : `/Users/work/小红书素材/2026/07/${i}.HEIC`,
    hash: `a1b2c3d4e5f6${i}`,
    storage_state: isMissing ? 'missing_file' : (isOSS ? 'oss_temp' : 'indexed_local'),
    index_state: isMissing ? 'stale' : 'indexed',
    usage_state: isPublished ? 'published' : (isDraft ? 'used_in_draft' : (i % 4 === 0 ? 'recently_used' : 'unused')),
    review_state: isRisky ? 'risky' : (i % 6 === 0 ? 'unchecked' : 'approved'),
    reuse_policy: 'reusable',
    
    usageTags: i % 3 === 0 ? ['首图', '场景'] : ['正文'],
    riskTags: isRisky ? ['竞品露出', '未经授权'] : [],
    
    usageCount: isPublished ? 2 : 0,
    lastUsedTime: isPublished ? '2026-07-01' : null,
    
    source: i % 2 === 0 ? '本地文件夹' : 'KOC 回传',
  };
});


export const MaterialStation: React.FC<MaterialStationProps> = ({
  activeProject,
}) => {
  const [activeCategory, setActiveCategory] = useState('unused');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [assignStep, setAssignStep] = useState<'idle' | 'select_note' | 'select_slot'>('idle');
  const [assignNote, setAssignNote] = useState<any>(null);
  const [activeDrawer, setActiveDrawer] = useState<'index' | 'batch_tag' | 'clean_oss' | 'review_standards' | null>(null);
  const [batchTagStep, setBatchTagStep] = useState<'select' | 'analyzing' | 'result'>('select');
  const [reviewTab, setReviewTab] = useState<'quality' | 'risk' | 'usage' | 'action'>('quality');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState('taptik');

  const MERCHANT_POOLS = {
    'taptik': ['产品底图', '用户反馈', '门店场景', '开箱试用', '员工补拍'],
    'operator': ['信息流素材', '达人分发', '私域素材', '直播切片'],
    'global': ['公共素材', '品牌物料', '授权资质']
  };
  const [showBatchTagModal, setShowBatchTagModal] = useState(false);
  const [showCleanCacheModal, setShowCleanCacheModal] = useState(false);
  const [showReviewStandardsModal, setShowReviewStandardsModal] = useState(false);
  
  const filteredData = MOCK_DATA.filter(item => {
    if (activeCategory === 'missing_local') return item.storage_state === 'missing_file';
    if (activeCategory === 'oss_pending_clean') return item.storage_state === 'oss_temp';
    if (activeCategory === 'risky') return item.review_state === 'risky';
    if (activeCategory === 'unused') return item.usage_state === 'unused';
    if (activeCategory === 'published') return item.usage_state === 'published';
    if (activeCategory === 'used_in_draft') return item.usage_state === 'used_in_draft';
    if (activeCategory === 'pending_review') return item.review_state === 'unchecked';
    
    // Simplistic pool mapping
    if (activeCategory === 'cover_pool') return item.usageTags.includes('首图');
    
    return true; // Show all for others temporarily
  });

  const getStorageBadge = (state: string) => {
    switch (state) {
      case 'indexed_local': return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-bold">本地已索引</span>;
      case 'oss_temp': return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded text-[10px] font-bold">服务器缓存</span>;
      case 'oss_cleaned': return <span className="bg-neutral-100 text-neutral-600 border border-neutral-200 px-1.5 py-0.5 rounded text-[10px] font-bold">缓存已清理</span>;
      case 'missing_file': return <span className="bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded text-[10px] font-bold">本地丢失</span>;
      default: return <span className="bg-neutral-100 text-neutral-600 border border-neutral-200 px-1.5 py-0.5 rounded text-[10px] font-bold">本地源文件</span>;
    }
  };

  const getUsageBadge = (state: string) => {
    switch (state) {
      case 'unused': return <span className="bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded text-[10px] font-bold">未使用</span>;
      case 'used_in_draft': return <span className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded text-[10px] font-bold">已用于草稿</span>;
      case 'published': return <span className="bg-neutral-900 text-white px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5"><CheckCircle2 size={10}/>已发布</span>;
      case 'recently_used': return <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-[10px] font-bold">近期用过</span>;
      default: return null;
    }
  };
  
  const getReviewBadge = (state: string) => {
    switch (state) {
      case 'risky': return <span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded text-[10px] font-bold border border-rose-100 flex items-center gap-0.5"><ShieldAlert size={10}/>高风险</span>;
      case 'unchecked': return <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-[10px] font-bold border border-amber-100">未检查</span>;
      case 'approved': return <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold border border-emerald-100 flex items-center gap-0.5"><Check size={10}/>已通过</span>;
      default: return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
      {/* Top Header & Metrics */}
      <div className="h-auto border-b border-neutral-200 bg-[#fcfcfc] shrink-0 px-8 py-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white shadow-sm">
              <FolderSearch size={16} />
            </div>
            <h2 className="text-[18px] font-bold text-neutral-900">素材库 <span className="text-[14px] text-neutral-400 font-normal ml-2">资产管理与内容基础设施</span></h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setActiveDrawer('index')} className="px-4 py-2 bg-neutral-900 text-white text-[13px] font-bold rounded-lg hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2">
              <HardDrive size={16} /> 选择本地文件夹 / 建立索引
            </button>
            <div className="w-px h-6 bg-neutral-200 mx-2" />
            <button className="px-3 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-[13px] font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
              <RotateCcw size={14} /> 重新扫描
            </button>
            <button onClick={() => { setActiveDrawer('batch_tag'); setBatchTagStep('select'); }} className="px-3 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-[13px] font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
              <Hash size={14} /> 批量打标
            </button>
            <button onClick={() => setActiveDrawer('clean_oss')} className="px-3 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-[13px] font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
              <Eraser size={14} /> 清理服务器缓存
            </button>
            <button onClick={() => { setActiveDrawer('review_standards'); setReviewTab('quality'); }} className="px-3 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-[13px] font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
              <ShieldAlert size={14} /> 设置审核标准
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-6 gap-4">
          <div className="bg-white border border-neutral-100 rounded-xl p-3 shadow-sm flex flex-col gap-1">
             <div className="text-[11px] text-neutral-500 font-bold">本地已索引</div>
             <div className="text-[18px] font-bold text-neutral-900">12,450 <span className="text-[12px] font-normal text-neutral-400">张</span></div>
          </div>
          <div className="bg-white border border-neutral-100 rounded-xl p-3 shadow-sm flex flex-col gap-1">
             <div className="text-[11px] text-neutral-500 font-bold">待索引</div>
             <div className="text-[18px] font-bold text-neutral-900">234 <span className="text-[12px] font-normal text-neutral-400">张</span></div>
          </div>
          <div className="bg-white border border-neutral-100 rounded-xl p-3 shadow-sm flex flex-col gap-1">
             <div className="text-[11px] text-neutral-500 font-bold">当前商家素材池</div>
             <div className="text-[18px] font-bold text-emerald-700">8,920 <span className="text-[12px] font-normal text-emerald-600/70">张</span></div>
          </div>
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 shadow-sm flex flex-col gap-1">
             <div className="text-[11px] text-rose-700 font-bold">当前内容缺口</div>
             <div className="text-[13px] font-bold text-rose-900 leading-snug mt-1">缺真实喂食场景 8 组</div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 shadow-sm flex flex-col gap-1">
             <div className="text-[11px] text-blue-700 font-bold">服务器缓存占用</div>
             <div className="text-[13px] font-bold text-blue-900 leading-snug mt-1">1.2GB<br/><span className="text-[11px] font-normal opacity-80">预计发布后释放 870MB</span></div>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 shadow-sm flex flex-col gap-1">
             <div className="text-[11px] text-amber-700 font-bold">高风险素材</div>
             <div className="text-[18px] font-bold text-amber-900">45 <span className="text-[12px] font-normal text-amber-700/70">张</span></div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 border-r border-neutral-200 bg-[#fafafa] flex flex-col shrink-0 overflow-y-auto custom-scrollbar p-4 space-y-6">
          
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-neutral-400 mb-2 px-2">运营状态</div>
            {OP_STATUS.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-primary-50 text-primary-700 font-bold' 
                    : 'text-neutral-600 hover:bg-neutral-100 font-medium'
                }`}
              >
                <div className="flex items-center gap-2">
                  <cat.icon size={16} className={activeCategory === cat.id ? 'text-primary-500' : 'text-neutral-400'} />
                  {cat.label}
                </div>
                <span className="text-[11px] text-neutral-400 bg-white border border-neutral-100 px-1.5 py-0.5 rounded">{cat.count}</span>
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-bold text-neutral-400 mb-2 px-2">业务素材池</div>
            {BUSINESS_POOLS.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-primary-50 text-primary-700 font-bold' 
                    : 'text-neutral-600 hover:bg-neutral-100 font-medium'
                }`}
              >
                <div className="flex items-center gap-2">
                  <cat.icon size={16} className={activeCategory === cat.id ? 'text-primary-500' : 'text-neutral-400'} />
                  {cat.label}
                </div>
              </button>
            ))}
          </div>
          
        </div>

        {/* Grid Area */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-white">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
            {filteredData.map((item) => (
              <div 
                key={item.id} 
                onClick={() => { setSelectedItem(item); setAssignStep('idle'); }} 
                className="group cursor-pointer flex flex-col"
              >
                <div className={`aspect-square rounded-xl relative overflow-hidden mb-3 border transition-all ${item.storage_state === 'missing_file' ? 'bg-neutral-50 border-dashed border-rose-200' : 'bg-neutral-100 border-neutral-200 group-hover:border-primary-400 shadow-sm group-hover:shadow-md'}`}>
                   
                   <div className="absolute inset-0 flex items-center justify-center text-neutral-300">
                     {item.storage_state === 'missing_file' ? (
                       <div className="flex flex-col items-center text-rose-300">
                         <ImageOff size={32} className="mb-2" />
                         <span className="text-[10px] font-bold text-rose-400">缩略图丢失</span>
                       </div>
                     ) : (
                       <ImageIcon size={32} className="group-hover:scale-105 transition-transform duration-500" />
                     )}
                   </div>
                   
                   {/* Top Left Badges */}
                   <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                      {getUsageBadge(item.usage_state)}
                      {getReviewBadge(item.review_state)}
                   </div>
                   
                   {/* Top Right Usage Count */}
                   {item.usageCount > 0 && (
                     <div className="absolute top-2 right-2 bg-neutral-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded z-10">
                       已用 {item.usageCount} 次
                     </div>
                   )}

                   {/* Bottom Badges */}
                   <div className="absolute bottom-2 left-2 flex gap-1 flex-wrap z-10">
                     {getStorageBadge(item.storage_state)}
                   </div>
                </div>
                <div>
                  <div className="text-[12px] font-bold text-neutral-900 mb-1 truncate group-hover:text-primary-700 transition-colors">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-neutral-500 flex items-center gap-2 mb-1.5">
                    <span>{item.size}</span>
                    <span className="w-1 h-1 rounded-full bg-neutral-300" />
                    <span className={`${item.index_state === 'indexed' ? 'text-emerald-600' : (item.index_state === 'stale' ? 'text-rose-600' : '')}`}>
                      {item.index_state === 'indexed' ? '已索引' : (item.index_state === 'stale' ? '索引失效' : '未索引')}
                    </span>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {item.usageTags.map(tag => (
                       <span key={tag} className="text-[10px] font-medium text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded">
                         {tag}
                       </span>
                    ))}
                    {item.riskTags.map(tag => (
                       <span key={tag} className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded">
                         {tag}
                       </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm z-20"
              onClick={() => { setSelectedItem(null); setAssignStep('idle'); }}
            />
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="absolute right-0 top-0 bottom-0 w-[480px] bg-white border-l border-neutral-200 z-30 shadow-2xl flex flex-col"
            >
              <div className="h-14 flex items-center justify-between px-6 border-b border-neutral-100 shrink-0 bg-white">
                <h3 className="text-[15px] font-bold text-neutral-900 flex items-center gap-2">
                  <FolderSearch size={16}/> 素材详情
                </h3>
                <button onClick={() => { setSelectedItem(null); setAssignStep('idle'); }} className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-[#fafafa] custom-scrollbar">
                
                                {/* Compact Image Preview & Header */}
                <div className="flex gap-4 mb-6 items-start">
                   <div className={`w-28 h-28 shrink-0 rounded-xl flex items-center justify-center border ${selectedItem.storage_state === 'missing_file' ? 'bg-neutral-50 border-dashed border-rose-200' : 'bg-neutral-100 border-neutral-200 shadow-sm'}`}>
                     {selectedItem.storage_state === 'missing_file' ? (
                       <ImageOff size={24} className="text-rose-300" />
                     ) : (
                       <ImageIcon size={32} className="text-neutral-300" />
                     )}
                   </div>
                   <div className="flex-1 overflow-hidden pt-1">
                      <h3 className="text-[14px] font-bold text-neutral-900 leading-snug break-all mb-2">{selectedItem.name}</h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {getUsageBadge(selectedItem.usage_state)}
                        {getReviewBadge(selectedItem.review_state)}
                        {selectedItem.storage_state === 'missing_file' && <span className="bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded text-[10px] font-bold">本地丢失</span>}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-mono break-all line-clamp-2" title={selectedItem.localPath}>
                        {selectedItem.localPath}
                      </div>
                   </div>
                </div>
                <div className="space-y-6">
                  
                  {/* Basic Info */}
                  <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                    <h4 className="text-[13px] font-bold text-neutral-900 mb-4 pb-2 border-b border-neutral-100">基础信息</h4>
                    <div className="space-y-3">
                      
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div>
                          <div className="text-[11px] text-neutral-500 mb-1">大小 & 格式</div>
                          <div className="text-[12px] font-bold text-neutral-900">{selectedItem.size} / {selectedItem.format}</div>
                        </div>
                        <div>
                          <div className="text-[11px] text-neutral-500 mb-1">分辨率</div>
                          <div className="text-[12px] font-bold text-neutral-900">{selectedItem.resolution}</div>
                        </div>
                        <div>
                          <div className="text-[11px] text-neutral-500 mb-1">文件 Hash</div>
                          <div className="text-[12px] font-mono text-neutral-900">{selectedItem.hash}</div>
                        </div>
                        <div>
                          <div className="text-[11px] text-neutral-500 mb-1">索引状态</div>
                          <div className={`text-[12px] font-bold ${selectedItem.index_state === 'indexed' ? 'text-emerald-600' : (selectedItem.index_state === 'stale' ? 'text-rose-600' : 'text-neutral-500')}`}>
                            {selectedItem.index_state === 'indexed' ? '已索引' : (selectedItem.index_state === 'stale' ? '索引已失效' : '未索引')}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] text-neutral-500 mb-1">来源</div>
                          <div className="text-[12px] font-bold text-neutral-900">{selectedItem.source}</div>
                        </div>
                        <div>
                          <div className="text-[11px] text-neutral-500 mb-1">存储状态</div>
                          <div>{getStorageBadge(selectedItem.storage_state)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags and Description */}
                  <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                    <h4 className="text-[13px] font-bold text-neutral-900 mb-3">标签与描述</h4>
                    <div className="flex gap-2 flex-wrap mb-3">
                      {selectedItem.usageTags.map((tag: string) => (
                        <span key={tag} className="bg-primary-50 text-primary-700 px-2 py-1 rounded-lg text-[11px] font-medium border border-primary-100 flex items-center gap-1">
                          {tag}
                        </span>
                      ))}
                      {selectedItem.riskTags.map((tag: string) => (
                        <span key={tag} className="bg-rose-50 text-rose-700 px-2 py-1 rounded-lg text-[11px] font-bold border border-rose-100 flex items-center gap-1">
                          {tag}
                        </span>
                      ))}
                      <button className="border border-dashed border-neutral-300 text-neutral-500 px-2 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 hover:border-primary-400 hover:text-primary-600 transition-colors bg-white">
                        <Plus size={10} /> 添加标签
                      </button>
                    </div>
                    <div className="text-[12px] text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                      描述：展示了幼犬在家庭环境中的真实喂食状态，背景包含品牌狗粮袋。
                    </div>
                  </div>

                  {/* AI Pre-review */}
                  <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                    <h4 className="text-[13px] font-bold text-neutral-900 mb-3 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-primary-500" /> AI 预审
                    </h4>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-[12px]">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">清晰度</span>
                        <span className="font-bold text-emerald-600">极佳</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">主体完整度</span>
                        <span className="font-bold text-emerald-600">完整</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">广告感</span>
                        <span className="font-bold text-emerald-600">弱 (偏真实)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">首图潜力</span>
                        <span className="font-bold text-emerald-600">非常适合</span>
                      </div>
                      <div className="col-span-2 pt-2 border-t border-neutral-100">
                        {selectedItem.review_state === 'risky' ? (
                          <div className="text-rose-600 bg-rose-50 p-2 rounded flex items-start gap-1.5 border border-rose-100 font-medium">
                            <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                            画面左上角出现竞品标识，发布前需处理。
                            <br/>建议：裁剪避开、遮挡敏感区域，或改用其他素材。
                          </div>
                        ) : (
                          <div className="text-emerald-700 bg-emerald-50 p-2 rounded flex items-start gap-1.5 border border-emerald-100 font-medium">
                            <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                            无明显合规风险，色彩表现良好，可直接用于小红书正文。
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Application Suggestions */}
                  <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                    <h4 className="text-[13px] font-bold text-neutral-900 mb-3 flex items-center gap-1.5">
                      <Target size={14} className="text-neutral-900" /> 适用建议
                    </h4>
                    <div className="space-y-2 text-[12px]">
                      <div className="flex gap-2">
                        <span className="text-neutral-500 w-20 shrink-0">适合用途</span>
                        <span className="text-neutral-900 font-bold">首图 / 场景铺垫 / 客户反馈</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-neutral-500 w-20 shrink-0">适合方向</span>
                        <span className="text-neutral-900 font-bold">种草推荐 / 科普养护</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-neutral-500 w-20 shrink-0">适合账号</span>
                        <span className="text-neutral-900 font-bold">KOS 账号 / 泛素人账号</span>
                      </div>
                    </div>
                  </div>

                  {/* Citation Records */}
                  <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                    <h4 className="text-[13px] font-bold text-neutral-900 mb-3 flex items-center gap-1.5">
                      <Share2 size={14} className="text-neutral-900" /> 引用记录
                    </h4>
                    {selectedItem.usageCount > 0 ? (
                      <div className="space-y-3">
                        <div className="text-[12px] p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                          <div className="font-bold text-neutral-900 mb-1">《双十一囤粮攻略，新手闭眼入》</div>
                          <div className="text-neutral-500 flex items-center justify-between">
                            <span>作为首图使用</span>
                            <span>发布于 2026-07-01</span>
                          </div>
                        </div>
                        <div className="text-[12px] p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                          <div className="font-bold text-neutral-900 mb-1">《幼犬软便怎么办？换粮实录》</div>
                          <div className="text-neutral-500 flex items-center justify-between">
                            <span>作为正文图使用</span>
                            <span>发布于 2026-06-15</span>
                          </div>
                        </div>
                        <div className="text-[11px] text-amber-600 bg-amber-50 p-2 rounded border border-amber-100 font-bold flex items-center gap-1.5">
                          <ShieldAlert size={12} /> 近期已频繁使用，建议使用相似素材替代或进行去重处理。
                        </div>
                      </div>
                    ) : (
                      <div className="text-[12px] text-neutral-400 py-4 text-center">
                        暂无引用记录，这是一张全新素材
                      </div>
                    )}
                  </div>

                  {/* Similar Materials */}
                  <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                    <h4 className="text-[13px] font-bold text-neutral-900 mb-3 flex items-center gap-1.5">
                      <BoxSelect size={14} className="text-neutral-900" /> 相似素材
                    </h4>
                    <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
                       <div className="w-16 h-16 shrink-0 bg-neutral-100 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-300">
                         <ImageIcon size={20} />
                       </div>
                       <div className="w-16 h-16 shrink-0 bg-neutral-100 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-300">
                         <ImageIcon size={20} />
                       </div>
                       <div className="w-16 h-16 shrink-0 border border-dashed border-neutral-300 rounded-lg flex flex-col items-center justify-center text-neutral-400 hover:text-primary-600 hover:border-primary-300 transition-colors cursor-pointer gap-1">
                         <Wand2 size={14} />
                         <span className="text-[9px] font-medium">以图生图</span>
                       </div>
                    </div>
                  </div>

                  {/* Lightweight AI processing */}
                  {selectedItem.storage_state !== 'missing_file' && (
                    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-[13px] font-bold text-neutral-900 flex items-center gap-1.5">
                          <Wand2 size={14} className="text-primary-500" /> 发布前轻量处理
                        </h4>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <button className="py-2 bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-lg text-[12px] font-bold hover:bg-neutral-100 transition-colors flex items-center justify-center gap-1.5">
                          <Scissors size={14} /> 3:4 比例裁剪
                        </button>
                        <button className="py-2 bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-lg text-[12px] font-bold hover:bg-neutral-100 transition-colors flex items-center justify-center gap-1.5">
                          <Palette size={14} /> 调色增强
                        </button>
                        <button className="py-2 bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-lg text-[12px] font-bold hover:bg-neutral-100 transition-colors flex items-center justify-center gap-1.5">
                          <Eraser size={14} /> 模糊敏感信息
                        </button>
                        <button className="py-2 bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-lg text-[12px] font-bold hover:bg-neutral-100 transition-colors flex items-center justify-center gap-1.5">
                          <LayoutDashboard size={14} /> 智能拼图
                        </button>
                      </div>
                      <button className="w-full py-2 text-primary-600 bg-primary-50 hover:bg-primary-100 text-[12px] font-bold rounded-lg transition-colors">
                        展开更多 AI 处理...
                      </button>
                    </div>
                  )}
                  
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-5 border-t border-neutral-100 bg-white space-y-3 shrink-0">
                {selectedItem.storage_state === 'missing_file' ? (
                  <>
                    <button className="w-full py-2.5 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-sm flex items-center justify-center gap-2">
                      <FolderSearch size={16} /> 重新定位本地文件
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[12px] font-bold hover:bg-neutral-50 transition-colors">
                        从备份查找
                      </button>
                      <button className="py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[12px] font-bold hover:bg-neutral-50 transition-colors">
                        用相似素材替代
                      </button>
                      <button className="py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[12px] font-bold hover:bg-neutral-50 transition-colors">
                        恢复低清图
                      </button>
                      <button className="py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[12px] font-bold hover:bg-neutral-50 transition-colors">
                        标记不可用
                      </button>
                    </div>
                    <div className="flex gap-2 justify-center mt-2">
                       <button className="text-[11px] text-neutral-400 hover:text-rose-600 font-medium px-2 py-1">归档素材</button>
                    </div>
                  </>
                ) : (
                  <>
                    <>
                        <button onClick={() => { setShowAssignModal(true); setAssignStep('select_note'); }} className="w-full py-2.5 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-sm flex items-center justify-center gap-2">
                          <Briefcase size={16} /> 加入某篇笔记 / 内容包
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                          <button className="py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[12px] font-bold hover:bg-neutral-50 transition-colors">
                            加入首图候选池
                          </button>
                          <button className="py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[12px] font-bold hover:bg-neutral-50 transition-colors">
                            生成同类补拍要求
                          </button>
                        </div>
                        <div className="flex gap-2 justify-center mt-2">
                           <button className="text-[11px] text-neutral-400 hover:text-neutral-700 font-medium px-2 py-1">定位本地文件</button>
                           <span className="text-neutral-200">|</span>
                           <button onClick={() => setActiveDrawer('clean_oss')} className="text-[11px] text-neutral-400 hover:text-neutral-700 font-medium px-2 py-1">清理服务器缓存</button>
                           <span className="text-neutral-200">|</span>
                           <button className="text-[11px] text-neutral-400 hover:text-rose-600 font-medium px-2 py-1">归档素材</button>
                        </div>
                      </>
                  </>
                )}
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Assign Modal */}
      <AnimatePresence>
        {showAssignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={() => setShowAssignModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-[480px] bg-white rounded-2xl shadow-xl flex flex-col max-h-[85vh] overflow-hidden">
              <div className="h-14 flex items-center justify-between px-6 border-b border-neutral-100 shrink-0">
                <div className="flex items-center gap-2">
                   {assignStep === 'select_slot' && (
                     <button onClick={() => setAssignStep('select_note')} className="text-neutral-400 hover:text-neutral-700 -ml-2 p-1"><RotateCcw size={14}/></button>
                   )}
                   <h3 className="text-[15px] font-bold text-neutral-900">
                     {assignStep === 'select_note' ? '选择要加入的笔记' : '分配到素材位'}
                   </h3>
                </div>
                <button onClick={() => setShowAssignModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                {assignStep === 'select_note' && (
                  <div className="space-y-3">
                    {[
                      { id: 1, title: '幼犬换粮避坑 #1', missing: '首图、喂食场景' },
                      { id: 2, title: '肠胃敏感科普 #2', missing: '正文图' },
                      { id: 3, title: '开箱试用 #3', missing: '开箱图、反馈图' }
                    ].map(note => (
                      <button key={note.id} onClick={() => { setAssignNote(note); setAssignStep('select_slot'); }} className="w-full text-left p-4 bg-neutral-50 border border-neutral-200 rounded-xl hover:border-primary-400 hover:bg-primary-50 transition-colors group">
                        <div className="text-[14px] font-bold text-neutral-900 group-hover:text-primary-700 mb-1">{note.title}</div>
                        <div className="text-[12px] text-neutral-500">缺：{note.missing}</div>
                      </button>
                    ))}
                  </div>
                )}
                
                {assignStep === 'select_slot' && (
                  <div className="space-y-4">
                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 flex gap-4 items-center">
                       <div className="w-16 h-16 bg-neutral-200 rounded-lg shrink-0 flex items-center justify-center text-neutral-400">
                         <ImageIcon size={24} />
                       </div>
                       <div className="flex-1 overflow-hidden">
                          <div className="text-[14px] font-bold text-neutral-900 truncate mb-1">{selectedItem?.name}</div>
                          <div className="text-[12px] text-neutral-500 truncate">目标笔记：{assignNote?.title}</div>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {['设为首图候选', '设为正文图', '设为场景图', '设为客户反馈图'].map(slot => (
                        <button key={slot} onClick={() => setShowAssignModal(false)} className="py-3 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-colors shadow-sm">
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      
      {/* Drawers */}
      <AnimatePresence>
        {activeDrawer && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={() => setActiveDrawer(null)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "tween", duration: 0.25, ease: "easeOut" }} className="relative w-[560px] bg-white h-full shadow-2xl flex flex-col">
              {/* Common Header */}
              <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-100 shrink-0">
                <h3 className="text-[16px] font-bold text-neutral-900">
                  {activeDrawer === 'index' && '建立本地素材索引'}
                  {activeDrawer === 'batch_tag' && '批量素材打标'}
                  {activeDrawer === 'clean_oss' && '清理服务器缓存文件'}
                  {activeDrawer === 'review_standards' && '配置 AI 审核标准'}
                </h3>
                <button onClick={() => setActiveDrawer(null)} className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                {activeDrawer === 'index' && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-[13px] font-bold text-neutral-900 mb-2 block">文件夹路径</label>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 text-[13px] text-neutral-600 truncate">
                          /Users/design/TapTik/Pets/Q3_Assets
                        </div>
                        <button className="px-4 bg-neutral-900 text-white text-[13px] font-bold rounded-lg hover:bg-neutral-800 transition-colors">选择</button>
                      </div>
                    </div>
                    <div>
                      <label className="text-[13px] font-bold text-neutral-900 mb-2 block">归属商家</label>
                      <select 
                        value={selectedMerchant}
                        onChange={(e) => setSelectedMerchant(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 text-[13px] text-neutral-900 outline-none focus:border-neutral-400"
                      >
                        <option value="taptik">当前商家 (TapTik 官方旗舰店)</option>
                        <option value="operator">操盘手素材库</option>
                        <option value="global">全局素材 (全公司可见)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[13px] font-bold text-neutral-900 mb-2 block">默认素材池</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(MERCHANT_POOLS[selectedMerchant as keyof typeof MERCHANT_POOLS] || []).map((pool, idx) => (
                          <label key={pool} className="flex items-center gap-2 p-2 bg-neutral-50 border border-neutral-200 rounded-lg cursor-pointer hover:border-neutral-300">
                            <input type="checkbox" className="rounded text-neutral-900 focus:ring-0" defaultChecked={idx === 0} />
                            <span className="text-[13px] text-neutral-700">{pool}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[13px] font-bold text-neutral-900 mb-2 block">扫描范围</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="scan_scope" className="text-neutral-900 focus:ring-0" defaultChecked />
                          <span className="text-[13px] text-neutral-700">仅新增文件</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="scan_scope" className="text-neutral-900 focus:ring-0" />
                          <span className="text-[13px] text-neutral-700">全量重新扫描</span>
                        </label>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-neutral-100">
                      <label className="text-[13px] font-bold text-neutral-900 mb-3 block">高级处理选项</label>
                      <div className="space-y-3">
                        {[
                          { label: '是否生成缩略图', default: true },
                          { label: '是否生成 AI 标签', default: true },
                          { label: '是否生成图片描述', default: true },
                          { label: '是否建立向量索引 (高价值素材建议开启)', default: false },
                          { label: '是否复制原图到 Taptik 工作区 (默认仅记录本地路径)', default: false },
                          { label: '文件变化监控 (避免持续占资源)', default: false },
                        ].map((opt, i) => (
                          <label key={i} className="flex items-center justify-between group cursor-pointer">
                            <span className="text-[13px] text-neutral-700 group-hover:text-neutral-900">{opt.label}</span>
                            <div className={`w-8 h-4.5 rounded-full relative transition-colors ${opt.default ? 'bg-neutral-900' : 'bg-neutral-200'}`}>
                              <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-transform ${opt.default ? 'left-[16px]' : 'left-0.5'}`} />
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {activeDrawer === 'batch_tag' && (
                  <div className="space-y-6">
                    {batchTagStep === 'select' ? (
                      <div className="space-y-6 animate-in fade-in">
                        <div>
                          <label className="text-[13px] font-bold text-neutral-900 mb-2 block">选择处理范围</label>
                          <div className="space-y-2">
                            {['当前文件夹/分类 (128 张)', '当前素材池 (1,209 张)', '未打标素材 (89 张)', '已勾选素材 (12 张)'].map((scope, i) => (
                              <label key={i} className="flex items-center gap-3 p-3 bg-neutral-50 border border-neutral-200 rounded-xl cursor-pointer hover:border-neutral-300">
                                <input type="radio" name="tag_scope" className="text-neutral-900 focus:ring-0" defaultChecked={i === 0} />
                                <span className="text-[13px] text-neutral-700">{scope}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                          <Sparkles className="text-blue-500 mt-0.5 shrink-0" size={18} />
                          <div>
                            <div className="text-[13px] font-bold text-blue-900 mb-1">AI 预分析完成</div>
                            <div className="text-[12px] text-blue-700">共分析 128 张素材，已生成以下分类建议，请确认后写入。</div>
                          </div>
                        </div>
                        <div>
                           <div className="text-[13px] font-bold text-neutral-900 mb-3">AI 建议标签分布</div>
                           <div className="space-y-2">
                             {[
                               { label: '喂食场景', count: 128, type: '场景标签' },
                               { label: '首图候选', count: 76, type: '用途标签' },
                               { label: '用户反馈', count: 43, type: '用途标签' },
                               { label: '竞品露出', count: 12, type: '风险标签', risk: true },
                               { label: '未授权人脸', count: 8, type: '风险标签', risk: true },
                             ].map((tag, i) => (
                               <div key={i} className="flex items-center justify-between p-3 bg-white border border-neutral-200 rounded-xl">
                                 <div className="flex items-center gap-3">
                                   <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${tag.risk ? 'bg-rose-50 text-rose-600' : 'bg-neutral-100 text-neutral-600'}`}>
                                     {tag.type}
                                   </div>
                                   <span className="text-[13px] font-medium text-neutral-900">{tag.label}</span>
                                 </div>
                                 <div className="flex items-center gap-3">
                                   <span className="text-[12px] text-neutral-500">{tag.count} 张</span>
                                   <button className="text-[12px] text-blue-600 hover:text-blue-700 font-bold">查看明细</button>
                                 </div>
                               </div>
                             ))}
                           </div>
                        </div>
                        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                           <button className="text-[12px] text-neutral-500 hover:text-neutral-700 font-bold transition-colors">只写入高置信标签</button>
                           <button className="text-[12px] text-neutral-500 hover:text-neutral-700 font-bold transition-colors">忽略低置信标签</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {activeDrawer === 'clean_oss' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                         <div className="text-[11px] text-neutral-500 mb-1">缓存占用总量</div>
                         <div className="text-[18px] font-bold text-neutral-900">2.2 GB</div>
                      </div>
                      <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                         <div className="text-[11px] text-emerald-600 mb-1">可安全释放</div>
                         <div className="text-[18px] font-bold text-emerald-700">870 MB</div>
                      </div>
                      <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                         <div className="text-[11px] text-neutral-500 mb-1">中转文件数</div>
                         <div className="text-[18px] font-bold text-neutral-900">1,245 <span className="text-[12px] font-normal">个</span></div>
                      </div>
                    </div>

                    <div className="space-y-4">
                       <div>
                         <div className="flex items-center justify-between mb-2">
                           <div className="text-[13px] font-bold text-emerald-600 flex items-center gap-1.5"><CheckCircle2 size={14}/> 可安全清理</div>
                           <span className="text-[12px] text-neutral-500">870 MB / 412 个</span>
                         </div>
                         <div className="bg-white border border-neutral-200 rounded-xl p-3 text-[12px] text-neutral-600 space-y-1">
                           <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-neutral-300" /> 已发布成功</div>
                           <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-neutral-300" /> 已保留缩略图和引用记录</div>
                           <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-neutral-300" /> 原文件仍在本地，服务器仅为发布中转</div>
                         </div>
                       </div>
                       
                       <div>
                         <div className="flex items-center justify-between mb-2">
                           <div className="text-[13px] font-bold text-amber-600 flex items-center gap-1.5"><ShieldAlert size={14}/> 建议确认后清理</div>
                           <span className="text-[12px] text-neutral-500">210 MB / 156 个</span>
                         </div>
                         <div className="bg-white border border-neutral-200 rounded-xl p-3 text-[12px] text-neutral-600 space-y-1">
                           <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-neutral-300" /> 已过期但未确认发布状态</div>
                           <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-neutral-300" /> H5 回传任务已完成但未归档</div>
                           <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-neutral-300" /> 已被替换的素材</div>
                         </div>
                       </div>
                       
                       <div>
                         <div className="flex items-center justify-between mb-2">
                           <div className="text-[13px] font-bold text-rose-600 flex items-center gap-1.5"><X size={14}/> 不可清理</div>
                           <span className="text-[12px] text-neutral-500">1.2 GB / 677 个</span>
                         </div>
                         <div className="bg-white border border-neutral-200 rounded-xl p-3 text-[12px] text-neutral-600 space-y-1">
                           <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-neutral-300" /> 正在发布中 / 给外部 H5 使用</div>
                           <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-neutral-300" /> 原文件本地丢失且 服务器缓存是唯一高清来源</div>
                         </div>
                       </div>
                    </div>
                    
                    <div className="pt-4 border-t border-neutral-100">
                      <div className="text-[13px] font-bold text-neutral-900 mb-3 flex items-center justify-between">
                        自动清理规则 <button className="text-[12px] text-blue-600 hover:text-blue-700 font-bold">编辑规则</button>
                      </div>
                      <div className="space-y-2">
                         <label className="flex items-center gap-3">
                            <input type="checkbox" defaultChecked className="rounded text-neutral-900 focus:ring-0" />
                            <span className="text-[12px] text-neutral-700">发布成功后 24 小时自动清理</span>
                         </label>
                         <label className="flex items-center gap-3">
                            <input type="checkbox" defaultChecked className="rounded text-neutral-900 focus:ring-0" />
                            <span className="text-[12px] text-neutral-700">保留最近 30 天中转文件</span>
                         </label>
                         <label className="flex items-center gap-3">
                            <input type="checkbox" defaultChecked className="rounded text-neutral-900 focus:ring-0" />
                            <span className="text-[12px] text-neutral-700">本地文件丢失时不自动清理缓存</span>
                         </label>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeDrawer === 'review_standards' && (
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-4 border-b border-neutral-100 mb-4 shrink-0">
                       {[
                         { id: 'quality', label: '基础质量' },
                         { id: 'risk', label: '内容风险' },
                         { id: 'usage', label: '用途标准' },
                         { id: 'action', label: '处理策略' }
                       ].map(tab => (
                         <button 
                           key={tab.id}
                           onClick={() => setReviewTab(tab.id as any)}
                           className={`pb-2 text-[13px] font-bold transition-colors border-b-2 ${reviewTab === tab.id ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-400 hover:text-neutral-600'}`}
                         >
                           {tab.label}
                         </button>
                       ))}
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      {reviewTab === 'quality' && (
                        <div className="space-y-6 animate-in fade-in">
                          <div>
                             <label className="text-[13px] font-bold text-neutral-900 mb-2 block">最低分辨率</label>
                             <select className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 text-[13px] text-neutral-900 outline-none focus:border-neutral-400">
                               <option>1080px 以上 (推荐)</option>
                               <option>720px 以上</option>
                               <option>不限制</option>
                             </select>
                          </div>
                          <div>
                             <label className="text-[13px] font-bold text-neutral-900 mb-2 block">清晰度要求</label>
                             <div className="flex items-center gap-3 p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                               <span className="text-[13px] text-neutral-700 flex-1">太糊 (低于阈值)</span>
                               <span className="text-[12px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded">打回重拍</span>
                             </div>
                          </div>
                          <div>
                             <label className="text-[13px] font-bold text-neutral-900 mb-2 block">光线与色偏</label>
                             <div className="flex items-center gap-3 p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                               <span className="text-[13px] text-neutral-700 flex-1">明显偏色 (过暗/过曝/偏黄)</span>
                               <span className="text-[12px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">建议调色</span>
                             </div>
                          </div>
                          <div>
                             <label className="text-[13px] font-bold text-neutral-900 mb-2 block">主体完整度</label>
                             <div className="flex items-center gap-3 p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                               <span className="text-[13px] text-neutral-700 flex-1">主体被明显遮挡或残缺</span>
                               <span className="text-[12px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">不建议做首图</span>
                             </div>
                          </div>
                        </div>
                      )}
                      
                      {reviewTab === 'risk' && (
                        <div className="space-y-4 animate-in fade-in">
                          <div className="text-[12px] text-neutral-500 mb-2">设置各类风险元素的拦截与警示规则，确保内容合规。</div>
                          {[
                            { label: '竞品 Logo / 包装', action: '需人工确认' },
                            { label: '未授权人脸 (素人)', action: '禁用' },
                            { label: '价格 / 优惠信息截图', action: '需人工确认' },
                            { label: '医疗化暗示 / 夸大功效', action: '禁用' },
                            { label: '聊天记录隐私 (微信等)', action: '禁用' },
                            { label: '客户手机号 / 微信号', action: '禁用' },
                          ].map((risk, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                              <span className="text-[13px] font-medium text-neutral-900">{risk.label}</span>
                              <select className="bg-white border border-neutral-200 rounded-md p-1.5 text-[12px] font-bold text-neutral-700 outline-none" defaultValue={risk.action}>
                                <option>自动通过</option>
                                <option>提醒</option>
                                <option>需人工确认</option>
                                <option>禁用</option>
                              </select>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {reviewTab === 'usage' && (
                        <div className="space-y-5 animate-in fade-in">
                          {[
                            { title: '首图标准', desc: '真实感强、主体清楚、点击点明确、不出现明显风险元素、不做硬广感' },
                            { title: '正文图标准', desc: '能承接正文内容、画面信息清楚、可接受轻微生活化瑕疵' },
                            { title: '客户反馈图标准', desc: '隐私必须打码、内容真实自然、不夸大功效、不暴露联系方式' },
                            { title: '对比测评图标准', desc: '避免恶意竞品攻击、不做绝对化结论、保留数据来源依据' },
                          ].map((usage, i) => (
                            <div key={i} className="bg-neutral-50 border border-neutral-200 p-4 rounded-xl">
                               <div className="text-[13px] font-bold text-neutral-900 mb-2">{usage.title}</div>
                               <div className="text-[12px] text-neutral-600 leading-relaxed">{usage.desc}</div>
                               <button className="text-[12px] text-blue-600 font-bold mt-2">编辑要求</button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {reviewTab === 'action' && (
                        <div className="space-y-4 animate-in fade-in">
                          <div className="text-[12px] text-neutral-500 mb-2">当素材不合格时，系统默认采取的处理策略。</div>
                          {[
                            { issue: '轻微问题 (可裁剪、遮挡、调色解决)', action: 'AI 预处理' },
                            { issue: '中风险 (识别存疑或需业务判定)', action: '人工确认' },
                            { issue: '高风险 (严重违规、画质极差无法修复)', action: '打回重拍' },
                            { issue: '相似度过高 (与已发布素材雷同)', action: '推荐替代素材' },
                          ].map((act, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                              <span className="text-[13px] text-neutral-700">{act.issue}</span>
                              <span className="text-[12px] font-bold text-neutral-900 bg-white border border-neutral-200 px-2 py-1 rounded">{act.action}</span>
                            </div>
                          ))}
                          
                          <div className="pt-6 mt-6 border-t border-neutral-100">
                             <div className="text-[13px] font-bold text-neutral-900 mb-3">当前规则生效范围</div>
                             <select className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 text-[13px] text-neutral-900 outline-none focus:border-neutral-400">
                               <option>当前项目 (优先级最高)</option>
                               <option>当前商家 (TapTik 官方旗舰店)</option>
                               <option>全局默认标准</option>
                             </select>
                             <div className="text-[11px] text-neutral-500 mt-2">提示：项目标准将覆盖商家和全局默认标准。</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Common Footer */}
              <div className="p-4 border-t border-neutral-100 bg-neutral-50 shrink-0 flex justify-end gap-3">
                 <button onClick={() => setActiveDrawer(null)} className="px-5 py-2.5 text-[13px] font-bold text-neutral-600 hover:bg-neutral-200 bg-white border border-neutral-200 rounded-xl transition-colors">取消</button>
                 {activeDrawer === 'index' && <button onClick={() => setActiveDrawer(null)} className="px-5 py-2.5 text-[13px] font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors">开始索引</button>}
                 {activeDrawer === 'batch_tag' && batchTagStep === 'select' && <button onClick={() => setBatchTagStep('result')} className="px-5 py-2.5 text-[13px] font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors">AI 预分析</button>}
                 {activeDrawer === 'batch_tag' && batchTagStep === 'result' && <button onClick={() => setActiveDrawer(null)} className="px-5 py-2.5 text-[13px] font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors">确认写入</button>}
                 {activeDrawer === 'clean_oss' && <button onClick={() => setActiveDrawer(null)} className="px-5 py-2.5 text-[13px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors">一键清理安全项</button>}
                 {activeDrawer === 'review_standards' && <button onClick={() => setActiveDrawer(null)} className="px-5 py-2.5 text-[13px] font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors">保存配置</button>}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
</div>
  );
};
