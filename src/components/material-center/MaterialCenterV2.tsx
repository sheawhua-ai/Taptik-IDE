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
  Upload,
  WandSparkles,
  X
} from 'lucide-react';
import { MaterialAsset } from './types';
import { INITIAL_ASSETS } from './mockData';
import { MaterialAssetCardV2, MaterialCardMode } from './MaterialAssetCardV2';
import { MaterialDetailDrawer } from './MaterialDetailDrawer';
import { UploadModal } from './UploadModal';

interface MaterialCenterV2Props {
  activeProject?: { name?: string };
  importedAssets?: MaterialAsset[];
}

type CenterView = 'available' | 'reserved' | 'optimize' | 'used' | 'archived';
type OptimizationContext = 'queue' | 'variant';

const OPERATOR_TAGS = ['9月新品', '门店实拍', 'KOC反馈', '高质量封面'];
const VISIBLE_OPERATOR_TAG_LIMIT = 3;
const OPTIMIZATION_HINTS: Record<string, string> = {
  'MAT-2026-002': '光线偏暖，已准备一版自然提亮结果，保留真实拍摄质感。',
  'MAT-2026-005': '顶部标题安全区偏窄，已准备3:4扩图和裁切结果。'
};
const AI_CLUSTER_RULES = [
  { id: 'experience', label: '宠物与体验', description: '宠物主体、进食、开箱和真实体验', keywords: ['犬', '猫', '进食', '开箱', 'KOC', '换粮', '体验'] },
  { id: 'product', label: '产品与包装', description: '产品特写、粮粒、包装和抠图元件', keywords: ['产品', '主粮', '粮粒', '包装', '抠图', '3D'] },
  { id: 'scene', label: '门店与场景', description: '门店、探店、桌面、生活化拍摄场景', keywords: ['门店', '探店', '场景', '生活感', '桌面', '迎宾'] },
  { id: 'brand', label: '品牌资产', description: 'Logo、色板、水印和视觉规范', keywords: ['品牌', 'Logo', '色板', '水印', 'VI', '规范'] }
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

const USE_LABELS: Record<string, string> = {
  cover: '封面图',
  body_image: '笔记内页',
  real_shot: '实拍素材',
  component_cutout: '产品抠图',
  component_logo: '品牌元件',
  component_packaging: '包装细节',
  component_swatch: '视觉规范'
};

const OptimizationDrawer: React.FC<{
  asset: MaterialAsset;
  context: OptimizationContext;
  onClose: () => void;
  onSave: (recipe: string) => void;
}> = ({ asset, context, onClose, onSave }) => {
  const options = context === 'variant'
    ? ['差异化构图', '3:4自然延展', '光线与色调调整']
    : ['推荐优化', '3:4智能裁切', '轻量清晰度优化'];
  const [selectedOption, setSelectedOption] = useState(options[0]);

  return (
    <div className="fixed inset-0 z-[130] flex justify-end bg-black/30" onClick={onClose}>
      <aside className="flex h-full w-full max-w-[560px] flex-col bg-surface-1 shadow-2xl" onClick={event => event.stopPropagation()} aria-label="素材优化结果">
        <div className="flex items-start justify-between border-b border-border-default px-5 py-4">
          <div>
            <h2 className="text-[15px] font-semibold text-text-main">{context === 'variant' ? '生成差异化版本' : '确认优化结果'}</h2>
            <p className="mt-1 text-[10.5px] text-text-tertiary">系统已基于真实原图准备结果，不改变产品和体验事实。</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-text-tertiary hover:bg-hover-bg" aria-label="关闭素材优化"><X size={16} /></button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="mb-2 text-[10px] font-medium text-text-secondary">原始素材</div>
              <div className="aspect-[3/4] overflow-hidden rounded-xl border border-border-default bg-surface-subtle"><img src={asset.url} alt={`${asset.name}原图`} className="h-full w-full object-cover" /></div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-[10px] font-medium text-text-secondary"><span>准备结果</span><span className="text-emerald-700">保持实拍</span></div>
              <div className="aspect-[3/4] overflow-hidden rounded-xl border-2 border-neutral-900 bg-surface-subtle"><img src={asset.url} alt={`${asset.name}优化预览`} className="h-full w-full scale-[1.04] object-cover brightness-[1.06] contrast-[1.03]" /></div>
            </div>
          </div>

          <section className="mt-5 rounded-xl border border-border-default p-4">
            <h3 className="text-[11.5px] font-semibold text-text-main">选择处理方式</h3>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {options.map(option => (
                <button key={option} type="button" onClick={() => setSelectedOption(option)} className={`rounded-lg border px-3 py-2.5 text-[10px] font-medium transition-colors ${selectedOption === option ? 'border-neutral-900 bg-neutral-100 text-neutral-900' : 'border-border-default text-text-secondary hover:bg-hover-bg'}`}>
                  {option}
                </button>
              ))}
            </div>
            <div className="mt-3 rounded-lg bg-surface-subtle px-3 py-2.5 text-[10px] leading-5 text-text-secondary">
              {context === 'variant'
                ? '将生成新的素材ID，原素材继续保留原有笔记关系，新版本重新进入可用池。'
                : OPTIMIZATION_HINTS[asset.id] ?? '已完成尺寸、构图和清晰度检查，请确认采用结果。'}
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between border-t border-border-default px-5 py-4">
          <span className="text-[10px] text-text-tertiary">只保存确认采用的版本</span>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-border-default px-4 py-2 text-[10.5px] font-medium text-text-secondary">取消</button>
            <button type="button" onClick={() => onSave(selectedOption)} className="rounded-lg bg-btn-main px-4 py-2 text-[10.5px] font-medium text-white">确认并保存新版本</button>
          </div>
        </div>
      </aside>
    </div>
  );
};

type BatchAction = 'watermark' | 'resize' | 'tag' | 'delete';

const BATCH_ACTIONS: Array<{
  id: BatchAction;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number }>;
  danger?: boolean;
}> = [
  { id: 'watermark', title: '批量去水印', description: '先识别水印，只处理检出的图片', icon: Eraser },
  { id: 'resize', title: '统一图片尺寸', description: '按小红书常用比例生成新版本', icon: Crop },
  { id: 'tag', title: '归类到标签', description: '加入一个手动标签，原标签保留', icon: Tag },
  { id: 'delete', title: '删除素材', description: '删除云端文件，保留已发布关系', icon: Trash2, danger: true }
];

const BatchProcessingDrawer: React.FC<{
  assets: MaterialAsset[];
  customTags: string[];
  onClose: () => void;
  onQueueProcessing: (action: 'watermark' | 'resize', option: string) => void;
  onApplyTag: (tagName: string) => void;
  onRequestDelete: () => void;
}> = ({ assets, customTags, onClose, onQueueProcessing, onApplyTag, onRequestDelete }) => {
  const [activeAction, setActiveAction] = useState<BatchAction>('watermark');
  const [targetRatio, setTargetRatio] = useState('3:4 · 1242×1656');
  const [targetTag, setTargetTag] = useState(customTags[0] ?? '待归类');

  const submit = () => {
    if (activeAction === 'watermark') onQueueProcessing('watermark', '自动识别并清理水印');
    if (activeAction === 'resize') onQueueProcessing('resize', targetRatio);
    if (activeAction === 'tag') onApplyTag(targetTag);
    if (activeAction === 'delete') onRequestDelete();
  };

  const submitLabel = activeAction === 'watermark'
    ? '开始识别与处理'
    : activeAction === 'resize'
      ? '开始生成新尺寸'
      : activeAction === 'tag'
        ? '确认归类'
        : '删除所选素材';

  return (
    <div className="fixed inset-0 z-[135] flex justify-end bg-black/30" onClick={onClose}>
      <aside className="flex h-full w-full max-w-[580px] flex-col bg-surface-1 shadow-2xl" onClick={event => event.stopPropagation()} aria-label="批量处理素材">
        <div className="flex items-start justify-between border-b border-border-default px-5 py-4">
          <div>
            <h2 className="text-[15px] font-semibold text-text-main">批量处理</h2>
            <p className="mt-1 text-[10.5px] text-text-tertiary">已选 {assets.length} 项素材，只需选择本次要完成的动作。</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-text-tertiary hover:bg-hover-bg" aria-label="关闭批量处理"><X size={16} /></button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="flex gap-2 overflow-hidden rounded-xl bg-surface-subtle p-2">
            {assets.slice(0, 5).map(asset => <img key={asset.id} src={asset.url} alt={asset.name} className="h-14 w-14 rounded-lg border border-white object-cover" />)}
            {assets.length > 5 ? <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white text-[10px] font-medium text-text-secondary">+{assets.length - 5}</div> : null}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {BATCH_ACTIONS.map(action => {
              const Icon = action.icon;
              const active = activeAction === action.id;
              return (
                <button key={action.id} type="button" onClick={() => setActiveAction(action.id)} className={`rounded-xl border p-3 text-left transition-colors ${active ? action.danger ? 'border-red-300 bg-red-50' : 'border-neutral-900 bg-neutral-100' : 'border-border-default hover:bg-hover-bg'}`}>
                  <div className={`flex items-center gap-2 text-[11px] font-semibold ${action.danger ? 'text-red-600' : 'text-text-main'}`}><Icon size={14} />{action.title}</div>
                  <p className="mt-1.5 text-[9.5px] leading-4 text-text-tertiary">{action.description}</p>
                </button>
              );
            })}
          </div>

          <section className="mt-4 rounded-xl border border-border-default p-4">
            {activeAction === 'watermark' ? (
              <div>
                <h3 className="text-[11px] font-semibold text-text-main">去水印规则</h3>
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-surface-subtle p-3"><Check size={12} className="mt-0.5 shrink-0 text-emerald-700" /><div><div className="text-[10px] font-medium text-text-main">仅处理识别到水印的图片</div><p className="mt-1 text-[9.5px] leading-4 text-text-tertiary">固定角标优先使用裁切或遮罩；复杂水印生成候选结果后由你确认。未检出水印的图片不会生成副本。</p></div></div>
              </div>
            ) : null}
            {activeAction === 'resize' ? (
              <div>
                <h3 className="text-[11px] font-semibold text-text-main">目标尺寸</h3>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {['3:4 · 1242×1656', '1:1 · 1080×1080', '原比例高清'].map(option => <button key={option} type="button" onClick={() => setTargetRatio(option)} className={`rounded-lg border px-2 py-2.5 text-[9.5px] ${targetRatio === option ? 'border-neutral-900 bg-neutral-100 font-medium text-neutral-900' : 'border-border-default text-text-secondary'}`}>{option}</button>)}
                </div>
                <p className="mt-3 text-[9.5px] leading-4 text-text-tertiary">默认保护主体和文字安全区；尺寸不足时生成延展候选，不直接拉伸原图。</p>
              </div>
            ) : null}
            {activeAction === 'tag' ? (
              <div>
                <h3 className="text-[11px] font-semibold text-text-main">选择手动标签</h3>
                <div className="mt-3 flex flex-wrap gap-2">{customTags.map(tagName => <button key={tagName} type="button" onClick={() => setTargetTag(tagName)} className={`rounded-lg px-2.5 py-1.5 text-[10px] ${targetTag === tagName ? 'bg-btn-main font-medium text-white' : 'bg-surface-subtle text-text-secondary'}`}>{tagName}</button>)}</div>
                <p className="mt-3 text-[9.5px] text-text-tertiary">手动标签用于操盘手归类；AI自动标签仍在后台参与搜索和智能匹配。</p>
              </div>
            ) : null}
            {activeAction === 'delete' ? (
              <div className="rounded-lg bg-red-50 p-3"><div className="text-[10px] font-semibold text-red-700">删除前需要再次确认</div><p className="mt-1 text-[9.5px] leading-4 text-red-600">已发布笔记中的使用关系和缩略记录会保留，但原始云端文件将不再出现在素材中心。</p></div>
            ) : null}
          </section>
        </div>

        <div className="flex items-center justify-between border-t border-border-default px-5 py-4">
          <span className="text-[10px] text-text-tertiary">处理结果不会覆盖原图</span>
          <div className="flex gap-2"><button type="button" onClick={onClose} className="rounded-lg border border-border-default px-4 py-2 text-[10.5px] text-text-secondary">取消</button><button type="button" onClick={submit} className={`rounded-lg px-4 py-2 text-[10.5px] font-medium text-white ${activeAction === 'delete' ? 'bg-red-600' : 'bg-btn-main'}`}>{submitLabel}</button></div>
        </div>
      </aside>
    </div>
  );
};

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
  const [optimizationNotes, setOptimizationNotes] = useState<Record<string, string>>(OPTIMIZATION_HINTS);
  const [optimizingAsset, setOptimizingAsset] = useState<MaterialAsset | null>(null);
  const [optimizationContext, setOptimizationContext] = useState<OptimizationContext>('queue');
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [selectedAssetIds, setSelectedAssetIds] = useState(() => new Set<string>());
  const [showTagModal, setShowTagModal] = useState(false);
  const [showBatchDrawer, setShowBatchDrawer] = useState(false);
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


  const createDerivedAsset = (asset: MaterialAsset, recipe: string, archiveOriginal: boolean) => {
    const derivedAsset: MaterialAsset = {
      ...asset,
      id: `MAT-DERIVED-${Date.now()}`,
      name: `${asset.name} · ${recipe}`,
      category: 'derived_material',
      status: 'available',
      sourceType: 'ai_derived',
      sourceLabel: `素材优化 · ${recipe}`,
      uploader: '素材Agent',
      uploadTime: '8月26日 16:20',
      usageRelation: undefined,
      tags: Array.from(new Set([...(asset.tags ?? []), '差异化版本'])),
      vectorDescription: `基于真实原图完成${recipe}，保留主体、产品与体验事实。`,
      performance: { hasBackendData: false, performanceType: 'none' },
      lineage: {
        parentId: asset.id,
        parentName: asset.name,
        parentUrl: asset.url,
        modificationType: recipe,
        generatorService: 'TapTik 素材Agent'
      },
      acceptance: {
        ...asset.acceptance,
        manualAcceptance: { operatorName: '当前操盘手', time: '8月26日 16:20', passed: true, comment: '已确认采用优化结果' }
      }
    };
    setAssets(current => [derivedAsset, ...current.map(item => item.id === asset.id && archiveOriginal && item.status === 'available' ? { ...item, status: 'archived' as const } : item)]);
    setOptimizationIds(current => {
      const next = new Set(current);
      next.delete(asset.id);
      return next;
    });
    setOptimizationNotes(current => Object.fromEntries(Object.entries(current).filter(([id]) => id !== asset.id)));
    setOptimizingAsset(null);
    setNotice('新版本已保存到可用素材，原素材关系保持不变。');
    switchView('available');
  };

  const addTag = () => {
    const tagName = newTagName.trim();
    if (!tagName) return;
    setCustomTags(current => current.includes(tagName) ? current : [...current, tagName]);
    if (selectedCount > 0) {
      setAssets(current => current.map(asset => selectedAssetIds.has(asset.id)
        ? { ...asset, tags: Array.from(new Set([...(asset.tags ?? []), tagName])) }
        : asset));
      setNotice(`已为${selectedCount}项素材添加标签“${tagName}”。`);
    } else {
      setNotice(`标签“${tagName}”已创建，可在批量管理中归类素材。`);
    }
    setNewTagName('');
    setShowTagModal(false);
  };

  const queueBatchProcessing = (action: 'watermark' | 'resize', option: string) => {
    const description = action === 'watermark'
      ? '已完成水印识别并准备清理结果，请逐项确认后保存。'
      : `已准备${option}尺寸版本，未拉伸原图，请确认构图结果。`;
    setOptimizationIds(current => new Set([...current, ...selectedAssetIds]));
    setOptimizationNotes(current => {
      const next = { ...current };
      selectedAssetIds.forEach(id => { next[id] = description; });
      return next;
    });
    setShowBatchDrawer(false);
    setNotice(`已为${selectedCount}项素材准备${action === 'watermark' ? '去水印' : '新尺寸'}结果。`);
    switchView('optimize');
  };

  const applyBatchTag = (tagName: string) => {
    setAssets(current => current.map(asset => selectedAssetIds.has(asset.id)
      ? { ...asset, tags: Array.from(new Set([...(asset.tags ?? []), tagName])) }
      : asset));
    setShowBatchDrawer(false);
    setNotice(`已将${selectedCount}项素材归类到“${tagName}”。`);
    resetSelection();
  };

  const deleteSelected = () => {
    setAssets(current => current.filter(asset => !selectedAssetIds.has(asset.id)));
    setOptimizationIds(current => new Set([...current].filter(id => !selectedAssetIds.has(id))));
    setOptimizationNotes(current => Object.fromEntries(Object.entries(current).filter(([id]) => !selectedAssetIds.has(id))));
    setShowDeleteConfirm(false);
    setNotice(`已删除${selectedCount}项素材。`);
    resetSelection();
  };

  const activeViewTitle = activeView === 'used' ? '已使用素材' : activeView === 'archived' ? '已归档素材' : VIEW_CONFIG.find(item => item.id === activeView)?.label;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-page-bg text-text-primary">
      <header className="shrink-0 border-b border-border-default bg-surface-1">
        <div className="flex items-center justify-between gap-5 px-7 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-[18px] font-semibold tracking-tight text-text-main">素材中心</h1>
              <span className="rounded-md border border-border-default bg-surface-subtle px-1.5 py-0.5 text-[9.5px] text-text-tertiary">{counts.available}项可用</span>
            </div>
            <p className="mt-1 text-[11px] text-text-secondary">管理已验收或主动上传的正式素材，快速确认哪些可用、已占用或需要优化。</p>
          </div>
          <div className="relative flex shrink-0 items-center gap-2">
            <button type="button" onClick={() => { setIsBatchMode(current => !current); setSelectedAssetIds(new Set()); }} className="rounded-lg border border-border-default bg-surface-1 px-3 py-2 text-[11px] font-medium text-text-main hover:bg-hover-bg">{isBatchMode ? '退出批量' : '批量管理'}</button>
            <button type="button" onClick={() => setShowUploadModal(true)} className="flex items-center gap-1.5 rounded-lg bg-btn-main px-4 py-2 text-[11px] font-medium text-white hover:bg-btn-main-hover"><Upload size={13} />上传素材</button>
            <button type="button" onClick={() => setShowMoreMenu(current => !current)} className="rounded-lg border border-border-default p-2 text-text-secondary hover:bg-hover-bg" aria-label="更多素材中心操作"><MoreHorizontal size={15} /></button>
            {showMoreMenu ? (
              <div className="absolute right-0 top-11 z-30 w-40 rounded-xl border border-border-default bg-surface-1 p-1.5 shadow-lg">
                <button type="button" onClick={() => { setShowStoragePanel(true); setShowMoreMenu(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[10.5px] text-text-main hover:bg-hover-bg"><HardDrive size={12} />存储与清理</button>
              </div>
            ) : null}
          </div>
        </div>

        <nav className="flex h-12 items-center gap-7 border-t border-border-subtle px-7" aria-label="素材状态">
          {VIEW_CONFIG.map(view => {
            const active = activeView === view.id;
            return (
              <button key={view.id} type="button" onClick={() => switchView(view.id)} className={`relative flex h-full items-center gap-2 px-0.5 text-[13px] ${active ? 'font-semibold text-text-main' : 'font-medium text-text-secondary hover:text-text-main'}`}>
                {view.label}
                <span className={`rounded-full px-1.5 py-0.5 text-[9px] ${active ? 'bg-neutral-900 text-white' : 'bg-surface-subtle text-text-tertiary'}`}>{counts[view.id]}</span>
                {active ? <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-neutral-900" /> : null}
              </button>
            );
          })}
          <div className="relative ml-auto">
            <button type="button" onClick={() => setShowHistoryMenu(current => !current)} className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10.5px] font-medium ${activeView === 'used' || activeView === 'archived' ? 'bg-surface-subtle text-text-main' : 'text-text-secondary hover:bg-hover-bg'}`}><History size={12} />历史素材<ChevronDown size={11} /></button>
            {showHistoryMenu ? (
              <div className="absolute right-0 top-9 z-30 w-40 rounded-xl border border-border-default bg-surface-1 p-1.5 shadow-lg">
                <button type="button" onClick={() => switchView('used')} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-[10.5px] text-text-main hover:bg-hover-bg"><span>已使用</span><span className="text-text-tertiary">{counts.used}</span></button>
                <button type="button" onClick={() => switchView('archived')} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-[10.5px] text-text-main hover:bg-hover-bg"><span>已归档</span><span className="text-text-tertiary">{counts.archived}</span></button>
              </div>
            ) : null}
          </div>
        </nav>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="mx-auto max-w-[1500px] space-y-4">
          <section className="rounded-xl border border-border-default bg-surface-1 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[260px] max-w-lg flex-1">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder="搜索素材或标签…" className="w-full rounded-lg border border-border-default bg-surface-subtle py-2 pl-8 pr-8 text-[10.5px] text-text-main outline-none focus:border-border-strong" />
                {searchQuery ? <button type="button" onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" aria-label="清空素材搜索"><X size={12} /></button> : null}
              </div>
              <button type="button" onClick={() => setShowFilters(current => !current)} className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[10.5px] font-medium ${showFilters || filtersActive ? 'border-border-strong bg-surface-subtle text-text-main' : 'border-border-default text-text-secondary'}`}><Filter size={12} />筛选{filtersActive ? ' · 已启用' : ''}</button>
              <span className="ml-auto text-[10px] text-text-tertiary">{visibleAssets.length}项素材</span>
            </div>

            <div className="mt-3 flex items-center gap-1.5 border-t border-border-subtle pt-3">
              <button type="button" onClick={() => setActiveTag('全部')} className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[10px] font-medium ${activeTag === '全部' ? 'bg-btn-main text-white' : 'bg-surface-subtle text-text-secondary hover:text-text-main'}`}>全部</button>
              {visibleCustomTags.map(tag => (
                <button key={tag.name} type="button" onClick={() => setActiveTag(tag.name)} className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[10px] font-medium ${activeTag === tag.name ? 'bg-btn-main text-white' : 'bg-surface-subtle text-text-secondary hover:text-text-main'}`}>{tag.name}<span className={`ml-1 ${activeTag === tag.name ? 'text-white/70' : 'text-text-tertiary'}`}>{tag.count}</span></button>
              ))}

              <div className="relative">
                <button type="button" onClick={() => { setShowTagMenu(current => !current); setShowSmartClusters(false); }} className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] font-medium ${hiddenCustomTags.some(tag => tag.name === activeTag) ? 'bg-btn-main text-white' : 'bg-surface-subtle text-text-secondary hover:text-text-main'}`}>更多标签<ChevronDown size={10} /></button>
                {showTagMenu ? (
                  <div className="absolute left-0 top-9 z-30 w-56 rounded-xl border border-border-default bg-surface-1 p-2 shadow-lg">
                    <div className="px-2 pb-1 text-[9px] text-text-tertiary">手动标签 · 用于日常归类</div>
                    {hiddenCustomTags.length > 0 ? hiddenCustomTags.map(tag => <button key={tag.name} type="button" onClick={() => { setActiveTag(tag.name); setShowTagMenu(false); }} className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-[10px] text-text-main hover:bg-hover-bg"><span>{tag.name}</span><span className="text-text-tertiary">{tag.count}</span></button>) : <div className="px-2 py-2 text-[10px] text-text-tertiary">暂无更多标签</div>}
                    <button type="button" onClick={() => { setShowTagMenu(false); setShowTagModal(true); }} className="mt-1 flex w-full items-center gap-1.5 border-t border-border-subtle px-2 pt-2 text-[10px] font-medium text-text-secondary"><Plus size={11} />新建手动标签</button>
                  </div>
                ) : null}
              </div>

              <div className="relative">
                <button type="button" onClick={() => { setShowSmartClusters(current => !current); setShowTagMenu(false); }} className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-medium ${activeTag.startsWith('ai:') ? 'border-neutral-900 bg-neutral-100 text-neutral-900' : 'border-border-default text-text-secondary hover:bg-hover-bg'}`}><Images size={11} />智能归类 · {smartClusters.length}组<ChevronDown size={10} /></button>
                {showSmartClusters ? (
                  <div className="absolute left-0 top-9 z-30 w-[360px] rounded-xl border border-border-default bg-surface-1 p-2 shadow-lg">
                    <div className="px-2 pb-2"><div className="text-[10px] font-medium text-text-main">AI自动合并同类素材</div><p className="mt-0.5 text-[9px] text-text-tertiary">不铺开全部AI标签，只显示有素材的语义分组。</p></div>
                    <div className="space-y-1">
                      {smartClusters.map(cluster => <button key={cluster.id} type="button" onClick={() => { setActiveTag(`ai:${cluster.id}`); setShowSmartClusters(false); }} className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-hover-bg"><div className="flex -space-x-2">{cluster.samples.map(asset => <img key={asset.id} src={asset.url} alt="" className="h-8 w-8 rounded-md border-2 border-white object-cover" />)}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between"><span className="text-[10px] font-medium text-text-main">{cluster.label}</span><span className="text-[9px] text-text-tertiary">{cluster.count}项</span></div><p className="mt-0.5 truncate text-[9px] text-text-tertiary">{cluster.description}</p></div></button>)}
                    </div>
                  </div>
                ) : null}
              </div>
              <span className="ml-auto text-[9.5px] text-text-tertiary">AI标签用于搜索，手动标签用于归类</span>
            </div>

            {showFilters ? (
              <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border-subtle pt-3">
                <select value={selectedUse} onChange={event => setSelectedUse(event.target.value)} className="rounded-lg border border-border-default bg-surface-1 px-2.5 py-2 text-[10px] text-text-secondary"><option value="all">所有用途</option>{Object.entries(USE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
                <select value={selectedSource} onChange={event => setSelectedSource(event.target.value)} className="rounded-lg border border-border-default bg-surface-1 px-2.5 py-2 text-[10px] text-text-secondary"><option value="all">所有来源</option><option value="merchant">商家上传</option><option value="task_upload">任务回传</option><option value="koc">KOC回传</option><option value="ai_derived">衍生版本</option></select>
                <div className="flex gap-2">
                  <select value={selectedProject} onChange={event => setSelectedProject(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-border-default bg-surface-1 px-2.5 py-2 text-[10px] text-text-secondary"><option value="all">所有方案</option>{projects.map(project => <option key={project} value={project}>{project}</option>)}</select>
                  {filtersActive ? <button type="button" onClick={() => { setSelectedUse('all'); setSelectedSource('all'); setSelectedProject('all'); }} className="flex items-center gap-1 rounded-lg px-2.5 text-[10px] text-text-tertiary hover:bg-hover-bg"><RotateCw size={11} />重置</button> : null}
                </div>
              </div>
            ) : null}
          </section>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[13px] font-semibold text-text-main">{activeViewTitle}</h2>
              <p className="mt-0.5 text-[10px] text-text-tertiary">
                {activeView === 'available' ? '只展示当前未被笔记占用、可以继续匹配的素材。' : null}
                {activeView === 'reserved' ? '素材已绑定到具体笔记，不再参与其他笔记的自动匹配。' : null}
                {activeView === 'optimize' ? '问题和候选结果都已准备，打开后选择采用即可。' : null}
                {activeView === 'used' ? '已使用素材保留原关系，优秀素材可生成新的差异化版本。' : null}
                {activeView === 'archived' ? '历史素材默认不参与笔记匹配。' : null}
              </p>
            </div>
            {isBatchMode ? <button type="button" onClick={selectAllVisible} className="text-[10px] font-medium text-text-secondary hover:text-text-main">{visibleAssets.length > 0 && visibleAssets.every(asset => selectedAssetIds.has(asset.id)) ? '取消全选' : '全选当前结果'}</button> : null}
          </div>

          {visibleAssets.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {visibleAssets.map(asset => (
                <MaterialAssetCardV2
                  key={asset.id}
                  asset={asset}
                  mode={cardMode}
                  primaryTag={(asset.tags ?? []).find(tagName => customTags.includes(tagName)) ?? (asset.tags?.[0] ? `AI · ${asset.tags[0]}` : undefined)}
                  optimizationHint={optimizationNotes[asset.id] ?? '已准备尺寸与清晰度优化结果。'}
                  isBatchMode={isBatchMode}
                  isSelected={selectedAssetIds.has(asset.id)}
                  onToggleSelect={toggleSelected}
                  onOpenDetail={setSelectedAssetForDetail}
                  onOpenOptimization={item => { setOptimizingAsset(item); setOptimizationContext('queue'); }}
                  onCreateVariant={item => { setOptimizingAsset(item); setOptimizationContext('variant'); }}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border-default bg-surface-1 px-6 py-14 text-center">
              <FolderOpen size={28} className="mx-auto text-text-tertiary" />
              <h3 className="mt-3 text-[12px] font-semibold text-text-main">当前没有需要处理的素材</h3>
              <p className="mt-1 text-[10px] text-text-tertiary">切换标签或调整筛选条件即可查看其他素材。</p>
            </div>
          )}

          {isBatchMode && selectedCount > 0 ? (
            <div className="sticky bottom-3 z-20 mx-auto flex max-w-2xl items-center justify-between rounded-xl border border-border-strong bg-surface-1 px-4 py-3 shadow-xl">
              <div className="text-[10.5px] font-medium text-text-main">已选 {selectedCount} 项</div>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => setNotice(`已开始打包下载${selectedCount}项素材。`)} className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] text-text-secondary hover:bg-hover-bg"><Download size={11} />下载</button>
                <button type="button" onClick={() => setShowBatchDrawer(true)} className="flex items-center gap-1.5 rounded-lg bg-btn-main px-3 py-1.5 text-[10px] font-medium text-white"><WandSparkles size={11} />批量处理</button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {notice ? (
        <div className="fixed bottom-6 left-1/2 z-[150] flex -translate-x-1/2 items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-[10.5px] text-white shadow-xl">
          <Check size={12} />{notice}<button type="button" onClick={() => setNotice(null)} className="ml-2 text-white/70" aria-label="关闭提示"><X size={11} /></button>
        </div>
      ) : null}

      <MaterialDetailDrawer asset={selectedAssetForDetail} manualTags={customTags} onManualTagsChange={tags => setCustomTags(current => Array.from(new Set([...current, ...tags])))} onClose={() => setSelectedAssetForDetail(null)} onUpdateAsset={updated => { setAssets(current => current.map(asset => asset.id === updated.id ? updated : asset)); setSelectedAssetForDetail(updated); }} />
      <UploadModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} onUploadSuccess={asset => setAssets(current => [addOperatorTags(asset), ...current])} />

      {showBatchDrawer ? <BatchProcessingDrawer assets={batchSelectedAssets} customTags={customTags} onClose={() => setShowBatchDrawer(false)} onQueueProcessing={queueBatchProcessing} onApplyTag={applyBatchTag} onRequestDelete={() => { setShowBatchDrawer(false); setShowDeleteConfirm(true); }} /> : null}
      {optimizingAsset ? <OptimizationDrawer asset={optimizingAsset} context={optimizationContext} onClose={() => setOptimizingAsset(null)} onSave={recipe => createDerivedAsset(optimizingAsset, recipe, optimizationContext === 'queue')} /> : null}

      {showTagModal ? (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/30 p-4" onClick={() => setShowTagModal(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-surface-1 p-5 shadow-2xl" onClick={event => event.stopPropagation()}>
            <div className="flex items-start justify-between"><div><h2 className="text-[14px] font-semibold text-text-main">{selectedCount > 0 ? '为素材添加标签' : '新建标签'}</h2><p className="mt-1 text-[10px] text-text-tertiary">标签会像文件夹一样聚合素材，不改变素材来源。</p></div><button type="button" onClick={() => setShowTagModal(false)} className="p-1 text-text-tertiary" aria-label="关闭标签窗口"><X size={14} /></button></div>
            <input autoFocus value={newTagName} onChange={event => setNewTagName(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') addTag(); }} placeholder="例如：9月新品、青岛门店" className="mt-4 w-full rounded-lg border border-border-default px-3 py-2.5 text-[11px] outline-none focus:border-border-strong" />
            <div className="mt-4 flex justify-end gap-2"><button type="button" onClick={() => setShowTagModal(false)} className="rounded-lg px-3 py-2 text-[10.5px] text-text-secondary">取消</button><button type="button" onClick={addTag} disabled={!newTagName.trim()} className="rounded-lg bg-btn-main px-4 py-2 text-[10.5px] font-medium text-white disabled:opacity-40">确认</button></div>
          </div>
        </div>
      ) : null}

      {showDeleteConfirm ? (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/30 p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-surface-1 p-5 shadow-2xl" onClick={event => event.stopPropagation()}>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600"><Trash2 size={16} /></div>
            <h2 className="mt-3 text-[14px] font-semibold text-text-main">删除所选素材？</h2>
            <p className="mt-1.5 text-[10.5px] leading-5 text-text-secondary">将删除 {selectedCount} 项素材。已发布或已绑定的使用记录仍会保留在对应笔记中。</p>
            <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setShowDeleteConfirm(false)} className="rounded-lg px-3 py-2 text-[10.5px] text-text-secondary">取消</button><button type="button" onClick={deleteSelected} className="rounded-lg bg-red-600 px-4 py-2 text-[10.5px] font-medium text-white">确认删除</button></div>
          </div>
        </div>
      ) : null}

      {showStoragePanel ? (
        <div className="fixed inset-0 z-[130] flex justify-end bg-black/30" onClick={() => setShowStoragePanel(false)}>
          <aside className="flex h-full w-full max-w-md flex-col bg-surface-1 shadow-2xl" onClick={event => event.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-border-default px-5 py-4"><div><div className="flex items-center gap-2 text-[14px] font-semibold text-text-main"><HardDrive size={15} />存储与清理</div><p className="mt-1 text-[10.5px] text-text-tertiary">低频管理项集中在这里，不干扰日常素材判断。</p></div><button type="button" onClick={() => setShowStoragePanel(false)} className="rounded-lg p-1.5 text-text-tertiary hover:bg-hover-bg" aria-label="关闭存储管理"><X size={15} /></button></div>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              <div className="rounded-xl bg-surface-subtle p-4"><div className="flex items-end justify-between"><div><div className="text-[10px] text-text-tertiary">当前商家云端占用</div><div className="mt-1 text-[24px] font-semibold text-text-main">8.4 GB</div></div><div className="text-right text-[10px] text-text-tertiary">套餐 20 GB<br />本月新增 1.2 GB</div></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white"><div className="h-full w-[42%] rounded-full bg-neutral-900" /></div></div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4"><div className="flex items-center gap-2 text-[11px] font-semibold text-amber-900"><Archive size={13} />预计可释放 2.1 GB</div><p className="mt-1.5 text-[10px] leading-5 text-amber-800">优先清理未采用候选和超过保留期的任务原图，已发布素材保留缩略图与关系记录。</p></div>
              <section className="rounded-xl border border-border-default p-4"><h3 className="text-[11px] font-semibold text-text-main">默认保存策略</h3><div className="mt-3 space-y-3 text-[10px] text-text-secondary"><div className="flex justify-between"><span>品牌资产、正式采用素材</span><strong className="text-text-main">长期保存</strong></div><div className="flex justify-between"><span>未采用优化候选</span><strong className="text-text-main">7天后清理</strong></div><div className="flex justify-between"><span>任务未采用原图</span><strong className="text-text-main">30天后清理</strong></div></div></section>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
};
