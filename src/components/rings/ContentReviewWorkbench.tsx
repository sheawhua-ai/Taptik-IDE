import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Check, AlertOctagon, User, Tag, Plus, Image as ImageIcon,
  ChevronRight, RefreshCw, History, AlignLeft, Info, FileText,
  ShieldAlert, Sparkles, CheckCircle2, CornerUpLeft, ArrowRightLeft, ListChecks, Search
} from 'lucide-react';

export function ContentReviewWorkbench({ onClose }: { onClose: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeNoteId, setActiveNoteId] = useState('n1');
  const [textSelection, setTextSelection] = useState<{text: string, start: number, end: number} | null>(null);
  const [activeRightTab, setActiveRightTab] = useState<'issues' | 'basis' | 'local_edit' | '' | 'history'>('issues');
  const [showBatchConfirm, setShowBatchConfirm] = useState(false);
  const [primaryTab, setPrimaryTab] = useState<'pending' | 'confirmed' | 'rejected'>('pending');
  const [pendingFilter, setPendingFilter] = useState<'all' | 'quick' | 'action'>('action');
  const [activeArea, setActiveArea] = useState<'title' | 'content' | 'tags' | 'materials' | null>(null);

  
  // Local edit states
  const [localEditInput, setLocalEditInput] = useState('');
  const [localEditResult, setLocalEditResult] = useState<{text: string, status: 'resolved' | 'unresolved', message: string} | null>(null);
  
  // Full edit states
  const [fullEditResult, setFullEditResult] = useState<string | null>(null);
  
  // Memory prompt
  const [showMemoryPrompt, setShowMemoryPrompt] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // 模拟笔记数据
  const [showReviewed, setShowReviewed] = useState(false);
  const [notes, setNotes] = useState([
    {
      id: 'n1',
      project: '幼犬换粮避坑搜索卡位',
      accountType: 'KOS员工号',
      accountName: 'A02避坑号',
      title: '幼犬换粮一定要慢！附换粮周期表',
      content: `今天给大家分享一下幼犬换粮的经验。很多新手家长刚接狗狗回家，就迫不及待地喂新粮，结果狗狗拉稀软便。其实换粮要遵循<span class="border-b-2 border-rose-400 text-rose-700 bg-rose-50 cursor-pointer px-1">七日换粮法</span>！第一天新粮比例10%，旧粮90%... 另外，如果肠胃敏感，<span class="border-b-2 border-amber-400 text-amber-700 bg-amber-50 cursor-pointer px-1">建议搭配益生菌</span>。`,
      rawContent: '今天给大家分享一下幼犬换粮的经验。很多新手家长刚接狗狗回家，就迫不及待地喂新粮，结果狗狗拉稀软便。其实换粮要遵循七日换粮法！第一天新粮比例10%，旧粮90%... 另外，如果肠胃敏感，建议搭配益生菌。',
      status: '建议调整',
      mainIssue: '事实待核实',
      tags: ['幼犬换粮', '新手养狗', '换粮软便'],
      fixedRole: '新手养犬经验分享',
      expressedAngle: '真实踩坑经历',
      target: '覆盖换粮常见误区',
      structure: '问题切入 -> 个人经历 -> 3个误区 -> 换粮建议',
      materialReq: '需要：幼犬喂食场景、换粮过渡期照片',
      materialStatus: '已提供：幼犬进食图',
      canBatchConfirm: false, isReviewed: false,
      history: [
        { time: '10:00', action: '系统生成初稿', user: 'AI' }
      ]
    },
    {
      id: 'n2',
      project: '幼犬换粮避坑搜索卡位',
      accountType: '品牌主账号',
      accountName: '官方小助手',
      title: '科学换粮，告别幼犬软便烦恼',
      content: '品牌主账号内容...',
      rawContent: '品牌主账号内容...',
      status: '可确认',
      mainIssue: '无明显问题',
      tags: ['科学喂养'],
      fixedRole: '宠物营养师',
      expressedAngle: '专业科普',
      target: '建立品牌专业形象',
      structure: '痛点引入 -> 科学原理 -> 解决方案',
      materialReq: '需要：产品高清图',
      materialStatus: '齐全',
      canBatchConfirm: true, isReviewed: false,
      history: [
        { time: '09:30', action: '系统生成初稿', user: 'AI' }
      ]
    },
    {
      id: 'n2',
      project: '幼犬换粮避坑搜索卡位',
      accountType: 'KOS员工号',
      accountName: '官方小助手',
      title: '科学换粮，告别幼犬软便烦恼',
      content: '品牌主账号内容...',
      rawContent: '品牌主账号内容...',
      status: '需逐篇处理',
      mainIssue: '无明显问题',
      tags: ['科学喂养'],
      fixedRole: '宠物营养师',
      expressedAngle: '专业科普',
      target: '建立品牌专业形象',
      structure: '痛点引入 -> 科学原理 -> 解决方案',
      materialReq: '需要：产品高清图',
      materialStatus: '不齐全',
      canBatchConfirm: false, isReviewed: false,
      history: [
        { time: '09:30', action: '系统生成初稿', user: 'AI' }
      ]
    }
  ]);

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

  const handleApprove = () => {
    setNotes(prev => prev.map(n => n.id === activeNoteId ? { ...n, isReviewed: true, status: '已确认' } : n));
    setToastMessage("内容已确认，已进入素材匹配");
    setTimeout(() => setToastMessage(null), 3000);
    const nextUnreviewed = notes.find(n => n.id !== activeNoteId && !n.isReviewed);
    if (nextUnreviewed) {
      setActiveNoteId(nextUnreviewed.id);
    }
  };

  const clearHighlight = () => {
    if (contentRef.current) {
      const currentNote = notes.find(n => n.id === activeNoteId) || notes[0];
      if (currentNote) {
        contentRef.current.innerHTML = currentNote.content;
      }
    }
  };

  const handleSelection = () => {
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0 && contentRef.current && contentRef.current.contains(selection.anchorNode)) {
        const text = selection.toString();
        
        document.execCommand('hiliteColor', false, '#fef08a');
        if (!document.queryCommandState('hiliteColor')) {
           document.execCommand('backColor', false, '#fef08a');
        }
        
        setTextSelection({
          text: text,
          start: 0,
          end: 0
        });
        setActiveRightTab('local_edit');
        setActiveArea('content');
      }
    }, 10);
  };
  
  const handleContentClick = () => {
    setActiveArea('content');
    const selection = window.getSelection();
    if (!selection || selection.toString().trim().length === 0) {
      clearHighlight();
      setTextSelection(null);
      setActiveRightTab('issues');
    }
  };
  
  const generateLocalEdit = () => {
    setLocalEditResult({
      text: '狗狗肚子容易咕噜叫',
      status: 'unresolved',
      message: '仍有事实核实问题：修改稿中虽调整了口吻，但“益生菌”相关表达依然缺乏资料支持。'
    });
  };

  const applyLocalEdit = () => {
    // 模拟应用修改
    setLocalEditResult(null);
    setTextSelection(null);
    setActiveRightTab('issues');
    setShowMemoryPrompt(true);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-neutral-100 flex flex-col h-screen overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white border-b border-neutral-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
              <FileText className="text-primary-600" size={20} />
              内容审核
            </h2>
          </div>
          
          <div className="h-4 w-px bg-neutral-200 mx-2"></div>
          
          <div className="flex items-center gap-2 text-[13px]">
            <div onClick={() => setPrimaryTab('pending')} className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border transition-colors ${primaryTab === 'pending' ? 'bg-neutral-900 border-neutral-900 text-white font-bold' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
              待审核 (12)
            </div>
            <div onClick={() => setPrimaryTab('confirmed')} className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border transition-colors ${primaryTab === 'confirmed' ? 'bg-neutral-900 border-neutral-900 text-white font-bold' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
              已确认 (6)
            </div>
            <div onClick={() => setPrimaryTab('rejected')} className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border transition-colors ${primaryTab === 'rejected' ? 'bg-neutral-900 border-neutral-900 text-white font-bold' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
              已退回 (1)
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-[12px] text-neutral-500 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-100 cursor-pointer hover:bg-neutral-100 transition-colors">
            <span className="font-bold text-neutral-700">6 篇内容已确认</span>，正在进入素材准备或发布安排。
          </div>
          <button className="text-neutral-500 hover:text-neutral-900 p-2 rounded-full hover:bg-neutral-100 transition-colors flex items-center justify-center">
            <RefreshCw size={18} />
          </button>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-900 p-1">
            <X size={20} />
          </button>
        </div>
      </div>
      
      {/* Main 3 Columns */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Column: Note List */}
        <div className="w-[300px] bg-white border-r border-neutral-200 flex flex-col shrink-0 overflow-hidden">
          <div className="p-4 border-b border-neutral-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-bold text-neutral-900">待审核列表</h3>
              <span className="text-[12px] text-neutral-500">按项目分组</span>
            </div>
            {primaryTab === 'pending' && (
              <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
                <button 
                  onClick={() => { setPendingFilter('quick'); setShowBatchConfirm(true); }}
                  className={`flex-1 py-1.5 text-[12px] font-medium rounded-md transition-colors ${pendingFilter === 'quick' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
                >
                  可快速确认 8
                </button>
                <button 
                  onClick={() => { setPendingFilter('action'); setShowBatchConfirm(false); }}
                  className={`flex-1 py-1.5 text-[12px] font-medium rounded-md transition-colors ${pendingFilter === 'action' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
                >
                  需逐篇处理 4
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            
            {/* Project Group */}
            <div>
              <div className="flex items-center justify-between text-[13px] font-bold text-neutral-900 mb-2 px-2 cursor-pointer hover:bg-neutral-50 rounded py-1">
                <div className="flex items-center gap-1">
                  <ChevronRight size={14} className="text-neutral-400 rotate-90" />
                  幼犬换粮避坑搜索卡位
                </div>
                <span className="text-neutral-400">{notes.filter(n => !n.isReviewed && (pendingFilter === 'quick' ? n.status === '可确认' : pendingFilter === 'action' ? n.status !== '可确认' : true)).length}</span>
              </div>
              
              <div className="pl-6 pr-2 space-y-3">
                {/* Account Type Group */}
                <div>
                   <div className="text-[11px] font-bold text-neutral-500 mb-2 mt-1">KOS员工号 ({notes.filter(n => !n.isReviewed && (pendingFilter === 'quick' ? n.status === '可确认' : pendingFilter === 'action' ? n.status !== '可确认' : true) && n.accountType === "KOS员工号").length})</div>
                   <div className="space-y-1.5">
                     {notes.filter(n => !n.isReviewed && (pendingFilter === 'quick' ? n.status === '可确认' : pendingFilter === 'action' ? n.status !== '可确认' : true) && n.accountType === 'KOS员工号').map(n => (
                       <div 
                         key={n.id}
                         onClick={() => setActiveNoteId(n.id)}
                         className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                           activeNoteId === n.id 
                             ? 'bg-primary-50 border-primary-200 shadow-sm' 
                             : 'bg-white border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50'
                         }`}
                       >
                         <div className="text-[13px] font-bold text-neutral-900 mb-1 truncate">{n.title}</div>
                         <div className="text-[11px] text-neutral-500 mb-2 flex items-center gap-1">
                           <User size={12}/> {n.accountName}
                         </div>
                         <div className="flex items-center gap-2">
                           <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${n.status === '可确认' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                             {n.status}
                           </span>
                           <span className="text-[11px] text-neutral-500 truncate">{n.mainIssue}</span>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
                
                {/* Brand Account Group */}
                <div>
                   <div className="text-[11px] font-bold text-neutral-500 mb-2 mt-3">品牌主账号 ({notes.filter(n => !n.isReviewed && (pendingFilter === 'quick' ? n.status === '可确认' : pendingFilter === 'action' ? n.status !== '可确认' : true) && n.accountType === "品牌主账号").length})</div>
                   <div className="space-y-1.5">
                     {notes.filter(n => !n.isReviewed && (pendingFilter === 'quick' ? n.status === '可确认' : pendingFilter === 'action' ? n.status !== '可确认' : true) && n.accountType === '品牌主账号').map(n => (
                       <div 
                         key={n.id}
                         onClick={() => setActiveNoteId(n.id)}
                         className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                           activeNoteId === n.id 
                             ? 'bg-primary-50 border-primary-200 shadow-sm' 
                             : 'bg-white border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50'
                         }`}
                       >
                         <div className="text-[13px] font-bold text-neutral-900 mb-1 truncate">{n.title}</div>
                         <div className="text-[11px] text-neutral-500 mb-2 flex items-center gap-1">
                           <User size={12}/> {n.accountName}
                         </div>
                         <div className="flex items-center gap-2">
                           <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${n.status === '可确认' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                             {n.status}
                           </span>
                           <span className="text-[11px] text-neutral-500 truncate">{n.mainIssue}</span>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>

            
            {/* Reviewed Notes Group */}
            {notes.filter(n => n.isReviewed).length > 0 && (
              <div>
                <div onClick={() => setShowReviewed(!showReviewed)} className="flex items-center justify-between text-[13px] font-bold text-neutral-500 mb-2 px-2 cursor-pointer hover:bg-neutral-50 rounded py-1 border-t border-neutral-100 mt-4 pt-4">
                  <div className="flex items-center gap-1">
                    <ChevronRight size={14} className={`text-neutral-400 transition-transform ${showReviewed ? 'rotate-90' : ''}`} />
                    已审核 (待发布)
                  </div>
                  <span className="text-neutral-400">{notes.filter(n => n.isReviewed).length}</span>
                </div>
                {showReviewed && (
                  <div className="pl-6 pr-2 space-y-1.5">
                     {notes.filter(n => n.isReviewed).map(n => (
                       <div 
                         key={n.id}
                         onClick={() => setActiveNoteId(n.id)}
                         className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                           activeNoteId === n.id 
                             ? 'bg-primary-50 border-primary-200 shadow-sm' 
                             : 'bg-white border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50'
                         }`}
                       >
                         <div className="text-[13px] font-bold text-neutral-900 mb-1 truncate">{n.title}</div>
                         <div className="text-[11px] text-neutral-500 flex items-center gap-1">
                           <User size={12}/> {n.accountName}
                         </div>
                       </div>
                     ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Another Project Group Placeholder */}
            <div>
              <div className="flex items-center justify-between text-[13px] font-bold text-neutral-900 mb-2 px-2 cursor-pointer hover:bg-neutral-50 rounded py-1">
                <div className="flex items-center gap-1">
                  <ChevronRight size={14} className="text-neutral-400" />
                  日常种草A组
                </div>
                <span className="text-neutral-400">4</span>
              </div>
            </div>

          </div>
        </div>

        {/* Middle Column: Editor */}
        <div className="flex-1 bg-neutral-50 flex flex-col min-w-0 relative">
          <div className="flex-1 overflow-y-auto p-8 relative">
            
            {/* 记忆沉淀提示 */}
            <AnimatePresence>
              {showMemoryPrompt && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-4 left-1/2 -translate-x-1/2 bg-neutral-900 text-white rounded-xl shadow-xl p-4 w-[480px] z-20 flex flex-col gap-3"
                >
                  <div className="flex items-start gap-3">
                    <Sparkles size={16} className="text-primary-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[13px] font-bold mb-1">发现重复的修改模式</div>
                      <div className="text-[12px] text-neutral-300 leading-relaxed">
                        你已在 3 篇笔记中将“肠胃敏感”等医疗化词汇修改为口语化表达。是否作为后续写作规则？
                      </div>
                    </div>
                    <button onClick={() => setShowMemoryPrompt(false)} className="text-neutral-400 hover:text-white shrink-0">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setShowMemoryPrompt(false)} className="px-3 py-1.5 text-[12px] text-neutral-300 hover:text-white">仅本项目使用</button>
                    <button className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-[12px] font-medium transition-colors">记为该商家的内容偏好</button>
                    <button className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 rounded text-[12px] font-medium transition-colors">整理为我的运营方法</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  
                  <span className="text-[13px] text-neutral-500 flex items-center gap-1">
                    <User size={14} /> {activeNote.accountName} · {activeNote.accountType}
                  </span>
                </div>
                <div className="text-[12px] text-neutral-400 flex items-center gap-2">
                   <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400"></span> 禁用表达</span>
                   <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> 事实待核实</span>
                </div>
              </div>
              
              <div className="bg-white border border-neutral-200 rounded-xl p-8 shadow-sm">
                {fullEditResult ? (
                  // Full Edit Comparison
                  <div className="space-y-6">
                    <div className="flex items-center justify-between bg-primary-50 p-3 rounded-lg border border-primary-100">
                       <span className="text-[13px] font-bold text-primary-800">正在预览全文修改稿</span>
                       <div className="flex gap-2">
                         <button onClick={() => setFullEditResult(null)} className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-600 rounded text-[12px] font-bold hover:bg-neutral-50">放弃</button>
                         <button onClick={() => { setFullEditResult(null); setActiveRightTab('issues'); }} className="px-3 py-1.5 bg-primary-600 text-white rounded text-[12px] font-bold hover:bg-primary-700">采用全文修改</button>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <div>
                         <div className="text-[12px] font-bold text-neutral-500 mb-3">原稿</div>
                         <div className="text-[16px] font-bold text-neutral-900 mb-4 opacity-50">{activeNote.title}</div>
                         <div className="text-[14px] leading-relaxed text-neutral-800 opacity-50">{activeNote.rawContent}</div>
                       </div>
                       <div>
                         <div className="text-[12px] font-bold text-primary-600 mb-3">修改稿 (更活泼、无广告感)</div>
                         <div className="text-[16px] font-bold text-neutral-900 mb-4 bg-primary-50 px-1 rounded">{activeNote.title}</div>
                         <div className="text-[14px] leading-relaxed text-neutral-800">{fullEditResult}</div>
                       </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <input 
                      type="text" 
                      defaultValue={activeNote.title}
                      onFocus={() => { setActiveArea('title'); setActiveRightTab('issues'); }}
                      onBlur={() => setActiveArea(null)}
                      className={`w-full text-[20px] font-bold text-neutral-900 mb-6 focus:outline-none placeholder-neutral-300 px-2 -mx-2 rounded transition-colors ${activeArea === 'title' ? 'bg-primary-50/50' : 'hover:bg-neutral-50'}`}
                      placeholder="输入标题..."
                    />
                    
                    <div 
                      className={`text-[15px] leading-relaxed text-neutral-800 min-h-[300px] focus:outline-none relative px-2 -mx-2 rounded transition-colors ${activeArea === 'content' ? 'bg-primary-50/50' : 'hover:bg-neutral-50'}`}
                      onMouseUp={handleSelection}
                      onKeyUp={handleSelection}
                      onClick={handleContentClick}
                      ref={contentRef}
                      
                      contentEditable
                      suppressContentEditableWarning
                    />
                    
                    <div className="mt-8 pt-6 border-t border-neutral-100 space-y-4">
                      <div 
                        className={`p-2 -mx-2 rounded transition-colors cursor-pointer ${activeArea === 'tags' ? 'bg-primary-50/50 ring-1 ring-primary-100' : 'hover:bg-neutral-50'}`}
                        onClick={() => { setActiveArea('tags'); setActiveRightTab('issues'); }}
                      >
                        <div className="text-[13px] font-bold text-neutral-900 flex items-center gap-1.5 mb-2">
                          <Tag size={14} /> 话题标签
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {activeNote.tags.map(t => (
                            <span key={t} className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-[12px]">#{t}</span>
                          ))}
                          <button className="px-2 py-1 bg-neutral-50 border border-neutral-200 text-neutral-400 rounded text-[12px] hover:text-neutral-600 flex items-center gap-1"><Plus size={12}/> 添加</button>
                        </div>
                      </div>
                      <div 
                        className={`p-2 -mx-2 rounded transition-colors cursor-pointer ${activeArea === 'materials' ? 'bg-primary-50/50 ring-1 ring-primary-100' : 'hover:bg-neutral-50'}`}
                        onClick={() => { setActiveArea('materials'); setActiveRightTab('issues'); }}
                      >
                        <div className="text-[13px] font-bold text-neutral-900 flex items-center gap-1.5 mb-2">
                          <AlertOctagon size={14} /> 配图要求
                        </div>
                        <textarea 
                          className="w-full text-[13px] text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-100 focus:outline-none focus:border-primary-300 resize-none min-h-[60px]"
                          defaultValue={activeNote.materialReq.replace('需要：', '')}
                          placeholder="输入配图要求..."
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Bottom Action Bar */}
          <div className="bg-white border-t border-neutral-200 p-4 shrink-0 flex items-center justify-between z-10 relative">
             <div className="flex items-center gap-3">
             </div>
             
             <div className="text-[13px] text-neutral-500 flex items-center gap-1.5 font-medium">
               第 1/12 篇 ｜ 草稿已保存 ｜ <span className="text-amber-600 font-bold">当前还有1项待核实</span>
             </div>
             
             <div className="flex items-center gap-3">
               <button className="px-4 py-2.5 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-bold rounded-lg hover:bg-neutral-50 transition-colors shadow-sm">
                 退回重写
               </button>
               <button className="px-4 py-2.5 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-bold rounded-lg hover:bg-neutral-50 transition-colors shadow-sm">
                 保存修改
               </button>
               <button onClick={handleApprove} className="px-6 py-2.5 bg-neutral-900 text-white text-[13px] font-bold rounded-lg hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2">
                 确认并查看下一篇 <ChevronRight size={16} />
               </button>
             </div>
          </div>

          
        </div>

        {/* Right Column: Dynamic Panel */}
        <div className="w-[360px] bg-white border-l border-neutral-200 flex flex-col shrink-0">
          
          {/* Top Info Bar */}
          <div className="bg-neutral-900 text-white px-4 py-2.5 text-[11px] font-medium truncate flex items-center gap-2">
            <User size={12} className="text-neutral-400 shrink-0"/>
            <span className="truncate">{activeNote.accountName}｜{activeNote.fixedRole}｜{activeNote.expressedAngle}</span>
          </div>

          {/* Tabs */}
          <div className="flex items-center px-2 pt-2 border-b border-neutral-100 bg-neutral-50 shrink-0">
            {[
              { id: 'issues', label: '审核要点', icon: ListChecks, Search },
              { id: 'basis', label: '写作依据', icon: AlignLeft },
              { id: 'local_edit', label: '局部修改', icon: ArrowRightLeft },
              { id: 'history', label: '修改记录', icon: History }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveRightTab(tab.id as any)}
                className={`flex-1 flex flex-col items-center gap-1 pb-2 pt-2 text-[12px] font-bold border-b-2 transition-colors ${
                  activeRightTab === tab.id 
                    ? 'border-neutral-900 text-neutral-900' 
                    : 'border-transparent text-neutral-400 hover:text-neutral-600'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-5 relative bg-white">
            
            {activeRightTab === 'issues' && (
              <div className="space-y-6">
                {activeArea === 'title' ? (
                  <div>
                    <h4 className="text-[13px] font-bold text-neutral-900 mb-3 flex items-center gap-1.5"><Sparkles size={14} className="text-primary-500" /> AI 标题建议</h4>
                    <div className="space-y-2">
                      <div className="p-3 border border-neutral-200 hover:border-primary-400 bg-neutral-50 hover:bg-primary-50 rounded-lg cursor-pointer transition-colors text-[13px] text-neutral-800">
                        换粮软便必看！新手养狗不踩坑指南
                      </div>
                      <div className="p-3 border border-neutral-200 hover:border-primary-400 bg-neutral-50 hover:bg-primary-50 rounded-lg cursor-pointer transition-colors text-[13px] text-neutral-800">
                        干货满满，带你了解科学“七日换粮法”
                      </div>
                      <div className="p-3 border border-neutral-200 hover:border-primary-400 bg-neutral-50 hover:bg-primary-50 rounded-lg cursor-pointer transition-colors text-[13px] text-neutral-800">
                        拒绝软便！这样换粮，幼犬肠胃更健康
                      </div>
                    </div>
                  </div>
                ) : activeArea === 'tags' ? (
                  <div>
                    <h4 className="text-[13px] font-bold text-neutral-900 mb-3 flex items-center gap-1.5"><Sparkles size={14} className="text-primary-500" /> AI 话题建议</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 border border-primary-200 bg-primary-50 text-primary-700 rounded text-[12px] cursor-pointer hover:bg-primary-100">+ #科学喂养</span>
                      <span className="px-2 py-1 border border-primary-200 bg-primary-50 text-primary-700 rounded text-[12px] cursor-pointer hover:bg-primary-100">+ #幼犬肠胃</span>
                      <span className="px-2 py-1 border border-primary-200 bg-primary-50 text-primary-700 rounded text-[12px] cursor-pointer hover:bg-primary-100">+ #狗狗软便</span>
                    </div>
                    <div className="mt-4 text-[12px] text-neutral-500">
                      点击添加建议的话题，或在左侧手动输入。
                    </div>
                  </div>
                ) : activeArea === 'materials' ? (
                  <div>
                    <h4 className="text-[13px] font-bold text-neutral-900 mb-3 flex items-center gap-1.5"><Sparkles size={14} className="text-primary-500" /> 配图素材建议</h4>
                    
                    <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-xl mb-4">
                      <div className="text-[13px] font-bold text-neutral-800 mb-2">匹配本地可用素材</div>
                      <div className="flex gap-2">
                         <div className="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary-500">
                           <ImageIcon size={20} className="text-neutral-400" />
                         </div>
                         <div className="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary-500">
                           <ImageIcon size={20} className="text-neutral-400" />
                         </div>
                      </div>
                    </div>

                    <button className="w-full py-2.5 bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl text-[13px] font-bold transition-colors mb-2">
                      保存素材需求并进入拍摄安排
                    </button>
                    <button className="w-full py-2 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 rounded-xl text-[12px] font-bold transition-colors">
                      转交素材匹配岗
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-[13px] font-bold text-neutral-900">自动检查结果</h4>
                      <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-bold">1项待核实</span>
                    </div>
                    
                    <div className="space-y-3">
                      {/* Fact Check Issue */}
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                        <div className="flex items-start gap-2">
                          <AlertOctagon size={14} className="text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[13px] font-bold text-amber-900 mb-1">事实依据不足</div>
                            <div className="text-[12px] text-amber-800 leading-relaxed mb-2">
                              文中“添加了专利级益生菌”缺乏具体资料支持，建议核实。
                            </div>
                            <button onClick={() => setActiveRightTab('local_edit')} className="text-[12px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1">
                              <ArrowRightLeft size={12} /> 去修改
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Banned Word Issue */}
                      <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
                        <div className="flex items-start gap-2">
                          <ShieldAlert size={14} className="text-rose-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[13px] font-bold text-rose-900 mb-1">潜在违规风险</div>
                            <div className="text-[12px] text-rose-800 leading-relaxed">
                              “七日换粮法”属于医疗化/绝对化用语风险，在当前平台限流概率高。
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Similarity Issue */}
                      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3">
                        <div className="flex items-start gap-2">
                          <Search size={14} className="text-neutral-500 shrink-0 mt-0.5" />
                          <div className="w-full">
                            <div className="text-[13px] font-bold text-neutral-900 mb-1 flex items-center justify-between">
                              同质化检查
                              <span className="text-[11px] text-neutral-500 font-normal">有风险</span>
                            </div>
                            <div className="text-[12px] text-neutral-600 leading-relaxed mb-2">
                              与本项目另外2篇内容角度接近。
                            </div>
                            <button className="text-[12px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                              查看相似笔记
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-neutral-100">
                  <button onClick={() => setActiveRightTab('')} className="w-full py-2.5 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 rounded-xl text-[13px] font-bold transition-colors">
                    调整全文
                  </button>
                </div>
              </div>
            )}

            {activeRightTab === 'basis' && (
              <div className="space-y-5">
                {/* 账号与表达身份 */}
                <div>
                  <div className="text-[12px] font-bold text-neutral-500 mb-2">账号与角色</div>
                  <div className="space-y-1.5 text-[13px]">
                    <div className="flex"><span className="text-neutral-500 w-[65px]">类型：</span><span className="text-neutral-800 font-medium">{activeNote.accountType}</span></div>
                    <div className="flex"><span className="text-neutral-500 w-[65px]">账号：</span><span className="text-neutral-800 font-medium">{activeNote.accountName}</span></div>
                    <div className="flex items-start">
                      <span className="text-neutral-500 w-[65px] shrink-0">固定角色：</span>
                      <span className="text-neutral-800 font-medium">{activeNote.fixedRole}</span>
                    </div>
                  </div>
                </div>
                
                {/* 内容目标 */}
                <div>
                  <div className="text-[12px] font-bold text-neutral-500 mb-1.5">内容目标</div>
                  <div className="text-[13px] text-neutral-800 leading-relaxed">
                    项目目标：搜索卡位<br/>
                    目标词：幼犬换粮、换粮软便<br/>
                    <span className="font-bold">本篇任务：{activeNote.target}</span>
                  </div>
                </div>
                
                {/* 内容角度 */}
                <div>
                  <div className="text-[12px] font-bold text-neutral-500 mb-1.5">本篇角度</div>
                  <div className="text-[13px] text-neutral-800 leading-relaxed">
                    角度：<span className="font-bold">{activeNote.expressedAngle}</span><br/>
                    <span className="text-neutral-500">区别：</span>强调“换粮速度”，不讲产品测评
                  </div>
                </div>

                {/* 内容结构 */}
                <div>
                  <div className="text-[12px] font-bold text-neutral-500 mb-1.5">内容结构与打法</div>
                  <div className="text-[13px] text-neutral-800 leading-relaxed bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                    <div className="font-medium mb-1">{activeNote.structure}</div>
                    <div className="text-neutral-500 text-[12px] cursor-pointer hover:text-primary-600 hover:underline">参考打法：搜索型避坑笔记</div>
                  </div>
                </div>

                {/* 资料依据 */}
                <div>
                  <div className="text-[12px] font-bold text-neutral-500 mb-1.5">资料依据</div>
                  <ul className="text-[13px] text-neutral-800 space-y-1 list-disc pl-4 marker:text-neutral-300">
                    <li>商家产品资料 (换粮建议)</li>
                    <li>已确认商家记忆 (幼犬敏感期)</li>
                    <li>项目策略</li>
                  </ul>
                </div>
                
                {/* 素材可实现性 */}
                <div>
                  <div className="text-[12px] font-bold text-neutral-500 mb-1.5">素材可实现性</div>
                  <div className="text-[13px] text-neutral-800">
                    需要：幼犬喂食场景、产品包装、换粮前后对比<br/>
                    <span className="text-amber-600 font-medium">当前：本地素材覆盖2项，缺喂食场景</span>
                  </div>
                </div>
              </div>
            )}

            {activeRightTab === 'local_edit' && (
              <div className="h-full flex flex-col">
                {!textSelection ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-neutral-400">
                    <ArrowRightLeft size={32} className="mb-3 opacity-50" />
                    <p className="text-[13px]">请在左侧正文中划选文字进行局部修改</p>
                  </div>
                ) : (
                  <div className="space-y-5 flex-1 flex flex-col">
                    <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 text-[13px] text-neutral-600 leading-relaxed italic relative">
                      <div className="absolute -left-2 top-3 w-1 h-8 bg-primary-400 rounded-full"></div>
                      "{textSelection.text}"
                    </div>

                    {!localEditResult ? (
                      <>
                        <div>
                          <div className="text-[12px] font-bold text-neutral-900 mb-2">常用要求</div>
                          <div className="flex flex-wrap gap-2">
                            {['去掉广告感', '更口语但不过度', '符合账号角色', '缩短这一段', '弱化医疗化表达'].map(tag => (
                              <button 
                                key={tag}
                                onClick={() => setLocalEditInput(tag)}
                                className="px-3 py-1.5 bg-white border border-neutral-200 hover:border-primary-400 hover:bg-primary-50 text-neutral-600 rounded-lg text-[12px] transition-colors"
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col">
                          <div className="text-[12px] font-bold text-neutral-900 mb-2">自定义修改</div>
                          <textarea 
                            value={localEditInput}
                            onChange={(e) => setLocalEditInput(e.target.value)}
                            placeholder="说明你希望怎么调整..."
                            className="flex-1 border border-neutral-200 rounded-xl p-3 text-[13px] focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none bg-white"
                          />
                          <button onClick={generateLocalEdit} className="w-full mt-3 bg-neutral-900 text-white py-2.5 rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-sm flex items-center justify-center gap-2">
                            <Sparkles size={14} /> 生成修改稿
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex flex-col pt-4 border-t border-neutral-100">
                        <div className="text-[12px] font-bold text-neutral-900 mb-2 flex items-center justify-between">
                          修改结果
                          <span className="text-[11px] font-normal text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">再次核实未通过</span>
                        </div>
                        <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm mb-4">
                          <div className="text-[13px] text-neutral-800 leading-relaxed mb-4 font-medium">
                            {localEditResult.text}
                          </div>
                          <div className="text-[12px] text-amber-700 bg-amber-50 p-2 rounded flex items-start gap-1.5">
                            <AlertOctagon size={14} className="shrink-0 mt-0.5" />
                            <span>{localEditResult.message}</span>
                          </div>
                        </div>
                        
                        <div className="mt-auto space-y-2">
                          <button 
                            className="w-full bg-white border border-rose-200 text-rose-600 py-2.5 rounded-xl text-[12px] font-bold hover:bg-rose-50 transition-colors"
                            onClick={() => { setLocalEditResult(null); setTextSelection(null); clearHighlight(); setActiveRightTab('issues'); }}
                          >
                            忽略风险，强行替换
                          </button>
                          <div className="flex gap-2">
                            <button onClick={() => setLocalEditResult(null)} className="flex-1 bg-neutral-900 text-white py-2.5 rounded-xl text-[12px] font-bold hover:bg-neutral-800 transition-colors">
                              再改一版
                            </button>
                            <button onClick={() => { setLocalEditResult(null); setTextSelection(null); clearHighlight(); setActiveRightTab('issues'); }} className="flex-1 bg-white border border-neutral-200 text-neutral-700 py-2.5 rounded-xl text-[12px] font-bold hover:bg-neutral-50 transition-colors">
                              放弃修改
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeRightTab === '' && (
              <div className="h-full flex flex-col">
                <div className="flex-1 flex flex-col space-y-6">
                  <div>
                    <div className="text-[12px] font-bold text-neutral-900 mb-3">常用要求</div>
                    <div className="flex flex-wrap gap-2">
                      {['统一账号口吻', '减少硬广表达', '加强搜索词出现', '缩短篇幅', '调整内容结构'].map(tag => (
                        <button 
                          key={tag}
                          className="px-3 py-1.5 bg-white border border-neutral-200 hover:border-primary-400 hover:bg-primary-50 text-neutral-600 rounded-lg text-[12px] transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="text-[12px] font-bold text-neutral-900 mb-2">自定义全文修改</div>
                    <textarea 
                      placeholder="说明你希望怎么调整全文..."
                      className="flex-1 border border-neutral-200 rounded-xl p-3 text-[13px] focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none bg-neutral-50"
                    />
                    <button 
                      onClick={() => setFullEditResult("今天给大家分享一下幼犬换粮的经验。刚接狗狗回家，很多家长急着喂新粮，容易导致拉稀。建议大家换粮慢一点，慢慢过渡。狗狗肚子容易咕噜叫的话，平时注意保暖。")}
                      className="w-full mt-3 bg-neutral-900 text-white py-2.5 rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={14} /> 生成预览并对比
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeRightTab === 'history' && (
              <div className="space-y-4">
                <div className="text-[13px] font-bold text-neutral-900 mb-4">版本记录</div>
                <div className="relative pl-4 border-l-2 border-neutral-100 space-y-6">
                  <div className="relative">
                    <div className="absolute w-3 h-3 bg-primary-500 rounded-full -left-[23px] top-1 border-4 border-white"></div>
                    <div className="text-[12px] font-bold text-neutral-900 mb-1">当前编辑中</div>
                    <div className="text-[11px] text-neutral-400">未保存</div>
                  </div>
                  <div className="relative">
                    <div className="absolute w-3 h-3 bg-neutral-300 rounded-full -left-[23px] top-1 border-4 border-white"></div>
                    <div className="text-[12px] font-bold text-neutral-700 mb-1">局部修改: 事实核实调整</div>
                    <div className="text-[11px] text-neutral-400 mb-2">10:30 · 操盘手</div>
                    <button className="text-[11px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                      <CornerUpLeft size={12} /> 恢复此版本
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute w-3 h-3 bg-neutral-300 rounded-full -left-[23px] top-1 border-4 border-white"></div>
                    <div className="text-[12px] font-bold text-neutral-700 mb-1">系统生成初稿</div>
                    <div className="text-[11px] text-neutral-400">10:00 · AI </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      
      {/* 批量确认弹窗 */}
      <AnimatePresence>
        {showBatchConfirm && (
          <div className="fixed inset-0 z-[200] bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-[900px] max-h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
                <h3 className="text-[16px] font-bold text-neutral-900">批量确认 8 篇内容</h3>
                <button onClick={() => setShowBatchConfirm(false)} className="text-neutral-400 hover:text-neutral-700">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <div className="bg-neutral-50 border border-neutral-200 text-neutral-600 text-[13px] p-4 rounded-xl mb-6 leading-relaxed">
                  以下笔记系统判定为“可确认”。如果有事实待核实或账号角色未补充的笔记，将被自动拦截。
                  <br/><span className="text-neutral-900 font-bold">批量确认代表内容审核完成，笔记将自动流转进入下一环节（如素材匹配或发布排期）。</span>
                </div>
                
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 text-[12px] text-neutral-500">
                      <th className="py-3 font-medium w-10 text-center"><input type="checkbox" defaultChecked className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"/></th>
                      <th className="py-3 font-medium w-[200px]">笔记标题</th>
                      <th className="py-3 font-medium">账号与角色</th>
                      <th className="py-3 font-medium">审核项检查</th>
                      <th className="py-3 font-medium text-right">下一步</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-neutral-100 text-[13px]">
                      <td className="py-4 text-center">
                        <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"/>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="font-bold text-neutral-900 mb-1 truncate">科学换粮，告别幼犬软便烦恼</div>
                        <div className="text-[11px] text-neutral-500 truncate">幼犬换粮避坑搜索卡位</div>
                      </td>
                      <td className="py-4">
                        <div className="text-neutral-800">官方小助手</div>
                        <div className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5"><Check size={10} className="text-emerald-500"/>角色已匹配</div>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col gap-1 text-[11px]">
                          <span className="text-emerald-600 flex items-center gap-1"><Check size={12}/> 事实有据</span>
                          <span className="text-emerald-600 flex items-center gap-1"><Check size={12}/> 无风险词</span>
                          <span className="text-emerald-600 flex items-center gap-1"><Check size={12}/> 角度独立</span>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-[11px] font-medium">进入发布排期</span>
                      </td>
                    </tr>
                    <tr className="border-b border-neutral-100 text-[13px]">
                      <td className="py-4 text-center">
                        <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"/>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="font-bold text-neutral-900 mb-1 truncate">软便克星？实测这几款...</div>
                        <div className="text-[11px] text-neutral-500 truncate">日常种草A组</div>
                      </td>
                      <td className="py-4">
                        <div className="text-neutral-800">小王探店</div>
                        <div className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5"><Check size={10} className="text-emerald-500"/>角色已匹配</div>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col gap-1 text-[11px]">
                          <span className="text-emerald-600 flex items-center gap-1"><Check size={12}/> 事实有据</span>
                          <span className="text-emerald-600 flex items-center gap-1"><Check size={12}/> 无风险词</span>
                          <span className="text-emerald-600 flex items-center gap-1"><Check size={12}/> 角度独立</span>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[11px] font-medium">进入素材匹配</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex justify-between items-center shrink-0">
                <span className="text-[13px] text-neutral-500">已选 8 篇</span>
                <div className="flex gap-3">
                  <button onClick={() => setShowBatchConfirm(false)} className="px-6 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors">
                    转为逐篇审核
                  </button>
                  <button onClick={() => { setShowBatchConfirm(false); setToastMessage("内容已确认，已进入素材匹配"); setTimeout(() => setToastMessage(null), 3000); }} className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-sm">
                    确认所选内容并进入下一环节
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 50, scale: 0.95 }} 
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] bg-neutral-900 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-3"
          >
            <Check size={18} className="text-emerald-400" />
            <span className="text-[14px] font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
