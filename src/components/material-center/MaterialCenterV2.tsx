import React, { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  Check,
  ChevronDown,
  Crop,
  Download,
  Eraser,
  Filter,
  FolderOpen,
  HardDrive,
  History,
  Images,
  MoreHorizontal,
  Plus,
  RotateCw,
  Search,
  Tag,
  Trash2,
  Type,
  Upload,
  X
} from 'lucide-react';
import { MaterialAsset } from './types';
import { INITIAL_ASSETS } from './mockData';
import { MaterialAssetCardV2, MaterialCardMode } from './MaterialAssetCardV2';
import { MaterialDetailDrawer } from './MaterialDetailDrawer';
import { DerivativeIntent, DerivativeOutputMode, MaterialDerivativeWorkbench } from './MaterialDerivativeWorkbench';
import { UploadModal } from './UploadModal';
import { MATERIAL_USE_LABELS } from './materialLabels';
import { BatchProcessTool, MaterialBatchWorkbench } from './MaterialBatchWorkbench';

interface MaterialCenterV2Props {
  activeProject?: { name?: string };
  importedAssets?: MaterialAsset[];
}

type CenterView = 'available' | 'reserved' | 'optimize' | 'used' | 'archived';
interface WorkbenchSession {
  sources: MaterialAsset[];
  intent: DerivativeIntent;
}

const OPERATOR_TAGS = ['9月新品', '门店实拍', 'KOC反馈', '高质量封面'];
const VISIBLE_OPERATOR_TAG_LIMIT = 3;
const OPTIMIZATION_HINTS: Record<string, string> = {
  'MAT-2026-002': '光线偏暖，已准备一版自然提亮结果，保留真实拍摄质感。',
  'MAT-2026-005': '顶部标题安全区偏窄，已准备3:4扩图和裁切结果。'
};
const AI_CLUSTER_RULES = [
  { id: 'experience', label: '宠物与体验', description: '宠物主体、进食、开箱和真实体验', keywords: ['犬', '猫', '进食', '开箱', 'KOC', '换粮', '体验'] },
  { id: 'product', label: '产品与包装', description: '产品特写、粮粒、包装和透明底产品图', keywords: ['产品', '主粮', '粮粒', '包装', '抠图', '3D'] },
  { id: 'scene', label: '门店与场景', description: '门店、探店、桌面、生活化拍摄场景', keywords: ['门店', '探店', '场景', '生活感', '桌面', '迎宾'] },
  { id: 'brand', label: '品牌素材', description: 'Logo、色板、水印和视觉规范', keywords: ['品牌', 'Logo', '色板', '水印', 'VI', '规范'] }
] as const;

const matchesAICluster = (asset: MaterialAsset, clusterId: string) => {
  const cluster = AI_CLUSTER_RULES.find(item => item.id === clusterId);
  if (!cluster) return false;
  const searchable = [asset.name, asset.vectorDescription, ...(asset.tags ?? [])].filter(Boolean).join(' ');
  return cluster.keywords.some(keyword => searchable.includes(keyword));
};

const addOperatorTags = (asset: MaterialAsset): MaterialAsset => {
  const mapping: Record<string, string[]> = {
    'MAT-2026-005': ['9月新品', '高质量封面'],
    'MAT-2026-002': ['KOC反馈'],
    'MAT-2026-003': ['门店实拍'],
    'MAT-2026-PENDING-01': ['KOC反馈']
  };
  return { ...asset, tags: Array.from(new Set([...(asset.tags ?? []), ...(mapping[asset.id] ?? [])])) };
};

const INITIAL_MATERIALS = INITIAL_ASSETS.filter(asset => asset.status !== 'pending_acceptance').map(addOperatorTags);

const VIEW_CONFIG: Array<{ id: Extract<CenterView, 'available' | 'reserved' | 'optimize'>; label: string }> = [
  { id: 'available', label: '可用素材' },
  { id: 'reserved', label: '已占用' },
  { id: 'optimize', label: '待优化' }
];

export const MaterialCenterV2: React.FC<MaterialCenterV2Props> = ({ importedAssets = [] }) => {
  const [assets, setAssets] = useState<MaterialAsset[]>(() => [...importedAssets, ...INITIAL_MATERIALS]);
  const [activeView, setActiveView] = useState<CenterView>('available');
  const [activeTag, setActiveTag] = useState('全部');
  const [customTags, setCustomTags] = useState(OPERATOR_TAGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUse, setSelectedUse] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedProject, setSelectedProject] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [showSmartClusters, setShowSmartClusters] = useState(false);
  const [showHistoryMenu, setShowHistoryMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showStoragePanel, setShowStoragePanel] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedAssetForDetail, setSelectedAssetForDetail] = useState<MaterialAsset | null>(null);
  const [optimizationIds, setOptimizationIds] = useState(() => new Set(Object.keys(OPTIMIZATION_HINTS)));
  const [workbenchSession, setWorkbenchSession] = useState<WorkbenchSession | null>(null);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [selectedAssetIds, setSelectedAssetIds] = useState(() => new Set<string>());
  const [showTagModal, setShowTagModal] = useState(false);
  const [batchWorkbenchTool, setBatchWorkbenchTool] = useState<BatchProcessTool | null>(null);
  const [showBatchMoreMenu, setShowBatchMoreMenu] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const imageAssets = useMemo(() => assets.filter(asset => asset.fileType === 'image'), [assets]);
  useEffect(() => {
    if (importedAssets.length === 0) return;
    setAssets(current => {
      const importedIds = new Set(importedAssets.map(asset => asset.id));
      return [...importedAssets, ...current.filter(asset => !importedIds.has(asset.id))];
    });
  }, [importedAssets]);
  const projects = useMemo(() => Array.from(new Set(imageAssets.map(asset => asset.sourceProject).filter((project): project is string => Boolean(project)))), [imageAssets]);
  const customTagStats = useMemo(() => customTags.map(tagName => ({
    name: tagName,
    count: imageAssets.filter(asset => (asset.tags ?? []).includes(tagName)).length
  })).sort((left, right) => right.count - left.count), [customTags, imageAssets]);
  const visibleCustomTags = customTagStats.slice(0, VISIBLE_OPERATOR_TAG_LIMIT);
  const hiddenCustomTags = customTagStats.slice(VISIBLE_OPERATOR_TAG_LIMIT);
  const smartClusters = useMemo(() => AI_CLUSTER_RULES.map(cluster => ({
    ...cluster,
    count: imageAssets.filter(asset => matchesAICluster(asset, cluster.id)).length,
    samples: imageAssets.filter(asset => matchesAICluster(asset, cluster.id)).slice(0, 3)
  })).filter(cluster => cluster.count > 0), [imageAssets]);

  const counts = useMemo(() => ({
    available: imageAssets.filter(asset => asset.status === 'available' && !optimizationIds.has(asset.id)).length,
    reserved: imageAssets.filter(asset => asset.status === 'reserved').length,
    optimize: imageAssets.filter(asset => optimizationIds.has(asset.id) && asset.status !== 'archived').length,
    used: imageAssets.filter(asset => asset.status === 'used').length,
    archived: imageAssets.filter(asset => asset.status === 'archived').length
  }), [imageAssets, optimizationIds]);

  const visibleAssets = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return imageAssets.filter(asset => {
      if (activeView === 'available' && (asset.status !== 'available' || optimizationIds.has(asset.id))) return false;
      if (activeView === 'reserved' && asset.status !== 'reserved') return false;
      if (activeView === 'optimize' && (!optimizationIds.has(asset.id) || asset.status === 'archived')) return false;
      if (activeView === 'used' && asset.status !== 'used') return false;
      if (activeView === 'archived' && asset.status !== 'archived') return false;
      if (activeTag.startsWith('ai:') && !matchesAICluster(asset, activeTag.slice(3))) return false;
      if (activeTag !== '全部' && !activeTag.startsWith('ai:') && !(asset.tags ?? []).includes(activeTag)) return false;
      if (selectedUse !== 'all' && asset.materialUse !== selectedUse) return false;
      if (selectedSource !== 'all' && asset.sourceType !== selectedSource) return false;
      if (selectedProject !== 'all' && asset.sourceProject !== selectedProject) return false;
      if (!normalizedQuery) return true;
      return [asset.name, asset.id, asset.sourceLabel, asset.sourceProject, asset.vectorDescription, ...(asset.tags ?? [])]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(normalizedQuery));
    });
  }, [imageAssets, activeView, activeTag, searchQuery, selectedUse, selectedSource, selectedProject, optimizationIds]);

  const cardMode: MaterialCardMode = activeView === 'optimize'
      ? 'optimize'
      : activeView === 'used' || activeView === 'archived' || activeView === 'reserved'
        ? 'history'
        : 'available';

  const filtersActive = selectedUse !== 'all' || selectedSource !== 'all' || selectedProject !== 'all';
  const selectedCount = selectedAssetIds.size;
  const batchSelectedAssets = useMemo(() => imageAssets.filter(asset => selectedAssetIds.has(asset.id)), [imageAssets, selectedAssetIds]);

  const resetSelection = () => {
    setSelectedAssetIds(new Set());
    setIsBatchMode(false);
  };

  const switchView = (view: CenterView) => {
    setActiveView(view);
    setActiveTag('全部');
    setShowHistoryMenu(false);
    resetSelection();
  };

  const toggleSelected = (assetId: string) => {
    setSelectedAssetIds(current => {
      const next = new Set(current);
      if (next.has(assetId)) next.delete(assetId);
      else next.add(assetId);
      return next;
    });
  };

  const selectAllVisible = () => {
    setSelectedAssetIds(current => {
      const allVisibleSelected = visibleAssets.length > 0 && visibleAssets.every(asset => current.has(asset.id));
      if (allVisibleSelected) return new Set();
      return new Set(visibleAssets.map(asset => asset.id));
    });
  };


  const openWorkbenchForAsset = (asset: MaterialAsset) => {
    setSelectedAssetForDetail(null);
    setWorkbenchSession({
      sources: [asset],
      intent: optimizationIds.has(asset.id) ? 'optimize' : 'derive'
    });
  };

  const saveProcessedAssets = (sources: MaterialAsset[], recipe: string, outputMode: DerivativeOutputMode) => {
    const timestamp = Date.now();
    const sourceNames = sources.map(asset => asset.name).join('、');
    const recipeTitle = recipe.split('→')[0].split('·')[0].replace(/^\d+\./, '').replace(/（.*$/, '').trim() || 'AI处理';
    const targets = outputMode === 'fusion' ? [sources[0]] : sources;
    const derivedAssets = targets.map((asset, index): MaterialAsset => ({
      ...asset,
      id: `MAT-DERIVED-${timestamp}-${index + 1}`,
      name: outputMode === 'fusion' ? `${asset.name} · 多图融合` : `${asset.name} · ${recipeTitle}`,
      category: 'derived_material',
      status: 'available',
      sourceType: 'ai_derived',
      sourceLabel: 'AI图片处理',
      uploader: '素材Agent',
      uploadTime: '刚刚',
      usageRelation: undefined,
      tags: Array.from(new Set([...(asset.tags ?? []), outputMode === 'fusion' ? '多图融合' : 'AI生成图片'])),
      vectorDescription: outputMode === 'fusion'
        ? `由${sourceNames}融合生成，原图与关联关系均保留。`
        : `基于原图完成${recipe}，原图与关联关系均保留。`,
      performance: { hasBackendData: false, performanceType: 'none' },
      lineage: {
        parentId: asset.id,
        parentName: asset.name,
        parentUrl: asset.url,
        modificationType: recipe,
        generatorService: 'TapTik 素材Agent',
        promptUsed: outputMode === 'fusion' ? `参考素材：${sourceNames}` : undefined
      },
      acceptance: {
        ...asset.acceptance,
        manualAcceptance: { operatorName: '当前操盘手', time: '刚刚', passed: true, comment: '已确认采用处理结果' }
      }
    }));
    const handledIds = new Set(sources.map(asset => asset.id));
    setAssets(current => [...derivedAssets, ...current]);
    setOptimizationIds(current => new Set([...current].filter(id => !handledIds.has(id))));
    setWorkbenchSession(null);
    setBatchWorkbenchTool(null);
    setNotice(outputMode === 'each' ? `已生成 ${derivedAssets.length} 张新图片，原图均已保留。` : '新图片已保存到可用素材，原图与原关系保持不变。');
    setActiveView('available');
    setActiveTag('全部');
    resetSelection();
  };

  const saveDerivedAssets = (recipe: string, outputMode: DerivativeOutputMode) => {
    if (!workbenchSession) return;
    saveProcessedAssets(workbenchSession.sources, recipe, outputMode);
  };

  const addTag = () => {
    const tagName = newTagName.trim();
    if (!tagName) return;
    setCustomTags(current => current.includes(tagName) ? current : [...current, tagName]);
    if (selectedCount > 0) {
      setAssets(current => current.map(asset => selectedAssetIds.has(asset.id)
        ? { ...asset, tags: Array.from(new Set([...(asset.tags ?? []), tagName])) }
        : asset));
      setNotice(`已为${selectedCount}张图片添加标签“${tagName}”。`);
    } else {
      setNotice(`标签“${tagName}”已创建，可在批量管理中归类素材。`);
    }
    setNewTagName('');
    setShowTagModal(false);
  };

  const applyBatchTag = (tagName: string) => {
    setAssets(current => current.map(asset => selectedAssetIds.has(asset.id)
      ? { ...asset, tags: Array.from(new Set([...(asset.tags ?? []), tagName])) }
      : asset));
    setShowTagModal(false);
    setNotice(`已将${selectedCount}张图片归类到“${tagName}”。`);
    resetSelection();
  };

  const deleteSelected = () => {
    setAssets(current => current.filter(asset => !selectedAssetIds.has(asset.id)));
    setOptimizationIds(current => new Set([...current].filter(id => !selectedAssetIds.has(id))));
    setShowDeleteConfirm(false);
    setNotice(`已删除${selectedCount}张图片。`);
    resetSelection();
  };

  const activeViewTitle = activeView === 'used' ? '已使用素材' : activeView === 'archived' ? '已归档素材' : VIEW_CONFIG.find(item => item.id === activeView)?.label;

  return (
    <div className="workspace-shell material-workspace flex h-full min-h-0 flex-col overflow-hidden bg-page-bg text-text-primary">
      <header className="shrink-0 border-b border-border-default bg-surface-1">
        <div className="workspace-header flex items-center justify-between gap-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-[18px] font-semibold tracking-tight text-text-main">素材中心</h1>
              <span className="rounded-md border border-border-default bg-surface-subtle px-1.5 py-0.5 text-[13px] text-text-tertiary">{counts.available}张可用</span>
            </div>
            <p className="mt-1 text-[13px] text-text-secondary">管理已验收或主动上传的正式素材，快速确认哪些可用、已占用或需要优化。</p>
          </div>
          <div className="relative flex shrink-0 items-center gap-2">
            <button type="button" onClick={() => { setIsBatchMode(current => !current); setSelectedAssetIds(new Set()); }} className="rounded-lg border border-border-default bg-surface-1 px-3 py-2 text-[13px] font-medium text-text-main hover:bg-hover-bg">{isBatchMode ? '退出批量' : '批量管理'}</button>
            <button type="button" onClick={() => setShowUploadModal(true)} className="flex items-center gap-1.5 rounded-lg bg-btn-main px-4 py-2 text-[13px] font-medium text-white hover:bg-btn-main-hover"><Upload size={13} />上传素材</button>
            <button type="button" onClick={() => setShowMoreMenu(current => !current)} className="rounded-lg border border-border-default p-2 text-text-secondary hover:bg-hover-bg" aria-label="更多素材中心操作"><MoreHorizontal size={15} /></button>
            {showMoreMenu ? (
              <div className="absolute right-0 top-11 z-30 w-40 rounded-xl border border-border-default bg-surface-1 p-1.5 shadow-lg">
                <button type="button" onClick={() => { setShowStoragePanel(true); setShowMoreMenu(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] text-text-main hover:bg-hover-bg"><HardDrive size={12} />存储与清理</button>
              </div>
            ) : null}
          </div>
        </div>

        <nav className="workspace-toolbar flex h-12 items-center gap-7 border-t border-border-subtle" aria-label="素材状态">
          {VIEW_CONFIG.map(view => {
            const active = activeView === view.id;
            return (
              <button key={view.id} type="button" onClick={() => switchView(view.id)} className={`relative flex h-full items-center gap-2 px-0.5 text-[13px] ${active ? 'font-semibold text-text-main' : 'font-medium text-text-secondary hover:text-text-main'}`}>
                {view.label}
                <span className={`rounded-full px-1.5 py-0.5 text-[13px] ${active ? 'bg-neutral-900 text-white' : 'bg-surface-subtle text-text-tertiary'}`}>{counts[view.id]}</span>
                {active ? <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-neutral-900" /> : null}
              </button>
            );
          })}
          <div className="relative ml-auto">
            <button type="button" onClick={() => setShowHistoryMenu(current => !current)} className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium ${activeView === 'used' || activeView === 'archived' ? 'bg-surface-subtle text-text-main' : 'text-text-secondary hover:bg-hover-bg'}`}><History size={12} />历史素材<ChevronDown size={11} /></button>
            {showHistoryMenu ? (
              <div className="absolute right-0 top-9 z-30 w-40 rounded-xl border border-border-default bg-surface-1 p-1.5 shadow-lg">
                <button type="button" onClick={() => switchView('used')} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-[13px] text-text-main hover:bg-hover-bg"><span>已使用</span><span className="text-text-tertiary">{counts.used}</span></button>
                <button type="button" onClick={() => switchView('archived')} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-[13px] text-text-main hover:bg-hover-bg"><span>已归档</span><span className="text-text-tertiary">{counts.archived}</span></button>
              </div>
            ) : null}
          </div>
        </nav>
      </header>

      <div className="workspace-stage min-h-0 flex-1 overflow-y-auto custom-scrollbar">
        <div className="mx-auto max-w-[1500px] space-y-4">
          <section className="workspace-surface workspace-filterbar rounded-xl border border-border-default bg-surface-1 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[260px] max-w-lg flex-1">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder="搜索素材或标签…" className="w-full rounded-lg border border-border-default bg-surface-subtle py-2 pl-8 pr-8 text-[13px] text-text-main outline-none focus:border-border-strong" />
                {searchQuery ? <button type="button" onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" aria-label="清空素材搜索"><X size={12} /></button> : null}
              </div>
              <button type="button" onClick={() => setShowFilters(current => !current)} className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[13px] font-medium ${showFilters || filtersActive ? 'border-border-strong bg-surface-subtle text-text-main' : 'border-border-default text-text-secondary'}`}><Filter size={12} />筛选{filtersActive ? ' · 已启用' : ''}</button>
              <span className="ml-auto text-[13px] text-text-tertiary">{visibleAssets.length}张图片</span>
            </div>

            <div className="mt-3 flex items-center gap-1.5 border-t border-border-subtle pt-3">
              <button type="button" onClick={() => setActiveTag('全部')} className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[13px] font-medium ${activeTag === '全部' ? 'bg-btn-main text-white' : 'bg-surface-subtle text-text-secondary hover:text-text-main'}`}>全部</button>
              {visibleCustomTags.map(tag => (
                <button key={tag.name} type="button" onClick={() => setActiveTag(tag.name)} className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[13px] font-medium ${activeTag === tag.name ? 'bg-btn-main text-white' : 'bg-surface-subtle text-text-secondary hover:text-text-main'}`}>{tag.name}<span className={`ml-1 ${activeTag === tag.name ? 'text-white/70' : 'text-text-tertiary'}`}>{tag.count}</span></button>
              ))}

              <div className="relative">
                <button type="button" onClick={() => { setShowTagMenu(current => !current); setShowSmartClusters(false); }} className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[13px] font-medium ${hiddenCustomTags.some(tag => tag.name === activeTag) ? 'bg-btn-main text-white' : 'bg-surface-subtle text-text-secondary hover:text-text-main'}`}>更多标签<ChevronDown size={10} /></button>
                {showTagMenu ? (
                  <div className="absolute left-0 top-9 z-30 w-56 rounded-xl border border-border-default bg-surface-1 p-2 shadow-lg">
                    <div className="px-2 pb-1 text-[13px] text-text-tertiary">手动标签 · 用于日常归类</div>
                    {hiddenCustomTags.length > 0 ? hiddenCustomTags.map(tag => <button key={tag.name} type="button" onClick={() => { setActiveTag(tag.name); setShowTagMenu(false); }} className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-[13px] text-text-main hover:bg-hover-bg"><span>{tag.name}</span><span className="text-text-tertiary">{tag.count}</span></button>) : <div className="px-2 py-2 text-[13px] text-text-tertiary">暂无更多标签</div>}
                    <button type="button" onClick={() => { setShowTagMenu(false); setShowTagModal(true); }} className="mt-1 flex w-full items-center gap-1.5 border-t border-border-subtle px-2 pt-2 text-[13px] font-medium text-text-secondary"><Plus size={11} />新建手动标签</button>
                  </div>
                ) : null}
              </div>

              <div className="relative">
                <button type="button" onClick={() => { setShowSmartClusters(current => !current); setShowTagMenu(false); }} className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[13px] font-medium ${activeTag.startsWith('ai:') ? 'border-neutral-900 bg-neutral-100 text-neutral-900' : 'border-border-default text-text-secondary hover:bg-hover-bg'}`}><Images size={11} />智能归类 · {smartClusters.length}组<ChevronDown size={10} /></button>
                {showSmartClusters ? (
                  <div className="absolute left-0 top-9 z-30 w-[360px] rounded-xl border border-border-default bg-surface-1 p-2 shadow-lg">
                    <div className="px-2 pb-2"><div className="text-[13px] font-medium text-text-main">AI自动合并同类素材</div><p className="mt-0.5 text-[13px] text-text-tertiary">不铺开全部AI标签，只显示有素材的语义分组。</p></div>
                    <div className="space-y-1">
                      {smartClusters.map(cluster => <button key={cluster.id} type="button" onClick={() => { setActiveTag(`ai:${cluster.id}`); setShowSmartClusters(false); }} className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-hover-bg"><div className="flex -space-x-2">{cluster.samples.map(asset => <img key={asset.id} src={asset.url} alt="" className="h-8 w-8 rounded-md border-2 border-white object-cover" />)}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between"><span className="text-[13px] font-medium text-text-main">{cluster.label}</span><span className="text-[13px] text-text-tertiary">{cluster.count}项</span></div><p className="mt-0.5 truncate text-[13px] text-text-tertiary">{cluster.description}</p></div></button>)}
                    </div>
                  </div>
                ) : null}
              </div>
              <span className="ml-auto text-[13px] text-text-tertiary">AI标签用于搜索，手动标签用于归类</span>
            </div>

            {showFilters ? (
              <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border-subtle pt-3">
                <select value={selectedUse} onChange={event => setSelectedUse(event.target.value)} className="rounded-lg border border-border-default bg-surface-1 px-2.5 py-2 text-[13px] text-text-secondary"><option value="all">所有用途</option>{Object.entries(MATERIAL_USE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
                <select value={selectedSource} onChange={event => setSelectedSource(event.target.value)} className="rounded-lg border border-border-default bg-surface-1 px-2.5 py-2 text-[13px] text-text-secondary"><option value="all">所有来源</option><option value="merchant">商家上传</option><option value="task_upload">任务回传</option><option value="koc">KOC回传</option><option value="ai_derived">AI生成图片</option></select>
                <div className="flex gap-2">
                  <select value={selectedProject} onChange={event => setSelectedProject(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-border-default bg-surface-1 px-2.5 py-2 text-[13px] text-text-secondary"><option value="all">所有方案</option>{projects.map(project => <option key={project} value={project}>{project}</option>)}</select>
                  {filtersActive ? <button type="button" onClick={() => { setSelectedUse('all'); setSelectedSource('all'); setSelectedProject('all'); }} className="flex items-center gap-1 rounded-lg px-2.5 text-[13px] text-text-tertiary hover:bg-hover-bg"><RotateCw size={11} />重置</button> : null}
                </div>
              </div>
            ) : null}
          </section>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[13px] font-semibold text-text-main">{activeViewTitle}</h2>
              <p className="mt-0.5 text-[13px] text-text-tertiary">
                {activeView === 'available' ? '只展示当前未被笔记占用、可以继续匹配的素材。' : null}
                {activeView === 'reserved' ? '素材已绑定到具体笔记，不再参与其他笔记的自动匹配。' : null}
                {activeView === 'optimize' ? '问题和候选结果都已准备，打开后选择采用即可。' : null}
                {activeView === 'used' ? '已使用图片保留原关系，也可以基于它生成新图片。' : null}
                {activeView === 'archived' ? '历史素材默认不参与笔记匹配。' : null}
              </p>
            </div>
            {isBatchMode ? <button type="button" onClick={selectAllVisible} className="text-[13px] font-medium text-text-secondary hover:text-text-main">{visibleAssets.length > 0 && visibleAssets.every(asset => selectedAssetIds.has(asset.id)) ? '取消全选' : '全选当前结果'}</button> : null}
          </div>

          {visibleAssets.length > 0 ? (
            <div className="workspace-material-grid grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {visibleAssets.map(asset => (
                <MaterialAssetCardV2
                  key={asset.id}
                  asset={asset}
                  mode={cardMode}
                  primaryTag={(asset.tags ?? []).find(tagName => customTags.includes(tagName)) ?? (asset.tags?.[0] ? `AI · ${asset.tags[0]}` : undefined)}
                  isBatchMode={isBatchMode}
                  isSelected={selectedAssetIds.has(asset.id)}
                  onToggleSelect={toggleSelected}
                  onOpenDetail={setSelectedAssetForDetail}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border-default bg-surface-1 px-6 py-14 text-center">
              <FolderOpen size={28} className="mx-auto text-text-tertiary" />
              <h3 className="mt-3 text-[13px] font-semibold text-text-main">当前没有需要处理的素材</h3>
              <p className="mt-1 text-[13px] text-text-tertiary">切换标签或调整筛选条件即可查看其他素材。</p>
            </div>
          )}

          {isBatchMode && selectedCount > 0 ? (
            <div className="sticky bottom-3 z-20 mx-auto flex max-w-4xl items-center justify-between rounded-xl border border-border-strong bg-surface-1 px-4 py-3 shadow-xl">
              <div className="shrink-0 text-[13px] font-medium text-text-main">已选 {selectedCount} 张</div>
              <div className="ml-4 flex items-center gap-1.5">
                <button type="button" onClick={() => setBatchWorkbenchTool('resize')} className="flex items-center gap-1 rounded-lg border border-border-default px-2.5 py-1.5 text-[13px] font-medium text-text-secondary hover:bg-hover-bg"><Crop size={11} />改尺寸</button>
                <button type="button" onClick={() => setBatchWorkbenchTool('watermark')} className="flex items-center gap-1 rounded-lg border border-border-default px-2.5 py-1.5 text-[13px] font-medium text-text-secondary hover:bg-hover-bg"><Eraser size={11} />清理水印</button>
                <button type="button" onClick={() => setBatchWorkbenchTool('text')} className="flex items-center gap-1 rounded-lg border border-border-default px-2.5 py-1.5 text-[13px] font-medium text-text-secondary hover:bg-hover-bg"><Type size={11} />添加文字/Logo</button>
                <button type="button" onClick={() => setShowTagModal(true)} className="flex items-center gap-1 rounded-lg border border-border-default px-2.5 py-1.5 text-[13px] font-medium text-text-secondary hover:bg-hover-bg"><Tag size={11} />归类</button>
                <div className="relative">
                  <button type="button" onClick={() => setShowBatchMoreMenu(current => !current)} className="flex items-center gap-1 rounded-lg bg-btn-main px-2.5 py-1.5 text-[13px] font-medium text-white">更多<ChevronDown size={11} /></button>
                  {showBatchMoreMenu ? <div className="absolute bottom-10 right-0 z-30 w-48 rounded-xl border border-border-default bg-white p-1.5 shadow-xl">
                    <button type="button" onClick={() => { setBatchWorkbenchTool('compress'); setShowBatchMoreMenu(false); }} className="w-full rounded-lg px-3 py-2 text-left text-[13px] hover:bg-hover-bg">压缩与转换格式</button>
                    <button type="button" onClick={() => { setBatchWorkbenchTool('tone'); setShowBatchMoreMenu(false); }} className="w-full rounded-lg px-3 py-2 text-left text-[13px] hover:bg-hover-bg">统一色调</button>
                    <button type="button" onClick={() => { setBatchWorkbenchTool('background'); setShowBatchMoreMenu(false); }} className="w-full rounded-lg px-3 py-2 text-left text-[13px] hover:bg-hover-bg">批量替换背景</button>
                    {batchSelectedAssets.length > 1 ? <button type="button" onClick={() => { setWorkbenchSession({ sources: batchSelectedAssets, intent: 'fusion' }); setShowBatchMoreMenu(false); }} className="w-full rounded-lg px-3 py-2 text-left text-[13px] hover:bg-hover-bg">多图融合为一张</button> : null}
                    <button type="button" onClick={() => { setNotice(`已开始打包下载${selectedCount}张图片。`); setShowBatchMoreMenu(false); }} className="flex w-full items-center gap-1.5 rounded-lg px-3 py-2 text-left text-[13px] hover:bg-hover-bg"><Download size={11} />下载</button>
                    <button type="button" onClick={() => { setShowDeleteConfirm(true); setShowBatchMoreMenu(false); }} className="flex w-full items-center gap-1.5 rounded-lg px-3 py-2 text-left text-[13px] text-red-600 hover:bg-red-50"><Trash2 size={11} />删除</button>
                  </div> : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {notice ? (
        <div className="fixed bottom-6 left-1/2 z-[150] flex -translate-x-1/2 items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-[13px] text-white shadow-xl">
          <Check size={12} />{notice}<button type="button" onClick={() => setNotice(null)} className="ml-2 text-white/70" aria-label="关闭提示"><X size={11} /></button>
        </div>
      ) : null}

      <MaterialDetailDrawer
        asset={selectedAssetForDetail}
        manualTags={customTags}
        canCreateDerived={Boolean(selectedAssetForDetail && (selectedAssetForDetail.status === 'available' || selectedAssetForDetail.status === 'used' || optimizationIds.has(selectedAssetForDetail.id)))}
        isOptimizationCandidate={Boolean(selectedAssetForDetail && optimizationIds.has(selectedAssetForDetail.id))}
        onCreateDerived={openWorkbenchForAsset}
        onManualTagsChange={tags => setCustomTags(current => Array.from(new Set([...current, ...tags])))}
        onClose={() => setSelectedAssetForDetail(null)}
        onUpdateAsset={updated => { setAssets(current => current.map(asset => asset.id === updated.id ? updated : asset)); setSelectedAssetForDetail(updated); }}
      />
      <UploadModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} onUploadSuccess={asset => setAssets(current => [addOperatorTags(asset), ...current])} />

      {workbenchSession ? <MaterialDerivativeWorkbench sourceAssets={workbenchSession.sources} availableAssets={imageAssets.filter(asset => asset.status === 'available' && !optimizationIds.has(asset.id))} initialIntent={workbenchSession.intent} onClose={() => setWorkbenchSession(null)} onSave={saveDerivedAssets} /> : null}
      {batchWorkbenchTool ? <MaterialBatchWorkbench assets={batchSelectedAssets} initialTool={batchWorkbenchTool} onClose={() => setBatchWorkbenchTool(null)} onSave={(recipe, completedAssetIds) => saveProcessedAssets(batchSelectedAssets.filter(asset => completedAssetIds.includes(asset.id)), recipe, 'each')} /> : null}

      {showTagModal ? (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/30 p-4" onClick={() => setShowTagModal(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-surface-1 p-5 shadow-2xl" onClick={event => event.stopPropagation()}>
            <div className="flex items-start justify-between"><div><h2 className="text-[14px] font-semibold text-text-main">{selectedCount > 0 ? '为素材添加标签' : '新建标签'}</h2><p className="mt-1 text-[13px] text-text-tertiary">标签会像文件夹一样聚合素材，不改变素材来源。</p></div><button type="button" onClick={() => setShowTagModal(false)} className="p-1 text-text-tertiary" aria-label="关闭标签窗口"><X size={14} /></button></div>
            {selectedCount > 0 ? <div className="mt-4"><div className="text-[13px] font-medium text-text-main">选择已有标签</div><div className="mt-2 flex flex-wrap gap-2">{customTags.map(tagName => <button key={tagName} type="button" onClick={() => applyBatchTag(tagName)} className="rounded-lg border border-border-default px-2.5 py-1.5 text-[13px] text-text-secondary hover:border-neutral-700 hover:bg-hover-bg">{tagName}</button>)}</div></div> : null}
            <div className="mt-4 border-t border-border-subtle pt-4"><label htmlFor="new-material-tag" className="text-[13px] font-medium text-text-main">{selectedCount > 0 ? '或者新建标签' : '标签名称'}</label><input id="new-material-tag" autoFocus value={newTagName} onChange={event => setNewTagName(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') addTag(); }} placeholder="例如：9月新品、青岛门店" className="mt-2 w-full rounded-lg border border-border-default px-3 py-2.5 text-[13px] outline-none focus:border-border-strong" /></div>
            <div className="mt-4 flex justify-end gap-2"><button type="button" onClick={() => setShowTagModal(false)} className="rounded-lg px-3 py-2 text-[13px] text-text-secondary">取消</button><button type="button" onClick={addTag} disabled={!newTagName.trim()} className="rounded-lg bg-btn-main px-4 py-2 text-[13px] font-medium text-white disabled:opacity-40">新建并归类</button></div>
          </div>
        </div>
      ) : null}

      {showDeleteConfirm ? (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/30 p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-surface-1 p-5 shadow-2xl" onClick={event => event.stopPropagation()}>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600"><Trash2 size={16} /></div>
            <h2 className="mt-3 text-[14px] font-semibold text-text-main">删除所选素材？</h2>
            <p className="mt-1.5 text-[13px] leading-5 text-text-secondary">将删除 {selectedCount} 张图片。已发布或已绑定的使用记录仍会保留在对应笔记中。</p>
            <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setShowDeleteConfirm(false)} className="rounded-lg px-3 py-2 text-[13px] text-text-secondary">取消</button><button type="button" onClick={deleteSelected} className="rounded-lg bg-red-600 px-4 py-2 text-[13px] font-medium text-white">确认删除</button></div>
          </div>
        </div>
      ) : null}

      {showStoragePanel ? (
        <div className="fixed inset-0 z-[130] flex justify-end bg-black/30" onClick={() => setShowStoragePanel(false)}>
          <aside className="flex h-full w-full max-w-md flex-col bg-surface-1 shadow-2xl" onClick={event => event.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-border-default px-5 py-4"><div><div className="flex items-center gap-2 text-[14px] font-semibold text-text-main"><HardDrive size={15} />存储与清理</div><p className="mt-1 text-[13px] text-text-tertiary">低频管理项集中在这里，不干扰日常素材判断。</p></div><button type="button" onClick={() => setShowStoragePanel(false)} className="rounded-lg p-1.5 text-text-tertiary hover:bg-hover-bg" aria-label="关闭存储管理"><X size={15} /></button></div>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              <div className="rounded-xl bg-surface-subtle p-4"><div className="flex items-end justify-between"><div><div className="text-[13px] text-text-tertiary">当前商家云端占用</div><div className="mt-1 text-[24px] font-semibold text-text-main">8.4 GB</div></div><div className="text-right text-[13px] text-text-tertiary">套餐 20 GB<br />本月新增 1.2 GB</div></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white"><div className="h-full w-[42%] rounded-full bg-neutral-900" /></div></div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4"><div className="flex items-center gap-2 text-[13px] font-semibold text-amber-900"><Archive size={13} />预计可释放 2.1 GB</div><p className="mt-1.5 text-[13px] leading-5 text-amber-800">优先清理未采用候选和超过保留期的任务原图，已发布素材保留缩略图与关系记录。</p></div>
              <section className="rounded-xl border border-border-default p-4"><h3 className="text-[13px] font-semibold text-text-main">默认保存策略</h3><div className="mt-3 space-y-3 text-[13px] text-text-secondary"><div className="flex justify-between"><span>品牌资产、正式采用素材</span><strong className="text-text-main">长期保存</strong></div><div className="flex justify-between"><span>未采用优化候选</span><strong className="text-text-main">7天后清理</strong></div><div className="flex justify-between"><span>任务未采用原图</span><strong className="text-text-main">30天后清理</strong></div></div></section>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
};
