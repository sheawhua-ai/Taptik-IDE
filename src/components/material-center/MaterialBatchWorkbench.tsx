import React, { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  ChevronDown,
  Crop,
  Eraser,
  FileImage,
  ImageDown,
  Palette,
  RefreshCw,
  Sparkles,
  Type,
  WandSparkles,
  X
} from 'lucide-react';
import { MaterialAsset } from './types';

export type BatchProcessTool = 'resize' | 'watermark' | 'text' | 'compress' | 'tone' | 'background';

interface MaterialBatchWorkbenchProps {
  assets: MaterialAsset[];
  initialTool: BatchProcessTool;
  onClose: () => void;
  onSave: (recipe: string, completedAssetIds: string[]) => void;
}

interface BatchStep {
  id: string;
  tool: BatchProcessTool;
  enabled: boolean;
}

const TOOL_CONFIG: Array<{
  id: BatchProcessTool;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number }>;
}> = [
  { id: 'resize', label: '改尺寸', description: '裁剪、留白或AI扩图', icon: Crop },
  { id: 'watermark', label: '清理水印', description: '识别后清理画面标记', icon: Eraser },
  { id: 'text', label: '添加文字/Logo', description: '统一标题和品牌角标', icon: Type },
  { id: 'compress', label: '压缩与格式', description: '控制大小和导出格式', icon: ImageDown },
  { id: 'tone', label: '统一色调', description: '统一亮度和色彩倾向', icon: Palette },
  { id: 'background', label: '替换背景', description: '保留主体批量换场景', icon: WandSparkles }
];

const createStep = (tool: BatchProcessTool): BatchStep => ({ id: `${tool}-${Date.now()}-${Math.random().toString(16).slice(2)}`, tool, enabled: true });

export const MaterialBatchWorkbench: React.FC<MaterialBatchWorkbenchProps> = ({ assets, initialTool, onClose, onSave }) => {
  const initialStep = useMemo(() => createStep(initialTool), [initialTool]);
  const [steps, setSteps] = useState<BatchStep[]>([initialStep]);
  const [activeStepId, setActiveStepId] = useState(initialStep.id);
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.id ?? '');
  const [showAddSteps, setShowAddSteps] = useState(false);
  const [targetRatio, setTargetRatio] = useState('3:4');
  const [resizeMode, setResizeMode] = useState('AI扩图');
  const [watermarkMode, setWatermarkMode] = useState('自动识别');
  const [textMode, setTextMode] = useState('统一固定文字');
  const [overlayText, setOverlayText] = useState('真实体验分享');
  const [textPosition, setTextPosition] = useState('顶部安全区');
  const [quality, setQuality] = useState('高清 · 85%');
  const [outputFormat, setOutputFormat] = useState('保持原格式');
  const [tone, setTone] = useState('自然明亮');
  const [backgroundPrompt, setBackgroundPrompt] = useState('明亮、真实的生活化场景');
  const [previewReady, setPreviewReady] = useState(false);
  const [confirmedReviewIds, setConfirmedReviewIds] = useState(() => new Set<string>());

  const selectedAsset = assets.find(asset => asset.id === selectedAssetId) ?? assets[0];
  const activeStep = steps.find(step => step.id === activeStepId) ?? steps[0];
  const enabledTools = new Set(steps.filter(step => step.enabled).map(step => step.tool));
  const hasAiStep = enabledTools.has('watermark') || enabledTools.has('background') || (enabledTools.has('resize') && resizeMode === 'AI扩图');
  const baseReviewCount = hasAiStep && assets.length > 1 ? Math.max(1, Math.round(assets.length * 0.2)) : 0;
  const reviewAssetIds = new Set(assets.slice(Math.max(0, assets.length - baseReviewCount)).map(asset => asset.id));
  const pendingReviewIds = assets.filter(asset => reviewAssetIds.has(asset.id) && !confirmedReviewIds.has(asset.id)).map(asset => asset.id);
  const reviewCount = previewReady ? pendingReviewIds.length : baseReviewCount;
  const directCount = Math.max(0, assets.length - reviewCount);
  const completedAssetIds = assets.filter(asset => !pendingReviewIds.includes(asset.id)).map(asset => asset.id);

  const stepSummary = (tool: BatchProcessTool) => {
    if (tool === 'resize') return `${targetRatio} · ${resizeMode}`;
    if (tool === 'watermark') return `${watermarkMode} · 低可信结果人工确认`;
    if (tool === 'text') return `${textMode} · ${textPosition}`;
    if (tool === 'compress') return `${quality} · ${outputFormat}`;
    if (tool === 'tone') return tone;
    return backgroundPrompt;
  };

  const recipe = steps
    .filter(step => step.enabled)
    .map((step, index) => `${index + 1}.${TOOL_CONFIG.find(tool => tool.id === step.tool)?.label ?? step.tool}（${stepSummary(step.tool)}）`)
    .join(' → ');

  const addStep = (tool: BatchProcessTool) => {
    const existing = steps.find(step => step.tool === tool);
    if (existing) {
      setActiveStepId(existing.id);
    } else {
      const next = createStep(tool);
      setSteps(current => [...current, next]);
      setActiveStepId(next.id);
    }
    setShowAddSteps(false);
    setPreviewReady(false);
  };

  const removeStep = (stepId: string) => {
    setSteps(current => {
      if (current.length === 1) return current;
      const next = current.filter(step => step.id !== stepId);
      if (activeStepId === stepId) setActiveStepId(next[0].id);
      return next;
    });
    setPreviewReady(false);
  };

  const moveStep = (stepId: string, direction: -1 | 1) => {
    setSteps(current => {
      const index = current.findIndex(step => step.id === stepId);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setPreviewReady(false);
  };

  const updateSetting = (update: () => void) => {
    update();
    setPreviewReady(false);
  };

  if (!selectedAsset) return null;

  return (
    <div className="fixed inset-0 z-[145] flex min-h-0 flex-col bg-page-bg text-text-main" role="dialog" aria-modal="true" aria-label="批量图片处理工作台">
      <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border-default bg-surface-1 px-5">
        <button type="button" onClick={onClose} className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-text-secondary hover:bg-hover-bg"><ArrowLeft size={15} />返回素材中心</button>
        <div className="h-5 w-px bg-border-default" />
        <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h1 className="text-[15px] font-semibold">批量图片处理</h1><span className="rounded-md bg-surface-subtle px-2 py-0.5 text-[13px] text-text-tertiary">{assets.length} 张图片</span></div><p className="mt-0.5 text-[13px] text-text-tertiary">处理步骤按顺序执行，结果保存为新图片</p></div>
        <button type="button" disabled={!previewReady || !recipe || completedAssetIds.length === 0} onClick={() => onSave(recipe, completedAssetIds)} className="rounded-lg bg-btn-main px-4 py-2 text-[13px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-35">保存已完成结果</button>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[250px_minmax(420px,1fr)_360px]">
        <aside className="min-h-0 overflow-y-auto border-r border-border-default bg-surface-1 p-4 custom-scrollbar" aria-label="已选图片">
          <div className="flex items-center justify-between"><h2 className="text-[13px] font-semibold">已选图片</h2><span className="text-[13px] text-text-tertiary">{assets.length} 张</span></div>
          <div className="mt-3 space-y-2">
            {assets.map(asset => {
              const selected = asset.id === selectedAsset.id;
              const needsReview = previewReady && reviewAssetIds.has(asset.id) && !confirmedReviewIds.has(asset.id);
              return <button key={asset.id} type="button" onClick={() => setSelectedAssetId(asset.id)} className={`flex w-full items-center gap-2 rounded-xl border p-2 text-left ${selected ? 'border-neutral-900 bg-neutral-100' : 'border-border-default hover:bg-hover-bg'}`}><img src={asset.url} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" /><span className="min-w-0 flex-1"><span className="line-clamp-1 text-[13px] font-medium">{asset.name}</span><span className="mt-0.5 block text-[13px] text-text-tertiary">{asset.aspectRatio} · {asset.sourceProject ?? asset.sourceLabel}</span></span>{needsReview ? <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500" title="需要确认" /> : null}</button>;
            })}
          </div>
        </aside>

        <main className="flex min-h-0 flex-col overflow-hidden p-5">
          <div className="mb-3 flex items-center justify-between"><div><h2 className="text-[14px] font-semibold">代表图片预览</h2><p className="mt-0.5 text-[13px] text-text-tertiary">切换左侧图片，检查同一规则在不同图片上的效果</p></div><span className={`rounded-md px-2 py-1 text-[13px] ${previewReady ? 'bg-emerald-50 text-emerald-700' : 'bg-surface-1 text-text-tertiary'}`}>{previewReady ? '批量预览已生成' : '等待生成'}</span></div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl border border-border-default bg-[#e9eaec] p-6">
            <div className={`relative flex max-h-full max-w-full items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ${enabledTools.has('resize') && targetRatio === '3:4' ? 'aspect-[3/4]' : ''}`}>
              <img src={selectedAsset.url} alt={`${selectedAsset.name}批量处理预览`} className={`max-h-[calc(100vh-220px)] max-w-full object-cover ${enabledTools.has('tone') && tone === '自然明亮' ? 'brightness-105 saturate-105' : ''} ${enabledTools.has('tone') && tone === '温暖生活感' ? 'sepia-[0.12] saturate-110' : ''}`} />
              {enabledTools.has('watermark') && !previewReady ? <div className="absolute bottom-[8%] right-[6%] rounded border-2 border-dashed border-amber-500 bg-amber-100/55 px-3 py-2 text-[13px] text-amber-900">疑似画面标记</div> : null}
              {enabledTools.has('text') ? <div className={`absolute inset-x-[8%] rounded-lg bg-white/90 px-3 py-2 text-center text-[17px] font-bold text-neutral-900 shadow-sm ${textPosition === '底部安全区' ? 'bottom-[7%]' : 'top-[7%]'}`}>{overlayText || '输入标题文字'}</div> : null}
              {enabledTools.has('background') && previewReady ? <div className="absolute bottom-3 left-3 rounded-md bg-neutral-900/75 px-2 py-1 text-[13px] text-white">背景：{backgroundPrompt}</div> : null}
            </div>
          </div>
          {previewReady && pendingReviewIds.includes(selectedAsset.id) ? <button type="button" onClick={() => setConfirmedReviewIds(current => new Set([...current, selectedAsset.id]))} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 py-2 text-[13px] font-medium text-amber-900"><Check size={12} />确认当前图片处理结果</button> : null}
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-border-default bg-surface-1 p-3"><div className="text-[13px] text-text-tertiary">预计直接完成</div><div className="mt-1 text-[16px] font-semibold">{directCount} 张</div></div>
            <div className="rounded-xl border border-border-default bg-surface-1 p-3"><div className="text-[13px] text-text-tertiary">需要确认</div><div className="mt-1 text-[16px] font-semibold text-amber-700">{reviewCount} 张</div></div>
            <div className="rounded-xl border border-border-default bg-surface-1 p-3"><div className="text-[13px] text-text-tertiary">处理失败</div><div className="mt-1 text-[16px] font-semibold">0 张</div></div>
          </div>
        </main>

        <aside className="flex min-h-0 flex-col border-l border-border-default bg-surface-1" aria-label="批量处理规则">
          <div className="border-b border-border-default px-4 py-3.5"><div className="flex items-center justify-between"><div><h2 className="text-[14px] font-semibold">处理步骤</h2><p className="mt-1 text-[13px] text-text-tertiary">步骤会从上到下依次执行</p></div><div className="relative"><button type="button" onClick={() => setShowAddSteps(current => !current)} className="flex items-center gap-1 rounded-lg border border-border-default px-2.5 py-1.5 text-[13px] font-medium"><Sparkles size={11} />添加步骤<ChevronDown size={11} /></button>{showAddSteps ? <div className="absolute right-0 top-9 z-30 grid w-[310px] grid-cols-2 gap-2 rounded-xl border border-border-default bg-white p-2 shadow-xl">{TOOL_CONFIG.map(tool => { const Icon = tool.icon; return <button key={tool.id} type="button" onClick={() => addStep(tool.id)} className="rounded-lg p-2.5 text-left hover:bg-hover-bg"><div className="flex items-center gap-1.5 text-[13px] font-medium"><Icon size={12} />{tool.label}</div><div className="mt-1 text-[13px] text-text-tertiary">{tool.description}</div></button>; })}</div> : null}</div></div></div>
          <div className="min-h-0 flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="space-y-2">
              {steps.map((step, index) => {
                const config = TOOL_CONFIG.find(tool => tool.id === step.tool);
                const Icon = config?.icon ?? FileImage;
                const active = step.id === activeStep?.id;
                return (
                  <div key={step.id} className={`rounded-xl border ${active ? 'border-neutral-900 bg-neutral-50' : 'border-border-default'}`}>
                    <div className="flex items-center gap-2 p-3">
                      <button type="button" onClick={() => setActiveStepId(step.id)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-[13px] font-semibold">{index + 1}</span>
                        <Icon size={13} />
                        <span className="min-w-0 flex-1"><span className="block text-[13px] font-semibold">{config?.label}</span><span className="mt-0.5 block truncate text-[13px] text-text-tertiary">{stepSummary(step.tool)}</span></span>
                      </button>
                      <button type="button" role="switch" aria-label={`${config?.label}${step.enabled ? '已启用' : '已停用'}`} aria-checked={step.enabled} onClick={() => { setSteps(current => current.map(item => item.id === step.id ? { ...item, enabled: !item.enabled } : item)); setPreviewReady(false); }} className={`h-5 w-9 shrink-0 rounded-full p-0.5 ${step.enabled ? 'bg-neutral-900' : 'bg-neutral-300'}`}><span className={`block h-4 w-4 rounded-full bg-white transition-transform ${step.enabled ? 'translate-x-4' : ''}`} /></button>
                    </div>
                    {active ? <div className="flex items-center justify-end gap-1 border-t border-border-subtle px-2 py-1"><button type="button" onClick={() => moveStep(step.id, -1)} disabled={index === 0} className="rounded p-1.5 text-text-tertiary hover:bg-white disabled:opacity-30" aria-label="上移步骤"><ArrowUp size={11} /></button><button type="button" onClick={() => moveStep(step.id, 1)} disabled={index === steps.length - 1} className="rounded p-1.5 text-text-tertiary hover:bg-white disabled:opacity-30" aria-label="下移步骤"><ArrowDown size={11} /></button><button type="button" onClick={() => removeStep(step.id)} disabled={steps.length === 1} className="rounded p-1.5 text-text-tertiary hover:bg-white disabled:opacity-30" aria-label="删除步骤"><X size={11} /></button></div> : null}
                  </div>
                );
              })}
            </div>

            <section className="mt-4 rounded-xl border border-border-default p-4">
              {activeStep?.tool === 'resize' ? <div><h3 className="text-[13px] font-semibold">尺寸与处理方式</h3><div className="mt-3 grid grid-cols-3 gap-2">{['3:4', '1:1', '16:9'].map(value => <button key={value} type="button" onClick={() => updateSetting(() => setTargetRatio(value))} className={`rounded-lg border py-2 text-[13px] ${targetRatio === value ? 'border-neutral-900 bg-neutral-100 font-medium' : 'border-border-default text-text-secondary'}`}>{value}</button>)}</div><div className="mt-2 grid grid-cols-3 gap-2">{['智能裁剪', '留白', 'AI扩图'].map(value => <button key={value} type="button" onClick={() => updateSetting(() => setResizeMode(value))} className={`rounded-lg border px-1 py-2 text-[13px] ${resizeMode === value ? 'border-neutral-900 bg-neutral-100 font-medium' : 'border-border-default text-text-secondary'}`}>{value}</button>)}</div></div> : null}
              {activeStep?.tool === 'watermark' ? <div><h3 className="text-[13px] font-semibold">清理范围</h3><div className="mt-3 grid grid-cols-2 gap-2">{['自动识别', '统一位置'].map(value => <button key={value} type="button" onClick={() => updateSetting(() => setWatermarkMode(value))} className={`rounded-lg border py-2 text-[13px] ${watermarkMode === value ? 'border-neutral-900 bg-neutral-100 font-medium' : 'border-border-default text-text-secondary'}`}>{value}</button>)}</div><p className="mt-3 text-[13px] leading-5 text-text-tertiary">仅处理有权编辑的图片。识别不确定的结果会进入“需要确认”，不会直接保存。</p></div> : null}
              {activeStep?.tool === 'text' ? <div><h3 className="text-[13px] font-semibold">文字与Logo</h3><select value={textMode} onChange={event => updateSetting(() => setTextMode(event.target.value))} className="mt-3 w-full rounded-lg border border-border-default bg-white px-3 py-2 text-[13px]"><option>统一固定文字</option><option>使用对应笔记标题</option><option>添加品牌Logo角标</option></select><input value={overlayText} onChange={event => updateSetting(() => setOverlayText(event.target.value))} placeholder="输入统一文字" className="mt-2 w-full rounded-lg border border-border-default px-3 py-2 text-[13px]" /><div className="mt-2 grid grid-cols-2 gap-2">{['顶部安全区', '底部安全区'].map(value => <button key={value} type="button" onClick={() => updateSetting(() => setTextPosition(value))} className={`rounded-lg border py-2 text-[13px] ${textPosition === value ? 'border-neutral-900 bg-neutral-100 font-medium' : 'border-border-default text-text-secondary'}`}>{value}</button>)}</div></div> : null}
              {activeStep?.tool === 'compress' ? <div><h3 className="text-[13px] font-semibold">压缩与导出</h3><select value={quality} onChange={event => updateSetting(() => setQuality(event.target.value))} className="mt-3 w-full rounded-lg border border-border-default px-3 py-2 text-[13px]"><option>高清 · 85%</option><option>标准 · 70%</option><option>尽量保持原画质</option></select><select value={outputFormat} onChange={event => updateSetting(() => setOutputFormat(event.target.value))} className="mt-2 w-full rounded-lg border border-border-default px-3 py-2 text-[13px]"><option>保持原格式</option><option>统一为JPG</option><option>统一为PNG</option></select></div> : null}
              {activeStep?.tool === 'tone' ? <div><h3 className="text-[13px] font-semibold">统一色调</h3><div className="mt-3 space-y-2">{['自然明亮', '温暖生活感', '保持原色'].map(value => <button key={value} type="button" onClick={() => updateSetting(() => setTone(value))} className={`w-full rounded-lg border px-3 py-2 text-left text-[13px] ${tone === value ? 'border-neutral-900 bg-neutral-100 font-medium' : 'border-border-default text-text-secondary'}`}>{value}</button>)}</div></div> : null}
              {activeStep?.tool === 'background' ? <div><label htmlFor="batch-background-prompt" className="text-[13px] font-semibold">描述新背景</label><textarea id="batch-background-prompt" value={backgroundPrompt} onChange={event => updateSetting(() => setBackgroundPrompt(event.target.value))} rows={4} className="mt-3 w-full resize-none rounded-lg border border-border-default bg-surface-subtle p-3 text-[13px] leading-5" /></div> : null}
            </section>
          </div>
          <div className="shrink-0 border-t border-border-default p-4"><button type="button" disabled={!recipe} onClick={() => setPreviewReady(true)} className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-btn-main py-2.5 text-[13px] font-medium text-white disabled:opacity-35">{previewReady ? <RefreshCw size={13} /> : <Sparkles size={13} />}{previewReady ? '重新生成批量预览' : '生成批量预览'}</button></div>
        </aside>
      </div>
    </div>
  );
};
