import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Images,
  Layers3,
  LayoutTemplate,
  RefreshCw,
  ScanSearch,
  Sparkles,
  WandSparkles,
  X
} from 'lucide-react';
import { MaterialAsset, MaterialUse } from './types';

export type MaterialWorkbenchTool = 'home' | 'review' | 'assembly' | 'compose' | 'batch';

interface MaterialAIWorkbenchProps {
  assets: MaterialAsset[];
  pendingAssets: MaterialAsset[];
  initialTool?: MaterialWorkbenchTool;
  onAcceptAssets: (assetIds: string[]) => void;
  onCreateDerived: (assetIds: string[], recipe: string, outputUse: MaterialUse) => void;
  onNavigateToExecution?: () => void;
}

const TOOL_CARDS: Array<{
  id: Exclude<MaterialWorkbenchTool, 'home'>;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  meta: string;
}> = [
  { id: 'review', title: '快审回传', description: 'AI先筛掉模糊、重复和不符合任务要求的素材，你只确认例外。', icon: ScanSearch, meta: '2分钟处理一批' },
  { id: 'assembly', title: '装配笔记图组', description: '按照笔记的视觉槽位，自动匹配封面、场景、证据与体验图片。', icon: Layers3, meta: '自动回写笔记' },
  { id: 'compose', title: '合图生成', description: '选择两张图片和一个配方，自动抠图、扩图、融合并排版。', icon: WandSparkles, meta: '生成衍生素材' },
  { id: 'batch', title: '批量生成封面', description: '从方案选择多篇笔记，用模板组批量生成并一次确认。', icon: LayoutTemplate, meta: '保持统一但不雷同' }
];

const RECIPES = [
  { id: 'product-scene', name: '产品＋使用场景', note: '产品为主，生活场景补充真实感' },
  { id: 'experience-proof', name: '体验＋证据', note: '左侧体验画面，右侧细节或数据证据' },
  { id: 'before-after', name: '前后对比', note: '适合过程、变化与阶段记录' },
  { id: 'main-detail', name: '主图＋局部细节', note: '大图保持情绪，小窗突出产品细节' }
];

const NOTE_ROWS = [
  { id: 'note-1', title: '幼犬换粮总是软便？店长教你避坑七日换粮法', account: '店长号·陆家嘴店', slots: ['封面', '问题场景', '产品细节', '换粮步骤'], matched: 3 },
  { id: 'note-2', title: '我家金毛换粮体验，记录七天便便变化', account: '体验官·汪汪队', slots: ['封面', '体验过程', '结果反馈'], matched: 2 },
  { id: 'note-3', title: '官方科普：幼犬肠胃敏感期如何顺利换粮', account: '品牌官方号', slots: ['封面', '成分说明', '喂养建议'], matched: 3 }
];

const TEMPLATE_GROUPS = [
  { id: 'real', name: '真实体验组', description: '人物/宠物大图＋短标题', score: '近30天点击率高于基准 18%' },
  { id: 'expert', name: '专业解释组', description: '产品细节＋步骤信息', score: '适合店长号与品牌号' },
  { id: 'contrast', name: '前后对比组', description: '双图对照＋结果型标题', score: '适合体验记录类内容' }
];

const ToolHeader: React.FC<{ title: string; description: string; onBack: () => void; action?: React.ReactNode }> = ({ title, description, onBack, action }) => (
  <div className="flex items-center justify-between gap-4 border-b border-border-default bg-surface-1 px-6 py-4">
    <div className="flex min-w-0 items-center gap-3">
      <button type="button" onClick={onBack} className="rounded-lg border border-border-default p-2 text-text-secondary transition-colors hover:bg-hover-bg" aria-label="返回AI素材工作台">
        <ArrowLeft size={15} />
      </button>
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold text-text-main">{title}</h3>
        <p className="mt-0.5 truncate text-[11px] text-text-tertiary">{description}</p>
      </div>
    </div>
    {action}
  </div>
);

export const MaterialAIWorkbench: React.FC<MaterialAIWorkbenchProps> = ({
  assets,
  pendingAssets,
  initialTool = 'home',
  onAcceptAssets,
  onCreateDerived,
  onNavigateToExecution
}) => {
  const [activeTool, setActiveTool] = useState<MaterialWorkbenchTool>(initialTool);
  const [reviewFilter, setReviewFilter] = useState<'recommended' | 'uncertain' | 'reject'>('recommended');
  const [reviewOverrides, setReviewOverrides] = useState<Record<string, 'recommended' | 'uncertain' | 'reject'>>({});
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [reviewDone, setReviewDone] = useState(false);
  const [assemblyReady, setAssemblyReady] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<string[]>(() => assets.slice(0, 2).map(asset => asset.id));
  const [selectedRecipe, setSelectedRecipe] = useState(RECIPES[0].id);
  const [outputUse, setOutputUse] = useState<MaterialUse>('cover');
  const [candidatesReady, setCandidatesReady] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(0);
  const [batchGenerated, setBatchGenerated] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATE_GROUPS[0].id);
  const [notice, setNotice] = useState<string | null>(null);

  const imageAssets = useMemo(() => assets.filter(asset => asset.fileType === 'image' && asset.status !== 'archived'), [assets]);
  const reviewItems = useMemo(() => {
    if (pendingAssets.length === 0) return [];
    const seeds = [...pendingAssets, ...imageAssets.filter(asset => asset.status !== 'pending_acceptance').slice(0, 5)];
    return seeds.slice(0, 6).map((asset, index) => {
      const defaultDecision = index < 3 ? 'recommended' as const : index < 5 ? 'uncertain' as const : 'reject' as const;
      return {
      asset,
      decision: reviewOverrides[asset.id] ?? defaultDecision,
      reason: index < 3
        ? ['清晰度与构图符合要求', '已匹配对应笔记槽位', '同组连拍中画面最佳'][index]
        : index < 5
          ? ['包装文字局部遮挡，需要扫一眼', '场景符合，但主体位置需要确认'][index - 3]
          : '画面偏暗且主体模糊，建议补拍'
      };
    });
  }, [imageAssets, pendingAssets, reviewOverrides]);

  const selectedSourceAssets = useMemo(
    () => imageAssets.filter(asset => selectedAssets.includes(asset.id)),
    [imageAssets, selectedAssets]
  );

  const goHome = () => {
    setActiveTool('home');
    setNotice(null);
  };

  if (activeTool === 'review') {
    const visibleItems = reviewItems.filter(item => item.decision === reviewFilter);
    const counts = {
      recommended: reviewItems.filter(item => item.decision === 'recommended').length,
      uncertain: reviewItems.filter(item => item.decision === 'uncertain').length,
      reject: reviewItems.filter(item => item.decision === 'reject').length
    };
    return (
      <div className="flex h-full min-h-0 flex-col bg-page-bg">
        <ToolHeader
          title="回传素材快审"
          description="AI已完成客观检查、相似图聚类和任务要求匹配；只需确认例外。"
          onBack={goHome}
          action={<button type="button" onClick={onNavigateToExecution} className="flex items-center gap-1.5 rounded-lg border border-border-default bg-surface-1 px-3 py-2 text-[11px] font-medium text-text-main hover:bg-hover-bg">查看任务来源<ChevronRight size={13} /></button>}
        />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-6xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-default bg-surface-1 p-3">
              <div className="flex items-center gap-2">
                {([
                  ['recommended', '建议通过', counts.recommended],
                  ['uncertain', '需要确认', counts.uncertain],
                  ['reject', '建议补拍', counts.reject]
                ] as const).map(([id, label, count]) => (
                  <button key={id} type="button" onClick={() => setReviewFilter(id)} className={`rounded-lg px-3 py-2 text-[11.5px] font-medium transition-colors ${reviewFilter === id ? 'bg-btn-main text-white' : 'bg-surface-subtle text-text-secondary hover:text-text-main'}`}>
                    {label} <span className="ml-1 opacity-70">{count}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 text-[10.5px] text-text-tertiary"><Sparkles size={13} className="text-brand-logo" />相似连拍已折叠，只展示每组最佳画面</div>
            </div>

            {reviewDone ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
                <CheckCircle2 size={30} className="mx-auto text-emerald-600" />
                <h4 className="mt-3 text-[15px] font-semibold text-text-main">本批次已完成确认</h4>
                <p className="mt-1 text-[11.5px] text-text-secondary">通过素材已自动进入素材库，并回填到等待素材的笔记槽位。</p>
                <button type="button" onClick={goHome} className="mt-4 rounded-lg bg-btn-main px-4 py-2 text-[11.5px] font-medium text-white">返回工作台</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
                  {visibleItems.map(({ asset, decision, reason }) => (
                    <button key={`${asset.id}-${decision}`} type="button" onClick={() => { setSelectedReviewId(asset.id); setNotice(`${asset.name}：${reason}`); }} className={`overflow-hidden rounded-xl border bg-surface-1 text-left transition-all hover:shadow-sm ${selectedReviewId === asset.id ? 'ring-2 ring-brand-100' : ''} ${decision === 'recommended' ? 'border-emerald-200' : decision === 'uncertain' ? 'border-amber-200' : 'border-rose-200'}`}>
                      <div className="relative aspect-[4/3] overflow-hidden bg-surface-subtle">
                        <img src={asset.url} alt={asset.name} className="h-full w-full object-cover" />
                        <div className={`absolute left-2 top-2 flex items-center gap-1 rounded-md px-1.5 py-1 text-[9.5px] font-semibold ${decision === 'recommended' ? 'bg-emerald-600 text-white' : decision === 'uncertain' ? 'bg-amber-500 text-white' : 'bg-rose-600 text-white'}`}>
                          {decision === 'recommended' ? <Check size={11} /> : decision === 'uncertain' ? <CircleAlert size={11} /> : <X size={11} />}
                          {decision === 'recommended' ? '建议通过' : decision === 'uncertain' ? '需要确认' : '建议补拍'}
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="line-clamp-1 text-[12px] font-semibold text-text-main">{asset.name}</div>
                        <p className="mt-1.5 min-h-8 text-[10.5px] leading-4 text-text-secondary">{reason}</p>
                        <div className="mt-2 text-[9.5px] text-text-tertiary">{asset.sourceLabel} · {asset.resolution}</div>
                      </div>
                    </button>
                  ))}
                </div>
                {notice && selectedReviewId ? <div className="flex items-center justify-between gap-3 rounded-lg border border-border-default bg-surface-1 px-3 py-2"><span className="min-w-0 truncate text-[10.5px] text-text-secondary">{notice}</span><div className="flex shrink-0 items-center gap-1.5"><button type="button" onClick={() => setReviewOverrides(current => ({ ...current, [selectedReviewId]: 'recommended' }))} className="rounded-md bg-emerald-50 px-2 py-1 text-[9.5px] font-medium text-emerald-700">标记通过</button><button type="button" onClick={() => setReviewOverrides(current => ({ ...current, [selectedReviewId]: 'uncertain' }))} className="rounded-md bg-amber-50 px-2 py-1 text-[9.5px] font-medium text-amber-700">待确认</button><button type="button" onClick={() => setReviewOverrides(current => ({ ...current, [selectedReviewId]: 'reject' }))} className="rounded-md bg-rose-50 px-2 py-1 text-[9.5px] font-medium text-rose-700">要求补拍</button></div></div> : null}
                <div className="sticky bottom-0 flex items-center justify-between rounded-xl border border-border-default bg-surface-1/95 p-3 shadow-sm backdrop-blur">
                  <div className="text-[10.5px] text-text-tertiary">客观问题由AI完成预检，最终采用与补拍仍由操盘手确认。</div>
                  <div className="flex items-center gap-2">
                    {counts.reject > 0 ? <button type="button" onClick={onNavigateToExecution} className="rounded-lg border border-border-default px-3 py-2 text-[11px] font-medium text-text-main hover:bg-hover-bg">生成补拍要求</button> : null}
                    <button type="button" onClick={() => { onAcceptAssets(pendingAssets.map(asset => asset.id)); setReviewDone(true); }} className="rounded-lg bg-btn-main px-4 py-2 text-[11px] font-medium text-white hover:bg-btn-main-hover">确认本批次</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeTool === 'assembly') {
    return (
      <div className="flex h-full min-h-0 flex-col bg-page-bg">
        <ToolHeader title="装配笔记图组" description="Agent读取笔记结构并建立视觉槽位，再从素材库自动匹配与补齐。" onBack={goHome} action={<button type="button" onClick={() => setAssemblyReady(true)} className="flex items-center gap-1.5 rounded-lg bg-btn-main px-4 py-2 text-[11px] font-medium text-white"><Sparkles size={13} />AI自动装配</button>} />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-6xl space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-border-default bg-surface-1 p-3"><div className="text-[10px] text-text-tertiary">纳入笔记</div><div className="mt-1 text-[20px] font-semibold text-text-main">3 <span className="text-[10px] font-normal">篇</span></div></div>
              <div className="rounded-xl border border-border-default bg-surface-1 p-3"><div className="text-[10px] text-text-tertiary">视觉槽位</div><div className="mt-1 text-[20px] font-semibold text-text-main">10 <span className="text-[10px] font-normal">个</span></div></div>
              <div className="rounded-xl border border-border-default bg-surface-1 p-3"><div className="text-[10px] text-text-tertiary">{assemblyReady ? '等待确认' : '可自动匹配'}</div><div className="mt-1 text-[20px] font-semibold text-text-main">{assemblyReady ? 2 : 8} <span className="text-[10px] font-normal">项</span></div></div>
            </div>
            <div className="overflow-hidden rounded-xl border border-border-default bg-surface-1">
              <div className="grid grid-cols-[minmax(260px,1.25fr)_2fr_110px] border-b border-border-default bg-surface-subtle px-4 py-2.5 text-[10.5px] text-text-tertiary"><span>笔记与账号</span><span>视觉槽位</span><span className="text-right">状态</span></div>
              {NOTE_ROWS.map((note, rowIndex) => (
                <div key={note.id} className="grid grid-cols-[minmax(260px,1.25fr)_2fr_110px] items-center gap-4 border-b border-border-subtle px-4 py-3 last:border-b-0">
                  <div className="min-w-0"><div className="truncate text-[12px] font-semibold text-text-main">{note.title}</div><div className="mt-1 text-[10px] text-text-tertiary">账号：{note.account}</div></div>
                  <div className="flex min-w-0 items-center gap-2">
                    {note.slots.map((slot, slotIndex) => {
                      const matched = assemblyReady ? slotIndex < note.slots.length - (rowIndex === 1 ? 1 : 0) : slotIndex < note.matched;
                      const source = imageAssets[(rowIndex + slotIndex) % Math.max(imageAssets.length, 1)];
                      return <div key={slot} className={`relative h-14 w-12 shrink-0 overflow-hidden rounded-lg border ${matched ? 'border-emerald-200 bg-emerald-50' : 'border-dashed border-amber-300 bg-amber-50'}`} title={slot}>{matched && source ? <img src={source.url} alt={slot} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-[9px] text-amber-700">缺图</div>}<span className="absolute inset-x-0 bottom-0 truncate bg-black/65 px-1 py-0.5 text-center text-[8px] text-white">{slot}</span></div>;
                    })}
                  </div>
                  <div className="text-right">{assemblyReady && rowIndex !== 1 ? <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700">可生成</span> : <span className="rounded-md bg-amber-50 px-2 py-1 text-[10px] font-medium text-amber-700">{rowIndex === 1 ? '缺1项' : '待装配'}</span>}</div>
                </div>
              ))}
            </div>
            {assemblyReady ? <div className="flex items-center justify-between rounded-xl border border-brand-100 bg-brand-50 p-3"><div className="flex items-center gap-2 text-[11px] text-text-secondary"><Sparkles size={14} className="text-brand-logo" /><span>8个槽位已自动匹配；1个素材可通过既定模板生成，1个需要补充实拍。</span></div><div className="flex gap-2"><button type="button" onClick={onNavigateToExecution} className="rounded-lg border border-border-default bg-white px-3 py-2 text-[10.5px] font-medium text-text-main">创建素材任务</button><button type="button" onClick={() => setActiveTool('batch')} className="rounded-lg bg-btn-main px-3 py-2 text-[10.5px] font-medium text-white">生成完整图组</button></div></div> : null}
          </div>
        </div>
      </div>
    );
  }

  if (activeTool === 'compose') {
    const recipe = RECIPES.find(item => item.id === selectedRecipe) ?? RECIPES[0];
    return (
      <div className="flex h-full min-h-0 flex-col bg-page-bg">
        <ToolHeader title="合图生成" description="选择两张素材和一种运营配方，后台自动完成抠图、扩图、融合与排版。" onBack={goHome} />
        <div className="grid min-h-0 flex-1 grid-cols-[280px_minmax(0,1fr)_280px]">
          <aside className="overflow-y-auto border-r border-border-default bg-surface-1 p-4">
            <div className="text-[11px] font-semibold text-text-main">1. 选择两张素材</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {imageAssets.slice(0, 8).map(asset => {
                const selected = selectedAssets.includes(asset.id);
                return <button key={asset.id} type="button" onClick={() => { setSelectedAssets(current => selected ? current.filter(id => id !== asset.id) : current.length < 2 ? [...current, asset.id] : [current[1], asset.id]); setCandidatesReady(false); setNotice(null); }} className={`relative aspect-square overflow-hidden rounded-lg border-2 ${selected ? 'border-brand-logo' : 'border-transparent'}`}><img src={asset.url} alt={asset.name} className="h-full w-full object-cover" />{selected ? <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-logo text-white"><Check size={11} /></span> : null}</button>;
              })}
            </div>
            <div className="mt-5 text-[11px] font-semibold text-text-main">2. 选择合图配方</div>
            <div className="mt-2 space-y-2">{RECIPES.map(item => <button key={item.id} type="button" onClick={() => { setSelectedRecipe(item.id); setCandidatesReady(false); setNotice(null); }} className={`w-full rounded-lg border p-2.5 text-left ${selectedRecipe === item.id ? 'border-brand-100 bg-brand-50' : 'border-border-default hover:bg-hover-bg'}`}><div className="text-[11px] font-medium text-text-main">{item.name}</div><div className="mt-0.5 text-[9.5px] leading-4 text-text-tertiary">{item.note}</div></button>)}</div>
          </aside>
          <main className="min-w-0 overflow-y-auto p-6">
            <div className="mx-auto max-w-3xl">
              <div className="flex items-center justify-between"><div><h4 className="text-[14px] font-semibold text-text-main">候选结果</h4><p className="mt-1 text-[10.5px] text-text-tertiary">{candidatesReady ? '点击选择一版，仍可锁定素材后重新生成。' : '选择素材与配方后开始生成。'}</p></div><div className="flex rounded-lg border border-border-default bg-surface-1 p-0.5"><button type="button" onClick={() => setOutputUse('cover')} className={`rounded-md px-3 py-1.5 text-[10.5px] ${outputUse === 'cover' ? 'bg-btn-main text-white' : 'text-text-secondary'}`}>封面</button><button type="button" onClick={() => setOutputUse('body_image')} className={`rounded-md px-3 py-1.5 text-[10.5px] ${outputUse === 'body_image' ? 'bg-btn-main text-white' : 'text-text-secondary'}`}>内页</button></div></div>
              {candidatesReady ? <div className="mt-4 grid grid-cols-3 gap-3">{[0, 1, 2].map(index => <button key={index} type="button" onClick={() => setSelectedCandidate(index)} className={`overflow-hidden rounded-xl border-2 bg-surface-1 text-left ${selectedCandidate === index ? 'border-brand-logo shadow-sm' : 'border-transparent'}`}><div className="relative aspect-[3/4] overflow-hidden bg-surface-subtle"><div className={`grid h-full ${index === 0 ? 'grid-cols-2' : index === 1 ? 'grid-rows-2' : 'grid-cols-[2fr_1fr]'}`}>{selectedSourceAssets.map(asset => <img key={asset.id} src={asset.url} alt={asset.name} className="h-full min-h-0 w-full object-cover" />)}</div><div className="absolute inset-x-3 bottom-4 rounded-md bg-white/92 px-2 py-2 text-[11px] font-semibold leading-4 text-text-main shadow">幼犬换粮总软便？<br />这样做更稳妥</div>{selectedCandidate === index ? <span className="absolute right-2 top-2 rounded-full bg-brand-logo p-1 text-white"><Check size={12} /></span> : null}</div><div className="p-2 text-[9.5px] text-text-tertiary">方案 {index + 1} · {recipe.name}</div></button>)}</div> : <div className="mt-4 flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong bg-surface-1"><Images size={30} className="text-text-tertiary" /><div className="mt-3 text-[12px] font-medium text-text-main">等待生成候选</div><p className="mt-1 text-[10.5px] text-text-tertiary">不会保存未采用的中间结果</p><button type="button" disabled={selectedAssets.length < 2} onClick={() => setCandidatesReady(true)} className="mt-4 flex items-center gap-1.5 rounded-lg bg-btn-main px-4 py-2 text-[11px] font-medium text-white disabled:opacity-40"><Sparkles size={13} />生成3个候选</button></div>}
            </div>
          </main>
          <aside className="border-l border-border-default bg-surface-1 p-4">
            <div className="text-[11px] font-semibold text-text-main">本次处理</div>
            <div className="mt-3 space-y-2 rounded-xl bg-surface-subtle p-3 text-[10px] leading-5 text-text-secondary"><div className="flex justify-between"><span>输出</span><strong className="text-text-main">{outputUse === 'cover' ? '小红书封面' : '笔记内页'}</strong></div><div className="flex justify-between"><span>配方</span><strong className="text-text-main">{recipe.name}</strong></div><div className="flex justify-between"><span>原素材</span><strong className="text-text-main">{selectedAssets.length}/2</strong></div></div>
            <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50 p-3"><div className="flex items-center gap-1.5 text-[10.5px] font-medium text-text-main"><Sparkles size={13} className="text-brand-logo" />后台自动完成</div><p className="mt-1.5 text-[9.5px] leading-4 text-text-secondary">主体识别、智能扩图、光线统一、边缘融合、标题安全区和品牌规范检查。</p></div>
            <button type="button" disabled={!candidatesReady || Boolean(notice)} onClick={() => { onCreateDerived(selectedAssets, recipe.name, outputUse); setNotice('已保存为新的衍生素材，并保留原素材与配方关系。'); }} className="mt-4 w-full rounded-lg bg-btn-main px-4 py-2.5 text-[11px] font-medium text-white disabled:opacity-40">{notice ? '衍生素材已保存' : '采用并保存衍生素材'}</button>
            {notice ? <div className="mt-3 rounded-lg bg-emerald-50 p-2.5 text-[10px] leading-4 text-emerald-700">{notice}</div> : null}
          </aside>
        </div>
      </div>
    );
  }

  if (activeTool === 'batch') {
    return (
      <div className="flex h-full min-h-0 flex-col bg-page-bg">
        <ToolHeader title="批量生成封面" description="方案、笔记标题、账号人设和可用素材已经自动带入。" onBack={goHome} action={<button type="button" onClick={() => { setBatchGenerated(true); setNotice(null); }} className="flex items-center gap-1.5 rounded-lg bg-btn-main px-4 py-2 text-[11px] font-medium text-white"><Sparkles size={13} />生成3篇封面</button>} />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-6xl space-y-4">
            <section className="rounded-xl border border-border-default bg-surface-1 p-4"><div className="flex items-center justify-between"><div><h4 className="text-[12px] font-semibold text-text-main">模板组</h4><p className="mt-0.5 text-[10px] text-text-tertiary">同一模板组会自动变化构图，保持统一但不让搜索瀑布流雷同。</p></div><span className="rounded-md bg-brand-50 px-2 py-1 text-[9.5px] font-medium text-brand-600">AI推荐：真实体验组</span></div><div className="mt-3 grid grid-cols-3 gap-3">{TEMPLATE_GROUPS.map(group => <button key={group.id} type="button" onClick={() => { setSelectedTemplate(group.id); setBatchGenerated(false); setNotice(null); }} className={`rounded-xl border p-3 text-left ${selectedTemplate === group.id ? 'border-brand-100 bg-brand-50' : 'border-border-default hover:bg-hover-bg'}`}><div className="flex items-center justify-between"><span className="text-[11.5px] font-semibold text-text-main">{group.name}</span>{selectedTemplate === group.id ? <Check size={14} className="text-brand-logo" /> : null}</div><p className="mt-1 text-[10px] text-text-secondary">{group.description}</p><p className="mt-2 text-[9.5px] text-text-tertiary">{group.score}</p></button>)}</div></section>
            <section className="rounded-xl border border-border-default bg-surface-1"><div className="grid grid-cols-[minmax(280px,1.3fr)_150px_minmax(300px,1fr)_100px] border-b border-border-default bg-surface-subtle px-4 py-2.5 text-[10px] text-text-tertiary"><span>笔记</span><span>账号</span><span>候选封面</span><span className="text-right">结果</span></div>{NOTE_ROWS.map((note, rowIndex) => <div key={note.id} className="grid grid-cols-[minmax(280px,1.3fr)_150px_minmax(300px,1fr)_100px] items-center gap-3 border-b border-border-subtle px-4 py-3 last:border-b-0"><div className="truncate text-[11.5px] font-medium text-text-main">{note.title}</div><div className="truncate text-[10px] text-text-secondary">{note.account}</div><div className="flex gap-2">{batchGenerated ? [0,1,2].map(offset => { const asset = imageAssets[(rowIndex + offset) % Math.max(imageAssets.length, 1)]; return asset ? <button key={offset} type="button" className={`relative h-16 w-12 overflow-hidden rounded-md border ${offset === 0 ? 'border-brand-logo' : 'border-border-default'}`}><img src={asset.url} alt="封面候选" className="h-full w-full object-cover" />{offset === 0 ? <span className="absolute right-0.5 top-0.5 rounded-full bg-brand-logo p-0.5 text-white"><Check size={8} /></span> : null}</button> : null; }) : <div className="flex h-16 w-full items-center justify-center rounded-lg border border-dashed border-border-strong text-[9.5px] text-text-tertiary">等待生成</div>}</div><div className="text-right">{batchGenerated ? <span className="text-[10px] font-medium text-emerald-700">已推荐</span> : <span className="text-[10px] text-text-tertiary">待生成</span>}</div></div>)}</section>
            {batchGenerated ? <div className="flex items-center justify-between rounded-xl border border-border-default bg-surface-1 p-3"><div className="text-[10.5px] text-text-secondary">已为3篇笔记各生成3个候选，采用版才会保存为衍生素材。</div><button type="button" disabled={Boolean(notice)} onClick={() => { NOTE_ROWS.forEach((_, index) => onCreateDerived(imageAssets.slice(index, index + 2).map(asset => asset.id), TEMPLATE_GROUPS.find(group => group.id === selectedTemplate)?.name ?? '模板组', 'cover')); setNotice('3篇封面已绑定笔记，并写入素材版本关系。'); }} className="rounded-lg bg-btn-main px-4 py-2 text-[11px] font-medium text-white disabled:opacity-50">{notice ? '推荐版本已采用' : '确认采用推荐版本'}</button></div> : null}
            {notice ? <div className="rounded-lg bg-emerald-50 p-3 text-[10.5px] text-emerald-700">{notice}</div> : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-page-bg p-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="rounded-2xl border border-border-default bg-surface-1 p-5">
          <div className="flex items-start justify-between gap-5">
            <div><div className="flex items-center gap-2 text-[13px] font-semibold text-text-main"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-logo"><Sparkles size={15} /></span>素材Agent已在后台完成准备</div><p className="mt-2 max-w-2xl text-[11px] leading-5 text-text-secondary">新回传已完成质量预检和相似图聚类；等待素材的笔记已生成视觉槽位。你只需要进入对应工作台确认结果。</p></div><div className="rounded-xl bg-surface-subtle px-4 py-3 text-right"><div className="text-[9.5px] text-text-tertiary">今日预计节省</div><div className="mt-0.5 text-[19px] font-semibold text-text-main">42 <span className="text-[10px] font-normal">分钟</span></div></div>
          </div>
        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border-subtle pt-4"><div><div className="text-[10px] text-text-tertiary">待快审</div><div className="mt-1 text-[16px] font-semibold text-text-main">{reviewItems.length} <span className="text-[9.5px] font-normal">张</span></div></div><div><div className="text-[10px] text-text-tertiary">已自动匹配槽位</div><div className="mt-1 text-[16px] font-semibold text-text-main">8/10</div></div><div><div className="text-[10px] text-text-tertiary">可直接生成图组</div><div className="mt-1 text-[16px] font-semibold text-text-main">2 <span className="text-[9.5px] font-normal">篇</span></div></div></div>
        </div>
        <div>
          <div className="mb-3 flex items-center justify-between"><div><h3 className="text-[13px] font-semibold text-text-main">快速开始</h3><p className="mt-0.5 text-[10px] text-text-tertiary">相同素材操作统一在一个工作台完成。</p></div></div>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{TOOL_CARDS.map(tool => { const Icon = tool.icon; const disabled = tool.id === 'review' && reviewItems.length === 0; return <button key={tool.id} type="button" disabled={disabled} onClick={() => setActiveTool(tool.id)} className="group rounded-xl border border-border-default bg-surface-1 p-4 text-left transition-all hover:border-border-strong hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-55"><div className="flex items-start justify-between"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-subtle text-text-main group-hover:bg-brand-50 group-hover:text-brand-logo"><Icon size={17} /></span><ArrowRight size={14} className="text-text-tertiary" /></div><div className="mt-4 text-[12.5px] font-semibold text-text-main">{tool.title}</div><p className="mt-1 min-h-10 text-[10.5px] leading-5 text-text-secondary">{tool.description}</p><div className="mt-3 text-[9.5px] font-medium text-text-tertiary">{disabled ? '当前没有待审素材' : tool.meta}</div></button>; })}</div>
        </div>
        <div className="grid grid-cols-[1.35fr_1fr] gap-4">
          <section className="rounded-xl border border-border-default bg-surface-1 p-4"><div className="flex items-center justify-between"><div><h4 className="text-[12px] font-semibold text-text-main">当前装配进度</h4><p className="mt-0.5 text-[10px] text-text-tertiary">按笔记槽位展示，不需要逐张翻找素材。</p></div><button type="button" onClick={() => setActiveTool('assembly')} className="text-[10.5px] font-medium text-text-main">查看全部</button></div><div className="mt-3 space-y-2">{NOTE_ROWS.slice(0,2).map((note,index) => <button key={note.id} type="button" onClick={() => setActiveTool('assembly')} className="flex w-full items-center justify-between rounded-lg bg-surface-subtle p-3 text-left hover:bg-hover-bg"><div className="min-w-0"><div className="truncate text-[11px] font-medium text-text-main">{note.title}</div><div className="mt-1 text-[9.5px] text-text-tertiary">{note.matched}/{note.slots.length} 个视觉槽位已匹配</div></div><span className={`ml-3 shrink-0 rounded-md px-2 py-1 text-[9.5px] ${index === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{index === 0 ? '可生成' : '缺1项'}</span></button>)}</div></section>
          <section className="rounded-xl border border-border-default bg-surface-1 p-4"><div className="flex items-center gap-2"><RefreshCw size={14} className="text-text-secondary" /><h4 className="text-[12px] font-semibold text-text-main">后台联动</h4></div><div className="mt-3 space-y-3 text-[10.5px] leading-4 text-text-secondary"><div className="flex gap-2"><CheckCircle2 size={13} className="mt-0.5 shrink-0 text-emerald-600" /><span>回传素材已匹配到2篇等待中的笔记。</span></div><div className="flex gap-2"><CheckCircle2 size={13} className="mt-0.5 shrink-0 text-emerald-600" /><span>3张相似连拍已折叠，保留最佳画面。</span></div><div className="flex gap-2"><CircleAlert size={13} className="mt-0.5 shrink-0 text-amber-600" /><span>1个视觉槽位仍需补充真实体验素材。</span></div></div></section>
        </div>
      </div>
    </div>
  );
};
