import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Plus, Building2, BarChart2, CheckCircle2, ChevronRight, 
  X, AlertCircle, Archive, RotateCcw, AlertTriangle, Info, Check, ShieldAlert
} from 'lucide-react';
import { CreateMerchantModal } from './merchant/CreateMerchantModal';

interface ProjectSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Record<string, any>;
  activeProjectId: string;
  onSelect: (id: string) => void;
  onArchive?: (id: string) => void;
  onRestore?: (id: string) => void;
  onAddMerchant?: (merchantData: any) => void;
}

export const ProjectSwitcherModal: React.FC<ProjectSwitcherModalProps> = ({ 
  isOpen, 
  onClose, 
  projects, 
  activeProjectId, 
  onSelect,
  onArchive,
  onRestore,
  onAddMerchant
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "pending" | "archived">("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [projectToArchive, setProjectToArchive] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const allProjects = Object.values(projects).filter((p: any) => p.id !== "new-merchant");
  
  const activeCount = allProjects.filter((p: any) => p.status !== "archived" && p.stats?.profileCompleteness === 100).length;
  const pendingCount = allProjects.filter((p: any) => p.status !== "archived" && (p.stats?.profileCompleteness ?? 0) < 100).length;
  const archivedCount = allProjects.filter((p: any) => p.status === "archived").length;

  const filteredProjects = allProjects.filter((p: any) => {
    const isArchived = p.status === "archived";

    if (activeTab === "archived") {
      if (!isArchived) return false;
    } else {
      // For all, active, pending: exclude archived merchants unless in archived tab
      if (isArchived) return false;
      if (activeTab === "pending" && p.stats?.profileCompleteness === 100) return false;
      if (activeTab === "active" && (p.stats?.profileCompleteness ?? 0) < 100) return false;
    }

    const matchesSearch = 
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.tags?.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  const handleConfirmArchive = () => {
    if (!projectToArchive) return;
    const targetId = projectToArchive.id;
    const targetName = projectToArchive.name;
    
    if (onArchive) {
      onArchive(targetId);
    }
    
    setProjectToArchive(null);
    showToast(`商家「${targetName}」已成功归档`);
  };

  const handleRestoreMerchant = (e: React.MouseEvent, proj: any) => {
    e.stopPropagation();
    if (onRestore) {
      onRestore(proj.id);
    }
    showToast(`商家「${proj.name}」已成功恢复`);
  };

  return (
    <>
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] bg-btn-main/40 backdrop-blur-sm flex items-start justify-center pt-[8vh] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-surface-1 rounded-[24px] shadow-[0_24px_80px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col border border-border-default relative"
          >
            {/* Toast Feedback */}
            <AnimatePresence>
              {toastMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-neutral-900 text-white rounded-full shadow-lg text-[13px] flex items-center gap-2"
                >
                  <Check size={14} className="text-emerald-400" />
                  <span>{toastMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header Area */}
            <div className="px-8 pt-6 pb-5 border-b border-border-default flex flex-col space-y-5 bg-page-bg/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-btn-main rounded-xl flex items-center justify-center text-white shadow-sm">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-[18px] font-semibold text-text-main tracking-tight">切换商家</h2>
                      <span className="text-[13px] px-2 py-0.5 rounded-full bg-surface-subtle border border-border-default text-text-secondary">
                        共 {allProjects.length} 家
                      </span>
                    </div>
                    <p className="text-[13px] text-text-tertiary mt-0.5">管理与切换旗下各品牌商家账户、经营状态与归档记录</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5">
                  <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-btn-main text-white rounded-xl text-[13px] font-medium hover:opacity-90 transition-all shadow-sm active:scale-95"
                  >
                    <Plus size={15} />
                    新增商家
                  </button>
                  <button 
                    onClick={onClose} 
                    className="w-9 h-9 bg-hover-bg hover:bg-selected-bg text-text-secondary rounded-xl flex items-center justify-center transition-colors"
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative flex-1 group">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand-logo transition-colors" />
                  <input 
                    type="text"
                    placeholder="搜索商家名称、行业或标签..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 bg-surface-1 border border-border-default focus:border-brand-500 outline-none rounded-xl text-[13px] placeholder:text-text-tertiary transition-all shadow-2xs"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-main"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                
                <div className="flex items-center p-1 bg-hover-bg/70 rounded-xl border border-border-default/50">
                  <button 
                    onClick={() => setActiveTab('all')} 
                    className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${activeTab === 'all' ? 'bg-surface-1 text-text-main shadow-xs' : 'text-text-tertiary hover:text-text-secondary'}`}
                  >
                    全部 ({allProjects.length - archivedCount})
                  </button>
                  <button 
                    onClick={() => setActiveTab('active')} 
                    className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${activeTab === 'active' ? 'bg-surface-1 text-text-main shadow-xs' : 'text-text-tertiary hover:text-text-secondary'}`}
                  >
                    服务中 ({activeCount})
                  </button>
                  <button 
                    onClick={() => setActiveTab('pending')} 
                    className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${activeTab === 'pending' ? 'bg-surface-1 text-text-main shadow-xs' : 'text-text-tertiary hover:text-text-secondary'}`}
                  >
                    待冷启 ({pendingCount})
                  </button>
                  <button 
                    onClick={() => setActiveTab('archived')} 
                    className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all flex items-center gap-1.5 ${activeTab === 'archived' ? 'bg-surface-1 text-amber-700 shadow-xs font-semibold' : 'text-text-tertiary hover:text-text-secondary'}`}
                  >
                    <Archive size={12} className={activeTab === 'archived' ? 'text-amber-600' : 'text-text-tertiary'} />
                    <span>已归档 ({archivedCount})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* List Area */}
            <div className="flex-1 min-h-[340px] max-h-[58vh] overflow-y-auto custom-scrollbar bg-surface-1">
              <div className="flex flex-col">
                <div className="grid grid-cols-12 gap-4 px-8 py-3 text-[13px] text-text-tertiary font-medium uppercase tracking-wider border-b border-border-default bg-surface-1 sticky top-0 z-10 w-full">
                  <div className="col-span-4 lg:col-span-5">商家名称与属性</div>
                  <div className="col-span-4 lg:col-span-3">核心业务状态</div>
                  <div className="col-span-2 lg:col-span-2">完善度 / 状态</div>
                  <div className="col-span-2 lg:col-span-2 text-right">操作与管理</div>
                </div>

                {filteredProjects.map((proj: any) => {
                  const isActive = proj.id === activeProjectId;
                  const isArchived = proj.status === "archived";

                  return (
                    <div
                      key={proj.id}
                      onClick={() => {
                        if (!isArchived) {
                          onSelect(proj.id);
                        }
                      }}
                      className={`group w-full grid grid-cols-12 gap-4 items-center px-8 py-4 border-b border-border-default transition-all text-left ${
                        isArchived 
                          ? 'bg-page-bg/40 opacity-80 hover:opacity-100' 
                          : isActive 
                            ? 'bg-brand-light/40 relative' 
                            : 'hover:bg-page-bg cursor-pointer'
                      }`}
                    >
                      {isActive && !isArchived && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-btn-main" />
                      )}
                      
                      {/* Col 1: Brand Info */}
                      <div className="col-span-4 lg:col-span-5 flex items-center gap-3 pr-4 min-w-0">
                        <div 
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-[14px] font-semibold shadow-2xs shrink-0 uppercase transition-transform group-hover:scale-105 ${
                            isArchived ? 'grayscale' : ''
                          }`}
                          style={{ backgroundColor: proj.color || "var(--primary-50)", color: proj.textColor || "var(--primary-500)" }}
                        >
                          {proj.initial || proj.name?.charAt(0) || "商"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`text-[14px] font-semibold tracking-tight truncate ${isArchived ? 'text-text-secondary line-through' : isActive ? 'text-brand-logo' : 'text-text-main'}`}>
                              {proj.name}
                            </h3>
                            {isActive && !isArchived && (
                              <span className="text-[13px] px-1.5 py-0.5 rounded bg-primary-100 text-brand-logo font-bold tracking-wider shrink-0">
                                当前使用
                              </span>
                            )}
                            {isArchived && (
                              <span className="text-[13px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-medium shrink-0 flex items-center gap-1">
                                <Archive size={10} />
                                已归档
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 flex-wrap">
                            {proj.tags?.map((tag: string) => (
                              <span key={tag} className="text-[13px] px-1.5 py-0.5 bg-hover-bg text-text-tertiary rounded truncate max-w-[90px]">
                                {tag}
                              </span>
                            ))}
                            {isArchived && proj.archivedAt && (
                              <span className="text-[13px] text-text-tertiary ml-1">
                                归档于 {proj.archivedAt}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Col 2: Stats */}
                      <div className="col-span-4 lg:col-span-3 flex items-center gap-2.5 min-w-0">
                        {isArchived ? (
                          <div className="text-[13px] text-text-tertiary">
                            自动化与矩阵分发已暂停
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-1 bg-page-bg px-2.5 py-1 rounded-lg border border-border-default shrink-0">
                              <BarChart2 size={11} className="text-text-tertiary" />
                              <span className="text-[13px] font-medium text-text-secondary">{proj.stats?.pendingContent || 0}</span>
                              <span className="text-[13px] text-text-tertiary">篇待发</span>
                            </div>
                            <div className="flex items-center gap-1 bg-page-bg px-2.5 py-1 rounded-lg border border-border-default shrink-0">
                              <AlertCircle size={11} className="text-text-tertiary" />
                              <span className="text-[13px] font-medium text-text-secondary">{proj.stats?.pendingLeads || 0}</span>
                              <span className="text-[13px] text-text-tertiary">条待回</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Col 3: Status */}
                      <div className="col-span-2 lg:col-span-2 flex items-center min-w-0">
                        {isArchived ? (
                          <span className="text-[13px] text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            业务已封存
                          </span>
                        ) : proj.stats?.profileCompleteness === 100 ? (
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-hover-bg rounded-md shrink-0">
                            <CheckCircle2 size={12} className="text-emerald-600" />
                            <span className="text-[13px] text-text-main font-medium">已完善</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="w-12 h-1.5 bg-hover-bg rounded-full overflow-hidden shrink-0">
                              <div className="h-full bg-brand-500 rounded-full" style={{ width: `${proj.stats?.profileCompleteness || 0}%` }} />
                            </div>
                            <span className="text-[13px] text-text-tertiary">{proj.stats?.profileCompleteness || 0}%</span>
                          </div>
                        )}
                      </div>

                      {/* Col 4: Action */}
                      <div className="col-span-2 lg:col-span-2 flex items-center justify-end gap-2">
                        {isArchived ? (
                          <button
                            type="button"
                            onClick={(e) => handleRestoreMerchant(e, proj)}
                            className="px-2.5 py-1.5 bg-surface-1 border border-border-default hover:border-brand-500 hover:text-brand-600 text-text-secondary rounded-lg text-[13px] font-medium transition-colors flex items-center gap-1 shadow-2xs"
                            title="恢复商家到服务列表"
                          >
                            <RotateCcw size={12} />
                            <span>恢复商家</span>
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setProjectToArchive(proj);
                              }}
                              className="opacity-0 group-hover:opacity-100 px-2 py-1 bg-surface-1 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 border border-border-default text-text-tertiary rounded-lg text-[13px] font-medium transition-all flex items-center gap-1"
                              title="归档此商家"
                            >
                              <Archive size={12} />
                              <span>归档</span>
                            </button>

                            <div 
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                                isActive 
                                  ? 'bg-primary-100 text-brand-logo' 
                                  : 'bg-surface-1 border border-border-default text-text-tertiary group-hover:border-brand-500 group-hover:text-brand-600'
                              }`}
                            >
                              <ChevronRight size={13} />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {filteredProjects.length === 0 && (
                  <div className="py-16 flex flex-col items-center justify-center text-text-tertiary">
                    <Search size={32} className="mb-3 opacity-40" />
                    <p className="text-[13.5px] font-medium">没有找到符合条件的商家</p>
                    <p className="text-[13px] text-text-tertiary mt-1">请尝试切换状态筛选或修改搜索词</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Archive Warning & Confirmation Modal */}
      <AnimatePresence>
        {projectToArchive && (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-btn-main/50 backdrop-blur-xs"
              onClick={() => setProjectToArchive(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-surface-1 rounded-2xl shadow-2xl border border-border-default overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-border-default bg-amber-50/40 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-[16px] font-bold text-text-main">
                    确认归档商家「{projectToArchive.name}」？
                  </h3>
                  <p className="text-[13px] text-text-secondary mt-1">
                    归档后将封存该商家的经营状态，请仔细核对以下业务影响。
                  </p>
                </div>
                <button
                  onClick={() => setProjectToArchive(null)}
                  className="w-7 h-7 rounded-lg hover:bg-surface text-text-tertiary hover:text-text-main flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-4 text-[13px]">
                {/* Active Merchant Special Warning */}
                {projectToArchive.id === activeProjectId && (
                  <div className="p-3 bg-amber-100/70 border border-amber-300/80 rounded-xl flex items-start gap-2.5 text-amber-900">
                    <ShieldAlert size={16} className="text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[13px] font-bold">正在归档当前激活中的商家</strong>
                      <span className="text-[13px] text-amber-800 leading-relaxed mt-0.5 block">
                        确认后系统将自动为您切换至旗下其他服务中的商家，您随时可在「已归档」列表中重新恢复该商家。
                      </span>
                    </div>
                  </div>
                )}

                {/* Impact details */}
                <div className="bg-surface-subtle p-3.5 rounded-xl border border-border-subtle space-y-2.5">
                  <div className="text-[13px] font-semibold text-text-main">归档影响说明：</div>
                  
                  <div className="flex items-start gap-2 text-text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                    <span><strong>自动化排期与生成挂起</strong>：该商家正在执行的内容生成、自动审核及排期发帖任务将即刻暂停。</span>
                  </div>

                  <div className="flex items-start gap-2 text-text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                    <span><strong>智能线索与私信承接暂停</strong>：关联账号的自动私信获客与员工任务派发将停止流转。</span>
                  </div>

                  <div className="flex items-start gap-2 text-text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    <span><strong>历史数据与资产完整保留</strong>：素材库原图、知识库人设规则及复盘报表数据将完整保留，不影响历史核算。</span>
                  </div>
                </div>

                <div className="text-[13px] text-text-tertiary flex items-center gap-1.5">
                  <Info size={13} className="shrink-0" />
                  <span>已归档的商家可在商家切换弹窗的「已归档」标签页随时一键恢复。</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-page-bg/50 border-t border-border-default flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setProjectToArchive(null)}
                  className="px-4 py-2 bg-surface-1 border border-border-default hover:bg-hover-bg text-text-secondary rounded-xl text-[13px] font-medium transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmArchive}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[13px] font-medium transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Archive size={14} />
                  <span>确认归档</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CreateMerchantModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={(newMerchant) => {
          if (onAddMerchant && newMerchant) {
            onAddMerchant(newMerchant);
          }
          setIsCreateModalOpen(false);
          onClose();
          showToast("新商家已成功创建并加入服务列表");
        }} 
      />
    </>
  );
};
