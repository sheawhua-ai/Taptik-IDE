import React, { useState } from 'react';
import {
  Upload, Search, Filter, MoreHorizontal, Sparkles,
  FileText, History, Trash2, ShieldCheck, CheckSquare, X
} from 'lucide-react';
import { AssetStatus, FilterState } from './types';

interface MaterialHeaderProps {
  activeStatus: AssetStatus;
  onChangeStatus: (status: AssetStatus) => void;
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
  filterState: FilterState;
  onChangeFilterState: (newState: FilterState) => void;
  availableProjects: string[];
  availableTasks: string[];
  availableStores: string[];
  onOpenUploadModal: () => void;
  onOpenNoteMatching: () => void;
  onImportHistory: () => void;
  statusCounts: { available: number; in_use: number; used: number };
}

export const MaterialHeader: React.FC<MaterialHeaderProps> = ({
  activeStatus,
  onChangeStatus,
  searchQuery,
  onChangeSearchQuery,
  filterState,
  onChangeFilterState,
  availableProjects,
  availableTasks,
  availableStores,
  onOpenUploadModal,
  onOpenNoteMatching,
  onImportHistory,
  statusCounts
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);
  const [showFilterPopover, setShowFilterPopover] = useState<boolean>(false);

  // 状态中文映射 (Section 4.3 极简状态)
  const getStatusLabel = (status: AssetStatus) => {
    switch (status) {
      case 'available':
        return '可用';
      case 'in_use':
        return '使用中';
      case 'used':
        return '已使用';
    }
  };

  // 组装自然语言转译筛选说明句 (Section 4.4)
  const getFilterNaturalSummary = () => {
    const parts: string[] = [];
    if (filterState.sourceProject) {
      parts.push(`${filterState.sourceProject}中`);
    }
    if (filterState.store) {
      parts.push(`由${filterState.store}收集`);
    }
    const mediaLabel =
      filterState.mediaType === 'image'
        ? '的图片'
        : filterState.mediaType === 'video'
        ? '的视频'
        : '的素材';

    if (parts.length === 0) {
      return `正在查看当前商家所有【${getStatusLabel(activeStatus)}】${mediaLabel}`;
    }
    return `正在查看“${parts.join('')}、当前${getStatusLabel(activeStatus)}”${mediaLabel}`;
  };

  const hasActiveFilters =
    filterState.sourceProject ||
    filterState.sourceTask ||
    filterState.store ||
    filterState.mediaType !== 'all' ||
    filterState.timeRange;

  const resetFilters = () => {
    onChangeFilterState({
      sourceProject: '',
      sourceTask: '',
      mediaType: 'all',
      store: '',
      timeRange: '',
      usedProject: ''
    });
    setShowFilterPopover(false);
  };

  return (
    <div className="space-y-4">
      {/* 4.1 页面头部：标题 + 副标题 + 补充上传 + 更多 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[20px] font-black text-neutral-900 tracking-tight">
              素材中心
            </h1>
          </div>
          <p className="text-[13px] font-medium text-neutral-500">
            当前商家全量可用与已用素材，支持自然语言检索与跨项目调用。
          </p>
        </div>

        {/* 右上角操作区：补充上传(次级操作) + 更多菜单 */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* 补充上传按钮 (次级操作) */}
          <button
            type="button"
            onClick={onOpenUploadModal}
            className="px-3.5 py-2 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 font-bold text-[12.5px] rounded-xl flex items-center gap-1.5 shadow-2xs transition-all active:scale-[0.98]"
          >
            <Upload size={15} />
            <span>补充上传</span>
          </button>

          {/* 更多菜单 (Section 4.1: 导入历史素材、存储规则、回收站、批量管理) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 rounded-xl transition-all"
              title="更多控制"
            >
              <MoreHorizontal size={18} />
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 top-11 w-48 bg-white rounded-2xl border border-neutral-200 shadow-xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150 text-[13px] font-bold text-neutral-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    onImportHistory();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-neutral-100 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <History size={15} className="text-neutral-500" />
                  <span>导入历史素材</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    alert('【商家级存储规则】\n当前商家统一素材池不限空间；原始文件与AI多模态向量自动三副本冷热分层备份，历史来源永久追溯。');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-neutral-100 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <ShieldCheck size={15} className="text-neutral-500" />
                  <span>存储规则</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    alert('【素材回收站】\n被用户删除或去重的历史素材将保留30天以供恢复；正处于“使用中”或“已使用”的素材无法直接删入回收站。');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-neutral-100 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <Trash2 size={15} className="text-neutral-500" />
                  <span>回收站 (0)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    alert('【批量管理】\n请选择列表素材进行跨项目绑定查看或导出原图。');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-neutral-100 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <CheckSquare size={15} className="text-neutral-500" />
                  <span>批量管理</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4.2 AI自然语言搜索栏 (顶部核心位置) */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onChangeSearchQuery(e.target.value)}
          placeholder="描述你想找的画面，例如“幼犬和产品同时出现、背景干净、还没有使用过”"
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-neutral-200/90 rounded-2xl text-[14px] font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 shadow-xs transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onChangeSearchQuery('')}
            className="absolute inset-y-0 right-3 pr-2 flex items-center text-neutral-400 hover:text-neutral-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* 4.3 极简中性状态切换 (可用 / 使用中 / 已使用) + 4.4 筛选浮层 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* 不使用红点和多种颜色，全部使用中性色 */}
        <div className="flex items-center gap-1.5 bg-neutral-100/80 p-1 rounded-2xl border border-neutral-200/80 self-start">
          <button
            type="button"
            onClick={() => onChangeStatus('available')}
            className={`px-4 py-2 rounded-xl text-[13px] font-extrabold transition-all flex items-center gap-1.5 ${
              activeStatus === 'available'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>可用</span>
            <span className="px-1.5 py-0.5 rounded-full bg-neutral-200 text-neutral-800 text-[11px] font-black">
              {statusCounts.available}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onChangeStatus('in_use')}
            className={`px-4 py-2 rounded-xl text-[13px] font-extrabold transition-all flex items-center gap-1.5 ${
              activeStatus === 'in_use'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>使用中</span>
            <span className="px-1.5 py-0.5 rounded-full bg-neutral-200 text-neutral-800 text-[11px] font-black">
              {statusCounts.in_use}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onChangeStatus('used')}
            className={`px-4 py-2 rounded-xl text-[13px] font-extrabold transition-all flex items-center gap-1.5 ${
              activeStatus === 'used'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>已使用</span>
            <span className="px-1.5 py-0.5 rounded-full bg-neutral-200 text-neutral-800 text-[11px] font-black">
              {statusCounts.used}
            </span>
          </button>
        </div>

        {/* 4.4 主页面只显示一个“筛选”按钮 -> 点击打开轻量浮层 */}
        <div className="flex items-center gap-3">
          <div className="text-[12.5px] font-bold text-neutral-500 hidden lg:block">
            {getFilterNaturalSummary()}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilterPopover(!showFilterPopover)}
              className={`px-3.5 py-2 rounded-xl border text-[13px] font-extrabold flex items-center gap-1.5 transition-all ${
                hasActiveFilters
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs'
                  : 'bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200'
              }`}
            >
              <Filter size={15} />
              <span>筛选</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>

            {/* 轻量筛选浮层 (Section 4.4) */}
            {showFilterPopover && (
              <div className="absolute right-0 top-11 w-80 bg-white rounded-3xl border border-neutral-200 shadow-2xl p-5 z-40 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b pb-2.5">
                  <span className="font-black text-[14px] text-neutral-900">细分维度条件</span>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-[11.5px] font-bold text-primary-600 hover:underline"
                  >
                    重置筛选
                  </button>
                </div>

                <div className="space-y-3 text-[12.5px]">
                  <div>
                    <label className="text-neutral-500 font-extrabold block mb-1">来源项目</label>
                    <select
                      value={filterState.sourceProject}
                      onChange={(e) => onChangeFilterState({ ...filterState, sourceProject: e.target.value })}
                      className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-800"
                    >
                      <option value="">全部来源项目</option>
                      {availableProjects.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-neutral-500 font-extrabold block mb-1">执行门店</label>
                    <select
                      value={filterState.store}
                      onChange={(e) => onChangeFilterState({ ...filterState, store: e.target.value })}
                      className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-800"
                    >
                      <option value="">全部执行门店</option>
                      {availableStores.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-neutral-500 font-extrabold block mb-1">媒体类型</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['all', 'image', 'video'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => onChangeFilterState({ ...filterState, mediaType: type })}
                          className={`py-1.5 rounded-lg text-center font-extrabold transition-all border ${
                            filterState.mediaType === type
                              ? 'bg-neutral-900 text-white border-neutral-900'
                              : 'bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-200'
                          }`}
                        >
                          {type === 'all' ? '全部' : type === 'image' ? '仅图片' : '仅视频'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowFilterPopover(false)}
                    className="px-4 py-2 bg-neutral-900 text-white font-extrabold text-[12.5px] rounded-xl shadow-2xs"
                  >
                    确认筛选
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 当存在高级筛选时，下方呈现一行自然语言反馈并可点击清除 */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-neutral-100/80 border border-neutral-200/80 text-[12.5px]">
          <span className="font-extrabold text-neutral-800">
            {getFilterNaturalSummary()}
          </span>
          <button
            type="button"
            onClick={resetFilters}
            className="text-[12px] font-bold text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
          >
            <X size={14} /> 清除全部筛选
          </button>
        </div>
      )}
    </div>
  );
};
