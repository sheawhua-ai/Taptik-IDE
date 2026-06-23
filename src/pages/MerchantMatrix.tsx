import React, { useState, useEffect } from 'react';
import { 
 PlusCircle, Target, ArrowUpRight, CheckCircle2, Activity, Send, 
 Package, X, Calendar, ArrowRight, PenTool, Play, Camera, CalendarClock,
 Image as ImageIcon, Layers, RefreshCw, Sparkles, CheckSquare, Settings, ChevronLeft,
 Users, MoreVertical, CalendarDays, Trash2, AlertTriangle, AlertCircle,
 Plus, Hash, Bot, MessageSquare, QrCode, Copy
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
  { id: 3, name: '夏季通勤防晒实测第1篇', noteTarget: '防晒测评第1篇：户外暴晒', count: 4, current: 4, assignee: '素人@小甜甜', status: 'AI审核通过待发布', require: '需包含真实上脸涂抹图及对应评测配文。合格后AI自动推流发布。' },
  { id: 4, name: '夏季通勤防晒实测第2篇', noteTarget: '防晒单品：带妆不补涂', count: 3, current: 0, assignee: '未分配', status: '待领取', require: '需包含带妆出镜图，体现产品服帖度。' }
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
        { id: '1', title: '防晒测评第1篇：户外暴晒', content: '作为一个每天通勤的打工人...', score: 92, imageType: 'pending', targetViews: 5000, targetInteractions: 120, status: 'scheduled' },
        { id: '2', title: '防晒单品：带妆不补涂', content: '妆后补防晒真的是个技术活...', score: 85, imageType: 'pending', targetViews: 3000, targetInteractions: 80, status: 'scheduled' }
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
 <div className="w-[140px] h-[180px] rounded-2xl border border-dashed border-neutral-300 bg-white relative shrink-0 flex flex-col gap-2 items-center justify-center hover:bg-neutral-50 cursor-pointer transition-colors text-neutral-400 hover:text-neutral-600">
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

 {/* Status Config */} 
 <div className="w-full xl:w-[280px] bg-white border-l border-neutral-200 p-6 flex flex-col justify-end shrink-0 block">
 <button onClick={() => setReviewingDraft(null)} className="w-full py-4 bg-primary-500 text-white rounded-[14px] text-[15px] hover:bg-primary-600 transition-colors shadow-lg active:scale-95 flex justify-center items-center gap-2 mb-3">
 确认人工精修无误 <CheckCircle2 size={18} />
 </button>
 
</div>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 <div className="flex flex-col h-full bg-neutral-50/50 overflow-hidden">


 {/* Project Generation Header */}
 <div className="h-20 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0 bg-white z-10">
 <div className="flex items-center gap-4">
 <button 
 onClick={() => { setActiveProject(null); }}
 className="w-10 h-10 border border-neutral-200 rounded-xl flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors"
 >
 <ChevronLeft size={20} />
 </button>
 <div>
 <h2 className="text-[17px] font-semibold text-neutral-900 tracking-tight">{project.name}</h2>
 <p className="text-[11px] text-neutral-400 mt-0.5">笔记管理与素材分配</p>
 </div>
 </div>
 
 
 </div>

 
      
      {/* Modals for Task Management */}
      <AnimatePresence>
        {showQrModal !== null && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-sm overflow-hidden flex flex-col shadow-2xl">
              <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
                <h3 className="font-medium text-neutral-900 border-l-4 border-primary-500 pl-2">任务分发二维码</h3>
                <button onClick={() => setShowQrModal(null)} className="p-1 hover:bg-neutral-200 rounded text-neutral-400"><X size={18} /></button>
              </div>
              <div className="p-6 flex flex-col items-center">
                <div className="w-48 h-48 bg-neutral-100 rounded-xl mb-4 flex items-center justify-center border-2 border-dashed border-neutral-200">
                  <QrCode size={100} className="text-neutral-400" />
                </div>
                <p className="text-[13px] text-neutral-500 text-center mb-4 leading-relaxed">扫码或复制链接下发给员工<br/>员工扫码后将自动将此任务添加至其工作日历中</p>
                <div className="flex w-full gap-2">
                  <div className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-[12px] text-neutral-500 flex items-center overflow-hidden">
                    <span className="truncate">https://ai.work/tasks/t-{showQrModal}</span>
                  </div>
                  <button onClick={() => {
                    setToastMessage("链接已复制，可直接下发给相关员工");
                    setTimeout(() => setToastMessage(""), 2000);
                  }} className="px-3 py-2 bg-primary-50 text-primary-600 rounded-lg shrink-0 flex items-center gap-1 hover:bg-primary-100 transition-colors tooltip" title="复制">
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showAssignModal !== null && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl">
              <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
                <h3 className="font-medium text-neutral-900 border-l-4 border-primary-500 pl-2">智能指派与企微/微信通知</h3>
                <button onClick={() => setShowAssignModal(null)} className="p-1 hover:bg-neutral-200 rounded text-neutral-400"><X size={18} /></button>
              </div>
              
              <div className="p-5 flex flex-col gap-4 bg-white max-h-[70vh] overflow-y-auto">
                {/* AI 自动化分发策略 */}
                <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 p-4 rounded-xl border border-primary-100">
                   <div className="flex items-center gap-2 mb-2 text-primary-700 font-medium text-[14px]">
                     <Sparkles size={16} /> AI 将基于视觉需求自动匹配最合适的内部员工
                   </div>
                   <div className="mt-3">
                     <button onClick={() => {
                        setToastMessage("AI 已自动指派员工「豆豆」，并通过企微/微信发送任务卡片");
                        setTimeout(() => setToastMessage(""), 3000);
                        setShowAssignModal(null);
                     }} className="w-full bg-white p-4 rounded-lg border border-primary-200 shadow-sm hover:shadow hover:border-primary-400 transition-all text-left flex items-center justify-between group">
                       <div className="flex flex-col gap-1">
                         <span className="text-[14px] font-semibold text-neutral-900 flex items-center gap-2"><svg className="w-4 h-4 text-[#10B681]" fill="currentColor" viewBox="0 0 24 24"><path d="M12.003 0C5.372 0 0 5.373 0 12.003c0 6.633 5.372 12.005 12.003 12.005 6.629 0 12.001-5.372 12.001-12.005C24.004 5.373 18.632 0 12.003 0zm4.568 15.938H7.43v-1.748h9.141v1.748zm.284-4.887H7.146v-1.746h9.709v1.746zm.283-4.885H6.864v-1.748h10.27v1.748z"/></svg>通过企微/微信通知下发</span>
                         <span className="text-[11px] text-neutral-500">依据员工画像与空闲度一键外派，素材回传后自动进入系统</span>
                       </div>
                       <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform">
                         <Bot size={18}/>
                       </div>
                     </button>
                   </div>
                </div>

                <div className="text-[12px] font-medium text-neutral-900 mt-2 mb-1 flex items-center justify-between">
                  手动下发
                  <span className="text-[10px] text-neutral-400 font-normal">指定特定部门与标签</span>
                </div>
                <div className="grid gap-2">
                {[
                  { name: '王大锤', dept: '设计部', status: '空闲', tags: ['棚拍', '精修', '视觉总控'], color: 'bg-green-100 text-green-600' },
                  { name: '豆豆', dept: '新媒体部', status: '进行2个任务', tags: ['生活感', '外景', '通勤', '出镜'], color: 'bg-amber-100 text-amber-600' },
                  { name: '视觉天下影棚', dept: '外部机构', status: '空闲', tags: ['专业器材', '批量产出'], color: 'bg-green-100 text-green-600' }
                ].map((person, idx) => (
                  <div key={idx} onClick={() => {
                    setToastMessage("已通过企业微信发送任务通知给：" + person.name);
                    setTimeout(() => setToastMessage(""), 3000);
                    setShowAssignModal(null);
                  }} className="p-3 border border-neutral-200 rounded-xl hover:border-primary-500 hover:shadow-md cursor-pointer transition-all flex flex-col gap-2 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500"><Users size={16} /></div>
                        <div>
                          <div className="text-[13px] text-neutral-900 font-medium mb-0.5">{person.name} <span className="text-[11px] text-neutral-400">({person.dept})</span></div>
                          <div className={`text-[10px] w-fit px-1.5 py-0.5 rounded-full ${person.color}`}>{person.status}</div>
                        </div>
                      </div>
                      <span className="text-primary-500 opacity-0 group-hover:opacity-100 text-[12px] bg-primary-50 px-2 py-1 rounded transition-opacity font-medium">指派任务</span>
                    </div>
                    <div className="flex flex-wrap gap-1 pl-13">
                      {person.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded border border-neutral-200 flex items-center gap-0.5"><Hash size={10}/> {tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showNotesModal !== null && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl">
              <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
                <div>
                  <h3 className="font-medium text-neutral-900 border-l-4 border-primary-500 pl-2">任务需求拆解来源</h3>
                  <p className="text-[11px] text-neutral-500 mt-1 pl-3">此素材任务的总体要求由以下笔记AI汇总生成</p>
                </div>
                <button onClick={() => setShowNotesModal(null)} className="p-1 hover:bg-neutral-200 rounded text-neutral-400"><X size={18} /></button>
              </div>
              <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                {[1,2,3].map(i => (
                  <div key={i} className="flex gap-4 p-4 border border-neutral-100 rounded-xl bg-neutral-50/50">
                    <div className="w-16 h-20 bg-neutral-200 rounded object-cover overflow-hidden shrink-0">
                      <img src={`https://images.unsplash.com/photo-1600000${i}00000?auto=format&fit=crop&q=80&w=100&h=140`} className="w-full h-full object-cover"/>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[14px] font-medium text-neutral-900 mb-1">防晒推荐大赏 - 笔记草稿 {i}</h4>
                      <p className="text-[12px] text-neutral-500 mb-3 bg-white p-2 rounded border border-neutral-100 shadow-sm">这里需要展示夏日强烈阳光下出行的状态，封面首图侧重整体穿搭效果，内页需求包括产品细节特写与质感展示...</p>
                      <div className="flex gap-2">
                         <span className="px-2 py-0.5 bg-white border border-neutral-200 text-[11px] font-medium text-neutral-700 rounded shadow-sm">需求：封面 (1张)</span>
                         <span className="px-2 py-0.5 bg-white border border-neutral-200 text-[11px] font-medium text-neutral-700 rounded shadow-sm">需求：内页图 (3-4张)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      
        {showAuditModal !== null && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl">
              <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
                <div>
                  <h3 className="font-medium text-neutral-900 border-l-4 border-primary-500 pl-2">AI 自动审核报告</h3>
                  <p className="text-[11px] text-neutral-500 mt-1 pl-3">系统已自动审核素人提交素材，并将其同步至对应笔记发布队列</p>
                </div>
                <button onClick={() => setShowAuditModal(null)} className="p-1 hover:bg-neutral-200 rounded text-neutral-400"><X size={18} /></button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="flex gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center bg-emerald-100 text-emerald-600"><CheckCircle2 size={18}/></div>
                  <div>
                    <div className="text-[14px] font-medium text-neutral-900 flex items-center gap-2">素人@小甜甜 - 提交的图文素材</div>
                    <div className="text-[12px] text-emerald-500 mt-1 flex items-center gap-1"><Sparkles size={12}/> AI 视觉引擎校验通过，内容健康且满足需求</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-[13px] font-medium text-neutral-900 mb-2 flex items-center gap-1.5"><ImageIcon size={14}/> 审核通过素材 (4/4)</div>
                    <div className="grid grid-cols-4 gap-2">
                       {[1,2,3,4].map(num => (
                         <div key={num} className="aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200 relative group cursor-pointer">
                            <img src={`https://images.unsplash.com/photo-1600000${num}00000?auto=format&fit=crop&q=80&w=150&h=200`} className="w-full h-full object-cover"/>
                            <div className="absolute top-1 right-1 bg-green-500 text-white p-0.5 rounded-full"><CheckCircle2 size={10}/></div>
                         </div>
                       ))}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="text-[13px] font-medium text-neutral-900 mb-2 flex items-center gap-1.5"><MessageSquare size={14}/> 配套发布文案展示</div>
                    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-[13px] text-neutral-700 leading-relaxed relative">
                      最近找到了一款超好用的防晒宝藏！[派对R]<br/><br/>
                      作为一个每天早起通勤的打工人，防晒真的是我的续命神器。这几天试用了品牌方寄来的这款，上脸感觉真的出乎意料的轻薄，一点都不假白！最重要的是化完妆也不会搓泥，真的爱了！<br/><br/>
                      #防晒推荐 #日常好物 #素人实测
                      <div className="absolute top-3 right-3 text-emerald-500 bg-emerald-100 px-2 py-0.5 text-[10px] rounded">合规探测通过</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-3 items-center">
                <span className="text-[12px] text-neutral-400 flex items-center gap-1"><Bot size={14}/> 此审核由系统自动完成，无需人工干预</span>
                <button onClick={() => setShowAuditModal(null)} className="px-6 py-2 bg-neutral-900 text-white rounded-xl text-[13px] font-medium hover:bg-neutral-800 shadow transition-colors flex items-center gap-2">
                  关闭查看
                </button>
              </div>
            </motion.div>
          </div>
        )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-10 left-1/2 -translate-x-1/2 bg-neutral-900 text-white px-6 py-3 rounded-full z-[9999] shadow-xl flex items-center gap-2"
          >
            <CheckCircle2 size={16} className="text-green-400" />
            <span className="text-[13px] font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Asset Library Modal */}
      <AnimatePresence>
        {showAssetLibrary && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                    <ImageIcon size={16} />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900 text-[15px]">品牌素材库</h3>
                    <p className="text-[11px] text-neutral-500">已自动为您推荐适合当前笔记的可用空闲素材</p>
                  </div>
                </div>
                <button onClick={() => setShowAssetLibrary(false)} className="p-2 hover:bg-neutral-100 rounded-xl transition-colors text-neutral-400">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 flex-1 overflow-y-auto bg-neutral-50">
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white p-2 rounded-xl border border-neutral-200 shadow-sm group cursor-pointer hover:border-primary-400 hover:shadow-md transition-all">
                      <div className="w-full aspect-[3/4] rounded-lg overflow-hidden relative mb-2">
                        <img src={`https://images.unsplash.com/photo-16000000000${i + 5}?auto=format&fit=crop&q=80&w=400&h=600`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-2 left-2 bg-green-500/90 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm shadow-sm flex items-center gap-1">
                          <CheckCircle2 size={10} /> 智能推荐
                        </div>
                      </div>
                      <button onClick={() => {
                        setToastMessage("图片更换成功，已使用新素材，原素材已恢复");
                        setTimeout(() => setToastMessage(""), 2000);
                        setShowAssetLibrary(false);
                      }} className="w-full py-2 bg-neutral-100 hover:bg-primary-50 hover:text-primary-600 text-neutral-700 text-[12px] font-medium rounded-lg transition-colors">
                        使用此素材
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

<div className="flex-1 flex relative overflow-hidden bg-white">
 <div className="flex flex-col w-full h-full">
 <div className="px-6 pt-4 border-b border-neutral-100 bg-neutral-50/50 flex flex-col gap-4 shrink-0">
 <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
 <div>
 <p className="text-[14px] text-neutral-900">
 笔记和素材
 </p>
 <p className="text-[11px] text-neutral-400 mt-0.5">
 在此管理和修改生成的完整笔记，以及跟踪关联图文素材的回传情况。点击文本框即可直接修改笔记，点击右侧助手即可启动 AI 辅助润色。
 </p>
 </div>
 
 </div>
 
 <div className="flex items-center gap-6 text-[13px] mt-2">
 <button 
 onClick={() => setActiveTab('notes')}
 className={`pb-3 border-b-2 transition-colors ${activeTab === 'notes' ? 'border-primary-500 text-primary-500' : 'border-transparent text-neutral-400 hover:text-neutral-600'}`}
 >
 笔记库
 </button>
 <button 
 onClick={() => setActiveTab('tasks')}
 className={`pb-3 border-b-2 transition-colors ${activeTab === 'tasks' ? 'border-primary-500 text-primary-500' : 'border-transparent text-neutral-400 hover:text-neutral-600'}`}
 >
 素材任务
 </button>
 </div>
 </div>

 <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-neutral-50/30">
 {activeTab === 'notes' && (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
 {drafts.map((draft, i) => (
 <div 
 key={draft.id} 
 onClick={() => setReviewingDraft(draft)}
 className="bg-white rounded-[16px] border-2 transition-all cursor-pointer relative flex flex-col h-[320px] border-neutral-200 hover:border-primary-500/50 hover:shadow-lg overflow-hidden group"
 >
 <div className="h-[150px] bg-neutral-100 relative shrink-0 overflow-hidden flex items-center justify-center">
 <img src={`https://images.unsplash.com/photo-${1600000000000 + i}?auto=format&fit=crop&q=80&w=400&h=300`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Cover" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
 <div className="absolute top-3 left-3 flex gap-1">
 {draft.status === 'scheduled' && (
 <span className="text-[10px] px-2 py-0.5 rounded tracking-widest bg-white/90 text-primary-600 shadow-sm flex items-center gap-1">
 <CalendarClock size={10} /> 待发布
 </span>
 )}
 {draft.status === 'dispatched' && (
 <span className="text-[10px] px-2 py-0.5 rounded tracking-widest bg-white/90 text-amber-600 shadow-sm flex items-center gap-1">
 <Camera size={10} /> 实拍中 (素材缺失)
 </span>
 )}
 {draft.status === 'published' && (
 <span onClick={(e) => { e.stopPropagation(); window.open('https://xiaohongshu.com', '_blank'); }} className="text-[10px] px-2 py-0.5 rounded tracking-widest bg-success-50 text-success-600 shadow-sm flex items-center gap-1 hover:bg-success-600 hover:text-white transition-colors">
 <CheckCircle2 size={10} /> @豆豆 - 已发布 (查看)
</span>
 )}
 {draft.status === 'review' && (
 <span className="text-[10px] px-2 py-0.5 rounded tracking-widest bg-white/90 text-neutral-600 shadow-sm flex items-center gap-1">
 待审核
 </span>
 )}
 </div>
 </div>
 <div className="p-4 flex-1 flex flex-col">
 <h4 className="text-[13px] font-semibold text-neutral-900 leading-snug line-clamp-2 mb-1.5">
 {draft.title}
 </h4>
 <p className="text-[11px] text-neutral-500 leading-relaxed line-clamp-3">
 {draft.content}
 </p>
 </div>
 <div className="px-4 py-3 border-t border-neutral-100 flex items-center flex-wrap gap-1.5 bg-neutral-50 shrink-0 min-h-[44px]">
 {hashtags.slice(0, 2).map(tag => (
 <span key={tag} className="text-[10px] text-neutral-500 bg-white border border-neutral-200 px-1.5 py-0.5 rounded">#{tag}</span>
 ))}
 </div>
 </div>
 ))}
 </div>
 )}

 {activeTab === 'tasks' && (
  <div className="space-y-4 max-w-5xl mx-auto">
    <div className="flex items-center justify-between mb-4">
      <div>
        <div className="text-[16px] font-medium text-neutral-900 flex items-center gap-2">
          {project.targetGroup === 'internal' ? '内部素材发包任务 (合并同类项)' : '外部KOC素人派单平台 (按单篇领取)'}
          <span className="px-2 py-0.5 bg-primary-50 text-primary-600 text-[11px] rounded-full">由笔记自动分类提炼</span>
        </div>
        <div className="text-[12px] text-neutral-500 mt-1">
          {project.targetGroup === 'internal' 
            ? '自动分析本周笔记规划，合并同类素材需求，直接通过企微指派给内部员工。'
            : '单篇笔记生成专属任务。素人扫码认领并回传素材，AI自动审核并即刻同步至小红书发布，全程无人化流转。'}
        </div>
      </div>
      {project.targetGroup === 'external' ? (
        <button onClick={() => setShowQrModal(project.id)} className="px-5 py-2.5 bg-primary-500 text-white rounded-[14px] text-[13px] font-medium flex items-center gap-2 shadow-lg hover:bg-primary-600 active:scale-95 transition-all tooltip" title="向所有素人库群发">
          <QrCode size={16} /> 生成专属任务池认领码
        </button>
      ) : null}
    </div>
    
    {(project.targetGroup === 'internal' ? INTERNAL_TASKS : EXTERNAL_TASKS).map(task => (
      <div key={task.id} className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col lg:flex-row lg:items-start gap-6 shadow-sm hover:shadow-md transition-shadow">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${task.status === 'AI审核通过待发布' ? 'bg-gradient-to-b from-emerald-50 to-emerald-100/50 text-emerald-500' : task.status === '待领取' ? 'bg-gradient-to-b from-neutral-50 to-neutral-100/50 text-neutral-500' : task.status === '执行中' ? 'bg-gradient-to-b from-blue-50 to-blue-100/50 text-blue-500' : 'bg-gradient-to-b from-amber-50 to-amber-100/50 text-amber-500'}`}>
          {task.status === 'AI审核通过待发布' ? <CheckSquare size={24}/> : task.status === '执行中' ? <Camera size={24} /> : <Target size={24} />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="text-[16px] font-semibold text-neutral-900">{task.name}</h4>
            {project.targetGroup === 'internal' ? (
              <button className="bg-neutral-100 transition-colors text-neutral-600 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium group tooltip" title="由多篇笔记的视觉需求合并而来">
                <Layers size={12} /> 来源于 {(task as any).mergedFrom} 篇笔记
              </button>
            ) : (
                <div className="text-[12px] bg-primary-50 border border-primary-100 text-primary-600 px-2 py-0.5 rounded-full font-medium flex items-center gap-1"><PenTool size={12}/> 绑定：{(task as any).noteTarget}</div>
            )}
            <span className={`text-[11px] px-2 py-0.5 rounded-full uppercase tracking-widest border ${task.status === 'AI审核通过待发布' ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : task.status === '待领取' ? 'border-neutral-200 bg-neutral-50 text-neutral-600' : task.status === '执行中' ? 'border-blue-200 bg-blue-50 text-blue-600' : 'border-amber-200 bg-amber-50 text-amber-600'}`}>
              {task.status}
            </span>
          </div>
          <div className="bg-neutral-50/80 rounded-xl p-3 mb-4 border border-neutral-100">
            <div className="flex items-start gap-2">
              <Bot size={14} className="text-primary-500 shrink-0 mt-0.5" />
              <p className="text-[13px] text-neutral-600 leading-relaxed font-medium">{task.require}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[13px]">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 rounded-lg text-neutral-600 border border-neutral-200">
              <ImageIcon size={14} /> 需回传 {task.count} 张素材
            </div>
            {task.status === 'AI审核通过待发布' ? (
              <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg tooltip" title="已列入发布排期序列">
                <CheckCircle2 size={14} /> AI判定合格，内容已直发
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-neutral-500 bg-neutral-50 px-3 py-1.5 rounded-lg">
                <CalendarClock size={14} /> 截止时间: 本周五 18:00
              </div>
            )}
          </div>
        </div>
        <div className="lg:border-l lg:border-neutral-100 lg:pl-8 flex flex-col items-end gap-5 shrink-0 w-full lg:w-[220px]">
          <div className="text-right w-full relative group cursor-pointer" onMouseEnter={() => setShowProgressHover(task.id)} onMouseLeave={() => setShowProgressHover(null)}>
            <div className="flex justify-between items-center lg:block bg-neutral-50 lg:bg-transparent p-3 lg:p-0 rounded-xl">
              <div className="text-[11px] text-neutral-400 font-medium mb-1 flex items-center gap-1 lg:justify-end">
                素材回传进度 <AlertCircle size={12} className="text-neutral-300 group-hover:text-primary-400 transition-colors"/>
              </div>
              <div className={`text-[28px] font-mono font-medium transition-colors leading-none ${task.current >= task.count ? 'text-emerald-500' : 'text-neutral-900'}`}>{task.current} <span className="text-neutral-400 text-[18px]">/ {task.count}</span></div>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 w-full">
            {task.status === 'AI审核通过待发布' ? (
              <button onClick={() => setShowAuditModal(task.id)} className="w-full py-2.5 bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 rounded-xl text-[12px] font-medium transition-colors whitespace-nowrap flex items-center justify-center gap-1.5">
                <CheckSquare size={14} /> 查看AI校验报告
              </button>
            ) : task.status === '执行中' ? (
              <button onClick={() => {
                 setToastMessage(`已向 ${task.assignee.split(' ')[0]} 发送催办提醒。`);
                 setTimeout(() => setToastMessage(""), 2000);
              }} className="w-full py-2.5 bg-neutral-900 text-white hover:bg-black rounded-xl text-[12px] font-medium transition-all shadow hover:shadow-md whitespace-nowrap flex items-center justify-center gap-1.5">
                <MessageSquare size={14} /> 催办执行进度
              </button>
            ) : project.targetGroup === 'internal' ? (
              <>
                <button onClick={() => setShowAssignModal(task.id)} className="w-full py-2.5 bg-neutral-900 text-white hover:bg-black rounded-xl text-[12px] font-medium transition-all shadow hover:shadow-md whitespace-nowrap flex items-center justify-center gap-1.5">
                  <Users size={14} /> 匹配内部分配
                </button>
              </>
            ) : (
                <button onClick={() => {
                   setToastMessage("系统已再次将该笔记任务推送至素人达人库");
                   setTimeout(() => setToastMessage(""), 2000);
                }} className="w-full py-2.5 border border-primary-200 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-xl text-[12px] font-medium transition-colors whitespace-nowrap flex items-center justify-center gap-1.5 tooltip" title="向素人大厅重新曝光">
                  <RefreshCw size={14}/> 推送至任务大厅
                </button>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
)}
</div>
 </div>
 </div>
 </div>
 
 </> );
  }

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
 <div className="w-[140px] h-[180px] rounded-2xl border border-dashed border-neutral-300 bg-white relative shrink-0 flex flex-col gap-2 items-center justify-center hover:bg-neutral-50 cursor-pointer transition-colors text-neutral-400 hover:text-neutral-600">
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

 {/* Status Config */} 
 <div className="w-full xl:w-[280px] bg-white border-l border-neutral-200 p-6 flex flex-col justify-end shrink-0 block">
 <button onClick={() => setReviewingDraft(null)} className="w-full py-4 bg-primary-500 text-white rounded-[14px] text-[15px] hover:bg-primary-600 transition-colors shadow-lg active:scale-95 flex justify-center items-center gap-2 mb-3">
 确认人工精修无误 <CheckCircle2 size={18} />
 </button>
 
</div>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 <div className="w-full h-full overflow-y-auto bg-white custom-scrollbar pb-24">
 <div className="max-w-6xl mx-auto space-y-6 p-6 lg:p-8">
 <div className="space-y-1">
 <h2 className="text-2xl font-semibold text-neutral-900 tracking-tight">项目与内容</h2>
 <p className="text-[13px] text-neutral-400 ">跟踪小红书运营项目的全链路进展、日历排期，并在项目中指派任务进行内容的批量成稿</p>
 </div>

 <div className="grid grid-cols-1 gap-4">
 {MOCK_PROJECTS.map(project => (
 <motion.div 
 key={project.id}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="p-5 flex flex-col xl:flex-row bg-white border border-neutral-100 rounded-[20px] hover:shadow-xl transition-all group overflow-hidden relative gap-6 items-center"
 >
 <div className="flex items-center gap-4 min-w-[240px] shrink-0">
 <div className="min-w-0">
 <h3 className="text-[16px] font-semibold text-neutral-900 mb-2 truncate">{project.name}</h3>
 <div className="flex items-center gap-1.5 text-[9px] tracking-widest uppercase mt-1">
 <span className={`px-2 py-1 rounded shadow-sm flex items-center gap-1 ${project.status === '任务进行中' ? 'text-primary-600 bg-primary-50 border border-primary-100' : 'text-neutral-500 bg-white border border-neutral-200'}`}><CheckCircle2 size={10} />图文生成</span>
 <ArrowRight size={10} className="text-neutral-300" />
 <span className={`px-2 py-1 rounded shadow-sm flex items-center gap-1 ${project.status === '任务进行中' ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : 'text-neutral-500 bg-white border border-neutral-200'}`}><Camera size={10} />素材回传分发</span>
 <ArrowRight size={10} className="text-neutral-300" />
 <span className={`px-2 py-1 rounded shadow-sm ${project.status === '已完成' ? 'text-success-600 bg-success-50 border border-success-100' : 'text-neutral-400 bg-neutral-50'}`}>自动发布归档</span>
 </div>
 </div>
 </div>

 <div className="flex-1 flex gap-6 md:gap-8 items-center xl:px-6 xl:border-x border-neutral-50 overflow-x-auto custom-scrollbar">
 <div className="flex flex-col gap-1.5 shrink-0">
 <span className="text-[10px] text-neutral-400 tracking-widest">排发任务总数</span>
 <span className="text-[16px] text-neutral-900">{project.targetCount}</span>
 </div>
 <div className="flex flex-col gap-1.5 shrink-0">
 <span className="text-[10px] text-neutral-400 tracking-widest">已提交素材</span>
 <span className="text-[16px] text-emerald-500">{project.recoveredMaterial}</span>
 </div>
 <div className="flex flex-col gap-1.5 shrink-0">
 <span className="text-[10px] text-neutral-400 tracking-widest">已成稿笔记</span>
 <span className="text-[16px] text-primary-500">{project.generatedNotes}</span>
 </div>
 <div className="flex flex-col gap-1.5 shrink-0">
 <span className="text-[10px] text-neutral-400 tracking-widest">已成功发布</span>
 <span className="text-[16px] text-success-500">{project.publishedNotes}</span>
 </div>
 </div>

 <div className="flex flex-col sm:flex-row justify-center gap-2 xl:pl-4 shrink-0 w-full xl:w-auto">
 <button 
 onClick={() => { setActiveProject(project.id); generateMocks(); }}
 className="w-full sm:w-auto px-5 py-2.5 bg-neutral-900 text-white rounded-[14px] text-[12px] transition-all flex items-center justify-center gap-2 hover:bg-primary-500 shadow-lg active:scale-95 whitespace-nowrap"
 >
 <PenTool size={14} /> 管理笔记
 </button>
 <button className="w-full sm:w-auto px-5 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-[14px] text-[12px] transition-all flex items-center justify-center gap-2 hover:bg-neutral-50 shadow-sm whitespace-nowrap">
 <Target size={14} /> 分发二维码
 </button>
 </div>
 </motion.div>
 ))}
 </div>

 <button 
 onClick={() => setIsCreatingProject(true)}
 className="w-full py-4 bg-white border border-dashed border-neutral-200 rounded-[20px] text-[13px] text-neutral-400 hover:border-primary-500 hover:text-primary-500 transition-all flex items-center justify-center gap-2"
 >
 <PlusCircle size={18} /> 启动新项目
 </button>

 
 

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
 <Target size={18} className="text-neutral-400" /> 1. 运营项目立项
 </h3>
 <div className="grid grid-cols-1 gap-5">
 <div className="space-y-2">
 <label className="text-[11px] text-neutral-400 uppercase">素材执行</label>
 <div className="grid grid-cols-2 gap-3">
   <div className="border-2 border-primary-500 bg-primary-50 rounded-xl p-3 flex items-start gap-3 cursor-pointer">
     <div className="w-5 h-5 rounded-full border-4 border-primary-500 bg-white shrink-0 mt-0.5"></div>
     <div>
       <div className="text-[13px] font-semibold text-neutral-900">内部员工</div>
       <div className="text-[11px] text-neutral-500 mt-1">自动合并相同拍照需求，通过企微分配给组织内员工</div>
     </div>
   </div>
   <div className="border border-neutral-200 bg-white hover:border-primary-200 rounded-xl p-3 flex items-start gap-3 cursor-pointer">
     <div className="w-5 h-5 rounded-full border border-neutral-300 bg-white shrink-0 mt-0.5 relative"><div className="absolute inset-1 rounded-full bg-transparent hover:bg-neutral-100"></div></div>
     <div>
       <div className="text-[13px] font-semibold text-neutral-900">外部KOC</div>
       <div className="text-[11px] text-neutral-500 mt-1">按单篇笔记拆解需求，扫码领取，素材自动进入审核发布流</div>
     </div>
   </div>
 </div>
 </div>
 <div className="space-y-2">
 <label className="text-[11px] text-neutral-400 uppercase">项目名称</label>
 <input type="text" placeholder="例如：2026秋季大促矩阵" className="w-full h-12 bg-white border border-neutral-200 rounded-xl px-4 text-[14px] outline-none focus:border-primary-500 transition-colors" />
 </div>
 <div className="space-y-2">
 <label className="text-[11px] text-neutral-400 uppercase">排期开始日期</label>
 <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full h-12 bg-white border border-neutral-200 rounded-xl px-4 text-[14px] outline-none focus:border-primary-500 transition-colors text-neutral-700 block" style={{ colorScheme: 'light' }} />
 </div>
 <div className="col-span-2 space-y-2 mt-2">
 <label className="text-[11px] text-neutral-400 uppercase">核心运营目标</label>
 <textarea 
 rows={2} 
 value={coreTarget}
 onChange={(e) => setCoreTarget(e.target.value)}
 placeholder="描述您的期望，例如：'想在下个月提升防晒品类的搜索占位，需要大批量真实素人测评'..." 
 className="w-full bg-white border border-neutral-200 rounded-2xl p-4 text-[14px] outline-none focus:border-primary-500 transition-colors resize-none"
 />
 </div>
 <div className="col-span-2 mt-1">
 <button 
 onClick={handleAnalyzeTarget}
 disabled={isAnalyzingTarget}
 className={`px-6 py-3.5 rounded-xl text-[13px] flex items-center gap-2 transition-all shadow-lg active:scale-95 border-0 ${isAnalyzingTarget ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed' : 'bg-neutral-900 text-white hover:bg-primary-500 group'}`}
 >
 <Sparkles size={16} className={isAnalyzingTarget ? "animate-spin text-neutral-500" : "text-primary-400 group-hover:text-white transition-colors"} /> 
 {isAnalyzingTarget ? '智能排期分析中...' : '智能排期助手分析目标'}
 </button>
 </div>
 </div>
 </div>

 <div className="space-y-6 pt-6 border-t border-neutral-200/50">
 <div className="flex flex-col gap-1">
 <div className="flex items-center justify-between">
 <h3 className="text-[14px] font-semibold text-neutral-900 uppercase tracking-widest flex items-center gap-2">
<Calendar size={18} className="text-neutral-400" /> 2. 规划执行排期与账号分配
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


 </div>
 </div>

 </>
 );
}

const TargetIcon = () => (
 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
 </svg>
);
