import React, { useState } from 'react';
import {
  Upload, Search, Filter, MoreHorizontal, Sparkles,
  FileText, History, Trash2, ShieldCheck, CheckSquare, X, Plus
} from 'lucide-react';
import { MaterialStatus, FilterState, MaterialSourceType } from './types';

interface MaterialHeaderProps {
  activeStatus: MaterialStatus;
  onChangeStatus: (status: MaterialStatus) => void;
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

  const getStatusLabel = (status: MaterialStatus) => {
    switch (status) {
      case 'available': return '可用';
      case 'reserved': return '已预占';
      case 'used': return '已使用';
      case 'pending_acceptance': return '待验收';
      case 'archived': return '已归档';
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-1 p-5 rounded-xl border border-border-default/80 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[20px] font-black text-text-main tracking-tight">
              素材中心
            </h1>
          </div>
          <p className="text-[13px] font-medium text-text-tertiary">
            管理当前商家的云端素材，以及素材与笔记的使用关系。
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => alert('新建素材任务（跳转或打开表单）')}
            className="px-3.5 py-2 bg-surface-1 hover:bg-page-bg text-text-main border border-border-default font-bold text-[12.5px] rounded-xl flex items-center gap-1.5 shadow-2xs transition-all active:scale-[0.98]"
          >
            <Plus size={15} />
            <span>创建素材任务</span>
          </button>

          <button
            type="button"
            onClick={onOpenUploadModal}
            className="px-4 py-2 bg-btn-main hover:bg-btn-main-hover text-white font-extrabold text-[12.5px] rounded-xl flex items-center gap-1.5 shadow-2xs transition-all active:scale-[0.98]"
          >
            <Upload size={15} />
            <span>上传素材</span>
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2 bg-surface-1 hover:bg-page-bg text-text-secondary border border-border-default rounded-xl transition-all"
              title="更多控制"
            >
              <MoreHorizontal size={18} />
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 top-11 w-48 bg-surface-1 rounded-xl border border-border-default shadow-xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150 text-[13px] font-bold text-text-secondary">
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    alert('当前支持通过系统接口对接外部图库。所有外部素材统一接入云端素材库。');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-hover-bg rounded-xl flex items-center gap-2 transition-colors"
                >
                  <History size={15} className="text-text-tertiary" />
                  <span>接入其他云端来源</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-tertiary">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onChangeSearchQuery(e.target.value)}
          placeholder="描述需要的画面，例如“幼犬与产品同时出现，背景干净，适合作为封面”"
          className="w-full pl-11 pr-4 py-3.5 bg-surface-1 border border-border-default/90 rounded-xl text-[14px] font-medium text-text-main placeholder:text-text-tertiary focus:outline-hidden focus:border-neutral-900 shadow-xs transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onChangeSearchQuery('')}
            className="absolute inset-y-0 right-3 pr-2 flex items-center text-text-tertiary hover:text-text-secondary"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-hover-bg/80 p-1 rounded-xl border border-border-default/80 self-start overflow-x-auto">
          {(['available', 'reserved', 'used', 'pending_acceptance', 'archived'] as MaterialStatus[]).map(status => (
            <button
              key={status}
              type="button"
              onClick={() => onChangeStatus(status)}
              className={`px-4 py-2 rounded-xl text-[13px] font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeStatus === status
                  ? 'bg-surface-1 text-text-main shadow-xs'
                  : 'text-text-secondary hover:text-text-main'
              }`}
            >
              <span>{getStatusLabel(status)}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-neutral-200 text-text-main text-[11px] font-black">
                {statusCounts[status as keyof typeof statusCounts] || 0}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-[12.5px] font-bold text-text-tertiary hidden lg:block max-w-[200px] truncate" title={getFilterNaturalSummary()}>
            {getFilterNaturalSummary()}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilterPopover(!showFilterPopover)}
              className={`px-3.5 py-2 rounded-xl border text-[13px] font-extrabold flex items-center gap-1.5 transition-all ${
                hasActiveFilters
                  ? 'bg-btn-main text-white border-neutral-900 shadow-2xs'
                  : 'bg-surface-1 hover:bg-page-bg text-text-main border-border-default'
              }`}
            >
              <Filter size={15} />
              <span>高级筛选</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>

            {showFilterPopover && (
              <div className="absolute right-0 top-11 w-80 bg-surface-1 rounded-2xl border border-border-default shadow-2xl p-5 z-40 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b pb-2.5">
                  <span className="font-black text-[14px] text-text-main">细分维度条件</span>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-[11.5px] font-bold text-brand-logo hover:underline"
                  >
                    重置筛选
                  </button>
                </div>

                <div className="space-y-3 text-[12.5px]">
                  <div>
                    <label className="text-text-tertiary font-extrabold block mb-1">来源项目</label>
                    <select
                      value={filterState.project}
                      onChange={(e) => onChangeFilterState({ ...filterState, project: e.target.value })}
                      className="w-full p-2 bg-page-bg border border-border-default rounded-xl font-bold text-text-main"
                    >
                      <option value="">全部来源项目</option>
                      {availableProjects.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-text-tertiary font-extrabold block mb-1">上传者</label>
                    <select
                      value={filterState.uploader}
                      onChange={(e) => onChangeFilterState({ ...filterState, uploader: e.target.value })}
                      className="w-full p-2 bg-page-bg border border-border-default rounded-xl font-bold text-text-main"
                    >
                      <option value="">全部上传者</option>
                      {availableUploaders?.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-text-tertiary font-extrabold block mb-1">来源类型</label>
                    <select
                      value={filterState.sourceType}
                      onChange={(e) => onChangeFilterState({ ...filterState, sourceType: e.target.value as MaterialSourceType | 'all' })}
                      className="w-full p-2 bg-page-bg border border-border-default rounded-xl font-bold text-text-main"
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
                    <label className="text-text-tertiary font-extrabold block mb-1">是否适合封面</label>
                    <select
                      value={filterState.suitableForCover}
                      onChange={(e) => onChangeFilterState({ ...filterState, suitableForCover: e.target.value as 'all'|'true'|'false' })}
                      className="w-full p-2 bg-page-bg border border-border-default rounded-xl font-bold text-text-main"
                    >
                      <option value="all">不限</option>
                      <option value="true">适合作为封面</option>
                      <option value="false">仅适合正文</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-border-default flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowFilterPopover(false)}
                    className="px-4 py-2 bg-btn-main text-white font-extrabold text-[12.5px] rounded-xl shadow-2xs"
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
        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-hover-bg/80 border border-border-default/80 text-[12.5px]">
          <span className="font-extrabold text-text-main">
            {getFilterNaturalSummary()}
          </span>
          <button
            type="button"
            onClick={resetFilters}
            className="text-[12px] font-bold text-text-tertiary hover:text-text-main flex items-center gap-1"
          >
            <X size={14} /> 清除全部筛选
          </button>
        </div>
      )}
    </div>
  );
};
