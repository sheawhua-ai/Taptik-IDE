import React, { useState } from 'react';
import {
  X, Plus, Link2,
  Table, Sparkles, Download, FileSpreadsheet, RefreshCw, CheckCircle2, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useProjectStore } from '../../context/ProjectContext';
import { Project } from '../../data/projectStore';

interface Props {
  project: Project;
  onClose: () => void;
  mode: "file" | "feishu" | "single";
}

const MODAL_COPY = {
  file: {
    title: "批量导入笔记",
    description: "上传 Excel 或 CSV，确认识别结果后批量导入。",
  },
  feishu: {
    title: "关联飞书多维表格",
    description: "粘贴飞书表格链接，把笔记和发布安排同步进来。",
  },
  single: {
    title: "手动写笔记",
    description: "直接填写一篇笔记，并安排账号和发布时间。",
  },
} as const;

const CONTENT_ANGLE_OPTIONS: Record<"KOC" | "店长号/KOS" | "品牌主号", string[]> = {
  KOC: ["真实体验", "使用测评", "避坑分享"],
  "店长号/KOS": ["专业答疑", "场景建议", "到店服务"],
  "品牌主号": ["产品科普", "品牌信息", "活动发布"],
};

export function AddSingleNoteModal({ project, onClose, mode }: Props) {
  const { createProjectNote, batchGenerateProjectNotes } = useProjectStore();
  const modalCopy = MODAL_COPY[mode];

  // Single Note Form state
  const [title, setTitle] = useState('');
  const [accountType, setAccountType] = useState<"KOC" | "店长号/KOS" | "品牌主号">("KOC");
  const [accountName, setAccountName] = useState('');
  const [contentDirection, setContentDirection] = useState('');
  const [plannedDate, setPlannedDate] = useState(new Date().toISOString().split('T')[0]);
  const [body, setBody] = useState('');
  const [titleError, setTitleError] = useState('');

  // File Batch Import state
  const [dragActive, setDragActive] = useState(false);
  const [importedFile, setImportedFile] = useState<File | null>(null);
  const [parsedNotes, setParsedNotes] = useState<Array<{
    title: string;
    accountType: "KOC" | "店长号/KOS" | "品牌主号";
    accountName: string;
    contentDirection: string;
    plannedDate: string;
    selected: boolean;
  }>>([]);
  const [isParsing, setIsParsing] = useState(false);

  // Feishu Bitable Integration state
  const [feishuUrl, setFeishuUrl] = useState('https://feishu.cn/base/bascnX92kL19m7Zpx100293?table=tbl888');
  const [autoSync, setAutoSync] = useState(true);
  const [syncInterval, setSyncInterval] = useState('15分钟');
  const [feishuStatus, setFeishuStatus] = useState<"idle" | "connecting" | "connected">("idle");
  const [feishuNotes, setFeishuNotes] = useState<Array<{
    title: string;
    accountType: "KOC" | "店长号/KOS" | "品牌主号";
    accountName: string;
    contentDirection: string;
    plannedDate: string;
    selected: boolean;
  }>>([]);

  // Single submit
  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError('请先填写笔记标题');
      return;
    }

    createProjectNote(project.id, {
      title,
      accountType,
      accountName: accountName || (accountType === "KOC" ? "KOC体验官" : accountType === "店长号/KOS" ? "店长号" : "品牌官方号"),
      contentDirection: contentDirection || "常规种草内容",
      plannedDate,
      body
    });

    onClose();
  };

  // Handle Mock File Drop or Selection
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file: File) => {
    setImportedFile(file);
    setIsParsing(true);
    setTimeout(() => {
      // Generate parsed notes based on project
      const sampleParsed = [
        {
          title: `【${file.name.replace(/\.[^/.]+$/, "")}】青岛婚宴热门宴会厅菜品全测评`,
          accountType: "KOC" as const,
          accountName: "KOC体验官_试菜组",
          contentDirection: "真实试菜体验",
          plannedDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          selected: true
        },
        {
          title: `【${file.name.replace(/\.[^/.]+$/, "")}】店长答疑：备婚新人最关注的宴会厅档期`,
          accountType: "店长号/KOS" as const,
          accountName: "店长号_旗舰店",
          contentDirection: "专业档期答疑",
          plannedDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
          selected: true
        },
        {
          title: `【${file.name.replace(/\.[^/.]+$/, "")}】婚宴菜品主厨推荐与菜单名牌搭配指南`,
          accountType: "KOC" as const,
          accountName: "KOC美学达人",
          contentDirection: "菜品美学拍摄",
          plannedDate: new Date(Date.now() + 259200000).toISOString().split('T')[0],
          selected: true
        },
        {
          title: `官方公告：${project.name} 2026独家备婚礼包与协议条款`,
          accountType: "品牌主号" as const,
          accountName: "品牌官方账号",
          contentDirection: "权威政策发布",
          plannedDate: new Date(Date.now() + 345600000).toISOString().split('T')[0],
          selected: true
        }
      ];
      setParsedNotes(sampleParsed);
      setIsParsing(false);
    }, 800);
  };

  // Mock Feishu Connect & Fetch
  const handleConnectFeishu = () => {
    if (!feishuUrl.trim()) return;
    setFeishuStatus("connecting");
    setTimeout(() => {
      setFeishuStatus("connected");
      setFeishuNotes([
        {
          title: "飞书同步 - 青岛婚宴全流程试菜与打卡心得",
          accountType: "KOC",
          accountName: "飞书表单-KOC_01",
          contentDirection: "飞书表格打卡同步",
          plannedDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          selected: true
        },
        {
          title: "飞书同步 - 酒店宴会厅灯光与舞台美学体验",
          accountType: "KOC",
          accountName: "飞书表单-KOC_02",
          contentDirection: "场景灯光打卡",
          plannedDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
          selected: true
        },
        {
          title: "飞书同步 - 官方店长一对一档期解答",
          accountType: "店长号/KOS",
          accountName: "飞书表单-KOS_店长",
          contentDirection: "官方回复答疑",
          plannedDate: new Date(Date.now() + 259200000).toISOString().split('T')[0],
          selected: true
        }
      ]);
    }, 900);
  };

  // Confirm Batch Import (from File or Feishu)
  const handleConfirmBatch = (notes: typeof parsedNotes) => {
    const selectedList = notes.filter(n => n.selected);
    if (selectedList.length === 0) return;

    batchGenerateProjectNotes(project.id, selectedList);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-btn-main/50 backdrop-blur-xs p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className={`bg-surface-1 rounded-xl shadow-2xl border border-border-default w-full overflow-hidden my-auto flex flex-col max-h-[90vh] ${mode === "single" ? "max-w-4xl" : "max-w-2xl"}`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between shrink-0 bg-surface-1">
          <div>
            <h2 className="text-[17px] font-bold text-text-main flex items-center gap-2">
              {mode === "file" ? <FileSpreadsheet size={20} /> : mode === "feishu" ? <Link2 size={20} /> : <Plus size={20} />}
              {modalCopy.title}
            </h2>
            <p className="text-[13px] text-text-tertiary mt-0.5">
              {modalCopy.description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭"
            className="p-1.5 text-text-tertiary hover:text-text-main hover:bg-hover-bg rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Entry Content */}
        <div className={`overflow-y-auto flex-1 bg-page-bg/30 ${mode === "single" ? "p-0" : "p-6"}`}>

          {mode === "file" && (
            <div className="space-y-4">
              <div className="bg-surface-1 p-5 rounded-xl border border-border-default shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[14px] font-bold text-text-main">上传 Excel / CSV 笔记清单</h3>
                    <p className="text-[13px] text-text-tertiary mt-0.5">
                      表头自动识别“笔记标题”、“账号类型”、“执行账号”、“内容方向”、“计划日期”。
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const sampleFile = new File(["title,accountType,accountName\n样板笔记,KOC,体验官"], "项目笔记排期导入表.csv", { type: "text/csv" });
                      processFile(sampleFile);
                    }}
                    className="text-[13px] font-bold text-text-main hover:bg-hover-bg flex items-center gap-1 bg-surface-1 px-3 py-1.5 rounded-xl border border-border-default"
                  >
                    <Download size={13} />
                    <span>下载导入模板文件</span>
                  </button>
                </div>

                {/* Drag and Drop Zone */}
                <div 
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleFileDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                    dragActive 
                      ? "border-neutral-900 bg-surface-subtle scale-[0.99]"
                      : "border-border-default hover:border-neutral-400 bg-surface-2"
                  }`}
                  onClick={() => {
                    const sampleFile = new File(["mock"], "婚宴试菜与种草笔记导入清单_2026.xlsx");
                    processFile(sampleFile);
                  }}
                >
                  <div className="w-12 h-12 bg-surface-1 rounded-xl shadow-2xs flex items-center justify-center text-text-main mb-2 border border-border-default/80">
                    <FileSpreadsheet size={24} />
                  </div>
                  <p className="text-[13px] font-bold text-text-main">
                    {importedFile ? `已选择文件：${importedFile.name}` : "点击选择或拖拽 Excel/CSV/JSON 笔记表格文件至此处"}
                  </p>
                  <p className="text-[13px] text-text-tertiary mt-1">
                    支持 .xlsx, .xls, .csv, .json 格式（最大支持 10MB，自动去重）
                  </p>
                </div>
              </div>

              {/* Parsing Output Preview Table */}
              {isParsing ? (
                <div className="p-8 text-center bg-surface-1 rounded-xl border border-border-default text-text-tertiary space-y-2">
                  <Sparkles size={24} className="animate-spin text-text-main mx-auto" />
                  <p className="text-[13px] font-bold text-text-main">正在解析文件表格列数据...</p>
                </div>
              ) : parsedNotes.length > 0 ? (
                <div className="bg-surface-1 rounded-xl border border-border-default overflow-hidden shadow-2xs">
                  <div className="p-3.5 border-b border-border-default bg-page-bg/70 flex items-center justify-between">
                    <span className="text-[13px] font-bold text-text-main">
                      解析成功！预览待导入笔记 ({parsedNotes.filter(n => n.selected).length} 篇选中)
                    </span>
                    <button
                      onClick={() => handleConfirmBatch(parsedNotes)}
                      className="px-4 py-1.5 bg-btn-main hover:bg-btn-main-hover text-white font-bold rounded-xl text-[13px] transition-colors flex items-center gap-1.5"
                    >
                      <span>导入选中的 {parsedNotes.filter(n => n.selected).length} 篇笔记</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  <div className="divide-y divide-neutral-100 max-h-[220px] overflow-y-auto">
                    {parsedNotes.map((note, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between gap-3 text-[13px]">
                        <input 
                          type="checkbox"
                          checked={note.selected}
                          onChange={(e) => {
                            const updated = [...parsedNotes];
                            updated[idx].selected = e.target.checked;
                            setParsedNotes(updated);
                          }}
                          className="w-4 h-4 rounded text-text-main focus:ring-neutral-900 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-text-main truncate">{note.title}</div>
                          <div className="text-[13px] text-text-tertiary mt-0.5 flex gap-2">
                            <span>{note.accountType}</span>
                            <span>• {note.accountName}</span>
                            <span>• {note.contentDirection}</span>
                          </div>
                        </div>
                        <div className="text-[13px] font-mono text-text-tertiary bg-hover-bg px-2 py-0.5 rounded shrink-0">
                          {note.plannedDate}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {mode === "feishu" && (
            <div className="space-y-4">
              <div className="bg-surface-1 p-5 rounded-xl border border-border-default shadow-2xs space-y-4">
                <div>
                  <h3 className="text-[14px] font-bold text-text-main flex items-center gap-2">
                    <Table size={16} />
                    绑定飞书多维表格
                  </h3>
                  <p className="text-[13px] text-text-tertiary mt-0.5">
                    复制飞书多维表格链接，系统会同步笔记和发布状态。
                  </p>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-text-secondary mb-1">
                    飞书表格 App 链接 / 多维表格 URL <span className="text-text-main">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={feishuUrl}
                      onChange={(e) => setFeishuUrl(e.target.value)}
                      placeholder="https://feishu.cn/base/bascn..."
                      className="flex-1 px-3.5 py-2 border border-border-default rounded-xl text-[13px] outline-none focus:border-neutral-500 font-mono bg-page-bg"
                    />
                    <button
                      onClick={handleConnectFeishu}
                      disabled={feishuStatus === "connecting"}
                      className="px-4 py-2 bg-btn-main hover:bg-btn-main-hover text-white font-bold rounded-xl text-[13px] transition-colors shrink-0 flex items-center gap-1.5 shadow-xs"
                    >
                      {feishuStatus === "connecting" ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          <span>建立连接中...</span>
                        </>
                      ) : feishuStatus === "connected" ? (
                        <>
                          <CheckCircle2 size={14} />
                          <span>重新检测与同步</span>
                        </>
                      ) : (
                        <>
                          <Link2 size={14} />
                          <span>测试连接飞书</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Auto Sync Settings */}
                <div className="p-3.5 bg-page-bg rounded-xl border border-border-default/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="autoSync"
                      checked={autoSync}
                      onChange={(e) => setAutoSync(e.target.checked)}
                      className="w-4 h-4 rounded text-text-main focus:ring-neutral-900"
                    />
                    <label htmlFor="autoSync" className="text-[13px] font-bold text-text-main cursor-pointer">
                      开启飞书表格定时自动全量增量同步
                    </label>
                  </div>
                  {autoSync && (
                    <select
                      value={syncInterval}
                      onChange={(e) => setSyncInterval(e.target.value)}
                      className="px-2.5 py-1 border border-border-default rounded-lg text-[13px] bg-surface-1 font-medium text-text-secondary"
                    >
                      <option value="5分钟">每 5 分钟同步</option>
                      <option value="15分钟">每 15 分钟同步</option>
                      <option value="1小时">每 1 小时同步</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Feishu Synced Preview */}
              {feishuStatus === "connected" && (
                <div className="bg-surface-1 rounded-xl border border-border-default overflow-hidden shadow-2xs">
                  <div className="p-3.5 border-b border-border-default bg-surface-subtle flex items-center justify-between">
                    <span className="text-[13px] font-bold text-text-main flex items-center gap-1.5">
                      <CheckCircle2 size={15} />
                      已成功读取飞书表格！获取到 {feishuNotes.length} 篇待打卡笔记记录
                    </span>
                    <button
                      onClick={() => handleConfirmBatch(feishuNotes)}
                      className="px-4 py-1.5 bg-btn-main hover:bg-btn-main-hover text-white font-bold rounded-xl text-[13px] transition-colors flex items-center gap-1.5"
                    >
                      <span>同步导入飞书笔记数据</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  <div className="divide-y divide-neutral-100 max-h-[220px] overflow-y-auto">
                    {feishuNotes.map((note, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between gap-3 text-[13px]">
                        <input 
                          type="checkbox"
                          checked={note.selected}
                          onChange={(e) => {
                            const updated = [...feishuNotes];
                            updated[idx].selected = e.target.checked;
                            setFeishuNotes(updated);
                          }}
                          className="w-4 h-4 rounded text-text-main focus:ring-neutral-900 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-text-main truncate">{note.title}</div>
                          <div className="text-[13px] text-text-tertiary mt-0.5 flex gap-2">
                            <span>飞书列: {note.accountType}</span>
                            <span>• {note.accountName}</span>
                            <span>• {note.contentDirection}</span>
                          </div>
                        </div>
                        <div className="text-[13px] font-mono text-text-tertiary bg-hover-bg px-2 py-0.5 rounded shrink-0">
                          {note.plannedDate}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {mode === "single" && (
            <form id="manual-note-form" onSubmit={handleSingleSubmit} className="grid lg:grid-cols-[minmax(0,1fr)_300px] bg-surface-1 min-h-[520px]">
              <section className="p-6 lg:border-r border-border-default space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="manual-note-title" className="text-[13px] font-bold text-text-main">
                      笔记标题 <span className="text-text-main">*</span>
                    </label>
                    <span className="text-[13px] text-text-tertiary">{title.length}/40</span>
                  </div>
                  <input
                    id="manual-note-title"
                    type="text"
                    maxLength={40}
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (titleError) setTitleError('');
                    }}
                    placeholder="用一句话说清这篇笔记讲什么"
                    aria-invalid={Boolean(titleError)}
                    aria-describedby={titleError ? "manual-note-title-error" : undefined}
                    className={`w-full px-4 py-3 border rounded-xl text-[15px] font-medium outline-none bg-surface-1 transition-colors ${titleError ? "border-red-400 focus:border-red-500" : "border-border-default focus:border-neutral-500"}`}
                  />
                  {titleError ? (
                    <p id="manual-note-title-error" className="text-[13px] text-red-600 mt-1.5">{titleError}</p>
                  ) : null}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="manual-note-body" className="text-[13px] font-bold text-text-main">笔记正文</label>
                    <span className="text-[13px] text-text-tertiary">{body.length} 字</span>
                  </div>
                  <textarea
                    id="manual-note-body"
                    rows={15}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder={'直接写正文，可先写草稿。\n\n建议包含：用户遇到的问题、真实过程或专业建议、最后的行动引导。'}
                    className="w-full min-h-[340px] px-4 py-3 border border-border-default rounded-xl text-[14px] leading-7 outline-none focus:border-neutral-500 bg-surface-1 resize-none"
                  />
                </div>
              </section>

              <aside className="p-5 bg-surface-subtle/70 space-y-5">
                <div>
                  <h3 className="text-[14px] font-bold text-text-main">发布设置</h3>
                  <p className="text-[13px] text-text-tertiary mt-1">先写内容，账号和时间也可以之后再调整。</p>
                </div>

                <div>
                  <label htmlFor="manual-note-account-type" className="block text-[13px] font-bold text-text-secondary mb-1.5">账号类型</label>
                  <select
                    id="manual-note-account-type"
                    value={accountType}
                    onChange={(e) => {
                      setAccountType(e.target.value as "KOC" | "店长号/KOS" | "品牌主号");
                      setAccountName('');
                      setContentDirection('');
                    }}
                    className="w-full px-3.5 py-2.5 border border-border-default rounded-xl text-[13px] outline-none focus:border-neutral-500 bg-surface-1"
                  >
                    <option value="KOC">KOC 消费者共创</option>
                    <option value="店长号/KOS">店长号 / KOS</option>
                    <option value="品牌主号">品牌主号</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="manual-note-account" className="block text-[13px] font-bold text-text-secondary mb-1.5">执行账号</label>
                  <input
                    id="manual-note-account"
                    type="text"
                    list="manual-note-account-options"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="选择或输入账号"
                    className="w-full px-3.5 py-2.5 border border-border-default rounded-xl text-[13px] outline-none focus:border-neutral-500 bg-surface-1"
                  />
                  <datalist id="manual-note-account-options">
                    {Array.from(new Set(project.notes.filter((note) => note.type === accountType).map((note) => note.participant))).map((name) => (
                      <option key={name} value={name} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label htmlFor="manual-note-direction" className="block text-[13px] font-bold text-text-secondary mb-1.5">内容角度</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {CONTENT_ANGLE_OPTIONS[accountType].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setContentDirection(option)}
                        className={`px-2.5 py-1 rounded-lg border text-[13px] transition-colors ${contentDirection === option ? "bg-btn-main border-btn-main text-white" : "bg-surface-1 border-border-default text-text-secondary hover:border-border-strong"}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <input
                    id="manual-note-direction"
                    type="text"
                    value={contentDirection}
                    onChange={(e) => setContentDirection(e.target.value)}
                    placeholder="也可以自己填写"
                    className="w-full px-3.5 py-2.5 border border-border-default rounded-xl text-[13px] outline-none focus:border-neutral-500 bg-surface-1"
                  />
                </div>

                <div>
                  <label htmlFor="manual-note-date" className="block text-[13px] font-bold text-text-secondary mb-1.5">计划发布日期</label>
                  <input
                    id="manual-note-date"
                    type="date"
                    value={plannedDate}
                    onChange={(e) => setPlannedDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-border-default rounded-xl text-[13px] outline-none focus:border-neutral-500 bg-surface-1"
                  />
                </div>
              </aside>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-default flex items-center justify-between bg-surface-1 shrink-0">
          <span className="text-[13px] text-text-tertiary">
            {mode === "file"
              ? "上传后可先确认识别结果，再批量导入。"
              : mode === "feishu"
              ? "连接后可定时同步飞书中的笔记安排。"
              : "保存后，这篇笔记会直接加入当前方案。"}
          </span>
          {mode === "single" ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-border-default rounded-xl text-[13px] font-bold text-text-secondary hover:bg-hover-bg transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                form="manual-note-form"
                className="px-6 py-2 bg-btn-main text-white rounded-xl text-[13px] font-bold hover:bg-btn-main-hover transition-colors shadow-xs"
              >
                保存笔记
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border-default rounded-xl text-[13px] font-bold text-text-secondary hover:bg-hover-bg transition-colors"
            >
              关闭
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
