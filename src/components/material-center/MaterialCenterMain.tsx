import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { MaterialAsset } from './types';
import { INITIAL_ASSETS } from './mockData';
import { MaterialCard } from './MaterialCard';
import { MaterialDetailDrawer } from './MaterialDetailDrawer';
import { UploadModal } from './UploadModal';
import { ShootingTaskProposalModal } from './ShootingTaskProposalModal';
import {
  Search,
  Plus,
  Camera,
  FolderOpen,
  X,
  RotateCw,
  CheckSquare,
  Tag,
  Archive,
  Layers,
  Check
} from 'lucide-react';

interface MaterialCenterMainProps {
  activeProject?: any;
  onNavigateToExecution?: () => void;
}

export const MaterialCenterMain: React.FC<MaterialCenterMainProps> = ({
  activeProject,
  onNavigateToExecution
}) => {
  // Assets State
  const [assets, setAssets] = useState<MaterialAsset[]>(INITIAL_ASSETS);

  // Primary 1st-level Filter Tab
  const [primaryTab, setPrimaryTab] = useState<'publishable' | 'base_components' | 'pending_acceptance' | 'used' | 'archived'>(
    'publishable'
  );

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterialUse, setSelectedMaterialUse] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSourceType, setSelectedSourceType] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedPerformanceFilter, setSelectedPerformanceFilter] = useState<string>('all');

  // Batch Management State
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [showBatchTagModal, setShowBatchTagModal] = useState(false);
  const [batchTagsInput, setBatchTagsInput] = useState('');

  // Modals & Drawers
  const [selectedAssetForDetail, setSelectedAssetForDetail] = useState<MaterialAsset | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showShootingTaskModal, setShowShootingTaskModal] = useState<boolean>(false);

  // Counts for top level tabs
  const tabCounts = useMemo(() => {
    return {
      publishable: assets.filter(a => a.category !== 'base_component' && (a.status === 'available' || a.status === 'reserved')).length,
      base_components: assets.filter(a => a.category === 'base_component').length,
      pending_acceptance: assets.filter(a => a.status === 'pending_acceptance').length,
      used: assets.filter(a => a.status === 'used').length,
      archived: assets.filter(a => a.status === 'archived').length
    };
  }, [assets]);

  // Filtered Assets List
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      // 1. Primary Tab Matching
      if (primaryTab === 'publishable') {
        if (asset.category === 'base_component') return false;
        if (asset.status !== 'available' && asset.status !== 'reserved') return false;
      } else if (primaryTab === 'base_components') {
        if (asset.category !== 'base_component') return false;
      } else if (primaryTab === 'pending_acceptance') {
        if (asset.status !== 'pending_acceptance') return false;
      } else if (primaryTab === 'used') {
        if (asset.status !== 'used') return false;
      } else if (primaryTab === 'archived') {
        if (asset.status !== 'archived') return false;
      }

      // 2. Material Use
      if (selectedMaterialUse !== 'all' && asset.materialUse !== selectedMaterialUse) {
        return false;
      }

      // 3. Category
      if (selectedCategory !== 'all' && asset.category !== selectedCategory) {
        return false;
      }

      // 4. Source Type
      if (selectedSourceType !== 'all' && asset.sourceType !== selectedSourceType) {
        return false;
      }

      // 5. Project
      if (selectedProject !== 'all' && asset.sourceProject !== selectedProject) {
        return false;
      }

      // 6. Performance Filter
      if (selectedPerformanceFilter === 'has_creator_data') {
        if (asset.performance.performanceType !== 'owned_account_creator_api') return false;
      } else if (selectedPerformanceFilter === 'no_backend_data') {
        if (asset.performance.performanceType !== 'koc_public_captured') return false;
      }

      // 7. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = asset.name.toLowerCase().includes(q);
        const idMatch = asset.id.toLowerCase().includes(q);
        const uploaderMatch = asset.uploader.toLowerCase().includes(q);
        const projectMatch = (asset.sourceProject || '').toLowerCase().includes(q);
        const noteMatch = (asset.usageRelation?.noteTitle || '').toLowerCase().includes(q);
        const tagsMatch = (asset.tags || []).some(t => t.toLowerCase().includes(q));
        const descMatch = (asset.vectorDescription || '').toLowerCase().includes(q);

        if (!nameMatch && !idMatch && !uploaderMatch && !projectMatch && !noteMatch && !tagsMatch && !descMatch) {
          return false;
        }
      }

      return true;
    });
  }, [assets, primaryTab, selectedMaterialUse, selectedCategory, selectedSourceType, selectedProject, selectedPerformanceFilter, searchQuery]);

  // Handle new material uploaded
  const handleAddMaterial = (newAsset: MaterialAsset) => {
    setAssets(prev => [newAsset, ...prev]);
  };

  // Handle asset update
  const handleUpdateAsset = (updated: MaterialAsset) => {
    setAssets(prev => prev.map(a => a.id === updated.id ? updated : a));
    setSelectedAssetForDetail(updated);
  };

  // Toggle single asset selection
  const handleToggleSelectAsset = (id: string) => {
    setSelectedAssetIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Select all / Deselect all
  const handleSelectAllFiltered = () => {
    const filteredIds = filteredAssets.map(a => a.id);
    const allSelected = filteredIds.every(id => selectedAssetIds.includes(id));
    if (allSelected) {
      setSelectedAssetIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      setSelectedAssetIds(prev => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  // Batch action: Apply tags
  const handleApplyBatchTags = () => {
    if (!batchTagsInput.trim()) return;
    const newTags = batchTagsInput.split(/[,，]/).map(t => t.trim()).filter(Boolean);

    setAssets(prev =>
      prev.map(asset => {
        if (selectedAssetIds.includes(asset.id)) {
          const existingTags = asset.tags || [];
          const merged = Array.from(new Set([...existingTags, ...newTags]));
          return { ...asset, tags: merged };
        }
        return asset;
      })
    );

    setBatchTagsInput('');
    setShowBatchTagModal(false);
  };

  // Batch action: Archive
  const handleBatchArchive = () => {
    setAssets(prev =>
      prev.map(asset => {
        if (selectedAssetIds.includes(asset.id)) {
          return { ...asset, status: 'archived' as any };
        }
        return asset;
      })
    );
    setSelectedAssetIds([]);
  };

  // Batch action: Set as available
  const handleBatchSetAvailable = () => {
    setAssets(prev =>
      prev.map(asset => {
        if (selectedAssetIds.includes(asset.id)) {
          return { ...asset, status: 'available' as any };
        }
        return asset;
      })
    );
    setSelectedAssetIds([]);
  };

  return (
    <div className="flex flex-col h-full bg-page-bg text-text-primary overflow-hidden">
      
      {/* Top Header Block */}
      <div className="bg-surface-1 border-b border-border-default shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-8 py-3.5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-semibold text-text-main tracking-tight">
                素材中心
              </h2>
            </div>
            <p className="text-[12px] text-text-secondary mt-0.5">
              统一管理小红书内容生产素材 · 记录使用与关联关系 · 关联创作者后台数据 · 支撑自动化检索与特征分类
            </p>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* Secondary Link to Execution Center Tasks */}
            <button
              onClick={() => setShowShootingTaskModal(true)}
              className="px-3.5 py-2 bg-surface-1 hover:bg-hover-bg text-text-main border border-border-default rounded-xl text-[12.5px] font-medium transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="素材不足时，发起拍摄任务提案并下发至执行中心"
            >
              <Camera size={14} className="text-text-secondary" />
              查看待回传素材任务
            </button>

            {/* Batch Mode Toggle */}
            <button
              onClick={() => {
                setIsBatchMode(!isBatchMode);
                if (isBatchMode) setSelectedAssetIds([]);
              }}
              className={`px-3.5 py-2 border rounded-xl text-[12.5px] font-medium transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer ${
                isBatchMode
                  ? 'bg-btn-main text-white border-neutral-900'
                  : 'bg-surface-1 hover:bg-hover-bg text-text-main border-border-default'
              }`}
            >
              <CheckSquare size={14} />
              {isBatchMode ? '退出批量管理' : '批量管理'}
            </button>

            {/* Primary Action: Upload */}
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-btn-main hover:bg-btn-main-hover text-white rounded-xl text-[12.5px] font-medium transition-all active:scale-95 flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Plus size={15} />
              上传素材
            </button>
          </div>
        </div>

        {/* Primary 1st-level Filter Tabs */}
        <div className="h-13 px-8 flex items-center justify-between border-t border-border-default bg-surface-1">
          <div className="flex items-center gap-8 h-full">
            {[
              { id: 'publishable', label: '可发布素材', count: tabCounts.publishable },
              { id: 'base_components', label: '基础元件', count: tabCounts.base_components },
              { id: 'pending_acceptance', label: '待验收', count: tabCounts.pending_acceptance },
              { id: 'used', label: '已使用', count: tabCounts.used },
              { id: 'archived', label: '已归档', count: tabCounts.archived }
            ].map(tab => {
              const isActive = primaryTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setPrimaryTab(tab.id as any)}
                  className={`relative h-full flex items-center gap-2 px-1 text-[14px] transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-text-main font-semibold'
                      : 'text-text-secondary hover:text-text-main font-medium'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[11px] leading-none transition-colors ${
                    isActive
                      ? 'bg-neutral-900 text-white font-medium'
                      : 'bg-surface-1 text-text-tertiary border border-border-default'
                  }`}>
                    {tab.count}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="materialTab"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-900 rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-[12px] text-text-tertiary hidden lg:block">
            共 {filteredAssets.length} 项素材
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-4">

      {/* Filter & Search Bar */}
      <div className="bg-surface p-3.5 rounded-lg border border-border-default space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          
          {/* Keyword Search Input */}
          <div className="flex-1 min-w-[240px] relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              placeholder="搜索素材名称、ID、标签、描述或关联项目..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-surface-subtle border border-border-default rounded text-[12px] text-text-primary focus:outline-none focus:border-border-strong"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* 素材用途 */}
            <select
              value={selectedMaterialUse}
              onChange={(e) => setSelectedMaterialUse(e.target.value)}
              className="px-2.5 py-1.5 bg-surface-subtle border border-border-default rounded text-[12px] text-text-primary font-medium"
            >
              <option value="all">所有用途</option>
              <option value="cover">封面图</option>
              <option value="body_image">笔记配图</option>
              <option value="finished_video">笔记视频</option>
              <option value="real_shot">实拍素材</option>
              <option value="component_cutout">产品抠图/透明底图</option>
              <option value="component_logo">品牌Logo/水印</option>
              <option value="component_packaging">包装细节图</option>
              <option value="component_swatch">品牌色板/字体</option>
            </select>

            {/* 来源类型 */}
            <select
              value={selectedSourceType}
              onChange={(e) => setSelectedSourceType(e.target.value)}
              className="px-2.5 py-1.5 bg-surface-subtle border border-border-default rounded text-[12px] text-text-primary font-medium"
            >
              <option value="all">所有来源</option>
              <option value="merchant">操盘手上传</option>
              <option value="task_upload">任务上传</option>
            </select>

            {/* 所属项目 */}
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-2.5 py-1.5 bg-surface-subtle border border-border-default rounded text-[12px] text-text-primary font-medium"
            >
              <option value="all">所有关联项目</option>
              <option value="幼犬换粮软便卡位项目">幼犬换粮软便卡位项目</option>
              <option value="猫粮肠胃敏感科普项目">猫粮肠胃敏感科普项目</option>
              <option value="线下门店KOS到店引流项目">线下门店KOS到店引流项目</option>
            </select>

            {/* Reset Filter Button */}
            {(selectedMaterialUse !== 'all' || selectedCategory !== 'all' || selectedSourceType !== 'all' || selectedProject !== 'all' || selectedPerformanceFilter !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedMaterialUse('all');
                  setSelectedCategory('all');
                  setSelectedSourceType('all');
                  setSelectedProject('all');
                  setSelectedPerformanceFilter('all');
                  setSearchQuery('');
                }}
                className="px-2.5 py-1.5 text-[12px] text-text-secondary hover:text-text-primary font-medium hover:underline flex items-center gap-1"
              >
                <RotateCw size={12} />
                重置筛选
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Batch Actions Bar (Sticky/Visible in Batch Mode) */}
      {isBatchMode && (
        <div className="bg-surface-subtle p-3 rounded-lg border border-border-default flex items-center justify-between flex-wrap gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAllFiltered}
              className="text-[12px] font-semibold text-text-primary flex items-center gap-1.5 hover:underline"
            >
              <input
                type="checkbox"
                checked={filteredAssets.length > 0 && filteredAssets.every(a => selectedAssetIds.includes(a.id))}
                readOnly
                className="w-4 h-4 rounded border-border-strong text-action-primary focus:ring-action-primary cursor-pointer accent-neutral-900"
              />
              全选当前页 ({filteredAssets.length} 项)
            </button>
            <span className="text-border-strong">|</span>
            <span className="text-[12px] text-text-secondary">
              已选中 <strong className="text-text-primary font-semibold">{selectedAssetIds.length}</strong> 项素材
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={selectedAssetIds.length === 0}
              onClick={() => setShowBatchTagModal(true)}
              className="px-3 py-1.5 bg-surface hover:bg-surface-hover disabled:opacity-50 text-text-primary border border-border-default rounded text-[12px] font-medium transition-colors flex items-center gap-1"
            >
              <Tag size={13} />
              批量打标签
            </button>

            <button
              disabled={selectedAssetIds.length === 0}
              onClick={handleBatchSetAvailable}
              className="px-3 py-1.5 bg-surface hover:bg-surface-hover disabled:opacity-50 text-text-primary border border-border-default rounded text-[12px] font-medium transition-colors flex items-center gap-1"
            >
              <Check size={13} />
              批量标记为可用
            </button>

            <button
              disabled={selectedAssetIds.length === 0}
              onClick={handleBatchArchive}
              className="px-3 py-1.5 bg-surface hover:bg-surface-hover disabled:opacity-50 text-text-primary border border-border-default rounded text-[12px] font-medium transition-colors flex items-center gap-1"
            >
              <Archive size={13} />
              批量归档
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Adaptive 3-4 Column Cards */}
      {filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {filteredAssets.map(asset => (
            <MaterialCard
              key={asset.id}
              asset={asset}
              onOpenDetail={(a) => setSelectedAssetForDetail(a)}
              isBatchMode={isBatchMode}
              isSelected={selectedAssetIds.includes(asset.id)}
              onToggleSelect={handleToggleSelectAsset}
            />
          ))}
        </div>
      ) : (
        <div className="bg-surface p-12 rounded-lg border border-border-default text-center text-text-tertiary space-y-2">
          <FolderOpen size={40} className="mx-auto text-text-tertiary stroke-1" />
          <p className="text-[14px] font-semibold text-text-primary">当前筛选下暂无匹配素材</p>
          <p className="text-[12px] text-text-secondary">
            可尝试调整顶部筛选条件或搜索关键词，或使用【上传素材】添加新素材。
          </p>
        </div>
      )}

      {/* Batch Tag Modal */}
      {showBatchTagModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-[420px] bg-surface rounded-xl shadow-xl border border-border-default p-5 space-y-4">
            <h3 className="text-[14px] font-semibold text-text-primary flex items-center gap-2">
              <Tag size={16} />
              批量添加标签
            </h3>
            <p className="text-[12px] text-text-secondary">
              将为已选中的 {selectedAssetIds.length} 项素材追加以下标签：
            </p>
            <input
              type="text"
              placeholder="输入标签，多个用逗号隔开 (如：促销活动, 柴犬, 门店探店)"
              value={batchTagsInput}
              onChange={(e) => setBatchTagsInput(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border-default rounded text-[12px] focus:outline-none focus:border-border-strong"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowBatchTagModal(false)}
                className="px-3 py-1.5 border border-border-default rounded text-[12px] text-text-primary"
              >
                取消
              </button>
              <button
                onClick={handleApplyBatchTags}
                className="px-4 py-1.5 bg-action-primary text-white rounded text-[12px] font-semibold"
              >
                确认应用
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Material Detail Drawer */}
      <MaterialDetailDrawer
        asset={selectedAssetForDetail}
        onClose={() => setSelectedAssetForDetail(null)}
        onUpdateAsset={handleUpdateAsset}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={handleAddMaterial}
      />

      {/* Shooting Task Proposal Modal */}
      <ShootingTaskProposalModal
        isOpen={showShootingTaskModal}
        onClose={() => setShowShootingTaskModal(false)}
        onNavigateToExecution={onNavigateToExecution}
      />

    </div>
  );
};

