import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useProjectStore } from '../../context/ProjectContext';
import { 
  X, Check, AlertOctagon, User, Tag, Plus, Image as ImageIcon, 
  ChevronRight, RefreshCw, History, AlignLeft, FileText, 
  Sparkles, ArrowRightLeft, ListChecks, MoreHorizontal, Trash2, ArrowUp, Zap
} from 'lucide-react';

export function ContentReviewWorkbench({ onClose }: { onClose: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeNoteId, setActiveNoteId] = useState('n1');
  const [textSelection, setTextSelection] = useState<{text: string, start: number, end: number} | null>(null);
  
  const [activeArea, setActiveArea] = useState<'title' | 'content' | 'tags' | 'images' | null>(null);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  
  const [listGroupMode, setListGroupMode] = useState<'project' | 'account'>('project');
  
  const [localEditInput, setLocalEditInput] = useState('');
  const [localEditResult, setLocalEditResult] = useState<{text: string, status: 'resolved' | 'unresolved', message: string} | null>(null);
  const [fullEditResult, setFullEditResult] = useState<string | null>(null);
  
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showReviewed, setShowReviewed] = useState(false);

  const { unifiedState } = useProjectStore();
  
  const [notes, setNotes] = useState(
    unifiedState.noteSlots.map(ns => {
      const draft = unifiedState.contentDrafts.find(d => d.noteSlotId === ns.id);
      return {
        id: ns.id,
        project: unifiedState.projects.find(p => p.id === ns.projectId)?.name || '',
        accountType: ns.accountType,
        accountName: ns.accountName,
        title: draft?.title || '未命名',
        content: draft?.body || '',
        rawContent: draft?.body || '',
        status: draft?.status === '已确认' ? '已完成' : '需处理',
        mainIssue: draft?.status === '已确认' ? '无' : '事实待核实',
        tags: draft?.tags || [],
        images: [
          { id: `img1_${ns.id}`, url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200' },
          { id: `img2_${ns.id}`, url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=200' },
          { id: `img3_${ns.id}`, url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=200' }
        ],
        fixedRole: ns.contentDirection,
        expressedAngle: ns.contentDirection,
        isReviewed: draft?.status === '已确认'
      };
    })
  );

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

  useEffect(() => {
    if (contentRef.current && activeNote) {
      contentRef.current.innerHTML = activeNote.content;
    }
  }, [activeNoteId]);

  const handleApprove = () => {
    setNotes(prev => prev.map(n => n.id === activeNoteId ? { ...n, isReviewed: true, status: '已完成' } : n));
    setToastMessage("已确认并保存");
    setTimeout(() => setToastMessage(null), 3000);
    const nextUnreviewed = notes.find(n => n.id !== activeNoteId && !n.isReviewed);
    if (nextUnreviewed) {
      setActiveNoteId(nextUnreviewed.id);
    }
  };
  
  const handleReject = () => {
    setToastMessage("已退回重写");
    setTimeout(() => setToastMessage(null), 3000);
  };
  
  const handleSave = () => {
    setToastMessage("已保存草稿");
    setTimeout(() => setToastMessage(null), 3000);
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
        
        setTextSelection({ text: text, start: 0, end: 0 });
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
    }
  };

  const moveImageToFirst = (imageId: string) => {
    setNotes(prev => prev.map(n => {
      if (n.id !== activeNoteId) return n;
      const idx = n.images.findIndex(img => img.id === imageId);
      if (idx <= 0) return n;
      const newImages = [...n.images];
      const [moved] = newImages.splice(idx, 1);
      newImages.unshift(moved);
      return { ...n, images: newImages };
    }));
  };
  
  const handleImageDragStart = (e: React.DragEvent, idx: number) => {
    e.dataTransfer.setData('text/plain', idx.toString());
  };

  const handleImageDrop = (e: React.DragEvent, dropIdx: number) => {
    e.preventDefault();
    const dragIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (dragIdx === dropIdx || isNaN(dragIdx)) return;
    
    setNotes(prev => prev.map(n => {
      if (n.id !== activeNoteId) return n;
      const newImages = [...n.images];
      const [moved] = newImages.splice(dragIdx, 1);
      newImages.splice(dropIdx, 0, moved);
      return { ...n, images: newImages };
    }));
  };
  
  const generateLocalEdit = () => {
    setLocalEditResult({
      text: '狗狗肚子容易咕噜叫',
      status: 'unresolved',
      message: '仍有事实核实问题：修改稿中虽调整了口吻，但“益生菌”相关表达依然缺乏资料支持。'
    });
  };

  const applyLocalEdit = () => {
    setLocalEditResult(null);
    setTextSelection(null);
  };

  // Group notes
  const pendingNotes = notes.filter(n => !n.isReviewed);
  const reviewedNotes = notes.filter(n => n.isReviewed);
  
  const groupedPending = pendingNotes.reduce((acc, note) => {
    const key = listGroupMode === 'project' ? note.project : note.accountType;
    if (!acc[key]) acc[key] = [];
    acc[key].push(note);
    return acc;
  }, {} as Record<string, typeof notes>);

  return (
    <div className="fixed inset-0 z-[100] bg-neutral-100 flex flex-col h-screen overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white border-b border-neutral-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-[16px] font-bold text-neutral-900 flex items-center gap-2">
            <FileText className="text-neutral-900" size={20} />
            内容修改
          </h2>
        </div>
        
        <div className="flex items-center gap-4 relative">
          <button 
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="text-neutral-500 hover:text-neutral-900 p-2 rounded-lg hover:bg-neutral-100 transition-colors flex items-center justify-center"
          >
            <MoreHorizontal size={20} />
          </button>
          
          <AnimatePresence>
            {showMoreMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-12 right-12 w-48 bg-white border border-neutral-200 shadow-xl rounded-xl overflow-hidden z-50 py-1"
              >
                <button className="w-full text-left px-4 py-2 text-[13px] text-neutral-700 hover:bg-neutral-50 flex items-center gap-2">
                  <AlignLeft size={14} /> 写作依据
                </button>
                <button className="w-full text-left px-4 py-2 text-[13px] text-neutral-700 hover:bg-neutral-50 flex items-center gap-2">
                  <History size={14} /> 修改记录
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-900 p-1">
            <X size={20} />
          </button>
        </div>
      </div>
      
      {/* Main 3 Columns */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Column: Note List */}
        <div className="w-[280px] bg-white border-r border-neutral-200 flex flex-col shrink-0 overflow-hidden">
          <div className="p-3 border-b border-neutral-100">
             <div className="flex items-center bg-neutral-100 p-1 rounded-lg">
                <button 
                  onClick={() => setListGroupMode('project')}
                  className={`flex-1 py-1.5 text-[12px] font-medium rounded-md transition-colors ${listGroupMode === 'project' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
                >按项目</button>
                <button 
                  onClick={() => setListGroupMode('account')}
                  className={`flex-1 py-1.5 text-[12px] font-medium rounded-md transition-colors ${listGroupMode === 'account' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
                >按账号</button>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {Object.entries(groupedPending).map(([groupName, groupNotes]: [string, any]) => (
              <div key={groupName}>
                <div className="text-[11px] font-bold text-neutral-500 mb-2 px-1">{groupName}</div>
                <div className="space-y-1.5">
                  {groupNotes.map(n => (
                    <div 
                      key={n.id}
                      onClick={() => { setActiveNoteId(n.id); setActiveArea(null); setTextSelection(null); }}
                      className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                        activeNoteId === n.id 
                          ? 'bg-rose-50 border-rose-200 shadow-sm' 
                          : 'bg-white border-neutral-100 hover:border-neutral-200'
                      }`}
                    >
                      <div className={`text-[13px] font-bold mb-1 truncate ${activeNoteId === n.id ? 'text-rose-900' : 'text-neutral-900'}`}>{n.title}</div>
                      <div className="text-[11px] text-neutral-500 mb-2">{listGroupMode === 'project' ? n.accountName : n.project}</div>
                      <div className="flex items-center justify-between">
                         <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${n.status === '需处理' ? 'bg-rose-100 text-rose-700' : 'bg-neutral-100 text-neutral-600'}`}>
                           {n.status}
                         </span>
                         {n.mainIssue !== '无' && <span className="text-[10px] text-rose-500">{n.mainIssue}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Reviewed Notes Group */}
            {reviewedNotes.length > 0 && (
              <div className="pt-4 border-t border-neutral-100 mt-4">
                <div 
                  onClick={() => setShowReviewed(!showReviewed)} 
                  className="flex items-center justify-between text-[12px] font-bold text-neutral-500 mb-2 px-1 cursor-pointer hover:text-neutral-700"
                >
                  <div className="flex items-center gap-1">
                    <ChevronRight size={14} className={`transition-transform ${showReviewed ? 'rotate-90' : ''}`} />
                    已完成
                  </div>
                  <span>{reviewedNotes.length}</span>
                </div>
                {showReviewed && (
                  <div className="space-y-1.5">
                    {reviewedNotes.map(n => (
                      <div 
                        key={n.id}
                        onClick={() => setActiveNoteId(n.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                          activeNoteId === n.id ? 'bg-neutral-50 border-neutral-300' : 'bg-white border-neutral-100'
                        }`}
                      >
                        <div className="text-[13px] font-bold text-neutral-900 mb-1 truncate opacity-70">{n.title}</div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-neutral-400">{n.accountName}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                            已完成
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Middle Column: Editor */}
        <div className="flex-1 bg-neutral-50 flex flex-col min-w-0 relative">
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-2xl mx-auto space-y-6">
              
              {/* Note Details Container */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm">
                
                {/* Title */}
                <input 
                  type="text" 
                  defaultValue={activeNote.title}
                  onFocus={() => setActiveArea('title')}
                  className={`w-full text-[22px] font-bold text-neutral-900 mb-6 focus:outline-none placeholder-neutral-300 px-3 py-2 -mx-3 rounded-xl transition-colors ${activeArea === 'title' ? 'bg-rose-50/50 ring-1 ring-rose-100' : 'hover:bg-neutral-50'}`}
                  placeholder="输入标题..."
                />
                
                {/* Content */}
                <div 
                  className={`text-[15px] leading-relaxed text-neutral-800 min-h-[300px] focus:outline-none px-3 py-4 -mx-3 rounded-xl transition-colors ${activeArea === 'content' ? 'bg-rose-50/50 ring-1 ring-rose-100' : 'hover:bg-neutral-50'}`}
                  onMouseUp={handleSelection}
                  onKeyUp={handleSelection}
                  onClick={handleContentClick}
                  ref={contentRef}
                  contentEditable
                  suppressContentEditableWarning
                />
                
                {/* Tags */}
                <div 
                  className={`mt-6 p-3 -mx-3 rounded-xl transition-colors cursor-pointer ${activeArea === 'tags' ? 'bg-rose-50/50 ring-1 ring-rose-100' : 'hover:bg-neutral-50'}`}
                  onClick={() => setActiveArea('tags')}
                >
                  <div className="flex flex-wrap gap-2">
                    {activeNote.tags.map(t => (
                      <span key={t} className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-lg text-[13px]">#{t}</span>
                    ))}
                    <button className="px-2 py-1 border border-dashed border-neutral-300 text-neutral-400 rounded-lg text-[13px] hover:text-neutral-600 flex items-center gap-1"><Plus size={12}/> 添加</button>
                  </div>
                </div>

                {/* Images */}
                <div 
                  className={`mt-6 pt-6 border-t border-neutral-100 p-3 -mx-3 rounded-xl transition-colors cursor-pointer ${activeArea === 'images' ? 'bg-rose-50/50 ring-1 ring-rose-100' : 'hover:bg-neutral-50'}`}
                  onClick={() => setActiveArea('images')}
                >
                  <div className="text-[13px] font-bold text-neutral-900 mb-3">笔记图片 (拖拽排序，第1张为首图)</div>
                  
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {activeNote.images.map((img, idx) => (
                      <div 
                        key={img.id} 
                        draggable
                        onDragStart={(e) => handleImageDragStart(e, idx)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleImageDrop(e, idx)}
                        onClick={(e) => { e.stopPropagation(); setActiveArea('images'); setActiveImageId(img.id); }}
                        className={`relative w-28 h-36 rounded-xl overflow-hidden shrink-0 border-2 cursor-pointer transition-colors ${activeImageId === img.id ? 'border-rose-500' : 'border-transparent hover:border-neutral-300'}`}
                      >
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <div className="absolute top-1 left-1 bg-black/40 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm">
                            首图
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors pointer-events-none"></div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3">
                    <button className="flex items-center justify-center gap-2 w-full py-3 border border-dashed border-neutral-300 rounded-xl text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 text-[13px] transition-colors">
                      <Plus size={16} /> 添加图片
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Action Bar */}
          <div className="bg-white border-t border-neutral-200 px-6 py-4 flex items-center justify-between shrink-0">
             <button onClick={handleReject} className="px-5 py-2.5 text-neutral-600 border border-neutral-200 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors">
               退回重写
             </button>
             <div className="flex items-center gap-3">
               <button onClick={handleSave} className="px-5 py-2.5 text-neutral-600 border border-neutral-200 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors">
                 保存
               </button>
               <button onClick={handleApprove} className="px-6 py-2.5 bg-rose-600 text-white rounded-xl text-[13px] font-bold hover:bg-rose-700 transition-colors shadow-sm flex items-center gap-2">
                 确认并查看下一篇 <ChevronRight size={16} />
               </button>
             </div>
          </div>
        </div>

        {/* Right Column: Dynamic Panel */}
        <div className="w-[320px] bg-white border-l border-neutral-200 flex flex-col shrink-0">
          
          {/* Top Info Bar */}
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center gap-2">
            <Sparkles size={16} className={activeArea ? "text-rose-600" : "text-neutral-400"} />
            <h3 className="text-[14px] font-bold text-neutral-900">
              {activeArea === 'title' ? '标题优化' 
               : activeArea === 'content' ? (textSelection ? '局部修改' : '正文优化')
               : activeArea === 'tags' ? '话题推荐'
               : activeArea === 'images' ? '图片操作'
               : '当前问题摘要'}
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5">
            {!activeArea && (
              <div className="space-y-4">
                <div className="text-[13px] text-neutral-600 leading-relaxed">
                  请在左侧编辑区点击任意部分（标题、正文、标签、图片）进行修改与优化。
                </div>
                {activeNote.mainIssue !== '无' && (
                  <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl">
                    <div className="flex items-start gap-2">
                      <AlertOctagon size={14} className="text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[13px] font-bold text-rose-900 mb-1">系统提示：{activeNote.mainIssue}</div>
                        <div className="text-[12px] text-rose-700/80">
                          发现可能的问题点，请点击对应区域查看详情并处理。
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeArea === 'title' && (
              <div className="space-y-4">
                <div className="text-[12px] text-neutral-500 mb-2">AI 建议标题：</div>
                <div className="space-y-2">
                  <div className="p-3 border border-neutral-200 hover:border-rose-400 bg-neutral-50 hover:bg-rose-50 rounded-xl cursor-pointer transition-colors text-[13px] text-neutral-800">
                    换粮软便必看！新手养狗不踩坑指南
                  </div>
                  <div className="p-3 border border-neutral-200 hover:border-rose-400 bg-neutral-50 hover:bg-rose-50 rounded-xl cursor-pointer transition-colors text-[13px] text-neutral-800">
                    干货满满，带你了解科学“七日换粮法”
                  </div>
                </div>
              </div>
            )}
            
            {activeArea === 'content' && !textSelection && (
              <div className="space-y-6">
                 <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl relative overflow-hidden">
                    <div className="flex items-start gap-2 relative z-10">
                      <AlertOctagon size={16} className="text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[14px] font-bold text-rose-900 mb-2">事实没有来源支撑</div>
                        <div className="text-[13px] text-rose-800/80 mb-3">文中可能存在过度承诺。</div>
                        <button className="text-[12px] font-bold text-rose-700 bg-white px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 transition-colors">
                          查看依据详情
                        </button>
                      </div>
                    </div>
                 </div>
                 
                 <div>
                   <h4 className="text-[13px] font-bold text-neutral-900 mb-3">全文优化建议</h4>
                   <button onClick={() => setFullEditResult('【修改后的全文内容...】')} className="w-full py-2.5 bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl text-[13px] font-bold transition-colors mb-2 shadow-sm">
                      一键优化表达
                   </button>
                 </div>
              </div>
            )}
            
            {activeArea === 'content' && textSelection && (
              <div className="space-y-4">
                <div className="bg-neutral-50 border border-neutral-200 p-3 rounded-xl">
                  <div className="text-[11px] font-bold text-neutral-500 mb-1">已选中文本：</div>
                  <div className="text-[13px] text-neutral-800 leading-relaxed line-clamp-3">
                    "{textSelection.text}"
                  </div>
                </div>
                
                <div>
                  <textarea 
                    value={localEditInput}
                    onChange={(e) => setLocalEditInput(e.target.value)}
                    className="w-full h-24 p-3 text-[13px] border border-neutral-200 rounded-xl focus:outline-none focus:border-rose-400 bg-white resize-none"
                    placeholder="输入修改要求，例如：更口语化一些"
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={generateLocalEdit} className="flex-1 py-2 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-sm">
                      生成修改
                    </button>
                  </div>
                </div>
                
                {localEditResult && (
                  <div className="mt-6 pt-6 border-t border-neutral-100">
                    <div className="text-[12px] font-bold text-neutral-500 mb-2">AI 修改建议：</div>
                    <div className="bg-white border border-rose-200 p-3 rounded-xl mb-3 shadow-sm">
                      <div className="text-[13px] text-neutral-900">{localEditResult.text}</div>
                    </div>
                    <button onClick={applyLocalEdit} className="w-full py-2 bg-rose-600 text-white rounded-xl text-[13px] font-bold hover:bg-rose-700 transition-colors shadow-sm">
                      采纳并替换
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeArea === 'tags' && (
              <div className="space-y-4">
                <div className="text-[12px] text-neutral-500 mb-2">AI 推荐话题：</div>
                <div className="flex flex-col gap-2">
                  <button className="px-3 py-2 border border-neutral-200 bg-neutral-50 text-neutral-700 rounded-xl text-[13px] hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 transition-colors text-left flex items-center justify-between">
                    <span>#科学喂养</span>
                    <Plus size={14} className="text-neutral-400" />
                  </button>
                  <button className="px-3 py-2 border border-neutral-200 bg-neutral-50 text-neutral-700 rounded-xl text-[13px] hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 transition-colors text-left flex items-center justify-between">
                    <span>#幼犬肠胃</span>
                    <Plus size={14} className="text-neutral-400" />
                  </button>
                </div>
              </div>
            )}
            
            {activeArea === 'images' && (
              <div className="space-y-3">
                {activeImageId ? (
                  <>
                    <button className="w-full py-2.5 bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2">
                      <ImageIcon size={16} /> 查看大图
                    </button>
                    <button className="w-full py-2.5 bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2">
                      <ArrowRightLeft size={16} /> 替换图片
                    </button>
                    <button className="w-full py-2.5 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-sm flex items-center justify-center gap-2">
                      <Zap size={16} className="text-amber-400" /> AI调整
                    </button>
                    <button className="w-full py-2.5 bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2">
                      <Sparkles size={16} /> 从素材中心选择
                    </button>
                    <button className="w-full py-2.5 bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2">
                      发起拍摄任务
                    </button>
                    
                    {activeNote.images.findIndex(img => img.id === activeImageId) !== 0 && (
                      <button 
                        onClick={() => moveImageToFirst(activeImageId)}
                        className="w-full py-2.5 bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2 mt-4"
                      >
                        <ArrowUp size={16} /> 移到首位 (设为封面)
                      </button>
                    )}
                    
                    <button className="w-full py-2.5 border border-rose-100 text-rose-600 rounded-xl text-[13px] font-bold hover:bg-rose-50 transition-colors flex items-center justify-center gap-2 mt-4">
                      <Trash2 size={16} /> 删除图片
                    </button>
                  </>
                ) : (
                  <div className="text-[13px] text-neutral-500 text-center py-10">
                    请在左侧选中一张图片进行操作
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>
      </div>
      
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
