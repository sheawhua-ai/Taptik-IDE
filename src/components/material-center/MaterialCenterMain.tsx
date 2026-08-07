import React, { useState, useMemo } from 'react';
import {
  MaterialAsset,
  CollectionTask,
  AssetStatus,
  FilterState
} from './types';
import {
  INITIAL_ASSETS,
  INITIAL_COLLECTION_TASKS,
  MOCK_NOTE_DRAFT
} from './mockData';
import { MaterialHeader } from './MaterialHeader';
import { MaterialCard } from './MaterialCard';
import { MaterialDetailDrawer } from './MaterialDetailDrawer';
import { FineTuneModal } from './FineTuneModal';
import { UploadModal } from './UploadModal';
import { NoteMatchingModal } from './NoteMatchingModal';
import { CollectionTaskTab } from './CollectionTaskTab';
import {
  Image as ImageIcon,
  CheckSquare,
  Search,
  Sparkles,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  FolderOpen
} from 'lucide-react';

interface MaterialCenterMainProps {
  activeProject?: any;
}

export const MaterialCenterMain: React.FC<MaterialCenterMainProps> = ({
  activeProject
}) => {
  // 一级页签：只保留 2 个 (Section 3 "页面信息架构")
  const [topLevelTab, setTopLevelTab] = useState<'materials' | 'tasks'>(
    'materials'
  );

  // 素材池列表与收集任务列表状态
  const [assets, setAssets] = useState<MaterialAsset[]>(INITIAL_ASSETS);
  const [tasks, setTasks] = useState<CollectionTask[]>(
    INITIAL_COLLECTION_TASKS
  );

  // 顶部状态切换：待审核 / 可用 / 已预占 / 已使用
  const [activeStatus, setActiveStatus] = useState<AssetStatus>('available');

  // AI自然语言搜索
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 筛选器状态
  const [filterState, setFilterState] = useState<FilterState>({
    status: [],
    sourceType: 'all',
    uploader: '',
    project: '',
    suitableForCover: 'all',
    timeRange: ''
  });

  // Modals & Drawers 状态
  const [selectedAssetForDetail, setSelectedAssetForDetail] =
    useState<MaterialAsset | null>(null);
  const [selectedAssetForFineTune, setSelectedAssetForFineTune] =
    useState<MaterialAsset | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showNoteMatchingModal, setShowNoteMatchingModal] =
    useState<boolean>(false);

  // 计算各状态下素材数量
  const statusCounts = useMemo(() => {
    return {
      available: assets.filter((a) => a.status === 'available').length,
      pending: assets.filter((a) => a.status === 'pending').length,
      reserved: assets.filter((a) => a.status === 'reserved').length,
      used: assets.filter((a) => a.status === 'used').length
    };
  }, [assets]);

  // 获取所有可选的项目和门店供筛选使用
  const availableProjects = useMemo(() => {
    const set = new Set<string>();
    assets.forEach((a) => {
      if (a.sourceProject) set.add(a.sourceProject);
    });
    return Array.from(set);
  }, [assets]);

  const availableUploaders = useMemo(() => {
    const set = new Set<string>();
    assets.forEach((a) => {
      if (a.uploader) set.add(a.uploader);
    });
    return Array.from(set);
  }, [assets]);

  // 过滤当前展示的素材
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // 1. 状态匹配
      if (asset.status !== activeStatus) return false;

      // 2. 来源项目匹配
      if (
        filterState.project &&
        asset.sourceProject !== filterState.project
      ) {
        return false;
      }

      // 3. 上传者匹配
      if (filterState.uploader && asset.uploader !== filterState.uploader) {
        return false;
      }

      // 4. 来源类型
      if (filterState.sourceType !== 'all') {
        if (asset.sourceType !== filterState.sourceType) return false;
      }

      // 5. 封面匹配
      if (filterState.suitableForCover !== 'all') {
        const isCover = asset.suitableForCover === 'suitable' || asset.suitableForCover === 'optimized_suitable';
        if (filterState.suitableForCover === 'true' && !isCover) return false;
        if (filterState.suitableForCover === 'false' && isCover) return false;
      }

      // 自然语言搜索
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchUnderstanding = asset.aiOneLineUnderstanding
          .toLowerCase()
          .includes(q);
        const matchSubject = asset.fullAiAnalysis.subject
          .toLowerCase()
          .includes(q);
        const matchProduct = asset.fullAiAnalysis.product
          .toLowerCase()
          .includes(q);
        const matchScene = asset.fullAiAnalysis.scene
          .toLowerCase()
          .includes(q);
        const matchProject = (asset.sourceProject || '').toLowerCase().includes(q);

        if (
          !matchUnderstanding &&
          !matchSubject &&
          !matchProduct &&
          !matchScene &&
          !matchProject
        ) {
          return false;
        }
      }

      return true;
    });
  }, [assets, activeStatus, filterState, searchQuery]);

  // 一句话理解人工修改
  const handleUpdateUnderstanding = async (
    assetId: string,
    newText: string
  ): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    setAssets((prev) =>
      prev.map((a) => {
        if (a.id !== assetId) return a;
        const updatedAsset = {
          ...a,
          aiOneLineUnderstanding: newText,
        };
        if (selectedAssetForDetail?.id === assetId) {
          setSelectedAssetForDetail(updatedAsset);
        }
        return updatedAsset;
      })
    );
  };

  // 卡片选择 / 预占事件
  const handleSelectAsset = (asset: MaterialAsset) => {
    const targetTitle =
      activeProject?.name || '幼犬换粮攻略种草日记';
    const updatedAsset: MaterialAsset = {
      ...asset,
      status: 'reserved',
      linkedNoteTitle: targetTitle,
      usageRecords: [
        {
          id: `rec_${Date.now()}`,
          noteTitle: targetTitle,
          project: asset.sourceProject || '默认项目',
          publishTime: '预占中（待发布）',
          status: 'reserved',
          operator: '当前操盘手'
        },
        ...asset.usageRecords
      ]
    };

    setAssets((prev) => prev.map((a) => (a.id === asset.id ? updatedAsset : a)));
    alert(
      `已将该素材预占给笔记【${targetTitle}】。其他未发布笔记默认不可选择此素材。`
    );
  };

  // 微调生成衍生版本逻辑 (Section 11)
  const handleConfirmDerive = async (
    parentAsset: MaterialAsset,
    modType: string
  ): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const derivativeUnderstanding = `基于优秀已使用爆款制作的衍生版：进行了【${modType}】。画面保留高表现力核心特征，色彩通透清晰，可作为新的可用素材进行跨项目分发。`;

    const newDerivative: MaterialAsset = {
      id: `mat_der_${Date.now().toString().slice(-4)}`,
      type: parentAsset.type,
      url: parentAsset.url,
      aiOneLineUnderstanding: derivativeUnderstanding,
      recommendationUse: parentAsset.recommendationUse,
      suitableForCover: 'optimized_suitable',
      coverReason: 'AI优化后主体更清晰，背景更干净，适合作为封面使用。',
      status: 'available',
      sourceType: 'ai_optimized',
      sourceProject: parentAsset.sourceProject,
      sourceTask: (parentAsset.sourceTask || '') + ' (衍生微调流水线)',
      uploader: 'AI素材引擎',
      uploadTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
      authStatus: 'verified',
      fileInfo: parentAsset.fileInfo,
      usageRecords: [],
      derivationInfo: {
        parentId: parentAsset.id,
        parentName: parentAsset.aiOneLineUnderstanding.slice(0, 18) + '...',
        familyId:
          parentAsset.derivationInfo?.familyId ||
          `fam_${parentAsset.id.slice(-4)}`,
        modificationType: modType,
        createdBy: '主操盘手 (激活微调)',
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
      },
      fullAiAnalysis: {
        ...parentAsset.fullAiAnalysis,
        subject: `${parentAsset.fullAiAnalysis.subject} (微调衍生版)`
      }
    };

    setAssets((prev) => [newDerivative, ...prev]);
    alert(
      `衍生版本已完成 AI 画面理解、向量表征与检索索引更新！\n现已放入商家“可用”素材池，可直接跨项目调用。`
    );
  };

  // 补充上传成功写入
  const handleSuccessUpload = (newAsset: MaterialAsset) => {
    setAssets((prev) => [newAsset, ...prev]);
    setShowUploadModal(false);
  };

  // 导入历史素材处理 (兼容主页右上角“更多 - 导入历史素材” Section 4.1)
  const handleImportHistory = () => {
    const historicalAsset: MaterialAsset = {
      id: `mat_hist_${Date.now().toString().slice(-4)}`,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop&q=80',
      aiOneLineUnderstanding:
        '品牌早期沉淀的线下到店实拍场景，包含萌犬日常及宠物主亲密喂食画面，自然真实，无显式广告文案。',
      recommendationUse: '通用到店体验、品牌可信度故事图',
      suitableForCover: 'suitable',
      coverReason: '真实场景，自然光线。',
      status: 'available',
      sourceType: 'other',
      sourceProject: '2025年到店体验计划 (历史导入)',
      sourceTask: '历史图库全量迁移',
      uploader: '历史图库管理员',
      uploadTime: '2025-11-15 10:00',
      authStatus: 'verified',
      fileInfo: {
        resolution: '2048x1536',
        format: 'JPEG',
        size: '1.8 MB',
        aspectRatio: '4:3'
      },
      usageRecords: [],
      fullAiAnalysis: {
        subject: '历史到店萌犬相册图',
        product: '极宠家早期试喂礼盒',
        scene: '线下门店体验区',
        composition: '自然实拍构图',
        lightingColor: '暖色温馨氛围光'
      }
    };

    setAssets((prev) => [historicalAsset, ...prev]);
    alert(
      `已导入 1 张历史图库素材，AI引擎已为其生成统一【一句话理解】与语义检索向量，并统一标记为“来源：历史导入”。`
    );
  };


  return (
    <div className="w-full min-h-full bg-neutral-50/60 p-5 md:p-8 space-y-6 max-w-7xl mx-auto pb-20">
      {/* 跨一级页签切换栏：素材 / 拍摄任务 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-2 rounded-2xl border border-neutral-200 shadow-2xs">
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100/80 rounded-xl">
          <button
            type="button"
            onClick={() => setTopLevelTab('materials')}
            className={`px-6 py-2.5 rounded-lg font-black text-[14px] transition-all flex items-center gap-2 ${
              topLevelTab === 'materials'
                ? 'bg-neutral-900 text-white shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <ImageIcon size={17} />
            <span>素材</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-extrabold">
              {assets.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTopLevelTab('tasks')}
            className={`px-6 py-2.5 rounded-lg font-black text-[14px] transition-all flex items-center gap-2 ${
              topLevelTab === 'tasks'
                ? 'bg-neutral-900 text-white shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <CheckSquare size={17} />
            <span>拍摄任务</span>
            <span className="px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800 text-[11px] font-extrabold">
              {tasks.length}
            </span>
          </button>
        </div>
      </div>

      {/* 当处于“素材中心”标签时，呈现 4.1-4.4 顶部操作区、搜索、极简状态、画廊卡片及空状态 */}
      {topLevelTab === 'materials' ? (
        <div className="space-y-6">
          <MaterialHeader
            activeStatus={activeStatus}
            onChangeStatus={setActiveStatus}
            searchQuery={searchQuery}
            onChangeSearchQuery={setSearchQuery}
            filterState={filterState}
            onChangeFilterState={setFilterState}
            availableProjects={availableProjects}
            availableTasks={tasks.map((t) => t.taskName)}
            onOpenUploadModal={() => setShowUploadModal(true)}
            onOpenNoteMatching={() => setShowNoteMatchingModal(true)}
            onImportHistory={handleImportHistory}
            statusCounts={statusCounts}
          />

          {/* Section 5.1 画廊视图 (取消传统文件列表，卡片只展示图片、一句话理解与极简状态) */}
          {filteredAssets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAssets.map((asset) => (
                <MaterialCard
                  key={asset.id}
                  asset={asset}
                  onView={(a) => setSelectedAssetForDetail(a)}
                  onSelect={(a) => handleSelectAsset(a)}
                  onViewSimilar={(a) => {
                    // 悬停：查看相似画面
                    setSearchQuery(
                      a.fullAiAnalysis.subject.slice(0, 10) || '幼犬'
                    );
                  }}
                  onViewWhereUsed={(a) => {
                    // 悬停：查看使用去向 -> 弹开详情并定位
                    setSelectedAssetForDetail(a);
                  }}
                  onViewResults={(a) => {
                    // 悬停：查看效果
                    setSelectedAssetForDetail(a);
                  }}
                  onActivateFineTune={(a) => {
                    // 悬停：激活微调 (Section 5.3 & 11)
                    setSelectedAssetForFineTune(a);
                  }}
                />
              ))}
            </div>
          ) : (
            /* 空状态呈现 */
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-12 text-center space-y-4 max-w-xl mx-auto my-6">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                <ImageIcon size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-[17px] font-black text-neutral-900">
                  暂无符合要求的素材
                </h3>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setTopLevelTab('tasks');
                    alert('请稍后创建素材任务');
                  }}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-[13px] rounded-xl transition-all shadow-2xs"
                >
                  创建素材任务
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-800 font-extrabold text-[13px] rounded-xl transition-all shadow-2xs"
                >
                  上传素材
                </button>
                <button
                  type="button"
                  onClick={() => alert('请选择现有素材并点击AI优化')}
                  className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-extrabold text-[13px] rounded-xl transition-all shadow-2xs"
                >
                  用AI优化现有素材
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Section 13 当处于“收集任务”标签时，呈现任务卡片及各拍摄镜头要求 */
        <CollectionTaskTab
          tasks={tasks}
          allAssets={assets}
          onOpenUploadForTask={(task) => {
            setShowUploadModal(true);
          }}
          onViewAsset={(asset) => {
            setSelectedAssetForDetail(asset);
          }}
          onUpdateTask={(updatedTask) => {
            setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
          }}
        />
      )}

      {/* --- 全平台业务侧抽屉与模态层 --- */}

      {/* Section 12: 素材详情抽屉 (右侧抽屉，宽520-600px，没有技术分值) */}
      {selectedAssetForDetail && (
        <MaterialDetailDrawer
          asset={selectedAssetForDetail}
          onClose={() => setSelectedAssetForDetail(null)}
          onUpdateUnderstanding={handleUpdateUnderstanding}
          onActivateFineTune={(asset) => {
            setSelectedAssetForDetail(null);
            setSelectedAssetForFineTune(asset);
          }}
        />
      )}

      {/* Section 11: 已使用素材激活微调模态框 */}
      {selectedAssetForFineTune && (
        <FineTuneModal
          parentAsset={selectedAssetForFineTune}
          onClose={() => setSelectedAssetForFineTune(null)}
          onConfirmDerive={handleConfirmDerive}
        />
      )}

      {/* Section 7: 补充上传模态框 (需选项目与任务 + 模拟AI通过/不通过) */}
      {showUploadModal && (
        <UploadModal
          tasks={tasks}
          onClose={() => setShowUploadModal(false)}
          onSuccessUpload={handleSuccessUpload}
        />
      )}

      {/* Section 9: 笔记驱动素材匹配模态框 (扫描三层级，无置信度数字) */}
      {showNoteMatchingModal && (
        <NoteMatchingModal
          noteDraft={MOCK_NOTE_DRAFT}
          allAssets={assets}
          onClose={() => setShowNoteMatchingModal(false)}
          onSelectAssetForPosition={(posIndex, asset) => {
            handleSelectAsset(asset);
          }}
          onOpenCreateReshootTask={() => {
            setShowNoteMatchingModal(false);
            setTopLevelTab('tasks');
            alert('即将转入【收集任务】新建门店补拍任务页面');
          }}
          onViewAssetDetail={(asset) => {
            setSelectedAssetForDetail(asset);
          }}
        />
      )}
    </div>
  );
};
