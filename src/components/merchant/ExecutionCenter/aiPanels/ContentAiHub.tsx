import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, Check, FolderPlus, Plus, Sparkle, RefreshCw, 
  Copy, ShieldCheck, AlertTriangle, FileText, CheckCheck
} from 'lucide-react';
import { 
  ExecutionTask, LibraryMaterialItem, SelectionAIProposal, SelectionTargetType 
} from '../types';
import { MOCK_LIBRARY_MATERIALS } from '../materialMockData';

interface ContentAiHubProps {
  task: ExecutionTask;
  draftTitle: string;
  setDraftTitle: (v: string) => void;
  draftBody: string;
  setDraftBody: (v: string) => void;
  tags: string[];
  setTags: (v: string[]) => void;
  selectedTagIndex: number | null;
  setSelectedTagIndex: (i: number | null) => void;
  selectionTarget: SelectionTargetType;
  setSelectionTarget: (t: SelectionTargetType) => void;
  selectedTextExcerpt: string;
  setSelectedTextExcerpt: (s: string) => void;
  selectedCoverUrl: string;
  setSelectedCoverUrl: (u: string) => void;
  selectedMaterialAssets: LibraryMaterialItem[];
  setSelectedMaterialAssets: React.Dispatch<React.SetStateAction<LibraryMaterialItem[]>>;
  onOpenLibraryModal: () => void;
  onOpenCreateTaskModal: () => void;
  showToast: (msg: string) => void;
}

export function ContentAiHub({
  task,
  draftTitle,
  setDraftTitle,
  draftBody,
  setDraftBody,
  tags,
  setTags,
  selectedTagIndex,
  setSelectedTagIndex,
  selectionTarget,
  setSelectionTarget,
  selectedTextExcerpt,
  setSelectedTextExcerpt,
  selectedCoverUrl,
  setSelectedCoverUrl,
  selectedMaterialAssets,
  setSelectedMaterialAssets,
  onOpenLibraryModal,
  onOpenCreateTaskModal,
  showToast
}: ContentAiHubProps) {
  const [userAIPrompt, setUserAIPrompt] = useState<string>('');
  const [isAIGenerating, setIsAIGenerating] = useState<boolean>(false);
  const [activeAIProposal, setActiveAIProposal] = useState<SelectionAIProposal | null>(null);

  // Selection handlers
  const handleSelectTitle = () => {
    setSelectionTarget('title');
    setSelectedTextExcerpt(draftTitle);
    setActiveAIProposal(null);
    setUserAIPrompt('');
  };

  const handleSelectTag = (index: number) => {
    setSelectedTagIndex(index);
    setSelectionTarget('tags');
    setSelectedTextExcerpt(tags[index]);
    setActiveAIProposal(null);
    setUserAIPrompt('');
  };

  // Generate AI Proposal based on selection
  const handleGenerateAIProposal = (promptOverride?: string) => {
    const prompt = promptOverride || userAIPrompt || '优化表达，更符合自然种草口吻';
    setIsAIGenerating(true);
    
    setTimeout(() => {
      setIsAIGenerating(false);
      
      if (selectionTarget === 'title') {
        if (prompt.includes('口语') || prompt.includes('痛点')) {
          setActiveAIProposal({
            target: 'title',
            selectedExcerpt: selectedTextExcerpt,
            originalText: draftTitle,
            suggestedText: '换粮小狗狂拉稀？宠物店长手把手教你7天稳妥换粮',
            reason: '突出高频搜索痛点“拉稀”与店长人设立场，点击率预估提升 28%',
            impactScope: '仅调整笔记主标题，正文及话题保持不变'
          });
        } else if (prompt.includes('避坑')) {
          setActiveAIProposal({
            target: 'title',
            selectedExcerpt: selectedTextExcerpt,
            originalText: draftTitle,
            suggestedText: '新手养狗换粮别踩坑！店长总结的7日不软便保姆级法则',
            reason: '强化“新手避坑”与“保姆级法则”心理暗示，提升收藏与完读意愿',
            impactScope: '仅调整笔记主标题'
          });
        } else {
          setActiveAIProposal({
            target: 'title',
            selectedExcerpt: selectedTextExcerpt,
            originalText: draftTitle,
            suggestedText: '幼犬换粮避坑必看：7日渐进过渡法，新手店长实测不软便',
            reason: '根据修改要求优化标题节奏，字数精简至23字以内',
            impactScope: '仅调整笔记主标题'
          });
        }
      } else if (selectionTarget === 'body_paragraph' || selectionTarget === 'body_all') {
        if (prompt.includes('功效') || prompt.includes('合规')) {
          setActiveAIProposal({
            target: 'body_paragraph',
            selectedExcerpt: selectedTextExcerpt,
            originalText: selectedTextExcerpt || '专利级益生菌配方',
            suggestedText: '特别添加的多联活性益生菌成分，温和呵护幼犬娇嫩肠胃',
            reason: '去除未经验证的“专利级”绝对化宣传词，符合广告法合规要求并保留专业背书',
            impactScope: '正文第 3 段特定用词替换'
          });
        } else if (prompt.includes('店长') || prompt.includes('口吻')) {
          setActiveAIProposal({
            target: 'body_paragraph',
            selectedExcerpt: selectedTextExcerpt,
            originalText: selectedTextExcerpt,
            suggestedText: '在门店经常遇到铲屎官急匆匆来问小狗换粮拉稀怎么办。其实按科学配比循序渐进，90%的小狗都能平稳过渡。遇到拿不准比例的，随时来店里找我！',
            reason: '强化线下门店店长第一人称服务场景，增强真实信任度',
            impactScope: '选中的正文段落'
          });
        } else {
          setActiveAIProposal({
            target: 'body_paragraph',
            selectedExcerpt: selectedTextExcerpt,
            originalText: selectedTextExcerpt,
            suggestedText: `${selectedTextExcerpt.slice(0, 50)}...（已根据【${prompt}】进行自然语言精炼与痛点加强）`,
            reason: '根据自然语言指令优化了文段流畅度与关键词分布',
            impactScope: '选中的正文段落'
          });
        }
      } else if (selectionTarget === 'tags') {
        setActiveAIProposal({
          target: 'tags',
          selectedExcerpt: selectedTextExcerpt,
          originalText: selectedTextExcerpt,
          suggestedText: '小狗拉肚子怎么办',
          reason: '替换为小红书搜索量高、竞争度中等的高转化长尾搜索词',
          impactScope: `第 ${(selectedTagIndex ?? 0) + 1} 个话题标签`
        });
      }
    }, 450);
  };

  // Apply AI proposal
  const handleApplyAIProposal = () => {
    if (!activeAIProposal) return;

    if (activeAIProposal.target === 'title') {
      setDraftTitle(activeAIProposal.suggestedText);
      showToast('已将AI建议应用到标题');
    } else if (activeAIProposal.target === 'body_paragraph' || activeAIProposal.target === 'body_all') {
      if (draftBody.includes(activeAIProposal.originalText)) {
        setDraftBody(draftBody.replace(activeAIProposal.originalText, activeAIProposal.suggestedText));
      } else {
        setDraftBody(draftBody + '\n' + activeAIProposal.suggestedText);
      }
      showToast('已将AI建议应用到正文选中内容');
    } else if (activeAIProposal.target === 'tags') {
      if (selectedTagIndex !== null) {
        const nextTags = [...tags];
        nextTags[selectedTagIndex] = activeAIProposal.suggestedText;
        setTags(nextTags);
        showToast('已更新话题标签');
      }
    }
    setActiveAIProposal(null);
  };

  const handleDiscardAIProposal = () => {
    setActiveAIProposal(null);
    showToast('已保留原文');
  };

  const handleSelectMaterialCover = (mat: LibraryMaterialItem) => {
    setSelectedCoverUrl(mat.url);
    if (!selectedMaterialAssets.some(a => a.id === mat.id)) {
      setSelectedMaterialAssets(prev => [mat, ...prev]);
    }
    showToast(`已将《${mat.title}》设为本篇笔记推荐封面`);
  };

  const handleToggleMaterialAsset = (mat: LibraryMaterialItem) => {
    if (selectedMaterialAssets.some(a => a.id === mat.id)) {
      setSelectedMaterialAssets(prev => prev.filter(a => a.id !== mat.id));
      showToast(`已移出素材《${mat.title}》`);
    } else {
      setSelectedMaterialAssets(prev => [...prev, mat]);
      showToast(`已从素材库选用《${mat.title}》`);
    }
  };

  return (
    <div className="w-80 border-l border-border-default bg-surface flex flex-col shrink-0">
      
      {/* Header */}
      <div className="p-3.5 border-b border-border-default bg-surface-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-neutral-900 text-white flex items-center justify-center text-[11px] font-bold">
            <Sparkles size={13} />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-text-primary">
              {selectionTarget === 'title' 
                ? '正在修改：笔记标题'
                : selectionTarget === 'body_paragraph'
                ? '正在修改：正文选中段落'
                : selectionTarget === 'body_all'
                ? '正在修改：整篇正文'
                : selectionTarget === 'tags'
                ? '正在修改：话题标签'
                : selectionTarget === 'material_recommendation'
                ? '素材中心匹配与推荐'
                : '内容与合规 AI 协同'}
            </div>
            <div className="text-[11px] text-text-tertiary">
              {selectionTarget === 'material_recommendation'
                ? '已自动匹配素材库可用资产'
                : selectionTarget ? '仅对当前选中范围生效' : '选区感知 · 局部改写'}
            </div>
          </div>
        </div>

        {selectionTarget && (
          <button
            type="button"
            onClick={() => {
              setSelectionTarget(null);
              setActiveAIProposal(null);
            }}
            className="text-[11px] text-text-tertiary hover:text-text-primary"
          >
            取消选择
          </button>
        )}
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[12.5px]">
        
        {/* Compliance Alert if task has compliance risk */}
        {task.complianceRisk && !selectionTarget && (
          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2">
            <div className="text-[12px] font-semibold text-amber-900 flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-amber-700" />
              <span>AI 合规预检提示</span>
            </div>
            <div className="text-[11.5px] text-amber-800 leading-relaxed">
              {task.complianceRisk}
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectionTarget('body_paragraph');
                setSelectedTextExcerpt('专利级益生菌配方');
                handleGenerateAIProposal('删除功效承诺，替换为合规说明');
              }}
              className="w-full py-1.5 bg-amber-100/80 hover:bg-amber-200/80 text-amber-900 border border-amber-300 rounded-lg text-[11.5px] font-medium transition-colors flex items-center justify-center gap-1"
            >
              <Sparkles size={12} />
              <span>一键合规化替换</span>
            </button>
          </div>
        )}

        {/* When No Selection */}
        {!selectionTarget && (
          <div className="space-y-4 pt-1">
            <div className="p-3 bg-surface-subtle border border-border-subtle rounded-lg text-text-secondary text-[12px] leading-relaxed">
              在左侧编辑器中<strong>划选文字、点击标题或话题</strong>，AI 将只针对选中范围提供精准修改建议。
            </div>

            <div className="space-y-2">
              <div className="text-[11.5px] font-medium text-text-tertiary">快捷修改目标：</div>
              <button
                type="button"
                onClick={handleSelectTitle}
                className="w-full text-left p-2.5 bg-surface hover:bg-surface-hover border border-border-default rounded-lg transition-colors flex items-center justify-between text-text-primary font-medium"
              >
                <span>修改笔记标题</span>
                <ArrowRight size={13} className="text-text-tertiary" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectionTarget('body_paragraph');
                  setSelectedTextExcerpt(draftBody.slice(0, 80) + '...');
                }}
                className="w-full text-left p-2.5 bg-surface hover:bg-surface-hover border border-border-default rounded-lg transition-colors flex items-center justify-between text-text-primary font-medium"
              >
                <span>修改正文段落</span>
                <ArrowRight size={13} className="text-text-tertiary" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectTag(0)}
                className="w-full text-left p-2.5 bg-surface hover:bg-surface-hover border border-border-default rounded-lg transition-colors flex items-center justify-between text-text-primary font-medium"
              >
                <span>优化话题标签</span>
                <ArrowRight size={13} className="text-text-tertiary" />
              </button>

              <button
                type="button"
                onClick={() => setSelectionTarget('material_recommendation')}
                className="w-full text-left p-2.5 bg-surface hover:bg-surface-hover border border-border-default rounded-lg transition-colors flex items-center justify-between text-text-primary font-medium"
              >
                <span>素材中心匹配与配图</span>
                <ArrowRight size={13} className="text-text-tertiary" />
              </button>
            </div>
          </div>
        )}

        {/* When Selection Active */}
        {selectionTarget && (
          <div className="space-y-3.5">
            
            {/* If Material Recommendation is selected */}
            {selectionTarget === 'material_recommendation' ? (
              <div className="space-y-4">
                <div className="p-3 bg-surface-subtle border border-border-subtle rounded-lg space-y-1">
                  <div className="text-[11.5px] font-semibold text-text-primary flex items-center justify-between">
                    <span>智能匹配素材资产</span>
                    <span className="text-[10.5px] text-emerald-700 font-medium">已关联方案词簇</span>
                  </div>
                  <div className="text-[11px] text-text-secondary leading-relaxed">
                    系统根据<strong>{task.projectName}</strong>已从素材中心调取可用实拍与封面。
                  </div>
                </div>

                {/* Recommended Covers Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[11.5px] font-semibold text-text-primary flex items-center gap-1.5">
                      <Sparkle size={12} className="text-rose-600" />
                      <span>推荐高点击封面</span>
                    </div>
                    <span className="text-[10.5px] text-text-tertiary">点击立即切换</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {MOCK_LIBRARY_MATERIALS.filter(m => m.isRecommendedCover || m.category === '门店实拍' || m.category === '产品特写').slice(0, 4).map((coverItem) => (
                      <div
                        key={coverItem.id}
                        onClick={() => handleSelectMaterialCover(coverItem)}
                        className={`group relative rounded-lg border overflow-hidden cursor-pointer transition-all ${
                          selectedCoverUrl === coverItem.url
                            ? 'border-neutral-900 ring-2 ring-neutral-900/10'
                            : 'border-border-default hover:border-border-strong'
                        }`}
                      >
                        <div className="aspect-[3/4] bg-neutral-100 relative">
                          <img
                            src={coverItem.url}
                            alt={coverItem.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          {selectedCoverUrl === coverItem.url && (
                            <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-neutral-900 text-white text-[9.5px] font-medium flex items-center gap-0.5 shadow-sm">
                              <Check size={10} />
                              <span>当前封面</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[11px] font-medium transition-opacity">
                            设为封面
                          </div>
                        </div>
                        <div className="p-1.5 bg-surface text-[11px]">
                          <div className="truncate font-medium text-text-primary">{coverItem.title}</div>
                          <div className="text-[10px] text-text-tertiary truncate">{coverItem.tags.join(' · ')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Body Images */}
                <div className="space-y-2 pt-2 border-t border-border-subtle">
                  <div className="flex items-center justify-between">
                    <div className="text-[11.5px] font-semibold text-text-primary flex items-center gap-1.5">
                      <FolderPlus size={12} className="text-text-secondary" />
                      <span>推荐正文配图</span>
                    </div>
                    <button
                      type="button"
                      onClick={onOpenLibraryModal}
                      className="text-[11px] text-text-secondary hover:text-text-primary font-medium"
                    >
                      素材库 →
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {MOCK_LIBRARY_MATERIALS.slice(0, 3).map((item) => {
                      const isSelected = selectedMaterialAssets.some(a => a.id === item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleToggleMaterialAsset(item)}
                          className={`p-2 rounded-lg border text-[11.5px] flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-neutral-50 border-neutral-900 ring-1 ring-neutral-900/10'
                              : 'bg-surface hover:bg-surface-hover border-border-default'
                          }`}
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <img
                              src={item.url}
                              alt={item.title}
                              className="w-9 h-9 rounded object-cover border border-border-subtle shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="truncate">
                              <div className="font-medium text-text-primary truncate">{item.title}</div>
                              <div className="text-[10.5px] text-text-tertiary truncate">{item.category} · {item.tags.slice(0, 2).join(' ')}</div>
                            </div>
                          </div>
                          <button
                            type="button"
                            className={`px-2 py-0.5 rounded text-[10.5px] font-medium shrink-0 ml-2 transition-colors ${
                              isSelected
                                ? 'bg-neutral-900 text-white'
                                : 'bg-surface-subtle text-text-secondary hover:text-text-primary border border-border-default'
                            }`}
                          >
                            {isSelected ? '已选用' : '+ 选用'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Fast Dispatch New Task */}
                <div className="pt-2 border-t border-border-subtle space-y-2">
                  <button
                    type="button"
                    onClick={onOpenCreateTaskModal}
                    className="w-full py-2 bg-surface hover:bg-surface-hover text-text-primary border border-border-default rounded-lg text-[12px] font-medium transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus size={13} />
                    <span>生成素材补拍任务</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Selected Excerpt Preview */}
                <div className="p-2.5 bg-surface-subtle border border-border-subtle rounded-lg space-y-1">
                  <div className="text-[11px] font-semibold text-text-tertiary">选中的原文：</div>
                  <div className="text-[12px] text-text-primary line-clamp-3 leading-snug">
                    "{selectedTextExcerpt}"
                  </div>
                </div>

                {/* Quick Prompts */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-medium text-text-tertiary">快捷修改要求：</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectionTarget === 'title' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleGenerateAIProposal('更口语化，突出软便痛点')}
                          className="px-2.5 py-1 text-[11.5px] bg-surface-subtle hover:bg-surface-hover text-text-secondary border border-border-default rounded-md transition-colors"
                        >
                          更口语化
                        </button>
                        <button
                          type="button"
                          onClick={() => handleGenerateAIProposal('强化新手避坑情绪')}
                          className="px-2.5 py-1 text-[11.5px] bg-surface-subtle hover:bg-surface-hover text-text-secondary border border-border-default rounded-md transition-colors"
                        >
                          强化避坑情绪
                        </button>
                        <button
                          type="button"
                          onClick={() => handleGenerateAIProposal('缩短字数')}
                          className="px-2.5 py-1 text-[11.5px] bg-surface-subtle hover:bg-surface-hover text-text-secondary border border-border-default rounded-md transition-colors"
                        >
                          缩短字数
                        </button>
                      </>
                    )}

                    {(selectionTarget === 'body_paragraph' || selectionTarget === 'body_all') && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleGenerateAIProposal('删除功效承诺，替换为合规说明')}
                          className="px-2.5 py-1 text-[11.5px] bg-surface-subtle hover:bg-surface-hover text-text-secondary border border-border-default rounded-md transition-colors"
                        >
                          删除功效承诺
                        </button>
                        <button
                          type="button"
                          onClick={() => handleGenerateAIProposal('更符合店长顾问口吻')}
                          className="px-2.5 py-1 text-[11.5px] bg-surface-subtle hover:bg-surface-hover text-text-secondary border border-border-default rounded-md transition-colors"
                        >
                          店长口吻
                        </button>
                        <button
                          type="button"
                          onClick={() => handleGenerateAIProposal('保留原意并缩短')}
                          className="px-2.5 py-1 text-[11.5px] bg-surface-subtle hover:bg-surface-hover text-text-secondary border border-border-default rounded-md transition-colors"
                        >
                          精炼段落
                        </button>
                      </>
                    )}

                    {selectionTarget === 'tags' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleGenerateAIProposal('从项目关键词词簇补充')}
                          className="px-2.5 py-1 text-[11.5px] bg-surface-subtle hover:bg-surface-hover text-text-secondary border border-border-default rounded-md transition-colors"
                        >
                          从词簇补充
                        </button>
                        <button
                          type="button"
                          onClick={() => handleGenerateAIProposal('替换为精准长尾词')}
                          className="px-2.5 py-1 text-[11.5px] bg-surface-subtle hover:bg-surface-hover text-text-secondary border border-border-default rounded-md transition-colors"
                        >
                          替换长尾词
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Custom Input */}
                <div className="space-y-1.5">
                  <div className="relative">
                    <input
                      type="text"
                      value={userAIPrompt}
                      onChange={(e) => setUserAIPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleGenerateAIProposal();
                      }}
                      placeholder="输入自然语言修改要求..."
                      className="w-full px-3 py-2 text-[12px] bg-surface border border-border-default rounded-lg focus:outline-none focus:border-neutral-900 pr-14"
                    />
                    <button
                      type="button"
                      disabled={isAIGenerating}
                      onClick={() => handleGenerateAIProposal()}
                      className="absolute right-1.5 top-1.5 px-2.5 py-1 bg-action-primary text-white text-[11.5px] font-semibold rounded-md hover:bg-action-primary-hover disabled:opacity-50 transition-colors"
                    >
                      {isAIGenerating ? '生成中...' : '生成'}
                    </button>
                  </div>
                </div>

                {/* AI Diff Proposal Result */}
                {activeAIProposal && (
                  <div className="p-3 bg-surface border border-neutral-900/20 rounded-xl space-y-2.5 shadow-sm animate-in fade-in duration-150">
                    <div className="text-[12px] font-semibold text-text-primary flex items-center justify-between">
                      <span>修改建议 (Diff)</span>
                      <span className="text-[10.5px] text-emerald-700 font-medium">已生成</span>
                    </div>

                    <div className="space-y-1.5 text-[12px]">
                      <div className="p-2 bg-rose-50/60 border border-rose-200/60 rounded text-rose-900">
                        <span className="text-[10.5px] font-bold text-rose-700 block">修改前：</span>
                        <span>{activeAIProposal.originalText}</span>
                      </div>
                      <div className="p-2 bg-emerald-50/60 border border-emerald-200/60 rounded text-emerald-900">
                        <span className="text-[10.5px] font-bold text-emerald-700 block">修改后：</span>
                        <span>{activeAIProposal.suggestedText}</span>
                      </div>
                    </div>

                    <div className="text-[11.5px] text-text-secondary space-y-0.5">
                      <div><strong>理由：</strong>{activeAIProposal.reason}</div>
                      <div className="text-text-tertiary"><strong>影响范围：</strong>{activeAIProposal.impactScope}</div>
                    </div>

                    <div className="pt-2 border-t border-border-subtle flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={handleDiscardAIProposal}
                        className="px-3 py-1.5 text-[11.5px] text-text-secondary hover:text-text-primary rounded-lg border border-border-default transition-colors"
                      >
                        保留原文
                      </button>
                      <button
                        type="button"
                        onClick={handleApplyAIProposal}
                        className="px-3.5 py-1.5 text-[11.5px] font-semibold text-white bg-action-primary hover:bg-action-primary-hover rounded-lg transition-colors shadow-sm"
                      >
                        应用到选中内容
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
