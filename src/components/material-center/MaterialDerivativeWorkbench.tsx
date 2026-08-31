import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Columns2,
  Crop,
  Eraser,
  ImagePlus,
  Layers3,
  LayoutTemplate,
  MousePointer2,
  Paintbrush,
  RefreshCw,
  Search,
  Sparkles,
  WandSparkles,
  X
} from 'lucide-react';
import { MaterialAsset } from './types';

export type DerivativeIntent = 'derive' | 'optimize' | 'batch' | 'fusion';
export type DerivativeOutputMode = 'single' | 'each' | 'fusion';

interface MaterialDerivativeWorkbenchProps {
  sourceAssets: MaterialAsset[];
  availableAssets: MaterialAsset[];
  initialIntent: DerivativeIntent;
  onClose: () => void;
  onSave: (recipe: string, outputMode: DerivativeOutputMode) => void;
}

type QuickActionId = 'resize' | 'cleanup' | 'background' | 'scene' | 'enhance' | 'cover';
type CanvasTool = 'select' | 'brush' | 'erase' | 'crop' | 'compare';

const QUICK_ACTIONS: Array<{
  id: QuickActionId;
  label: string;
  description: string;
  prompt: string;
  icon: React.ComponentType<{ size?: number }>;
}> = [
  { id: 'resize', label: '生成3:4笔记图', description: '保护主体并智能扩图', prompt: '扩展为小红书3:4笔记图片，保持主体比例和画面自然', icon: Crop },
  { id: 'cleanup', label: '清理画面杂物', description: '移除无关元素和标记', prompt: '清理画面中的杂物和无关标记，保持主体与原有构图', icon: Eraser },
  { id: 'background', label: '替换生活化背景', description: '保留主体，更换场景', prompt: '保留主体，把背景替换为明亮、真实的生活化场景', icon: WandSparkles },
  { id: 'scene', label: '产品融入场景', description: '结合一张或多张参考图', prompt: '参考所选图片，把产品自然融入场景，保持真实光影和比例', icon: Layers3 },
  { id: 'enhance', label: '提亮增强清晰度', description: '改善光线与细节', prompt: '自然提亮并增强清晰度，不改变人物、宠物和产品外观', icon: Sparkles },
  { id: 'cover', label: '制作小红书封面', description: '预留标题安全区域', prompt: '生成小红书封面排版，顶部预留标题安全区，主体突出且画面简洁', icon: LayoutTemplate }
];

const CANVAS_TOOLS: Array<{ id: CanvasTool; label: string; icon: React.ComponentType<{ size?: number }> }> = [
  { id: 'select', label: '选择', icon: MousePointer2 },
  { id: 'brush', label: '涂抹', icon: Paintbrush },
  { id: 'erase', label: '擦除', icon: Eraser },
  { id: 'crop', label: '裁剪', icon: Crop },
  { id: 'compare', label: '对比', icon: Columns2 }
];

const defaultActionForIntent = (intent: DerivativeIntent): QuickActionId => {
  if (intent === 'fusion') return 'scene';
  if (intent === 'optimize') return 'enhance';
  return 'resize';
};

export const MaterialDerivativeWorkbench: React.FC<MaterialDerivativeWorkbenchProps> = ({
  sourceAssets,
  availableAssets,
  initialIntent,
  onClose,
  onSave
}) => {
  const initialActionId = defaultActionForIntent(initialIntent);
  const initialAction = QUICK_ACTIONS.find(action => action.id === initialActionId) ?? QUICK_ACTIONS[0];
  const [activeAction, setActiveAction] = useState<QuickActionId>(initialAction.id);
  const [prompt, setPrompt] = useState(initialAction.prompt);
  const [preserveSubject, setPreserveSubject] = useState(true);
  const [preserveText, setPreserveText] = useState(true);
  const [outputCount, setOutputCount] = useState<1 | 3>(1);
  const [selectedResult, setSelectedResult] = useState(0);
  const [canvasOpen, setCanvasOpen] = useState(false);
  const [canvasTool, setCanvasTool] = useState<CanvasTool>('select');
  const [isEditingGeneratedResult, setIsEditingGeneratedResult] = useState(false);
  const [referenceIds, setReferenceIds] = useState(() => new Set(initialIntent === 'fusion' ? sourceAssets.slice(1).map(asset => asset.id) : []));
  const [showReferencePicker, setShowReferencePicker] = useState(false);
  const [referenceSearch, setReferenceSearch] = useState('');
  const [previewReady, setPreviewReady] = useState(false);

  const primaryAsset = sourceAssets[0];
  const sourceIdSet = useMemo(() => new Set(sourceAssets.map(asset => asset.id)), [sourceAssets]);
  const referenceAssets = useMemo(() => {
    const seededReferences = sourceAssets.slice(1).filter(asset => referenceIds.has(asset.id));
    const addedReferences = availableAssets.filter(asset => !sourceIdSet.has(asset.id) && referenceIds.has(asset.id));
    return [...seededReferences, ...addedReferences];
  }, [availableAssets, referenceIds, sourceAssets, sourceIdSet]);
  const referenceCandidates = useMemo(() => {
    const query = referenceSearch.trim().toLowerCase();
    return availableAssets
      .filter(asset => asset.fileType === 'image' && !sourceIdSet.has(asset.id))
      .filter(asset => !query || [asset.name, asset.sourceProject, ...(asset.tags ?? [])]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(query)));
  }, [availableAssets, referenceSearch, sourceIdSet]);

  if (!primaryAsset) return null;

  const needsReference = activeAction === 'scene';
  const outputMode: DerivativeOutputMode = activeAction === 'scene' ? 'fusion' : initialIntent === 'batch' ? 'each' : 'single';
  const canGenerate = Boolean(prompt.trim()) && (!needsReference || referenceAssets.length > 0);
  const preserveRules = [
    preserveSubject ? '保持人物、宠物和产品主体' : '',
    preserveText ? '保持包装和图片原有文字' : ''
  ].filter(Boolean).join('；');
  const selectedActionLabel = QUICK_ACTIONS.find(action => action.id === activeAction)?.label ?? '图片处理';
  const recipe = `${isEditingGeneratedResult ? '基于生成结果继续修改' : selectedActionLabel} · ${prompt.trim()}${preserveRules ? ` · ${preserveRules}` : ''}${referenceAssets.length > 0 ? ` · 参考${referenceAssets.length}张图片` : ''}`;

  const selectQuickAction = (actionId: QuickActionId) => {
    const action = QUICK_ACTIONS.find(item => item.id === actionId);
    if (!action) return;
    setActiveAction(actionId);
    setPrompt(action.prompt);
    setCanvasOpen(false);
    setCanvasTool('select');
    setPreviewReady(false);
    setIsEditingGeneratedResult(false);
  };

  const toggleReference = (assetId: string) => {
    setReferenceIds(current => {
      const next = new Set(current);
      if (next.has(assetId)) next.delete(assetId);
      else next.add(assetId);
      return next;
    });
    setPreviewReady(false);
  };

  const activateCanvasTool = (tool: CanvasTool) => {
    setCanvasOpen(true);
    setCanvasTool(tool);
    if (tool === 'brush' || tool === 'erase') setPreviewReady(false);
  };

  const continueEditingResult = () => {
    setIsEditingGeneratedResult(true);
    setCanvasOpen(true);
    setCanvasTool('brush');
    setPrompt('');
    setPreviewReady(false);
  };

  return (
    <div className="fixed inset-0 z-[145] flex min-h-0 flex-col bg-page-bg text-text-main" role="dialog" aria-modal="true" aria-label="图片处理工作台">
      <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border-default bg-surface-1 px-5">
        <button type="button" onClick={onClose} className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-text-secondary hover:bg-hover-bg" aria-label="返回素材中心"><ArrowLeft size={15} />返回素材中心</button>
        <div className="h-5 w-px bg-border-default" />
        <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h1 className="truncate text-[15px] font-semibold">图片处理</h1><span className="rounded-md bg-surface-subtle px-2 py-0.5 text-[13px] text-text-tertiary">{sourceAssets.length} 张原图</span></div><p className="mt-0.5 truncate text-[13px] text-text-tertiary">原图不会被覆盖，确认后保存为一张新图片</p></div>
        <button type="button" disabled={!previewReady} onClick={() => onSave(recipe, outputMode)} className="rounded-lg bg-btn-main px-4 py-2 text-[13px] font-medium text-white hover:bg-btn-main-hover disabled:cursor-not-allowed disabled:opacity-35">保存当前结果</button>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[230px_minmax(440px,1fr)_340px]">
        <aside className="min-h-0 overflow-y-auto border-r border-border-default bg-surface-1 p-4 custom-scrollbar" aria-label="原图与参考图">
          <div className="flex items-center justify-between"><h2 className="text-[13px] font-semibold">当前原图</h2><span className="text-[13px] text-text-tertiary">不会覆盖</span></div>
          <div className="mt-3 overflow-hidden rounded-xl border border-border-default bg-surface-subtle"><img src={primaryAsset.url} alt={primaryAsset.name} className="aspect-[4/3] w-full object-cover" /><div className="line-clamp-2 p-2.5 text-[13px] font-medium leading-5">{primaryAsset.name}</div></div>
          <div className="mt-5 flex items-center justify-between"><h2 className="text-[13px] font-semibold">参考图</h2><span className="text-[13px] text-text-tertiary">{referenceAssets.length} 张</span></div>
          <div className="mt-2 space-y-2">
            {referenceAssets.map(asset => <div key={asset.id} className="flex items-center gap-2 rounded-lg border border-border-default p-2"><img src={asset.url} alt="" className="h-11 w-11 shrink-0 rounded-md object-cover" /><span className="min-w-0 flex-1 truncate text-[13px] text-text-secondary">{asset.name}</span><button type="button" onClick={() => toggleReference(asset.id)} className="rounded p-1 text-text-tertiary hover:bg-hover-bg" aria-label={`移除参考图${asset.name}`}><X size={12} /></button></div>)}
            {referenceAssets.length === 0 ? <p className="rounded-lg bg-surface-subtle px-3 py-2.5 text-[13px] leading-5 text-text-tertiary">替换背景、参考构图或多图融合时，可以添加一张或多张参考图。</p> : null}
          </div>
          <button type="button" onClick={() => setShowReferencePicker(true)} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border-strong py-2 text-[13px] font-medium text-text-secondary hover:bg-hover-bg"><ImagePlus size={13} />添加参考图</button>
        </aside>

        <main className="flex min-h-0 flex-col overflow-hidden p-5">
          <div className="mb-3 flex items-center justify-between"><div><h2 className="text-[14px] font-semibold">效果预览</h2><p className="mt-0.5 text-[13px] text-text-tertiary">{isEditingGeneratedResult ? '正在基于已选结果继续修改' : '先确认画面，再保存到素材中心'}</p></div><div className="flex items-center gap-2"><button type="button" onClick={() => { setCanvasOpen(current => !current); setCanvasTool('select'); }} className={`rounded-lg border px-2.5 py-1.5 text-[13px] font-medium ${canvasOpen ? 'border-neutral-900 bg-neutral-100' : 'border-border-default text-text-secondary'}`}>精确调整</button><span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[13px] ${previewReady ? 'bg-emerald-50 text-emerald-700' : 'bg-surface-1 text-text-tertiary'}`}>{previewReady ? <><Check size={11} />结果已生成</> : '等待生成'}</span></div></div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl border border-border-default bg-[#e9eaec] p-6">
            {canvasOpen ? <div className="absolute left-1/2 top-3 z-20 flex -translate-x-1/2 items-center gap-1 rounded-xl border border-border-default bg-white p-1.5 shadow-lg" aria-label="画布工具">{CANVAS_TOOLS.map(tool => { const Icon = tool.icon; return <button key={tool.id} type="button" onClick={() => activateCanvasTool(tool.id)} aria-pressed={canvasTool === tool.id} className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[13px] ${canvasTool === tool.id ? 'bg-neutral-900 text-white' : 'text-text-secondary hover:bg-hover-bg'}`}><Icon size={12} />{tool.label}</button>; })}</div> : null}
            <div className="relative flex max-h-full max-w-full items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
              <img src={primaryAsset.url} alt={`${primaryAsset.name}处理预览`} className={`max-h-[calc(100vh-190px)] max-w-full object-contain transition-all duration-300 ${previewReady && activeAction === 'enhance' ? 'brightness-[1.07] contrast-[1.04] saturate-[1.03]' : ''} ${previewReady && selectedResult === 1 ? 'brightness-[1.04] saturate-[1.08]' : ''} ${previewReady && selectedResult === 2 ? 'contrast-[1.06]' : ''}`} />
              {previewReady && activeAction === 'scene' && referenceAssets[0] ? <div className="absolute bottom-[6%] right-[5%] w-[34%] overflow-hidden rounded-lg border-4 border-white bg-white shadow-lg"><img src={referenceAssets[0].url} alt="融合参考图" className="aspect-[4/3] w-full object-cover" /></div> : null}
              {canvasOpen && (canvasTool === 'brush' || canvasTool === 'erase') ? <div className="pointer-events-none absolute left-[42%] top-[35%] h-24 w-24 rounded-full border-2 border-dashed border-white bg-black/20 shadow-[0_0_0_999px_rgba(0,0,0,0.08)]" /> : null}
              {canvasOpen && canvasTool === 'crop' ? <div className="pointer-events-none absolute inset-[8%] border-2 border-white shadow-[0_0_0_999px_rgba(0,0,0,0.28)]"><span className="absolute -top-7 left-0 rounded bg-neutral-900/80 px-2 py-1 text-[13px] text-white">拖动调整裁剪区域</span></div> : null}
              {previewReady && canvasOpen && canvasTool === 'compare' ? <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.25)]"><span className="absolute left-2 top-2 whitespace-nowrap rounded bg-neutral-900/75 px-2 py-1 text-[13px] text-white">左：原图　右：结果</span></div> : null}
              {previewReady && activeAction === 'cover' ? <div className="absolute inset-x-[6%] top-[7%] rounded-lg bg-white/92 px-4 py-3 text-center shadow-sm backdrop-blur-sm"><div className="text-[18px] font-bold text-neutral-900">小红书封面标题</div><div className="mt-1 text-[13px] text-neutral-600">真实体验 · 清晰表达</div></div> : null}
            </div>
          </div>
          {previewReady ? <div className="mt-3 flex shrink-0 items-center gap-2"><span className="mr-1 text-[13px] text-text-tertiary">原图 → {selectedActionLabel} →</span>{Array.from({ length: outputCount }, (_, index) => <button key={index} type="button" onClick={() => setSelectedResult(index)} aria-label={`查看生成结果${index + 1}`} aria-pressed={selectedResult === index} className={`h-12 w-16 overflow-hidden rounded-lg border bg-surface-1 p-0.5 ${selectedResult === index ? 'border-neutral-900 ring-1 ring-neutral-900' : 'border-border-default'}`}><img src={primaryAsset.url} alt="" className={`h-full w-full rounded-md object-cover ${index === 1 ? 'brightness-105 saturate-110' : index === 2 ? 'contrast-105' : ''}`} /></button>)}<button type="button" onClick={continueEditingResult} className="ml-auto flex items-center gap-1.5 rounded-lg border border-border-default px-3 py-2 text-[13px] font-medium text-text-main hover:bg-hover-bg"><Paintbrush size={12} />继续修改当前结果</button></div> : null}
        </main>

        <aside className="flex min-h-0 flex-col border-l border-border-default bg-surface-1" aria-label="图片处理操作">
          <div className="border-b border-border-default px-4 py-3.5"><div className="flex items-center gap-2"><Sparkles size={14} /><h2 className="text-[14px] font-semibold">怎么处理这张图</h2></div><p className="mt-1 text-[13px] text-text-tertiary">先选常用动作，也可以直接修改下面的要求</p></div>
          <div className="min-h-0 flex-1 overflow-y-auto p-4 custom-scrollbar">
            <section><h3 className="text-[13px] font-semibold">常用处理</h3><div className="mt-2 grid grid-cols-2 gap-2">{QUICK_ACTIONS.map(action => { const Icon = action.icon; const active = activeAction === action.id && !isEditingGeneratedResult; return <button key={action.id} type="button" onClick={() => selectQuickAction(action.id)} className={`rounded-xl border p-3 text-left ${active ? 'border-neutral-900 bg-neutral-100' : 'border-border-default hover:bg-hover-bg'}`}><Icon size={14} /><div className="mt-2 text-[13px] font-semibold leading-4">{action.label}</div><div className="mt-1 text-[13px] leading-4 text-text-tertiary">{action.description}</div></button>; })}</div></section>
            <section className="mt-4"><div className="flex items-center justify-between"><label htmlFor="material-edit-prompt" className="text-[13px] font-semibold">描述你想怎么修改</label><button type="button" onClick={() => activateCanvasTool('brush')} className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[13px] ${canvasOpen && canvasTool === 'brush' ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-border-default text-text-secondary'}`}><Paintbrush size={11} />涂抹局部</button></div><textarea id="material-edit-prompt" value={prompt} onChange={event => { setPrompt(event.target.value); setPreviewReady(false); }} rows={5} placeholder="例如：删除桌面杂物，把背景换成明亮宠物店，保留狗狗和包装文字" className="mt-2 w-full resize-none rounded-lg border border-border-default bg-surface-subtle p-3 text-[13px] leading-5 outline-none focus:border-border-strong" /><div className="mt-2 flex gap-2"><button type="button" onClick={() => setShowReferencePicker(true)} className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-border-default py-2 text-[13px] text-text-secondary hover:bg-hover-bg"><ImagePlus size={11} />添加参考图</button><button type="button" onClick={() => activateCanvasTool('crop')} className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-border-default py-2 text-[13px] text-text-secondary hover:bg-hover-bg"><Crop size={11} />调整画面范围</button></div></section>
            <section className="mt-4 space-y-2"><button type="button" role="switch" aria-checked={preserveSubject} onClick={() => { setPreserveSubject(current => !current); setPreviewReady(false); }} className="flex w-full items-center justify-between rounded-lg border border-border-default px-3 py-2.5 text-[13px] text-text-secondary"><span>保持人物、宠物和产品主体</span><span className={`h-5 w-9 rounded-full p-0.5 ${preserveSubject ? 'bg-neutral-900' : 'bg-neutral-300'}`}><span className={`block h-4 w-4 rounded-full bg-white transition-transform ${preserveSubject ? 'translate-x-4' : ''}`} /></span></button><button type="button" role="switch" aria-checked={preserveText} onClick={() => { setPreserveText(current => !current); setPreviewReady(false); }} className="flex w-full items-center justify-between rounded-lg border border-border-default px-3 py-2.5 text-[13px] text-text-secondary"><span>保留包装和图片原有文字</span><span className={`h-5 w-9 rounded-full p-0.5 ${preserveText ? 'bg-neutral-900' : 'bg-neutral-300'}`}><span className={`block h-4 w-4 rounded-full bg-white transition-transform ${preserveText ? 'translate-x-4' : ''}`} /></span></button></section>
            {needsReference && referenceAssets.length === 0 ? <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[13px] leading-5 text-amber-800">“产品融入场景”需要至少添加一张场景参考图。</div> : null}
            <section className="mt-4 border-t border-border-subtle pt-4"><div className="flex items-center justify-between"><h3 className="text-[13px] font-semibold">生成数量</h3><span className="text-[13px] text-text-tertiary">多生成几张便于比较</span></div><div className="mt-2 grid grid-cols-2 gap-2">{([1, 3] as const).map(count => <button key={count} type="button" onClick={() => { setOutputCount(count); setSelectedResult(0); setPreviewReady(false); }} className={`rounded-lg border py-2 text-[13px] ${outputCount === count ? 'border-neutral-900 bg-neutral-100 font-medium' : 'border-border-default text-text-secondary'}`}>{count} 张</button>)}</div></section>
          </div>
          <div className="shrink-0 border-t border-border-default p-4"><button type="button" disabled={!canGenerate} onClick={() => { setPreviewReady(true); setSelectedResult(0); }} className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-btn-main py-2.5 text-[13px] font-medium text-white hover:bg-btn-main-hover disabled:cursor-not-allowed disabled:opacity-35">{previewReady ? <RefreshCw size={13} /> : <Sparkles size={13} />}{previewReady ? '重新生成' : '生成'}</button></div>
        </aside>
      </div>

      {showReferencePicker ? <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/35 p-6" onClick={() => setShowReferencePicker(false)}><div className="flex max-h-[74vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-surface-1 shadow-2xl" onClick={event => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="选择参考图"><div className="flex items-center justify-between border-b border-border-default px-5 py-4"><div><h2 className="text-[14px] font-semibold">选择参考图</h2><p className="mt-1 text-[13px] text-text-tertiary">可以多选，完成后直接返回处理页面</p></div><button type="button" onClick={() => setShowReferencePicker(false)} className="rounded-lg p-1.5 text-text-tertiary hover:bg-hover-bg" aria-label="关闭参考图选择"><X size={16} /></button></div><div className="p-4 pb-2"><div className="relative"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" /><input autoFocus value={referenceSearch} onChange={event => setReferenceSearch(event.target.value)} placeholder="搜索图片、项目或标签…" className="w-full rounded-lg border border-border-default bg-surface-subtle py-2.5 pl-9 pr-3 text-[13px] outline-none focus:border-border-strong" /></div></div><div className="grid min-h-0 flex-1 grid-cols-3 gap-3 overflow-y-auto p-4 pt-2 custom-scrollbar">{referenceCandidates.map(asset => { const selected = referenceIds.has(asset.id); return <button key={asset.id} type="button" onClick={() => toggleReference(asset.id)} aria-pressed={selected} className={`overflow-hidden rounded-xl border text-left ${selected ? 'border-neutral-900 ring-1 ring-neutral-900' : 'border-border-default hover:border-neutral-500'}`}><div className="relative"><img src={asset.url} alt={asset.name} className="aspect-[4/3] w-full object-cover" />{selected ? <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-md bg-neutral-900 text-white"><Check size={13} /></span> : null}</div><div className="truncate p-2.5 text-[13px] font-medium">{asset.name}</div></button>; })}{referenceCandidates.length === 0 ? <div className="col-span-3 py-10 text-center text-[13px] text-text-tertiary">没有匹配的参考图</div> : null}</div><div className="flex items-center justify-between border-t border-border-default px-5 py-3.5"><span className="text-[13px] text-text-secondary">已选 {referenceAssets.length} 张参考图</span><button type="button" onClick={() => setShowReferencePicker(false)} className="rounded-lg bg-btn-main px-4 py-2 text-[13px] font-medium text-white">完成选择</button></div></div></div> : null}
    </div>
  );
};
