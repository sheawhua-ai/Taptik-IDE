import React, { useState } from 'react';
import {
  Upload, Search, Filter, MoreHorizontal, Sparkles,
  FileText, History, Trash2, ShieldCheck, CheckSquare, X, Plus
} from 'lucide-react';
import { AssetStatus, FilterState, AssetSourceType } from './types';

interface MaterialHeaderProps {
  activeStatus: AssetStatus;
  onChangeStatus: (status: AssetStatus) => void;
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
  filterState: FilterState;
  onChangeFilterState: (newState: FilterState) => void;
  availableProjects: string[];
  availableTasks: string[];
  availableUploaders: string[];
  onOpenUploadModal: () => void;
  onOpenNoteMatching: () => void;
  onImportHistory: () => void;
  statusCounts: { available: number; pending: number; reserved: number; used: number };
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
  availableUploaders,
  onOpenUploadModal,
  onOpenNoteMatching,
  onImportHistory,
  statusCounts
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);
  const [showFilterPopover, setShowFilterPopover] = useState<boolean>(false);

  const getStatusLabel = (status: AssetStatus) => {
    switch (status) {
      case 'available': return '可用';
      case 'reserved': return '已预占';
      case 'used': return '已使用';
      case 'pending': return '待审核';
      case 'unavailable': return '不可用';
      case 'optimizing': return '优化中';
      default: return '未知状态';
    }
  };

  const getFilterNaturalSummary = () => {
    const parts: string[] = [];
    if (filterState.project) {
      parts.push(`${filterState.project}项目中`);
    }
    if (filterState.uploader) {
      parts.push(`由${filterState.uploader}上传`);
    }
    if (filterState.sourceType !== 'all') {
      const typeMap: Record<string, string> = {
        operator: '操盘手上传',
        clerk: '店员上传',
        consumer: '消费者/KOC上传',
        ai_optimized: 'AI优化生成',
        other: '其他渠道'
      };
      parts.push(`来源为${typeMap[filterState.sourceType as string] || ''}`);
    }
    if (filterState.suitableForCover !== 'all') {
      parts.push(filterState.suitableForCover === 'true' ? '适合做封面' : '不适合做封面');
    }

    if (parts.length === 0) {
      return `正在查看所有【${getStatusLabel(activeStatus)}】素材`;
    }
    return `正在查看“${parts.join('、')}”的【${getStatusLabel(activeStatus)}】素材`;
  };

  const hasActiveFilters =
    filterState.project ||
    filterState.uploader ||
    filterState.sourceType !== 'all' ||
    filterState.suitableForCover !== 'all' ||
    filterState.timeRange;

  const resetFilters = () => {
    onChangeFilterState({
      status: [],
      sourceType: 'all',
      uploader: '',
      project: '',
      suitableForCover: 'all',
      timeRange: ''
    });
    setShowFilterPopover(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[20px] font-black text-neutral-900 tracking-tight">
              素材中心
            </h1>
          </div>
          <p className="text-[13px] font-medium text-neutral-500">
            管理当前商家的云端素材，以及素材与笔记的使用关系。
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => alert('新建素材任务（跳转或打开表单）')}
            className="px-3.5 py-2 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 font-bold text-[12.5px] rounded-xl flex items-center gap-1.5 shadow-2xs transition-all active:scale-[0.98]"
          >
            <Plus size={15} />
            <span>创建素材任务</span>
          </button>

          <button
            type="button"
            onClick={onOpenUploadModal}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-[12.5px] rounded-xl flex items-center gap-1.5 shadow-2xs transition-all active:scale-[0.98]"
          >
            <Upload size={15} />
            <span>上传素材</span>
          </button>

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
                    alert('当前支持通过系统接口对接外部图库。所有外部素材统一接入云端素材库。');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-neutral-100 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <History size={15} className="text-neutral-500" />
                  <span>接入其他云端来源</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onChangeSearchQuery(e.target.value)}
          placeholder="描述需要的画面，例如“幼犬与产品同时出现，背景干净，适合作为封面”"
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

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-neutral-100/80 p-1 rounded-2xl border border-neutral-200/80 self-start overflow-x-auto">
          {(['available', 'reserved', 'used', 'pending'] as AssetStatus[]).map(status => (
            <button
              key={status}
              type="button"
              onClick={() => onChangeStatus(status)}
              className={`px-4 py-2 rounded-xl text-[13px] font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeStatus === status
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span>{getStatusLabel(status)}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-neutral-200 text-neutral-800 text-[11px] font-black">
                {statusCounts[status as keyof typeof statusCounts] || 0}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-[12.5px] font-bold text-neutral-500 hidden lg:block max-w-[200px] truncate" title={getFilterNaturalSummary()}>
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
              <span>高级筛选</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>

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
                      value={filterState.project}
                      onChange={(e) => onChangeFilterState({ ...filterState, project: e.target.value })}
                      className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-800"
                    >
                      <option value="">全部来源项目</option>
                      {availableProjects.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-neutral-500 font-extrabold block mb-1">上传者</label>
                    <select
                      value={filterState.uploader}
                      onChange={(e) => onChangeFilterState({ ...filterState, uploader: e.target.value })}
                      className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-800"
                    >
                      <option value="">全部上传者</option>
                      {availableUploaders?.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-neutral-500 font-extrabold block mb-1">来源类型</label>
                    <select
                      value={filterState.sourceType}
                      onChange={(e) => onChangeFilterState({ ...filterState, sourceType: e.target.value as AssetSourceType | 'all' })}
                      className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-800"
                    >
                      <option value="all">全部来源</option>
                      <option value="operator">操盘手</option>
                      <option value="clerk">店员</option>
                      <option value="consumer">消费者/KOC</option>
                      <option value="ai_optimized">AI优化生成</option>
                      <option value="other">其他渠道</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-neutral-500 font-extrabold block mb-1">是否适合封面</label>
                    <select
                      value={filterState.suitableForCover}
                      onChange={(e) => onChangeFilterState({ ...filterState, suitableForCover: e.target.value as 'all'|'true'|'false' })}
                      className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-800"
                    >
                      <option value="all">不限</option>
                      <option value="true">适合作为封面</option>
                      <option value="false">仅适合正文</option>
                    </select>
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
