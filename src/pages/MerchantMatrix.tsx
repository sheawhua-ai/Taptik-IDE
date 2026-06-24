import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, Target, Check, ArrowUpRight, CheckCircle2, Activity, Send, 
  Package, X, Calendar, ArrowRight, PenTool, Play, Camera, CalendarClock,
  Image as ImageIcon, Layers, RefreshCw, Sparkles, CheckSquare, Settings, ChevronLeft,
  Users, MoreVertical, CalendarDays, Trash2, AlertTriangle, AlertCircle,
  Plus, Hash, Bot, MessageSquare, QrCode, Copy, LayoutGrid, ArrowLeft, Wand2, Eye, Zap, MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SubagentChat } from '../components/SubagentChat';

interface BatchProject {
 id: string;
 project: string;
 target: string;
 totalCount: number;
 completedCount: number;
}

interface NoteDraft {
 id: string;
 title: string;
 content: string;
 imageType: 'official' | 'real_shoot' | 'pending';
 status: 'drafting' | 'review' | 'dispatched' | 'scheduled' | 'published';
 selected?: boolean;
}

export default function MerchantMatrix() {
 const [activeProject, setActiveProject] = useState<string | null>(null);
 const [isCreatingProject, setIsCreatingProject] = useState(false);
 
 const [reviewingDraft, setReviewingDraft] = useState<NoteDraft | null>(null);
 const [activeTab, setActiveTab] = useState<'notes' | 'tasks'>('notes');
 const [chatInput, setChatInput] = useState("");
 const [isCreatingTask, setIsCreatingTask] = useState(false);
 const [showTaskDetail, setShowTaskDetail] = useState(false);
 const [taskName, setTaskName] = useState("");
 const [taskAssignee, setTaskAssignee] = useState("");
 const [taskCount, setTaskCount] = useState(10);
  const handleFieldFocus = (fieldName: string, content?: string, expertName: string = '内容专家') => {
    window.dispatchEvent(new CustomEvent('open-expert', {
      detail: { 
        expert: expertName, 
        context: content ? `需要修改的${fieldName}：\n"${content}"\n\n请结合项目背景和上述内容，提供修改建议。` : `准备修改${fieldName}...` 
      }
    }));
  };
 const [showQrModal, setShowQrModal] = useState<number | null>(null);
  const [showAssignModal, setShowAssignModal] = useState<number | null>(null);
  const [showNotesModal, setShowNotesModal] = useState<number | null>(null);
  const [showProgressHover, setShowProgressHover] = useState<number | null>(null);
  const [showAuditModal, setShowAuditModal] = useState<number | null>(null);
  const [auditSubmitting, setAuditSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showAssetLibrary, setShowAssetLibrary] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<number[]>([]);
  
  const handleReplaceFromLibrary = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAssetLibrary(true);
  };
  const handleRequestReshoot = (e: React.MouseEvent) => {
    e.stopPropagation();
    setToastMessage("已生成重拍需求，并发送至【拍摄任务管理】");
    setTimeout(() => setToastMessage(""), 2500);
  };
  const handleDeleteImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setToastMessage("图片已删除，并在品牌素材库中重新标记为“可用”状态");
    setTimeout(() => setToastMessage(""), 2500);
  };
  
  const INTERNAL_TASKS = [
  { id: 1, name: '外景通勤透气感穿搭实拍', mergedFrom: 5, count: 15, current: 8, assignee: '豆豆 (新媒体部)', status: '执行中', require: '基于5篇“防晒测评合集”自动提炼。需要阳光充足，体现透气材质，带产品特写。' },
  { id: 2, name: '室内摄影棚平铺静物', mergedFrom: 3, count: 12, current: 0, assignee: '未分配', status: '待分配', require: '基于3篇“单品深度解析”提炼。要求室温柔光背景，高级光影，突出产品质感，3:4构图。' }
];

const EXTERNAL_TASKS = [
  { id: 3, name: '夏季通勤防晒实测第1篇', noteTarget: '防晒测评第1篇：户外暴晒', count: 4, current: 4, assignee: '素人@小甜甜', kocWeChat: 'wx123_summer', kocXhs: '夏日小甜甜', status: 'AI审核通过待发布', require: '需包含真实上脸涂抹图及对应评测配文。合格后AI自动推流发布。' },
  { id: 4, name: '夏季通勤防晒实测第2篇', noteTarget: '防晒单品：带妆不补涂', count: 3, current: 0, assignee: '未分配', kocWeChat: '', kocXhs: '', status: '待领取', require: '需包含带妆出镜图，体现产品服帖度。' }
];

 const [hashtags, setHashtags] = useState(["防晒推荐", "夏日穿搭"]);
 const [suggestedTags] = useState(["好物分享", "测评", "防晒霜", "通勤必备"]);
 
 const [drafts, setDrafts] = useState<NoteDraft[]>([]);
 const [coreTarget, setCoreTarget] = useState("根据前期大盘与策略推演：建议本月提升品牌在下沉市场的防晒搜索卡位，需规模化制造真实素人测评内容，抢占长尾流量池。");
 const [isAnalyzingTarget, setIsAnalyzingTarget] = useState(false);
 const [startDate, setStartDate] = useState('2026-06-25');
 const [showConfirmModal, setShowConfirmModal] = useState(false);
 const handleRemovePeriod = (index: number) => {
 setSchedulePeriods(schedulePeriods.filter((_, i) => i !== index));
 };
 
 const handleNotesChange = (index: number, newNotes: string) => {
 const newPeriods = [...schedulePeriods];
 newPeriods[index].notes = newNotes;
 const count = parseInt(newNotes.replace(/[^0-9]/g, '')) || 0;
 if (count > 0) {
 const main = Math.max(1, Math.floor(count * 0.1));
 const kos = Math.max(1, Math.floor(count * 0.3));
 const koc = count - main - kos;
 newPeriods[index].allocation = `主账号 ${main}篇 | KOS ${kos}篇 | 素人 ${koc}篇`;
 }
 setSchedulePeriods(newPeriods);
 };
 
 const [schedulePeriods, setSchedulePeriods] = useState([
 { period: '冷启动与收录期', notes: '25 篇', target: '跑通账号防晒标签，提升基础社区收录率', allocation: '主账号 2篇 | KOS 5篇 | 素人 18篇' },
 { period: '心智种草与互动期', notes: '40 篇', target: '测试垂直穿搭/美妆流量池，沉淀转化素材', allocation: '主账号 5篇 | KOS 10篇 | 素人 25篇' },
 { period: '搜索卡位与爆发期', notes: '60 篇', target: '集中占据防晒推荐搜索占位，获取长尾流量', allocation: '主账号 5篇 | KOS 15篇 | 素人 40篇' }
 ]);

 const handleAnalyzeTarget = () => {
 if (!coreTarget) return;
 setIsAnalyzingTarget(true);
 setTimeout(() => {
 setIsAnalyzingTarget(false);
 
 setSchedulePeriods([
 { period: '新破圈与受众拓新期', notes: '30 篇', target: '聚焦高潜衍生话题，跨圈层进行流量分发', allocation: '主账号 3篇 | KOS 10篇 | 素人 17篇' },
 { period: '单点打透与带货爆发期', notes: '60 篇', target: '高密度针对核心痛点进行卖点输出，刺激转化', allocation: '主账号 5篇 | KOS 20篇 | 素人 35篇' },
 { period: '长尾卡位阶段', notes: '40 篇', target: '维护热门防晒词条下的首屏占位率，求索被动长尾搜索流量', allocation: '主账号 2篇 | KOS 8篇 | 素人 30篇' }
 ]);
 }, 1500);
 };

 const handleAddPeriod = () => {
 setSchedulePeriods([...schedulePeriods, { period: '常规沉淀期', notes: '15 篇', target: '沉淀自然搜索，内容池维护', allocation: '主账号 2篇 | KOS 3篇 | 素人 10篇' }]);
 };

 useEffect(() => {
 const handleOpenCreate = () => {
 setActiveProject(null);
 setIsCreatingProject(true);
 };
 window.addEventListener('nav-to-create-project', handleOpenCreate);
 return () => window.removeEventListener('nav-to-create-project', handleOpenCreate);
 }, []);

 const MOCK_PROJECTS = [
  { 
  id: 'p1', 
  name: '蕉下 - 夏日防晒种草季', 
  status: '任务进行中',
  progress: 65,
  targetCount: 100,
  recoveredMaterial: 55,
  generatedNotes: 45,
  publishedNotes: 12,
  targetGroup: 'internal'
  },
  { 
  id: 'p2', 
  name: '发小发 - 素人测评寄样派发', 
  status: '筹备中',
  progress: 10,
  targetCount: 50,
  recoveredMaterial: 5,
  generatedNotes: 50,
  publishedNotes: 0,
  targetGroup: 'external'
  }
  ];

 
  const generateMocks = () => {
    setTimeout(() => {
      setDrafts([
        { id: '1', title: '防晒测评第1篇：户外暴晒', content: '作为一个每天通勤的打工人...', score: 92, imageType: 'pending', targetViews: 5000, targetInteractions: 120, status: 'review' },
        { id: '2', title: '防晒单品：带妆不补涂', content: '妆后补防晒真的是个技术活...', score: 85, imageType: 'pending', targetViews: 3000, targetInteractions: 80, status: 'drafting' },
        { id: '3', title: '绝美出街防晒穿搭', content: '今天分享防晒又轻薄的搭配...', score: 95, imageType: 'real_shoot', targetViews: 8000, targetInteractions: 200, status: 'published', kocWeChat: 'wx123_summer', kocXhs: '夏日小甜甜' },
        { id: '4', title: '防晒红黑榜：看看你中招没', content: '总结了几款踩雷和真香的防晒产品。', score: 88, imageType: 'real_shoot', targetViews: 6000, targetInteractions: 150, status: 'scheduled', kocWeChat: 'beauty_koc_01', kocXhs: '护肤野生专家' }
      ]);
    }, 600);
  };

  const handleAutoGroupDispatch = () => {
 // AI automatic grouping logic
 setTimeout(() => {
 setDrafts(drafts.map((d, i) => ({ 
 ...d, 
 imageType: i % 2 === 0 ? 'real_shoot' : 'pending', 
 status: i === 0 ? 'published' : i % 2 === 0 ? 'dispatched' : 'scheduled' 
 })));
 }, 800);
 };

  if (activeProject) {
    const project = MOCK_PROJECTS.find(p => p.id === activeProject) || MOCK_PROJECTS[0];
 return (
 <>
{/* Draft Review Modal */}
 <AnimatePresence>
 {reviewingDraft && (
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm flex justify-center p-4 md:p-8"
 >
 <motion.div 
 initial={{ y: 20, opacity: 0, scale: 0.95 }}
 animate={{ y: 0, opacity: 1, scale: 1 }}
 exit={{ y: 20, opacity: 0, scale: 0.95 }}
 className="w-full max-w-5xl bg-white h-full rounded-[30px] shadow-2xl flex flex-col overflow-hidden"
 >
 <div className="h-16 border-b border-neutral-100 flex items-center justify-between px-6 bg-white shrink-0">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center">
 <PenTool size={18} />
 </div>
 <h2 className="text-[16px] md:text-xl font-semibold text-neutral-900 tracking-tight">修改笔记</h2>
 </div>
 <button onClick={() => setReviewingDraft(null)} className="p-2 hover:bg-neutral-100 rounded-xl text-neutral-400 transition-colors">
 <X size={20} />
 </button>
 </div>
 <div className="flex-1 overflow-y-auto flex flex-col xl:flex-row bg-neutral-50">
 {/* Left: Component Edit */}
 <div className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto custom-scrollbar lg:border-r border-neutral-200">
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <label className="text-[14px] text-neutral-900 flex items-center gap-2">
 <ImageIcon size={18} className="text-neutral-400" />
 笔记素材
 </label>
 
 </div>
 
 <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
 <div onClick={() => handleFieldFocus("封面素材", "请分析此封面首图是否吸睛、是否符合当前笔记调性", "视觉专家")} className="w-[140px] h-[180px] rounded-2xl border-2 border-primary-500 bg-neutral-100 relative shrink-0 overflow-hidden group cursor-pointer hover:border-primary-600 shadow-md">
 <img src="https://images.unsplash.com/photo-1600000000000?auto=format&fit=crop&q=80&w=400&h=600" className="w-full h-full object-cover" alt="封面" />
 <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm z-10 shadow-sm">封面首图</div>
 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm px-2">
    <button onClick={handleReplaceFromLibrary} title="从素材库挑选替换图片" className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors">
      <RefreshCw size={16} />
    </button>
    <button onClick={handleRequestReshoot} title="提交重拍任务" className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors">
      <Camera size={16} />
    </button>
    <button onClick={handleDeleteImage} title="删除并释放至素材库" className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors shadow-sm">
      <Trash2 size={16} />
    </button>
</div>
 </div>
 <div onClick={() => handleFieldFocus("内页素材", "请分析此内页图是否清晰传达了产品信息，与上下文是否连贯", "视觉专家")} className="w-[140px] h-[180px] rounded-2xl border border-neutral-300 bg-neutral-100 relative shrink-0 overflow-hidden group cursor-pointer hover:border-neutral-400 shadow-sm">
 <img src="https://images.unsplash.com/photo-1600000000001?auto=format&fit=crop&q=80&w=400&h=600" className="w-full h-full object-cover" alt="内图" />
 <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm z-10 shadow-sm">内页 1</div>
 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm px-2">
    <button onClick={handleReplaceFromLibrary} title="从素材库挑选替换图片" className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors">
      <RefreshCw size={16} />
    </button>
    <button onClick={handleRequestReshoot} title="提交重拍任务" className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors">
      <Camera size={16} />
    </button>
    <button onClick={handleDeleteImage} title="删除并释放至素材库" className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors shadow-sm">
      <Trash2 size={16} />
    </button>
</div>
 </div>
 <div onClick={handleReplaceFromLibrary} className="w-[140px] h-[180px] rounded-2xl border border-dashed border-neutral-300 bg-white relative shrink-0 flex flex-col gap-2 items-center justify-center hover:bg-neutral-50 cursor-pointer transition-colors text-neutral-400 hover:text-neutral-600">
 <PlusCircle size={28} />
 <span className="text-[12px] ">添加笔记素材</span>
 </div>
 </div>
 </div>

 <div className="space-y-3 group/title relative">
 <div className="flex items-center justify-between">
 <label className="text-[14px] text-neutral-900 flex items-center gap-2">
 <PenTool size={18} className="text-neutral-400" />
 笔记标题
 </label>
 
 </div>
 <div className="relative">
 <input type="text" defaultValue={reviewingDraft.title} onClick={(e) => handleFieldFocus("标题", e.currentTarget.value)} onFocus={(e) => handleFieldFocus("标题", e.currentTarget.value)}  className="w-full bg-white border border-neutral-200 rounded-xl pl-4 pr-10 py-3.5 text-[15px] outline-none focus:border-primary-500 hover:border-neutral-300 transition-colors shadow-inner" />
 
 </div>
 </div>
 <div className="space-y-3 group/content relative">
 <div className="flex flex-wrap items-center justify-between gap-2">
 <label className="text-[14px] text-neutral-900 flex items-center gap-2">
 <PenTool size={18} className="text-neutral-400" />
 笔记正文与排版
 </label>
 
 </div>
 <div className="relative">
 <textarea rows={10} defaultValue={reviewingDraft.content} onClick={(e) => handleFieldFocus("正文", e.currentTarget.value.slice(0, 50) + "...")} onFocus={(e) => handleFieldFocus("正文", e.currentTarget.value.slice(0, 50) + "...")}  className="w-full bg-white border border-neutral-200 hover:border-neutral-300 rounded-xl p-4 text-[14px] outline-none focus:border-primary-500 transition-colors resize-none custom-scrollbar leading-relaxed shadow-inner block" />
 
 </div>
 </div>

 <div className="space-y-3">
 <label className="text-[14px] text-neutral-900 flex items-center gap-2">
 <Hash size={18} className="text-neutral-400" />
 话题标签打标 (Hashtags)
 </label>
 <div className="flex flex-wrap gap-2">
 {hashtags.map(t => (
 <span key={t} className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-[13px] flex items-center gap-1.5 shadow-sm">
 #{t} 
 <button className="hover:text-red-400" onClick={() => setHashtags(hashtags.filter(h => h !== t))}><X size={14} /></button>
 </span>
 ))}
 <button className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 rounded-lg text-[13px] flex items-center gap-1 shadow-sm transition-colors">
 <Plus size={14} /> 自定义
 </button>
 </div>
 <div className="pt-2 bg-primary-50/50 p-3 rounded-xl mt-2 flex flex-col gap-2">
 <span className="text-[11px] text-primary-500 uppercase flex items-center gap-1">
 <Sparkles size={12} /> AI 智能检测下划词推荐:
 </span>
 <div className="flex flex-wrap gap-2">
 {suggestedTags.map(t => (
 <button key={t} onClick={() => !hashtags.includes(t) && setHashtags([...hashtags, t])} className="text-[12px] text-neutral-600 bg-white border border-neutral-200 hover:border-primary-300 hover:text-primary-600 px-3 py-1 rounded-lg transition-colors shadow-sm">
 +{t}
 </button>
 ))}
 </div>
 </div>
 </div>

 </div>

 {/* Right: Subagent Chat */} 
          <div className="w-full xl:w-[380px] bg-white border-l border-neutral-200 flex flex-col shrink-0 relative">
             <div className="absolute inset-0 pb-[80px]">
               <SubagentChat 
                  moduleId="content" 
                  moduleName="内容精修专家" 
                  onClose={() => setReviewingDraft(null)} 
               />
             </div>
             <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-100 bg-white shrink-0 z-10">
                <button onClick={() => setReviewingDraft(null)} className="w-full py-3 bg-neutral-900 text-white rounded-xl text-[14px] font-medium hover:bg-neutral-800 transition-colors shadow-md active:scale-95 flex justify-center items-center gap-2">
                  完成修改并保存 <CheckCircle2 size={16} />
                </button>
             </div>
          </div>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 <div className="w-full h-full flex flex-col overflow-hidden">
        <div className="h-20 border-b border-neutral-100 flex items-center justify-between px-8 bg-white shrink-0 z-10 w-full mb-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveProject(null)} className="p-2 hover:bg-neutral-100 rounded-xl text-neutral-500 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div className="w-12 h-12 bg-neutral-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <PenTool size={24} />
            </div>
            <div>
              <h2 className="text-[17px] font-semibold text-neutral-900 tracking-tight">项目草稿与成稿管理</h2>
              <p className="text-[11px] text-neutral-400 mt-0.5">{project.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleAutoGroupDispatch} className="px-5 py-2.5 bg-neutral-900 text-white rounded-[14px] text-[13px] font-medium flex items-center gap-2 shadow-lg hover:bg-neutral-800 active:scale-95 transition-all tooltip" title="智能分配并排期">
              <Wand2 size={16} /> AI 一键派发执行
            </button>
          </div>
        </div>
        <div className="flex-1 w-full overflow-y-auto bg-neutral-50/50 custom-scrollbar pb-24">
          <div className="max-w-6xl mx-auto p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {drafts.map((draft, idx) => (
                <div key={draft.id} className="bg-white border border-neutral-200 rounded-[20px] overflow-hidden hover:shadow-xl transition-all group">
                  <div className="p-5 border-b border-neutral-100">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-[15px] font-semibold text-neutral-900 line-clamp-2 leading-tight">{draft.title}</h3>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${draft.score && draft.score > 90 ? 'bg-orange-50 text-orange-500' : 'bg-neutral-50 text-neutral-400'}`}>
                        {draft.score ? <span className="text-[12px] font-bold">{draft.score}</span> : <Zap size={14} />}
                      </div>
                    </div>
                    <p className="text-[13px] text-neutral-500 line-clamp-3 leading-relaxed mb-4">{draft.content}</p>
                    
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span className="flex items-center gap-1.5"><Eye size={12} /> {draft.targetViews} 预估阅读</span>
                      <span className="flex items-center gap-1.5"><MessageCircle size={12} /> {draft.targetInteractions} 预估互动</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-neutral-50/50 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-neutral-500 flex items-center gap-1.5">
                        <ImageIcon size={14} /> 
                        {draft.imageType === 'official' ? '官方素材' : draft.imageType === 'real_shoot' ? '实拍回传' : '待补充素材'}
                      </span>
                      <span className={`text-[11px] px-2 py-1 rounded-md border ${draft.status === 'published' ? 'bg-success-50 text-success-600 border-success-200' : draft.status === 'dispatched' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : draft.status === 'review' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-white text-neutral-500 border-neutral-200'}`}>
                        {draft.status === 'published' ? '已发布' : draft.status === 'dispatched' ? '已派发执行' : draft.status === 'review' ? '待审核修改' : draft.status === 'scheduled' ? '已排期待发' : 'AI起草中'}
                      </span>
                    </div>
                    
                    {(draft.kocWeChat || draft.kocXhs) && (
                      <div className="text-[10px] text-neutral-400 bg-white border border-neutral-100 p-2 rounded-lg flex flex-col gap-1">
                         {draft.kocWeChat && <div>企微：{draft.kocWeChat}</div>}
                         {draft.kocXhs && <div>小红书：{draft.kocXhs}</div>}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => setReviewingDraft(draft)} className="flex-1 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[12px] font-medium hover:bg-neutral-50 transition-colors shadow-sm">
                        审阅笔记修改
                      </button>
                      <button className="flex-1 py-2.5 bg-neutral-900 text-white rounded-xl text-[12px] font-medium hover:bg-neutral-800 transition-colors shadow-sm">
                        分配 KOC/账号
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

  {/* Create Project Overlay Modal */}

 <AnimatePresence>
 {isCreatingProject && (
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm flex justify-end p-4"
 >
 <motion.div 
 initial={{ x: '100%', opacity: 0 }}
 animate={{ x: 0, opacity: 1 }}
 exit={{ x: '100%', opacity: 0 }}
 transition={{ type: 'spring', damping: 30, stiffness: 300 }}
 className="w-full max-w-3xl bg-white h-full rounded-[40px] shadow-2xl flex flex-col overflow-hidden"
 >
 <div className="h-20 border-b border-neutral-100 flex items-center justify-between px-8 bg-white shrink-0">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-2xl flex items-center justify-center">
 <Package size={20} />
 </div>
 <h2 className="text-xl font-semibold text-neutral-900 tracking-tight">创建新项目</h2>
 </div>
 <button onClick={() => setIsCreatingProject(false)} className="p-2 hover:bg-neutral-100 rounded-xl text-neutral-400 transition-colors">
 <X size={20} />
 </button>
 </div>
 
 <div className="flex-1 overflow-y-auto p-8 bg-neutral-50/30 custom-scrollbar space-y-10">
 <div className="space-y-6">
  <h3 className="text-[14px] font-semibold text-neutral-900 uppercase tracking-widest flex items-center gap-2">
    <Target size={18} className="text-neutral-400" /> 1. 业务战略与选题推演
  </h3>
  <div className="space-y-3">
    <label className="text-[11px] text-neutral-400 uppercase">前期业务目标与种草焦点</label>
    <textarea 
      rows={3} 
      value={coreTarget}
      onChange={(e) => setCoreTarget(e.target.value)}
      placeholder="描述您的期望，例如：'想在下个月提升防晒品类的搜索占位，主推办公室通勤不闷痘场景...' " 
      className="w-full bg-white border border-neutral-200 rounded-2xl p-4 text-[14px] outline-none focus:border-primary-500 transition-colors resize-none leading-relaxed"
    />
  </div>
  <div className="mt-2">
    <button 
      onClick={handleAnalyzeTarget}
      disabled={isAnalyzingTarget}
      className={`px-6 py-3.5 rounded-xl text-[13px] flex items-center justify-center w-full sm:w-auto gap-2 transition-all shadow-lg active:scale-95 border-0 ${isAnalyzingTarget ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed' : 'bg-neutral-900 text-white hover:bg-primary-500 group'}`}
    >
      <Sparkles size={16} className={isAnalyzingTarget ? "animate-spin text-neutral-500" : "text-primary-400 group-hover:text-white transition-colors"} /> 
      {isAnalyzingTarget ? 'AI 分析选题及用户偏好中...' : 'AI 一键生成矩阵策略与执行大纲'}
    </button>
  </div>
</div>

<div className="space-y-6 pt-6 border-t border-neutral-200/50">
  <h3 className="text-[14px] font-semibold text-neutral-900 uppercase tracking-widest flex items-center gap-2">
    <Package size={18} className="text-neutral-400" /> 2. 基础配置与发包模式
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="space-y-2">
      <label className="text-[11px] text-neutral-400 uppercase">项目名称</label>
      <input type="text" placeholder="例如：2026秋季大促矩阵" className="w-full h-12 bg-white border border-neutral-200 rounded-xl px-4 text-[14px] outline-none focus:border-primary-500 transition-colors" />
      </div>
      <div className="space-y-2">
      <label className="text-[11px] text-neutral-400 uppercase">排期起始时间</label>
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full h-12 bg-white border border-neutral-200 rounded-xl px-4 text-[14px] outline-none focus:border-primary-500 transition-colors text-neutral-700 block" style={{ colorScheme: 'light' }} />
      </div>

    <div className="col-span-1 md:col-span-2 space-y-2 mt-2">
      <label className="text-[11px] text-neutral-400 uppercase">素材执行</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="border-2 border-primary-500 bg-primary-50 rounded-xl p-3 flex items-start gap-3 cursor-pointer">
          <div className="w-5 h-5 rounded-full border-4 border-primary-500 bg-white shrink-0 mt-0.5"></div>
          <div>
            <div className="text-[13px] font-semibold text-neutral-900">内部员工</div>
            <div className="text-[11px] text-neutral-500 mt-1">自动合并相似构图需求，打包发送至企微进行员工排期拍摄</div>
          </div>
        </div>
        <div className="border border-neutral-200 bg-white hover:border-primary-200 rounded-xl p-3 flex items-start gap-3 cursor-pointer">
          <div className="w-5 h-5 rounded-full border border-neutral-300 bg-white shrink-0 mt-0.5 relative"><div className="absolute inset-1 rounded-full bg-transparent hover:bg-neutral-100"></div></div>
          <div>
            <div className="text-[13px] font-semibold text-neutral-900">外部KOC</div>
            <div className="text-[11px] text-neutral-500 mt-1">按单篇生成任务下发接单大厅。接单上传通过后AI代发布</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div className="space-y-6 pt-6 border-t border-neutral-200/50">
 <div className="flex flex-col gap-1">
 <div className="flex items-center justify-between">
 <h3 className="text-[14px] font-semibold text-neutral-900 uppercase tracking-widest flex items-center gap-2">
 <Calendar size={18} className="text-neutral-400" /> 3. 规划执行排期与账号分配
 </h3>
 <span className="text-[10px] text-neutral-500 bg-white border border-neutral-200 px-2.5 py-1 rounded-md shadow-sm">可手动微调</span>
 </div>
 <p className="text-[12px] text-neutral-400 ml-6">系统已根据目标智能规划出最优发布节奏与所需的笔记规模。</p>
 </div>
 
 <div className="space-y-4">
 {schedulePeriods.map((m, i) => (
 <div key={i} className="bg-white p-6 rounded-[24px] border border-neutral-200 hover:border-primary-500/30 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col xl:flex-row items-start xl:items-center gap-5">
 <div className="w-10 h-10 bg-neutral-100 rounded-[12px] flex items-center justify-center text-neutral-500 text-[15px] shrink-0">
 {i + 1}
 </div>
 <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
 <div className="xl:col-span-1">
 <label className="text-[10px] text-neutral-400 uppercase mb-1.5 block">阶段定义</label>
 <input readOnly value={m.period} className="w-full bg-neutral-100 border border-transparent rounded-xl px-3 py-2 text-[13px] text-neutral-500 outline-none cursor-not-allowed" />
 </div>
 <div className="xl:col-span-1">
 <label className="text-[10px] text-neutral-400 uppercase mb-1.5 block">目标产量</label>
 <input value={m.notes} onChange={(e) => handleNotesChange(i, e.target.value)} className="w-full bg-white border border-neutral-200/50 rounded-xl px-3 py-2 text-[13px] outline-none focus:bg-white focus:border-primary-500 transition-colors" />
 </div>
 <div className="xl:col-span-2">
 <label className="text-[10px] text-neutral-400 uppercase mb-1.5 block">阶段核心目标 (KPI)</label>
 <input defaultValue={m.target} className="w-full bg-neutral-50 border border-neutral-200/50 rounded-xl px-3 py-2 text-[13px] outline-none focus:bg-white focus:border-primary-500 transition-colors" />
 </div>
 <div className="xl:col-span-1">
 <label className="text-[10px] text-neutral-400 uppercase mb-1.5 block">账号类型分配</label>
 <input readOnly value={m.allocation} title={m.allocation} className="w-full bg-neutral-50 border border-neutral-200/50 rounded-xl px-3 py-2 text-[11px] outline-none focus:bg-white focus:border-primary-500 transition-colors text-slate-700" />
 </div>
 </div>
 <button onClick={() => handleRemovePeriod(i)} className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors shrink-0" title="删除当前阶段排期">
 <Trash2 size={14} />
 </button>
 </div>
 ))}
 
 </div>
 </div>
 </div>

 <div className="h-24 border-t border-neutral-100 bg-white flex items-center justify-between px-8 shrink-0">
 <div className="text-[12px] text-neutral-400 flex items-center gap-2 bg-neutral-50 px-4 py-2 rounded-xl">
 <div className="relative flex h-2 w-2">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
 </div>
 已默认关联当前商家 IP规范与敏感词拦截库
 </div>
 <div className="flex items-center gap-3">
 <button onClick={() => setIsCreatingProject(false)} className="px-6 py-3.5 rounded-xl text-[14px] text-neutral-500 hover:bg-neutral-100 transition-colors">
 取消
 </button>
 <button onClick={() => setShowConfirmModal(true)} className="px-8 py-3.5 bg-primary-500 text-white rounded-xl text-[14px] hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20 active:scale-95 flex items-center gap-2">
 确认立项并保存任务排期 <ArrowRight size={16} />
 </button>
 </div>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 {/* Create Task Modal */}
 <AnimatePresence>
 {isCreatingTask && (
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm flex justify-center p-4 items-center"
 >
 <motion.div 
 initial={{ y: 20, opacity: 0, scale: 0.95 }}
 animate={{ y: 0, opacity: 1, scale: 1 }}
 exit={{ y: 20, opacity: 0, scale: 0.95 }}
 className="w-full max-w-lg bg-white rounded-[24px] shadow-2xl flex flex-col overflow-hidden"
 >
 <div className="h-16 border-b border-neutral-100 flex items-center justify-between px-6 bg-neutral-50 shrink-0">
 <h2 className="text-[16px] font-semibold text-neutral-900 tracking-tight">发布新的素材图文收集任务</h2>
 <button onClick={() => setIsCreatingTask(false)} className="p-2 hover:bg-neutral-200 rounded-xl text-neutral-500 transition-colors">
 <X size={20} />
 </button>
 </div>
 <div className="p-6 space-y-5">
 <div className="space-y-2">
 <label className="text-[13px] text-neutral-900">任务需求名称</label>
 <input value={taskName} onChange={e => setTaskName(e.target.value)} placeholder="例如: 阳光外拍素材集1" className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-primary-500 transition-colors shadow-sm" />
 </div>
 <div className="flex gap-4">
 <div className="flex-1 space-y-2">
 <label className="text-[13px] text-neutral-900">指派给谁 (承接人/编外机构)</label>
 <input value={taskAssignee} onChange={e => setTaskAssignee(e.target.value)} placeholder="例如: 外部编导 王小明" className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-primary-500 transition-colors shadow-sm" />
 </div>
 <div className="w-[120px] space-y-2">
 <label className="text-[13px] text-neutral-900">图文张数</label>
 <input type="number" value={taskCount} onChange={e => setTaskCount(Number(e.target.value))} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-primary-500 transition-colors shadow-sm" />
 </div>
 </div>
 </div>
 <div className="p-6 pt-0">
 <button 
 onClick={() => {
 // setTasks([...tasks, { id: Date.now(), name: taskName, assignee: taskAssignee || "待定", count: taskCount, current: 0, status: '待承接', require: '请根据提示要求回传高质量图文。' }]);
 setIsCreatingTask(false);
 setTaskName("");
 setTaskAssignee("");
 }}
 className="w-full py-3.5 bg-neutral-900 text-white rounded-xl text-[14px] transition-all hover:bg-primary-500 shadow-md active:scale-95"
 >
 确认派发图文任务
 </button>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 {/* Secondary Confirmation Modal */}
 <AnimatePresence>
 {showConfirmModal && (
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
 >
 <motion.div
 initial={{ scale: 0.95, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.95, opacity: 0 }}
 className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
 >
 <div className="p-6 border-b border-neutral-100 flex items-center gap-4 bg-amber-50">
 <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-[16px] flex items-center justify-center shrink-0">
 <AlertTriangle size={24} />
 </div>
 <div>
 <h3 className="text-[16px] font-semibold text-amber-900">执行资源预警确认</h3>
 <p className="text-[12px] text-amber-700 mt-1">检测到计划发布分发的内容密集度较高，需二次确认</p>
 </div>
 </div>
 <div className="p-6 space-y-4 bg-white flex-1">
 <div className="p-4 bg-neutral-50 rounded-[16px] border border-neutral-200">
 <ul className="space-y-3">
 <li className="flex items-start gap-2">
 <AlertCircle size={14} className="text-neutral-400 mt-0.5 shrink-0" />
 <span className="text-[13px] text-slate-700 leading-snug">
 请确认是否具备足够数量的合作账号矩阵。
 </span>
 </li>
 <li className="flex items-start gap-2">
 <AlertCircle size={14} className="text-neutral-400 mt-0.5 shrink-0" />
 <span className="text-[13px] text-slate-700 leading-snug">
 所有内容将由博主或员工扫描二维码通过官方流程发布（防风控安全模式），如储备账号不足，将导致您规划的产能无法落地分发。
 </span>
 </li>
 </ul>
 </div>
 <p className="text-[12px] text-neutral-500 px-1">
 点击“强制执行创建”后，系统将在本阶段自动锁定对应的预算和积分消耗。
 </p>
 </div>
 <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-end gap-3 shrink-0">
 <button onClick={() => setShowConfirmModal(false)} className="px-5 py-2.5 rounded-xl text-[13px] text-neutral-500 hover:bg-neutral-200 transition-colors">
 返回调整排期
 </button>
 <button onClick={() => { setShowConfirmModal(false); setIsCreatingProject(false); }} className="px-6 py-2.5 bg-amber-500 text-white rounded-xl text-[13px] hover:bg-amber-600 transition-all shadow-sm active:scale-95">
 确认资源充足，强制执行
 </button>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Task Detail Modal */}
 <AnimatePresence>
 {showTaskDetail && (
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-[60] bg-neutral-900/40 backdrop-blur-sm flex justify-center p-4 md:p-8"
 onClick={() => setShowTaskDetail(false)}
 >
 <motion.div 
 initial={{ y: 20, opacity: 0, scale: 0.95 }}
 animate={{ y: 0, opacity: 1, scale: 1 }}
 exit={{ y: 20, opacity: 0, scale: 0.95 }}
 className="w-full max-w-xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden relative"
 onClick={(e) => e.stopPropagation()}
 >
 <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
 <div>
 <h2 className="text-[18px] font-semibold text-neutral-900">图文承接人员提交详情</h2>
 <p className="text-[12px] text-neutral-400 mt-1">监督哪些人已经提交，或者发微信通知催办</p>
 </div>
 <button onClick={() => setShowTaskDetail(false)} className="p-2 hover:bg-neutral-200 rounded-xl text-neutral-500 transition-colors">
 <X size={20} />
 </button>
 </div>
 <div className="p-6 space-y-4">
 <div className="flex items-center justify-between p-4 border border-neutral-100 rounded-2xl bg-white">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center ">豆</div>
 <div>
 <p className="text-[14px] text-neutral-900">@豆豆 (KOC)</p>
 <p className="text-[12px] text-neutral-400">已提交 8 张原图结构</p>
 </div>
 </div>
 <span className="text-[12px] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">已完成</span>
 </div>
 <div className="flex items-center justify-between p-4 border border-neutral-100 rounded-2xl bg-white">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center ">李</div>
 <div>
 <p className="text-[14px] text-neutral-900">@李同学 (KOC)</p>
 <p className="text-[12px] text-amber-500">待提交素材，原定 7 张</p>
 </div>
 </div>
 <button className="text-[12px] text-primary-600 bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors">
 <MessageSquare size={14} /> 微信催图
 </button>
 </div>
 </div>
 <div className="p-6 pt-2">
 <button onClick={() => setShowTaskDetail(false)} className="w-full py-4 text-[14px] text-neutral-900 bg-neutral-100 hover:bg-neutral-200 transition-colors rounded-xl">关闭</button>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
</>
  );
}

  if (isCreatingProject) {
    return (
      <div className="flex flex-col h-full bg-neutral-50/50 p-8 items-center justify-center">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">创建新项目</h2>
        <button onClick={() => setIsCreatingProject(false)} className="px-5 py-2.5 bg-neutral-200 text-neutral-700 rounded-xl">返回</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-neutral-50/50 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 tracking-tight">项目与任务矩阵</h2>
          <p className="text-[13px] text-neutral-500 mt-1">管理所有分发任务、图文回收与审批排期</p>
        </div>
        <button 
          onClick={() => setIsCreatingProject(true)}
          className="px-5 py-2.5 bg-primary-500 text-white rounded-xl text-[13px] font-medium hover:bg-primary-600 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={16} /> 创建新项目
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {MOCK_PROJECTS.map(p => (
          <div 
            key={p.id}
            onClick={() => setActiveProject(p.id)}
            className="bg-white p-5 rounded-2xl border border-neutral-200 hover:border-primary-500 hover:shadow-lg transition-all cursor-pointer group flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                <LayoutGrid size={18} />
              </div>
              <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${p.status === '任务进行中' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                {p.status}
              </span>
            </div>
            <h3 className="text-[15px] font-semibold text-neutral-900 mb-1 group-hover:text-primary-600 transition-colors">{p.name}</h3>
            <p className="text-[12px] text-neutral-400 mb-4">{p.targetGroup === 'internal' ? '内部员工发包任务' : '素人KOC派单任务'}</p>
            
            <div className="mt-auto space-y-3">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-neutral-500">素材回收进度</span>
                <span className="font-medium text-neutral-900">{p.recoveredMaterial}/{p.targetCount}</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full transition-all duration-500" style={{ width: `${(p.recoveredMaterial / p.targetCount) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const TargetIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
