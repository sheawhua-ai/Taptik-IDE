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

  // 顶部状态切换：可用 / 使用中 / 已使用 (默认进入 "可用", Section 4.3)
  const [activeStatus, setActiveStatus] = useState<AssetStatus>('available');

  // AI自然语言搜索 (Section 4.2)
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 筛选器状态 (Section 4.4)
  const [filterState, setFilterState] = useState<FilterState>({
    sourceProject: '',
    sourceTask: '',
    mediaType: 'all',
    store: '',
    timeRange: '',
    usedProject: ''
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
      in_use: assets.filter((a) => a.status === 'in_use').length,
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

  const availableStores = useMemo(() => {
    const set = new Set<string>();
    assets.forEach((a) => {
      if (a.store) set.add(a.store);
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
        filterState.sourceProject &&
        asset.sourceProject !== filterState.sourceProject
      ) {
        return false;
      }

      // 3. 执行门店匹配
      if (filterState.store && asset.store !== filterState.store) {
        return false;
      }

      // 4. 媒体类型匹配
      if (filterState.mediaType !== 'all') {
        if (asset.type !== filterState.mediaType) return false;
      }

      // 5. 自然语言与多维度关键词模糊搜索 (Section 4.2: 画面主体、产品、场景、一句话理解、OCR等)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchUnderstanding = asset.oneSentenceUnderstanding
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
        const matchOcr =
          asset.fullAiAnalysis.ocrText?.toLowerCase().includes(q) || false;
        const matchProject = asset.sourceProject.toLowerCase().includes(q);
        const matchTask = asset.sourceTask.toLowerCase().includes(q);

        if (
          !matchUnderstanding &&
          !matchSubject &&
          !matchProduct &&
          !matchScene &&
          !matchOcr &&
          !matchProject &&
          !matchTask
        ) {
          return false;
        }
      }

      return true;
    });
  }, [assets, activeStatus, filterState, searchQuery]);

  // 一句话理解人工修改并同步更新向量与历史 (Section 8.2 & 8.3)
  const handleUpdateUnderstanding = async (
    assetId: string,
    newText: string
  ): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    setAssets((prev) =>
      prev.map((a) => {
        if (a.id !== assetId) return a;
        const newHistoryItem = {
          id: `uh_${Date.now()}`,
          version: a.understandingHistory.length + 1,
          text: newText,
          updatedBy: '主操盘手 (人工修正)',
          updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
        };
        const updatedAsset = {
          ...a,
          oneSentenceUnderstanding: newText,
          understandingHistory: [newHistoryItem, ...a.understandingHistory]
        };
        if (selectedAssetForDetail?.id === assetId) {
          setSelectedAssetForDetail(updatedAsset);
        }
        return updatedAsset;
      })
    );
  };

  // 卡片选择 / 占用事件 (Section 10 素材占用与一次性使用)
  const handleSelectAsset = (asset: MaterialAsset) => {
    const targetTitle =
      activeProject?.name || '极宠家-幼犬换粮攻略种草日记(主推文)';
    const updatedAsset: MaterialAsset = {
      ...asset,
      status: 'in_use',
      usageRecords: [
        {
          id: `rec_${Date.now()}`,
          noteTitle: targetTitle,
          project: asset.sourceProject,
          strategy: '核心词卡位打法',
          account: '极宠家旗舰店-店长日常',
          publishTime: '占用中（待发布）',
          status: 'using',
          operator: '当前操盘手'
        },
        ...asset.usageRecords
      ]
    };

    setAssets((prev) => prev.map((a) => (a.id === asset.id ? updatedAsset : a)));
    alert(
      `已将该素材选定占用至笔记【${targetTitle}】。\n根据一次性使用原则，素材状态已变更为“使用中（锁定中）”，不再对其他发布任务开放。`
    );
  };

  // 微调生成衍生版本逻辑 (Section 11)
  const handleConfirmDerive = async (
    parentAsset: MaterialAsset,
    modType: string
  ): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const derivativeUnderstanding = `基于优秀已使用爆款【${
      parentAsset.shotName
    }】制作的衍生版：进行了【${modType}】。画面保留高表现力核心特征，色彩通透清晰，可作为新的可用素材进行跨项目分发。`;

    const newDerivative: MaterialAsset = {
      id: `mat_der_${Date.now().toString().slice(-4)}`,
      type: parentAsset.type,
      url: parentAsset.url,
      oneSentenceUnderstanding: derivativeUnderstanding,
      recommendationUse: parentAsset.recommendationUse,
      drawback: '由AI微调生成，具备原素材爆款基因',
      status: 'available',
      merchant: parentAsset.merchant,
      sourceProject: parentAsset.sourceProject,
      sourceTask: parentAsset.sourceTask + ' (衍生微调流水线)',
      shotName: parentAsset.shotName + '·衍生版',
      store: parentAsset.store,
      executor: 'AI素材引擎（微调复用生成）',
      uploadTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
      fileInfo: parentAsset.fileInfo,
      understandingHistory: [
        {
          id: `uh_der_${Date.now()}`,
          version: 1,
          text: derivativeUnderstanding,
          updatedBy: 'AI视觉引擎 (衍生版多模态理解)',
          updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
        }
      ],
      usageRecords: [],
      derivationInfo: {
        parentId: parentAsset.id,
        parentName: parentAsset.oneSentenceUnderstanding.slice(0, 18) + '...',
        familyId:
          parentAsset.derivationInfo?.familyId ||
          `fam_${parentAsset.id.slice(-4)}`,
        modificationType: modType,
        createdBy: '主操盘手 (激活微调)',
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        originNoteTitle:
          parentAsset.usageRecords[0]?.noteTitle || '换粮避坑口碑笔记',
        originPerformance:
          parentAsset.usageRecords[0]?.performanceData ||
          '收藏率与互动明显高出类目平均值42%'
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
      oneSentenceUnderstanding:
        '品牌早期沉淀的线下到店实拍场景，包含萌犬日常及宠物主亲密喂食画面，自然真实，无显式广告文案。',
      recommendationUse: '通用到店体验、品牌可信度故事图',
      drawback: '历史图库分辨率稍逊于新拍机型',
      status: 'available',
      merchant: '极宠家旗舰店（上海总部）',
      sourceProject: '2025年到店体验计划 (历史导入)',
      sourceTask: '历史图库全量迁移',
      shotName: '历史档案-真实到店喂养',
      store: '上海总部样板间',
      executor: '历史图库管理员',
      uploadTime: '2025-11-15 10:00',
      isHistoricalImport: true,
      fileInfo: {
        resolution: '2048x1536',
        format: 'JPEG',
        size: '1.8 MB',
        aspectRatio: '4:3'
      },
      understandingHistory: [
        {
          id: `uh_hist_${Date.now()}`,
          version: 1,
          text: '品牌早期沉淀的线下到店实拍场景，包含萌犬日常及宠物主亲密喂食画面，自然真实，无显式广告文案。',
          updatedBy: 'AI视觉引擎 (历史图全量多模态转译)',
          updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
        }
      ],
      usageRecords: [],
      fullAiAnalysis: {
        subject: '历史到店萌犬相册图',
        product: '极宠家早期试喂礼盒',
        scene: '线下门店体验区',
        action: '自然到店互动',
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
            availableStores={availableStores}
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
                  没有找到符合全部条件的可用素材。
                </h3>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                    if (searchInput) searchInput.focus();
                  }}
                  className="px-4 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-800 font-extrabold text-[13px] rounded-xl transition-all shadow-2xs"
                >
                  调整描述
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterState({
                      sourceProject: '',
                      sourceTask: '',
                      mediaType: 'all',
                      store: '',
                      timeRange: '',
                      usedProject: ''
                    });
                  }}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-[13px] rounded-xl transition-all shadow-2xs"
                >
                  查看相近素材
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
