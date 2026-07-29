import React, { useState } from "react";
import {
  X,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Info,
  Calendar,
  CheckCircle2,
  Paperclip,
  UploadCloud,
  Link as LinkIcon,
  FileText,
  File,
  Edit2,
  Check,
  ChevronRight,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Attachment {
  id: string;
  type: "file" | "link" | "text";
  name: string;
}

export function CreateProjectWorkstation({
  onClose,
  onCreate,
  mode = "create",
}: {
  onClose: () => void;
  onCreate: (project: any) => void;
  mode?: "create" | "edit";
}) {
  const [step, setStep] = useState<"initial" | "confirm">(
    mode === "edit" ? "confirm" : "initial"
  );
  const [intent, setIntent] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Core Project Confirmation State
  const [projectData, setProjectData] = useState({
    name: "幼犬换粮体验优化及搜索卡位",
    goal: "验证真实换粮经历能否增加有效问题评论与咨询线索，建立幼犬换粮搜索卡位。",
    startDate: "2026-08-01",
    endDate: "2026-08-15",
    
    // Content numbers
    kocCount: 20,
    kosCount: 2,
    brandCount: 1,

    // Validation parameters
    firstBatchKoc: 5,
    observeDays: 3,
  });

  // Goal Edit state
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(projectData.goal);

  // True Blocker State (ONLY items that truly prevent task generation, e.g. missing product factual资料)
  const [blockers, setBlockers] = useState([
    {
      id: "b1",
      title: "缺少核心产品事实资料",
      impact: "暂时不能生成涉及产品功效与成分调用的内容",
      actionText: "补充资料",
      type: "material",
    },
  ]);

  // Modal / Drawer active state
  const [activeModal, setActiveModal] = useState<
    | null
    | "add_material"
    | "add_product_data"
    | "date_basis_popover"
    | "observe_basis_drawer"
    | "scope_drawer"
  >(null);

  // Calculate total notes & remaining KOC
  const totalNotes =
    Number(projectData.kocCount || 0) +
    Number(projectData.kosCount || 0) +
    Number(projectData.brandCount || 0);

  const remainingKoc = Math.max(
    0,
    Number(projectData.kocCount || 0) - Number(projectData.firstBatchKoc || 0)
  );

  // Initial Generate Plan Handler
  const handleGenerate = () => {
    if (!intent.trim() && attachments.length === 0) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStep("confirm");
    }, 1200);
  };

  // Final Create Project Action
  const handleFinalCreate = () => {
    onCreate({
      id: Date.now().toString(),
      name: projectData.name,
      goal: projectData.goal,
      currentCheckpoint: "筹备就绪",
      lastActive: "刚刚",
      kocCount: projectData.kocCount,
      startDate: projectData.startDate,
      endDate: projectData.endDate,
      totalNotes,
    });
  };

  return (
    <div className="h-full w-full bg-[#f8f9fa] flex flex-col relative text-neutral-900 font-sans">
      {/* Top Header Navigation */}
      <div className="h-14 bg-white border-b border-neutral-200/80 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <X size={18} />
          </button>
          <div className="h-4 w-px bg-neutral-200" />
          <h1 className="text-[15px] font-bold text-neutral-900">
            {step === "initial"
              ? "新建项目"
              : mode === "edit"
              ? "调整项目方案"
              : "确认本轮安排"}
          </h1>
        </div>

        {step === "confirm" && (
          <button
            onClick={() => setStep("initial")}
            className="text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            返回修改需求
          </button>
        )}
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto relative">
        {step === "initial" ? (
          <InitialDemandScreen
            intent={intent}
            setIntent={setIntent}
            attachments={attachments}
            setAttachments={setAttachments}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            onOpenAddMaterial={() => setShowAddMaterial(true)}
            onOpenScope={() => setActiveModal("scope_drawer")}
          />
        ) : (
          <CompactConfirmWorkbench
            projectData={projectData}
            setProjectData={setProjectData}
            isEditingGoal={isEditingGoal}
            setIsEditingGoal={setIsEditingGoal}
            tempGoal={tempGoal}
            setTempGoal={setTempGoal}
            blockers={blockers}
            totalNotes={totalNotes}
            remainingKoc={remainingKoc}
            onActionBlocker={() => setActiveModal("add_product_data")}
            onOpenDateBasis={() => setActiveModal("date_basis_popover")}
            onOpenObserveBasis={() => setActiveModal("observe_basis_drawer")}
          />
        )}
      </div>

      {/* Fixed Bottom Action Bar */}
      {step === "confirm" && (
        <FixedBottomBar
          hasBlockers={blockers.length > 0}
          onPrimaryClick={() => {
            if (blockers.length > 0) {
              setActiveModal("add_product_data");
            } else {
              handleFinalCreate();
            }
          }}
        />
      )}

      {/* Modals & Drawers */}
      <AnimatePresence>
        {/* Add Material Modal */}
        {showAddMaterial && (
          <AddMaterialModal
            onClose={() => setShowAddMaterial(false)}
            onAdd={(item) => setAttachments((prev) => [...prev, item])}
          />
        )}

        {/* Add Product Data Blocker Modal */}
        {activeModal === "add_product_data" && (
          <AddProductDataModal
            onClose={() => setActiveModal(null)}
            onSuccess={() => {
              setBlockers([]);
              setActiveModal(null);
            }}
          />
        )}

        {/* Date Suggestion Basis Popover */}
        {activeModal === "date_basis_popover" && (
          <DateBasisPopover onClose={() => setActiveModal(null)} />
        )}

        {/* First Batch Validation Basis Drawer */}
        {activeModal === "observe_basis_drawer" && (
          <ObserveBasisDrawer onClose={() => setActiveModal(null)} />
        )}

        {/* Reference Scope Drawer */}
        {activeModal === "scope_drawer" && (
          <ScopeDrawer onClose={() => setActiveModal(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// 1. Initial Demand Input Screen (新建项目需求录入)
// ==========================================
function InitialDemandScreen({
  intent,
  setIntent,
  attachments,
  setAttachments,
  onGenerate,
  isGenerating,
  onOpenAddMaterial,
  onOpenScope,
}: {
  intent: string;
  setIntent: (s: string) => void;
  attachments: Attachment[];
  setAttachments: React.Dispatch<React.SetStateAction<Attachment[]>>;
  onGenerate: () => void;
  isGenerating: boolean;
  onOpenAddMaterial: () => void;
  onOpenScope: () => void;
}) {
  return (
    <div className="max-w-[1100px] mx-auto py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-[24px] font-bold text-neutral-900 mb-2 tracking-tight">
          这轮运营，你想做什么？
        </h1>
        <p className="text-[13px] text-neutral-500 leading-normal mb-6">
          写下目标、周期或限制，系统会整理成一版可修改的项目方案。
        </p>

        {/* Input Box */}
        <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden mb-4 focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-100 transition-all flex flex-col min-h-[260px] max-h-[320px]">
          <textarea
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            placeholder="例如：换粮内容有收藏但咨询少，准备做一轮店长号和消费者共创，两周完成。想验证真实换粮过程和专业解释能否带来更多有效咨询。"
            className="w-full flex-1 resize-none outline-none p-5 text-[14px] leading-relaxed text-neutral-900 placeholder:text-neutral-400 font-normal"
          />

          {/* Added Material Chips */}
          {attachments.length > 0 && (
            <div className="px-5 py-2 border-t border-neutral-100 flex flex-wrap gap-2 bg-neutral-50/60">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-neutral-200 rounded-lg text-[12px] text-neutral-700 shadow-2xs"
                >
                  {att.type === "file" && <File size={13} className="text-neutral-500" />}
                  {att.type === "link" && <LinkIcon size={13} className="text-neutral-500" />}
                  {att.type === "text" && <FileText size={13} className="text-neutral-500" />}
                  <span className="font-medium max-w-[180px] truncate">{att.name}</span>
                  <button
                    onClick={() =>
                      setAttachments((prev) => prev.filter((a) => a.id !== att.id))
                    }
                    className="text-neutral-400 hover:text-neutral-700 ml-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <span className="text-[11px] text-neutral-400 self-center ml-1">
                默认仅用于本项目
              </span>
            </div>
          )}

          {/* Bottom Toolbar inside Input Box */}
          <div className="px-5 py-3 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/40">
            <button
              onClick={onOpenAddMaterial}
              className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-600 hover:text-neutral-900 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-neutral-100"
            >
              <Paperclip size={15} />
              <span>添加项目资料</span>
            </button>

            <button
              onClick={onGenerate}
              disabled={(!intent.trim() && attachments.length === 0) || isGenerating}
              className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-xs"
            >
              {isGenerating ? (
                <>
                  <Sparkles size={15} className="animate-spin text-neutral-300" />
                  <span>正在整理方案…</span>
                </>
              ) : (
                <>
                  <span>生成项目方案</span>
                  <Sparkles size={15} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. Compact Confirmation Workbench (确认本轮安排主界面)
// ==========================================
function CompactConfirmWorkbench({
  projectData,
  setProjectData,
  isEditingGoal,
  setIsEditingGoal,
  tempGoal,
  setTempGoal,
  blockers,
  totalNotes,
  remainingKoc,
  onActionBlocker,
  onOpenDateBasis,
  onOpenObserveBasis,
}: {
  projectData: any;
  setProjectData: React.Dispatch<React.SetStateAction<any>>;
  isEditingGoal: boolean;
  setIsEditingGoal: (b: boolean) => void;
  tempGoal: string;
  setTempGoal: (s: string) => void;
  blockers: any[];
  totalNotes: number;
  remainingKoc: number;
  onActionBlocker: () => void;
  onOpenDateBasis: () => void;
  onOpenObserveBasis: () => void;
}) {
  return (
    <div className="max-w-[1100px] mx-auto py-8 px-6 pb-28 space-y-5">
      {/* Page Header */}
      <div>
        <h1 className="text-[20px] font-bold text-neutral-900 tracking-tight">
          确认本轮安排
        </h1>
        <p className="text-[13px] text-neutral-500 mt-1">
          确认日期、投入和内容数量后，即可创建项目并拆解笔记排期。
        </p>
      </div>

      {/* 1. Goal Block (本轮目标) */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
              本轮目标
            </div>

            {isEditingGoal ? (
              <div className="space-y-2">
                <textarea
                  value={tempGoal}
                  onChange={(e) => setTempGoal(e.target.value)}
                  className="w-full p-3 border border-neutral-300 rounded-xl text-[14px] font-medium text-neutral-900 leading-relaxed outline-none focus:border-neutral-500 resize-none h-[72px]"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setTempGoal(projectData.goal);
                      setIsEditingGoal(false);
                    }}
                    className="px-3 py-1 text-[12px] font-medium text-neutral-500 hover:text-neutral-800"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => {
                      setProjectData((p: any) => ({ ...p, goal: tempGoal }));
                      setIsEditingGoal(false);
                    }}
                    className="px-3.5 py-1 bg-neutral-900 text-white rounded-lg text-[12px] font-bold hover:bg-neutral-800"
                  >
                    保存
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[14px] font-bold text-neutral-900 leading-relaxed">
                {projectData.goal}
              </p>
            )}
          </div>

          {!isEditingGoal && (
            <button
              onClick={() => {
                setTempGoal(projectData.goal);
                setIsEditingGoal(true);
              }}
              className="text-[12px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors shrink-0 flex items-center gap-1 hover:underline"
            >
              <Edit2 size={13} />
              <span>修改目标</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Card 1: Date */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-5">
        <div className="text-[14px] font-bold text-neutral-900 mb-4">
          项目日期
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[12px] font-bold text-neutral-600">
              项目周期
            </label>
            <button
              onClick={onOpenDateBasis}
              className="text-[11px] font-normal text-neutral-500 hover:text-neutral-800 flex items-center gap-1 transition-colors"
            >
              <HelpCircle size={12} className="text-neutral-400" />
              <span>参考相似项目周期</span>
            </button>
          </div>
          <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 max-w-sm">
            <Calendar size={16} className="text-neutral-400 shrink-0" />
            <input
              type="date"
              value={projectData.startDate}
              onChange={(e) =>
                setProjectData((p: any) => ({ ...p, startDate: e.target.value }))
              }
              className="bg-transparent text-[13px] font-bold text-neutral-900 outline-none w-32"
            />
            <span className="text-neutral-400 text-[12px] font-bold">至</span>
            <input
              type="date"
              value={projectData.endDate}
              onChange={(e) =>
                setProjectData((p: any) => ({ ...p, endDate: e.target.value }))
              }
              className="bg-transparent text-[13px] font-bold text-neutral-900 outline-none w-32"
            />
          </div>
        </div>
      </div>

      {/* 3. Card 2: Content Distribution (本轮计划发布) */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[14px] font-bold text-neutral-900">本轮计划发布</h2>
          <span className="text-[12px] text-neutral-500 font-medium">
            一名参与者生成一篇笔记，不预先绑定具体账号
          </span>
        </div>

        {/* Tight editable row */}
        <div className="bg-neutral-50/80 border border-neutral-200/80 rounded-xl p-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-bold text-neutral-700">KOC 消费者共创</span>
            <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded-lg px-2.5 py-1">
              <input
                type="number"
                value={projectData.kocCount}
                onChange={(e) =>
                  setProjectData((p: any) => ({
                    ...p,
                    kocCount: Math.max(0, parseInt(e.target.value) || 0),
                  }))
                }
                className="w-12 text-center text-[13px] font-bold text-neutral-900 outline-none"
              />
              <span className="text-[12px] text-neutral-400 font-medium">篇</span>
            </div>
          </div>

          <div className="h-4 w-px bg-neutral-200" />

          <div className="flex items-center gap-3">
            <span className="text-[13px] font-bold text-neutral-700">KOS / 店长号</span>
            <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded-lg px-2.5 py-1">
              <input
                type="number"
                value={projectData.kosCount}
                onChange={(e) =>
                  setProjectData((p: any) => ({
                    ...p,
                    kosCount: Math.max(0, parseInt(e.target.value) || 0),
                  }))
                }
                className="w-10 text-center text-[13px] font-bold text-neutral-900 outline-none"
              />
              <span className="text-[12px] text-neutral-400 font-medium">篇</span>
            </div>
          </div>

          <div className="h-4 w-px bg-neutral-200" />

          <div className="flex items-center gap-3">
            <span className="text-[13px] font-bold text-neutral-700">品牌主号</span>
            <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded-lg px-2.5 py-1">
              <input
                type="number"
                value={projectData.brandCount}
                onChange={(e) =>
                  setProjectData((p: any) => ({
                    ...p,
                    brandCount: Math.max(0, parseInt(e.target.value) || 0),
                  }))
                }
                className="w-10 text-center text-[13px] font-bold text-neutral-900 outline-none"
              />
              <span className="text-[12px] text-neutral-400 font-medium">篇</span>
            </div>
          </div>

          <div className="h-4 w-px bg-neutral-200" />

          <div className="flex items-center gap-1.5 pl-2">
            <span className="text-[13px] font-bold text-neutral-500">合计：</span>
            <span className="text-[16px] font-extrabold text-neutral-900">
              {totalNotes}
            </span>
            <span className="text-[12px] font-bold text-neutral-700">篇</span>
          </div>
        </div>
      </div>

      {/* 4. Card 3: First Batch Validation (先验证，再决定是否继续) */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[14px] font-bold text-neutral-900">
            先验证，再决定是否继续
          </h2>
          <button
            onClick={onOpenObserveBasis}
            className="text-[12px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1"
          >
            <span>查看依据</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="bg-neutral-50/80 border border-neutral-200/80 rounded-xl p-4 flex items-center gap-2 text-[13px] text-neutral-800 font-medium">
          <span>首批安排</span>
          <input
            type="number"
            value={projectData.firstBatchKoc}
            onChange={(e) =>
              setProjectData((p: any) => ({
                ...p,
                firstBatchKoc: Math.max(1, parseInt(e.target.value) || 1),
              }))
            }
            className="w-12 bg-white border border-neutral-200 rounded-lg px-2 py-1 text-center font-bold text-neutral-900 outline-none"
          />
          <span>位 KOC，发布后观察</span>
          <input
            type="number"
            value={projectData.observeDays}
            onChange={(e) =>
              setProjectData((p: any) => ({
                ...p,
                observeDays: Math.max(1, parseInt(e.target.value) || 1),
              }))
            }
            className="w-12 bg-white border border-neutral-200 rounded-lg px-2 py-1 text-center font-bold text-neutral-900 outline-none"
          />
          <span>天，再确认剩余 {remainingKoc} 位是否继续。</span>
        </div>
      </div>

      {/* 5. Blockers Section (仅当存在真正阻止任务生成的硬阻断时显示) */}
      {blockers.length > 0 && (
        <div className="bg-red-50/60 border border-red-200/90 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-red-900 font-bold text-[14px]">
            <AlertTriangle size={18} className="text-red-600 shrink-0" />
            <span>创建前必须处理 ({blockers.length})</span>
          </div>

          <div className="space-y-2">
            {blockers.map((b) => (
              <div
                key={b.id}
                className="bg-white border border-red-200 rounded-xl p-3.5 flex items-center justify-between"
              >
                <div>
                  <div className="text-[13px] font-bold text-red-950">
                    {b.title}
                  </div>
                  <div className="text-[12px] text-neutral-600 mt-0.5">
                    影响：{b.impact}
                  </div>
                </div>
                <button
                  onClick={onActionBlocker}
                  className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-[12px] font-bold hover:bg-red-700 transition-colors shrink-0 shadow-xs"
                >
                  {b.actionText}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. Fixed Bottom Action Bar (固定底栏)
// ==========================================
function FixedBottomBar({
  hasBlockers,
  onPrimaryClick,
}: {
  hasBlockers: boolean;
  onPrimaryClick: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 z-30 flex items-center justify-between px-8 max-w-[1100px] mx-auto rounded-t-2xl shadow-lg">
      <div className="text-[12px] text-neutral-500 font-normal">
        创建后将根据已确认安排生成首批任务。
      </div>

      <button
        onClick={onPrimaryClick}
        className="px-8 py-2.5 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-xs"
      >
        <span>{hasBlockers ? "处理阻断项" : "创建项目"}</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

// ==========================================
// 4. Auxiliary Modals & Drawers
// ==========================================

// Add Material Modal (Initial screen)
function AddMaterialModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (item: Attachment) => void;
}) {
  const [tab, setTab] = useState<"file" | "link" | "text">("file");
  const [fileName, setFileName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [textContent, setTextContent] = useState("");

  const handleAdd = () => {
    if (tab === "file") {
      onAdd({
        id: Date.now().toString(),
        type: "file",
        name: fileName || "幼犬换粮竞品资料.pdf",
      });
    } else if (tab === "link") {
      onAdd({
        id: Date.now().toString(),
        type: "link",
        name: linkUrl || "小红书对标笔记链接",
      });
    } else {
      onAdd({
        id: Date.now().toString(),
        type: "text",
        name: textContent.slice(0, 15) + "...",
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/30 backdrop-blur-xs" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-[460px] bg-white rounded-2xl shadow-xl border border-neutral-200 relative z-10 overflow-hidden flex flex-col"
      >
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-neutral-900">添加项目资料</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700">
            <X size={18} />
          </button>
        </div>

        <div className="flex border-b border-neutral-100 px-5 bg-neutral-50/50">
          {[
            { id: "file", label: "上传文件", icon: UploadCloud },
            { id: "link", label: "粘贴链接", icon: LinkIcon },
            { id: "text", label: "粘贴文本", icon: FileText },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`flex items-center gap-1.5 py-3 px-4 text-[13px] font-bold border-b-2 transition-colors ${
                tab === t.id
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-500 hover:text-neutral-800"
              }`}
            >
              <t.icon size={14} />
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === "file" && (
            <div className="border-2 border-dashed border-neutral-200 rounded-xl p-6 text-center hover:border-neutral-400 transition-colors bg-neutral-50/40 cursor-pointer">
              <UploadCloud size={28} className="mx-auto text-neutral-400 mb-2" />
              <div className="text-[13px] font-bold text-neutral-800 mb-1">
                点击上传或拖拽文件至此处
              </div>
              <div className="text-[12px] text-neutral-400">
                支持 PDF, Word, Excel, TXT, 图片等格式
              </div>
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) setFileName(e.target.files[0].name);
                }}
              />
            </div>
          )}

          {tab === "link" && (
            <div>
              <label className="block text-[12px] font-bold text-neutral-600 mb-1.5">
                网页或笔记链接
              </label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://www.xiaohongshu.com/discovery/item/..."
                className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-[13px] outline-none focus:border-neutral-400"
              />
            </div>
          )}

          {tab === "text" && (
            <div>
              <label className="block text-[12px] font-bold text-neutral-600 mb-1.5">
                补充资料文本
              </label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="例如：本次活动需要包含赠品成本，店长号排期需避开周三..."
                className="w-full h-[100px] p-3 border border-neutral-200 rounded-xl text-[13px] outline-none resize-none focus:border-neutral-400"
              />
            </div>
          )}

          <div className="mt-4 p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-[12px] text-neutral-500 leading-relaxed">
            💡 提示：默认仅用于本项目，不会自动修改全局商家知识库。
          </div>
        </div>

        <div className="p-4 border-t border-neutral-100 flex justify-end gap-2 bg-neutral-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-neutral-200 rounded-xl text-[13px] font-bold text-neutral-600 hover:bg-neutral-100"
          >
            取消
          </button>
          <button
            onClick={handleAdd}
            className="px-5 py-2 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800"
          >
            确定添加
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Add Product Data Modal (Truly blocking item)
function AddProductDataModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [productFacts, setProductFacts] = useState(
    "针对3-12个月幼犬，特研肠胃适应过渡颗粒，双益生菌配方提升消化吸收率，减少软便风险。"
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/30 backdrop-blur-xs" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-[480px] bg-white rounded-2xl shadow-xl border border-neutral-200 relative z-10 overflow-hidden"
      >
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-neutral-900">补充核心产品事实资料</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[12px] text-amber-900 leading-relaxed">
            缺少真实产品功效参数会导致AI生成内容时出现虚构成分风险。请补充或确认核心参数：
          </div>

          <div>
            <label className="block text-[12px] font-bold text-neutral-700 mb-1.5">
              核心功效与产品事实
            </label>
            <textarea
              value={productFacts}
              onChange={(e) => setProductFacts(e.target.value)}
              className="w-full h-[120px] p-3 border border-neutral-200 rounded-xl text-[13px] outline-none resize-none focus:border-neutral-400 leading-relaxed"
            />
          </div>
        </div>

        <div className="p-4 border-t border-neutral-100 flex justify-end gap-2 bg-neutral-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-neutral-200 rounded-xl text-[13px] font-bold text-neutral-600 hover:bg-neutral-100"
          >
            取消
          </button>
          <button
            onClick={onSuccess}
            className="px-5 py-2 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800"
          >
            保存并解除阻断
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Date Suggestion Basis Popover
function DateBasisPopover({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-xs" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        className="w-[380px] bg-white rounded-2xl shadow-xl border border-neutral-200 p-5 relative z-10 space-y-3"
      >
        <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
          <h3 className="text-[14px] font-bold text-neutral-900">日期建议依据</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700">
            <X size={16} />
          </button>
        </div>

        <div className="text-[12px] text-neutral-600 leading-relaxed space-y-2">
          <p>• 参照 2026年6月《成犬转换体验》项目实际耗时（14天）。</p>
          <p>• 包含 KOC 招募寄样（3天）+ 体验记录（7天）+ 首批效果汇总（4天）。</p>
          <p className="text-neutral-400 text-[11px]">
            注：操盘手可随时在页面中修改具体开始与结束日期。
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// First Batch Validation Basis Drawer
function ObserveBasisDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-xs" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="w-[420px] bg-white h-full shadow-2xl flex flex-col relative z-10"
      >
        <div className="p-5 border-b border-neutral-200 flex justify-between items-center bg-white">
          <h2 className="text-[16px] font-bold text-neutral-900">首批验证推荐依据</h2>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-[13px] text-neutral-700 leading-relaxed">
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-2">
            <div className="font-bold text-neutral-900">1. 已确认商家事实</div>
            <p className="text-[12px] text-neutral-600">
              KOC 第一次尝试宠物换粮题材时，互动评论问答率波动较大，先小规模测试风险可控。
            </p>
          </div>

          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-2">
            <div className="font-bold text-neutral-900">2. 历史同类项目结果</div>
            <p className="text-[12px] text-neutral-600">
              上期 5 篇首批发布后，第 3 天即可获得足够样本观察有效咨询转化率，无需等全量发完再调整。
            </p>
          </div>

          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-2">
            <div className="font-bold text-neutral-900">3. 操盘手验证经验</div>
            <p className="text-[12px] text-neutral-600">
              控制首批 5 人可将前期产品寄样和内容审阅压力降低 70%。
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-neutral-200 bg-neutral-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800"
          >
            知道了
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Scope Reference Drawer
function ScopeDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-xs" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="w-[420px] bg-white h-full shadow-2xl flex flex-col relative z-10"
      >
        <div className="p-5 border-b border-neutral-200 flex justify-between items-center bg-white">
          <h2 className="text-[16px] font-bold text-neutral-900">参考依据与能力范围</h2>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-[13px] text-neutral-700 leading-relaxed">
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
            <div className="font-bold text-neutral-900">商家已知事实</div>
            <div className="text-[12px] text-neutral-600">已绑定品牌主号1个、已关连店长号2个。</div>
          </div>

          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
            <div className="font-bold text-neutral-900">历史项目经验</div>
            <div className="text-[12px] text-neutral-600">上期种草笔记单篇KOC平均招募成本约 200元。</div>
          </div>

          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
            <div className="font-bold text-neutral-900">自动编排流程</div>
            <div className="text-[12px] text-neutral-600">项目创建后，系统后台将自动匹配下发渠道与任务队列。</div>
          </div>
        </div>

        <div className="p-4 border-t border-neutral-200 bg-neutral-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800"
          >
            关闭
          </button>
        </div>
      </motion.div>
    </div>
  );
}
