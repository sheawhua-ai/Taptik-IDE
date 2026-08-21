import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useProjectStore } from '../../context/ProjectContext';
import { 
  X, Check, AlertOctagon, User, Tag, Plus, Image as ImageIcon, 
  ChevronRight, RefreshCw, History, AlignLeft, FileText, 
  Sparkles, ArrowRightLeft, ListChecks, MoreHorizontal, Trash2, ArrowUp, Zap,
  CheckCircle2
} from 'lucide-react';

export function ContentReviewWorkbench({ onClose }: { onClose: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeNoteId, setActiveNoteId] = useState('n1');
  const [textSelection, setTextSelection] = useState<{text: string, start: number, end: number} | null>(null);
  
  const [activeArea, setActiveArea] = useState<'title' | 'content' | 'tags' | 'images' | null>(null);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  
  const [localEditInput, setLocalEditInput] = useState('');
  const [localEditResult, setLocalEditResult] = useState<{text: string, status: 'resolved' | 'unresolved', message: string} | null>(null);
  const [fullEditResult, setFullEditResult] = useState<string | null>(null);
  
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showReviewed, setShowReviewed] = useState(false);

  const [showBasisDrawer, setShowBasisDrawer] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showAIAdjustModal, setShowAIAdjustModal] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  
  const removeTag = (tagToRemove: string) => {
    setNotes(notes.map(n => n.id === activeNoteId ? { ...n, tags: n.tags.filter(t => t !== tagToRemove) } : n));
  };
  const addTag = (newTag: string) => {
    const cleanTag = newTag.trim().replace(/^#/, '');
    if (cleanTag && !activeNote.tags.includes(cleanTag)) {
      setNotes(notes.map(n => n.id === activeNoteId ? { ...n, tags: [...n.tags, cleanTag] } : n));
    }
    setNewTagInput('');
    setShowNewTagInput(false);
  };
  const deleteImage = (imgId: string) => {
    setNotes(notes.map(n => n.id === activeNoteId ? { ...n, images: n.images.filter(img => img.id !== imgId) } : n));
    setActiveImageId(null);
  };


  const { unifiedState } = useProjectStore();
  
  const [notes, setNotes] = useState(
    unifiedState.noteSlots.map(ns => {
      const draft = unifiedState.contentDrafts.find(d => d.noteSlotId === ns.id);
      return {
        id: ns.id,
        project: ns.id.includes('2') || ns.id.includes('4') ? '双十一大促种草计划' : (unifiedState.projects.find(p => p.id === ns.projectId)?.name || '幼犬换粮搜索卡位第三轮'),
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
    const key = note.project || '其他项目';
    if (!acc[key]) acc[key] = [];
    acc[key].push(note);
    return acc;
  }, {} as Record<string, typeof notes>);

  return (
    <div className="fixed inset-0 z-[100] bg-hover-bg flex flex-col h-screen overflow-hidden">
      {/* Top Bar */}
      <div className="bg-surface-1 border-b border-border-default px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-[16px] font-bold text-text-main flex items-center gap-2">
            <FileText className="text-text-main" size={20} />
            内容修改
          </h2>
        </div>
        
        <div className="flex items-center gap-4 relative">
          <button 
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="text-text-tertiary hover:text-text-main p-2 rounded-lg hover:bg-hover-bg transition-colors flex items-center justify-center"
          >
            <MoreHorizontal size={20} />
          </button>
          
          <AnimatePresence>
            {showMoreMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-12 right-12 w-48 bg-surface-1 border border-border-default shadow-xl rounded-xl overflow-hidden z-50 py-1"
              >
                <button onClick={() => { setShowBasisDrawer(true); setShowMoreMenu(false); }} className="w-full text-left px-4 py-2 text-[13px] text-text-secondary hover:bg-page-bg flex items-center gap-2">
                  <AlignLeft size={14} /> 写作依据
                </button>
                <button onClick={() => { setShowHistoryDrawer(true); setShowMoreMenu(false); }} className="w-full text-left px-4 py-2 text-[13px] text-text-secondary hover:bg-page-bg flex items-center gap-2">
                  <History size={14} /> 修改记录
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button onClick={onClose} className="text-text-tertiary hover:text-text-main p-1">
            <X size={20} />
          </button>
        </div>
      </div>
      
      {/* Main 3 Columns */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Column: Note List */}
        <div className="w-[280px] bg-surface-1 border-r border-border-default flex flex-col shrink-0 overflow-hidden">
          
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {Object.keys(groupedPending).length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-surface-2 rounded-xl flex items-center justify-center text-text-tertiary mb-3">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-[14px] font-bold text-text-main">暂无待审阅笔记</h3>
              </div>
            ) : (
              Object.entries(groupedPending).map(([groupName, groupNotes]: [string, any]) => (
              <div key={groupName}>
                <div className="text-[11px] font-bold text-text-tertiary mb-2 px-1">{groupName}</div>
                <div className="space-y-1.5">
                  {groupNotes.map(n => (
                    <div 
                      key={n.id}
                      onClick={() => { setActiveNoteId(n.id); setActiveArea(null); setTextSelection(null); }}
                      className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                        activeNoteId === n.id 
                          ? 'bg-brand-light border-primary-200 shadow-sm' 
                          : 'bg-surface-1 border-border-default hover:border-border-default'
                      }`}
                    >
                      <div className={`text-[13px] font-bold mb-1 truncate ${activeNoteId === n.id ? 'text-primary-900' : 'text-text-main'}`}>{n.title}</div>
                      <div className="text-[11px] text-text-tertiary mb-2">{n.accountName}</div>
                      <div className="flex items-center justify-between">
                         <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${n.status === '需处理' ? 'bg-primary-100 text-primary-700' : 'bg-hover-bg text-text-secondary'}`}>
                           {n.status}
                         </span>
                         {n.mainIssue !== '无' && <span className="text-[10px] text-brand-logo font-medium">{n.mainIssue}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )))}
            
                      </div>
        </div>

        {/* Middle Column: Editor */}
        <div className="flex-1 bg-page-bg flex flex-col min-w-0 relative">
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-2xl mx-auto space-y-6">
              
              {/* Note Details Container */}
              <div className="bg-surface-1 border border-border-default rounded-xl p-8 shadow-sm">
                
                {/* Title */}
                <input 
                  type="text" 
                  defaultValue={activeNote.title}
                  onFocus={() => setActiveArea('title')}
                  className={`w-full text-[22px] font-bold text-text-main mb-6 focus:outline-none placeholder-neutral-300 px-3 py-2 -mx-3 rounded-xl transition-colors ${activeArea === 'title' ? 'bg-brand-light/50 ring-1 ring-primary-200' : 'hover:bg-page-bg'}`}
                  placeholder="输入标题..."
                />
                
                {/* Content */}
                <div 
                  className={`text-[15px] leading-relaxed text-text-main min-h-[300px] focus:outline-none px-3 py-4 -mx-3 rounded-xl transition-colors ${activeArea === 'content' ? 'bg-brand-light/50 ring-1 ring-primary-200' : 'hover:bg-page-bg'}`}
                  onMouseUp={handleSelection}
                  onKeyUp={handleSelection}
                  onClick={handleContentClick}
                  ref={contentRef}
                  contentEditable
                  suppressContentEditableWarning
                />
                
                {/* Tags */}
                <div 
                  className={`mt-6 p-3 -mx-3 rounded-xl transition-colors cursor-pointer ${activeArea === 'tags' ? 'bg-brand-light/50 ring-1 ring-primary-200' : 'hover:bg-page-bg'}`}
                  onClick={() => setActiveArea('tags')}
                >
                  <div className="flex flex-wrap gap-2">
                    {activeNote.tags.map(t => (
                      <span key={t} className="px-2 py-1 bg-hover-bg text-text-secondary rounded-lg text-[13px] group flex items-center gap-1 transition-colors hover:bg-brand-light hover:text-primary-700">
                        #{t}
                        <button onClick={(e) => { e.stopPropagation(); removeTag(t); }} className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-text-tertiary hover:text-brand-logo">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    {!showNewTagInput ? (
                      <button onClick={(e) => { e.stopPropagation(); setShowNewTagInput(true); }} className="px-2 py-1 border border-dashed border-neutral-300 text-text-tertiary rounded-lg text-[13px] hover:text-text-secondary flex items-center gap-1"><Plus size={12}/> 添加</button>
                    ) : (
                      <div className="flex items-center">
                        <input autoFocus type="text" value={newTagInput} onChange={e => setNewTagInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(newTagInput); } }} onBlur={() => addTag(newTagInput)} onClick={e => e.stopPropagation()} className="px-2 py-1 border border-primary-500 bg-surface-1 text-text-secondary rounded-lg text-[13px] focus:outline-none w-24" placeholder="输入标签" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Images */}
                <div 
                  className={`mt-6 pt-6 border-t border-border-default p-3 -mx-3 rounded-xl transition-colors cursor-pointer ${activeArea === 'images' ? 'bg-brand-light/50 ring-1 ring-primary-200' : 'hover:bg-page-bg'}`}
                  onClick={() => setActiveArea('images')}
                >
                  <div className="text-[13px] font-bold text-text-main mb-3">笔记图片 (拖拽排序，第1张为首图)</div>
                  
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {activeNote.images.map((img, idx) => (
                      <div 
                        key={img.id} 
                        draggable
                        onDragStart={(e) => handleImageDragStart(e, idx)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleImageDrop(e, idx)}
                        onClick={(e) => { e.stopPropagation(); setActiveArea('images'); setActiveImageId(img.id); }}
                        className={`relative w-28 h-36 rounded-xl overflow-hidden shrink-0 border-2 cursor-pointer transition-colors ${activeImageId === img.id ? 'border-primary-500' : 'border-transparent hover:border-neutral-300'}`}
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
                    <button className="flex items-center justify-center gap-2 w-full py-3 border border-dashed border-neutral-300 rounded-xl text-text-tertiary hover:bg-page-bg hover:text-text-secondary text-[13px] transition-colors">
                      <Plus size={16} /> 添加图片
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Action Bar */}
          <div className="bg-surface-1 border-t border-border-default px-6 py-4 flex items-center justify-between shrink-0">
             <button onClick={handleReject} className="px-5 py-2.5 text-text-secondary border border-border-default rounded-xl text-[13px] font-bold hover:bg-page-bg transition-colors">
               退回重写
             </button>
             <div className="flex items-center gap-3">
               <button onClick={handleSave} className="px-5 py-2.5 text-text-secondary border border-border-default rounded-xl text-[13px] font-bold hover:bg-page-bg transition-colors">
                 保存
               </button>
               <button onClick={handleApprove} className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-[13px] font-bold hover:bg-primary-700 transition-colors shadow-sm flex items-center gap-2">
                 确认并查看下一篇 <ChevronRight size={16} />
               </button>
             </div>
          </div>
        </div>

        {/* Right Column: Dynamic Panel */}
        <div className="w-[320px] bg-surface-1 border-l border-border-default flex flex-col shrink-0">
          
          {/* Top Info Bar */}
          <div className="px-5 py-4 border-b border-border-default flex items-center gap-2">
            <Sparkles size={16} className={activeArea ? "text-brand-logo" : "text-text-tertiary"} />
            <h3 className="text-[14px] font-bold text-text-main">
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
                <div className="text-[13px] text-text-secondary leading-relaxed">
                  请在左侧编辑区点击任意部分（标题、正文、标签、图片）进行修改与优化。
                </div>
                {activeNote.mainIssue !== '无' && (
                  <div className="bg-brand-light border border-primary-200 p-3 rounded-xl">
                    <div className="flex items-start gap-2">
                      <AlertOctagon size={14} className="text-brand-logo shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[13px] font-bold text-primary-900 mb-1">系统提示：{activeNote.mainIssue}</div>
                        <div className="text-[12px] text-primary-700">
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
                <div className="text-[12px] text-text-tertiary mb-2">AI 建议标题：</div>
                <div className="space-y-2">
                  <div className="p-3 border border-border-default hover:border-primary-400 bg-page-bg hover:bg-brand-light rounded-xl cursor-pointer transition-colors text-[13px] text-text-main">
                    换粮软便必看！新手养狗不踩坑指南
                  </div>
                  <div className="p-3 border border-border-default hover:border-primary-400 bg-page-bg hover:bg-brand-light rounded-xl cursor-pointer transition-colors text-[13px] text-text-main">
                    干货满满，带你了解科学“七日换粮法”
                  </div>
                </div>
              </div>
            )}
            
            {activeArea === 'content' && !textSelection && (
              <div className="space-y-6">
                 <div className="bg-brand-light border border-primary-200 p-4 rounded-xl relative overflow-hidden">
                    <div className="flex items-start gap-2 relative z-10">
                      <AlertOctagon size={16} className="text-brand-logo shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[14px] font-bold text-primary-900 mb-2">事实没有来源支撑</div>
                        <div className="text-[13px] text-primary-800 mb-3">文中可能存在过度承诺。</div>
                        <button className="text-[12px] font-bold text-primary-700 bg-surface-1 px-3 py-1.5 rounded-lg border border-primary-200 hover:bg-brand-light transition-colors">
                          查看依据详情
                        </button>
                      </div>
                    </div>
                 </div>
                 
                 <div>
                   <h4 className="text-[13px] font-bold text-text-main mb-3">全文优化建议</h4>
                   <button onClick={() => setFullEditResult('【修改后的全文内容...】')} className="w-full py-2.5 bg-btn-main text-white hover:bg-btn-main-hover rounded-xl text-[13px] font-bold transition-colors mb-2 shadow-sm">
                      一键优化表达
                   </button>
                 </div>
              </div>
            )}
            
            {activeArea === 'content' && textSelection && (
              <div className="space-y-4">
                <div className="bg-page-bg border border-border-default p-3 rounded-xl">
                  <div className="text-[11px] font-bold text-text-tertiary mb-1">已选中文本：</div>
                  <div className="text-[13px] text-text-main leading-relaxed line-clamp-3">
                    "{textSelection.text}"
                  </div>
                </div>
                
                <div>
                  <textarea 
                    value={localEditInput}
                    onChange={(e) => setLocalEditInput(e.target.value)}
                    className="w-full h-24 p-3 text-[13px] border border-border-default rounded-xl focus:outline-none focus:border-primary-500 bg-surface-1 resize-none"
                    placeholder="输入修改要求，例如：更口语化一些"
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={generateLocalEdit} className="flex-1 py-2 bg-btn-main text-white rounded-xl text-[13px] font-bold hover:bg-btn-main-hover transition-colors shadow-sm">
                      生成修改
                    </button>
                  </div>
                </div>
                
                {localEditResult && (
                  <div className="mt-6 pt-6 border-t border-border-default">
                    <div className="text-[12px] font-bold text-text-tertiary mb-2">AI 修改建议：</div>
                    <div className="bg-surface-1 border border-primary-200 p-3 rounded-xl mb-3 shadow-sm">
                      <div className="text-[13px] text-text-main">{localEditResult.text}</div>
                    </div>
                    <button onClick={applyLocalEdit} className="w-full py-2 bg-primary-600 text-white rounded-xl text-[13px] font-bold hover:bg-primary-700 transition-colors shadow-sm">
                      采纳并替换
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeArea === 'tags' && (
              <div className="space-y-4">
                <div className="text-[12px] text-text-tertiary mb-2">AI 推荐话题：</div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => addTag('科学喂养')} className="px-3 py-2 border border-border-default bg-page-bg text-text-secondary rounded-xl text-[13px] hover:bg-brand-light hover:border-primary-200 hover:text-primary-700 transition-colors text-left flex items-center justify-between">
                    <span>#科学喂养</span>
                    <Plus size={14} className="text-text-tertiary" />
                  </button>
                  <button onClick={() => addTag('幼犬肠胃')} className="px-3 py-2 border border-border-default bg-page-bg text-text-secondary rounded-xl text-[13px] hover:bg-brand-light hover:border-primary-200 hover:text-primary-700 transition-colors text-left flex items-center justify-between">
                    <span>#幼犬肠胃</span>
                    <Plus size={14} className="text-text-tertiary" />
                  </button>
                </div>
              </div>
            )}
            
            {activeArea === 'images' && (
              <div className="space-y-3">
                {activeImageId ? (
                  <>
                    <button className="w-full py-2.5 bg-page-bg border border-border-default text-text-secondary rounded-xl text-[13px] font-bold hover:bg-hover-bg transition-colors flex items-center justify-center gap-2">
                      <ImageIcon size={16} /> 查看大图
                    </button>
                    <button className="w-full py-2.5 bg-page-bg border border-border-default text-text-secondary rounded-xl text-[13px] font-bold hover:bg-hover-bg transition-colors flex items-center justify-center gap-2">
                      <ArrowRightLeft size={16} /> 替换图片
                    </button>
                    <button onClick={() => setShowAIAdjustModal(true)} className="w-full py-2.5 bg-btn-main text-white rounded-xl text-[13px] font-bold hover:bg-btn-main-hover transition-colors shadow-sm flex items-center justify-center gap-2">
                      <Zap size={16} className="text-amber-400" /> AI调整
                    </button>
                    <button onClick={() => setShowMaterialModal(true)} className="w-full py-2.5 bg-page-bg border border-border-default text-text-secondary rounded-xl text-[13px] font-bold hover:bg-hover-bg transition-colors flex items-center justify-center gap-2">
                      <Sparkles size={16} /> 从素材中心选择
                    </button>
                    <button className="w-full py-2.5 bg-page-bg border border-border-default text-text-secondary rounded-xl text-[13px] font-bold hover:bg-hover-bg transition-colors flex items-center justify-center gap-2">
                      发起拍摄任务
                    </button>
                    
                    {activeNote.images.findIndex(img => img.id === activeImageId) !== 0 && (
                      <button 
                        onClick={() => moveImageToFirst(activeImageId)}
                        className="w-full py-2.5 bg-page-bg border border-border-default text-text-secondary rounded-xl text-[13px] font-bold hover:bg-hover-bg transition-colors flex items-center justify-center gap-2 mt-4"
                      >
                        <ArrowUp size={16} /> 移到首位 (设为封面)
                      </button>
                    )}
                    
                    <button onClick={() => deleteImage(activeImageId)} className="w-full py-2.5 border border-danger-light text-danger rounded-xl text-[13px] font-bold hover:bg-danger-light transition-colors flex items-center justify-center gap-2 mt-4">
                      <Trash2 size={16} /> 删除图片
                    </button>
                  </>
                ) : (
                  <div className="text-[13px] text-text-tertiary text-center py-10">
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-[300] bg-surface-1 text-text-main px-4 py-2 rounded-xl shadow-lg border border-border-default flex items-center gap-2 h-10 max-h-[48px]"
          >
            <Check size={16} className="text-success" />
            <span className="text-[13px] font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBasisDrawer && (
          <div className="fixed inset-0 z-[200] flex">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-btn-main/20 backdrop-blur-sm" onClick={() => setShowBasisDrawer(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="absolute right-0 top-0 bottom-0 w-[400px] bg-surface-1 shadow-2xl border-l border-border-default flex flex-col">
              <div className="p-6 border-b border-border-default flex items-center justify-between">
                <h3 className="text-[18px] font-bold text-text-main flex items-center gap-2"><FileText size={20} className="text-text-tertiary" /> 写作依据</h3>
                <button onClick={() => setShowBasisDrawer(false)} className="p-2 hover:bg-hover-bg rounded-full transition-colors"><X size={20} className="text-text-tertiary" /></button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div>
                  <h4 className="text-[13px] font-bold text-text-main mb-2">所属项目/需求</h4>
                  <div className="bg-page-bg p-4 rounded-xl border border-border-default text-[13px] text-text-secondary">
                    <p className="font-bold mb-1">{activeNote.project}</p>
                    <p className="text-text-tertiary">内容方向: {activeNote.fixedRole}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-text-main mb-2">人设与账号类型</h4>
                  <div className="bg-page-bg p-4 rounded-xl border border-border-default text-[13px] text-text-secondary">
                    <p>当前账号: <span className="font-bold">{activeNote.accountName}</span> ({activeNote.accountType})</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-text-main mb-2">核心参考素材</h4>
                  <div className="space-y-2">
                    <div className="bg-surface-1 border border-border-default p-3 rounded-xl flex items-center gap-3">
                      <div className="w-10 h-10 bg-hover-bg rounded-lg flex items-center justify-center shrink-0"><FileText size={16} className="text-text-tertiary" /></div>
                      <div>
                        <div className="text-[13px] font-bold text-text-main">产品功能手册_2024.pdf</div>
                        <div className="text-[11px] text-text-tertiary">提供事实支撑</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showHistoryDrawer && (
          <div className="fixed inset-0 z-[200] flex">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-btn-main/20 backdrop-blur-sm" onClick={() => setShowHistoryDrawer(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="absolute right-0 top-0 bottom-0 w-[400px] bg-surface-1 shadow-2xl border-l border-border-default flex flex-col">
              <div className="p-6 border-b border-border-default flex items-center justify-between">
                <h3 className="text-[18px] font-bold text-text-main flex items-center gap-2"><History size={20} className="text-text-tertiary" /> 修改记录</h3>
                <button onClick={() => setShowHistoryDrawer(false)} className="p-2 hover:bg-hover-bg rounded-full transition-colors"><X size={20} className="text-text-tertiary" /></button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 relative">
                <div className="absolute left-[39px] top-6 bottom-6 w-px bg-neutral-200 z-0"></div>
                <div className="space-y-8 relative z-10">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0 border-2 border-white shadow-sm text-brand-logo"><User size={14} /></div>
                    <div>
                      <div className="text-[13px] font-bold text-text-main mb-0.5">人类审查员 修改了标题</div>
                      <div className="text-[11px] text-text-tertiary mb-2">今天 14:30</div>
                      <div className="bg-page-bg p-3 rounded-xl border border-border-default text-[13px] text-text-secondary line-through mb-1">原：太棒了！这款新品超出预期</div>
                      <div className="bg-brand-light p-3 rounded-xl border border-primary-200 text-[13px] text-primary-900 font-medium">新：绝了！这款新品真的超出预期</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-btn-main flex items-center justify-center shrink-0 border-2 border-white shadow-sm text-white"><Zap size={14} /></div>
                    <div>
                      <div className="text-[13px] font-bold text-text-main mb-0.5">AI 助手 (GPT) 调整了配图排版</div>
                      <div className="text-[11px] text-text-tertiary mb-2">今天 14:15</div>
                      <div className="bg-page-bg p-3 rounded-xl border border-border-default text-[13px] text-text-secondary">
                        应用了 "首图加文字" 模板
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center shrink-0 border-2 border-white shadow-sm text-text-secondary"><Check size={14} /></div>
                    <div>
                      <div className="text-[13px] font-bold text-text-main mb-0.5">笔记初稿生成</div>
                      <div className="text-[11px] text-text-tertiary mb-2">今天 14:00</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showMaterialModal && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-btn-main/40 backdrop-blur-sm" onClick={() => setShowMaterialModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="bg-surface-1 w-[600px] max-h-[80vh] rounded-2xl shadow-2xl relative z-10 flex flex-col overflow-hidden">
              <div className="p-6 border-b border-border-default flex items-center justify-between">
                <h3 className="text-[18px] font-bold text-text-main">从素材中心选择</h3>
                <button onClick={() => setShowMaterialModal(false)} className="p-2 hover:bg-hover-bg rounded-full transition-colors"><X size={20} className="text-text-tertiary" /></button>
              </div>
              <div className="p-6 overflow-y-auto grid grid-cols-3 gap-4">
                {[
                  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400',
                  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400',
                  'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=400',
                  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=400',
                  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400'
                ].map((url, i) => (
                  <div key={i} onClick={() => {
                      if (activeImageId) {
                        setNotes(notes.map(n => n.id === activeNoteId ? { ...n, images: n.images.map(img => img.id === activeImageId ? { ...img, url } : img) } : n));
                      }
                      setShowMaterialModal(false);
                      setToastMessage("图片已替换");
                      setTimeout(() => setToastMessage(null), 2000);
                    }} 
                    className="aspect-square bg-hover-bg rounded-xl overflow-hidden cursor-pointer group relative border-2 border-transparent hover:border-primary-500 transition-all"
                  >
                    <img src={url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-[13px] font-bold bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">选择此图</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {showAIAdjustModal && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-btn-main/40 backdrop-blur-sm" onClick={() => setShowAIAdjustModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="bg-surface-1 w-[500px] rounded-2xl shadow-2xl relative z-10 flex flex-col overflow-hidden">
              <div className="p-6 border-b border-border-default flex items-center justify-between bg-surface-1">
                <h3 className="text-[18px] font-bold text-text-main flex items-center gap-2"><Zap size={20} className="text-brand-logo" /> AI 智能调整 (GPT / orshot)</h3>
                <button onClick={() => setShowAIAdjustModal(false)} className="p-2 hover:bg-hover-bg rounded-full transition-colors"><X size={20} className="text-text-tertiary hover:text-text-secondary" /></button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <div className="text-[13px] font-bold text-text-main mb-3">选择文字编排模板</div>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="p-4 border-2 border-primary-500 bg-brand-light/60 rounded-xl text-left">
                      <div className="text-[14px] font-bold text-primary-900 mb-1">封面大字</div>
                      <div className="text-[11px] text-primary-700">提取标题自动排版，适合首图</div>
                    </button>
                    <button className="p-4 border border-border-default bg-page-bg hover:bg-hover-bg rounded-xl text-left transition-colors">
                      <div className="text-[14px] font-bold text-text-main mb-1">拍立得边框</div>
                      <div className="text-[11px] text-text-tertiary">添加复古边框和手写体说明</div>
                    </button>
                  </div>
                </div>
                <div>
                  <div className="text-[13px] font-bold text-text-main mb-3">或输入自定义调整指令</div>
                  <textarea 
                    className="w-full h-24 p-3 border border-border-default rounded-xl focus:border-primary-500 focus:outline-none resize-none text-[13px]"
                    placeholder="例如：使用 orshot 接口提取图片主体，并把背景替换为干净的纯色..."
                  />
                </div>
                <button 
                  onClick={() => {
                    setShowAIAdjustModal(false);
                    setToastMessage("AI 处理中，请稍候...");
                    setTimeout(() => setToastMessage("图片处理完成！"), 3000);
                    setTimeout(() => setToastMessage(null), 5000);
                  }}
                  className="w-full py-3 bg-primary-600 text-white rounded-xl text-[14px] font-bold hover:bg-primary-700 transition-colors shadow-sm"
                >
                  开始生成
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
