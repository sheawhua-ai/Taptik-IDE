import React, { useState } from "react";
import { X, Download, FolderOpen, ShieldCheck, Table2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { ReviewTask } from "./types";

interface ExportReportModalProps {
  task: ReviewTask;
  isOpen: boolean;
  onClose: () => void;
}

export function ExportReportModal({ task, isOpen, onClose }: ExportReportModalProps) {
  const [exportType, setExportType] = useState<"html" | "pdf">("html");
  const [includeSourceData, setIncludeSourceData] = useState(true);
  const [saveToProjectDirectory, setSaveToProjectDirectory] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Generate self-contained HTML document with full styles and print-readiness
  const generateStandaloneHTML = () => {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${task.title} - 运营复盘报告</title>
  <style>
    :root {
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --card-subtle: #f1f5f9;
      --text-main: #0f172a;
      --text-secondary: #334155;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --border-subtle: #f1f5f9;
      --primary: #0284c7;
      --success: #16a34a;
      --warning: #d97706;
      --danger: #dc2626;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
      background-color: var(--bg);
      color: var(--text-main);
      line-height: 1.6;
      padding: 32px 20px;
    }
    .container {
      max-width: 960px;
      margin: 0 auto;
      background: var(--card-bg);
      border-radius: 16px;
      border: 1px solid var(--border);
      padding: 40px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }
    .header {
      border-bottom: 2px solid var(--border);
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 12px;
      background: #e0f2fe;
      color: #0369a1;
      border: 1px solid #bae6fd;
    }
    h1 { font-size: 24px; font-weight: 800; margin-bottom: 8px; color: var(--text-main); }
    .meta { font-size: 13px; color: var(--text-muted); display: flex; flex-wrap: wrap; gap: 16px; }
    
    .section {
      margin-bottom: 36px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 17px;
      font-weight: 700;
      border-bottom: 1px solid var(--border);
      padding-bottom: 10px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-title::before {
      content: "";
      display: inline-block;
      width: 4px;
      height: 18px;
      background: var(--primary);
      border-radius: 2px;
    }
    
    .highlight-box {
      background: var(--card-subtle);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
    }
    .tag-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
    .tag {
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
    }
    .tag-success { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
    .tag-warning { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
    .tag-primary { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }
    .metric-card {
      background: var(--card-subtle);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 14px;
    }
    .metric-label { font-size: 12px; color: var(--text-muted); margin-bottom: 4px; }
    .metric-val { font-size: 20px; font-weight: 800; color: var(--text-main); font-family: monospace; }
    .metric-diff { font-size: 12px; font-weight: 700; color: var(--success); }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 14px;
      margin-bottom: 20px;
    }
    .store-card {
      background: var(--card-subtle);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
    }
    .store-card.top {
      border: 2px solid #10b981;
      background: #f0fdf4;
    }
    .store-title { font-size: 14px; font-weight: 700; margin-bottom: 10px; }
    
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      margin: 16px 0;
    }
    th, td {
      border: 1px solid var(--border);
      padding: 10px 12px;
      text-align: left;
    }
    th { background: var(--card-subtle); font-weight: 600; color: var(--text-muted); }
    
    .funnel-step {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 14px;
      background: var(--card-subtle);
      border: 1px solid var(--border);
      border-radius: 8px;
      margin-bottom: 6px;
      font-size: 12px;
    }
    .funnel-step.critical {
      background: #fffbeb;
      border-color: #fde68a;
      font-weight: 600;
    }

    .action-card {
      background: var(--card-subtle);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 12px;
    }
    .action-badge {
      display: inline-block;
      padding: 2px 6px;
      font-size: 11px;
      font-weight: 700;
      border-radius: 4px;
      background: #fee2e2;
      color: #b91c1c;
      margin-bottom: 6px;
    }

    @media print {
      body { background: #ffffff; padding: 0; }
      .container { border: none; box-shadow: none; padding: 0; max-width: 100%; }
      .section { page-break-inside: avoid; margin-bottom: 24px; }
      @page { margin: 15mm; size: A4 portrait; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">正式运营复盘报告</div>
      <h1>${task.title}</h1>
      <div class="meta">
        <span><strong>复盘周期：</strong>${task.dateRange.start} 至 ${task.dateRange.end}</span>
        <span><strong>复盘范围：</strong>${task.projectNames.join('、')}</span>
        <span><strong>生成时间：</strong>${new Date().toLocaleDateString('zh-CN')}</span>
      </div>
    </div>

    <!-- 1. 复盘结论 -->
    <div class="section">
      <div class="section-title">1. 复盘核心结论</div>
      <div class="highlight-box">
        <p style="font-size: 15px; font-weight: 700;">
          矩阵发布 58 篇笔记累计曝光 44.2 万，三亚店实测科普类笔记私信留资率显著领先；夜间 20:00—24:00 咨询承接缺失导致 52% 潜客流失。
        </p>
        <div class="tag-row">
          <span class="tag tag-success">高转化特征：换粮实测与避坑科普（篇均线索 24.2 条）</span>
          <span class="tag tag-warning">核心卡点：夜间 20:00-24:00 咨询流失率达 52%</span>
          <span class="tag tag-primary">内容规模：58 篇有效笔记 · 44.2万 总曝光</span>
        </div>
      </div>
    </div>

    <!-- 2. 核心指标 -->
    <div class="section">
      <div class="section-title">2. 核心内容与线索转化指标</div>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">发布笔记数</div>
          <div class="metric-val">58 篇</div>
          <div class="metric-diff">↑ 16.0% 环比增长</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">全网笔记曝光</div>
          <div class="metric-val">44.2 万</div>
          <div class="metric-diff">↑ 16.8% 环比增长</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">深度互动总量</div>
          <div class="metric-val">28,240 次</div>
          <div class="metric-diff">↑ 19.4% 环比增长</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">综合互动率</div>
          <div class="metric-val">15.2%</div>
          <div class="metric-diff">↑ 2.1% 环比提升</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">私信咨询发起量</div>
          <div class="metric-val">1,420 人</div>
          <div class="metric-diff">↑ 17.3% 环比增长</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">有效留资率</div>
          <div class="metric-val">48.0%</div>
          <div class="metric-diff">↑ 5.9% 环比提升</div>
        </div>
      </div>
    </div>

    <!-- 3. 关键分析 -->
    <div class="section">
      <div class="section-title">3. 关键业务分析（结论与证据）</div>
      
      <!-- 门店对比 -->
      <h3 style="font-size: 14px; margin: 16px 0 8px;">3.1 门店表现与账号对比</h3>
      <div class="card-grid">
        <div class="store-card top">
          <div class="store-title">三亚海棠湾店长账号（转化标杆）</div>
          <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">
            发布 24 篇 · 曝光 18.4万 · 互动率 17.8% · 获取 582 条留资 (占比 54%)
          </p>
          <p style="font-size: 11.5px; color: var(--success); font-weight: 600;">
            [标杆经验] 真实店长人设 + 评论区置顶换粮自测表 + 3.2分钟极速响应。
          </p>
        </div>
        <div class="store-card">
          <div class="store-title">青岛万象城体验店账号</div>
          <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">
            发布 18 篇 · 曝光 14.2万 · 互动率 12.1% · 获取 310 条留资 (占比 22%)
          </p>
          <p style="font-size: 11.5px; color: var(--warning); font-weight: 600;">
            [差距原因] 促销硬广多泛流量大；夜间无自动接待导致 52% 咨询超时流失。
          </p>
        </div>
      </div>

      <!-- 内容表现 -->
      <h3 style="font-size: 14px; margin: 20px 0 8px;">3.2 内容表现与样本归因</h3>
      <table>
        <thead>
          <tr>
            <th>代表性笔记</th>
            <th>类型</th>
            <th>曝光量</th>
            <th>阅读/点击</th>
            <th>互动率</th>
            <th>留资线索</th>
            <th>留资转化率</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>【店长换粮打卡】幼犬换粮连拉3天便便？</strong></td>
            <td>专业答疑实测</td>
            <td>4.8万</td>
            <td>2.1万</td>
            <td>18.4%</td>
            <td>142 条</td>
            <td style="color: #16a34a; font-weight: 700;">22.4%</td>
          </tr>
          <tr>
            <td><strong>低温烘焙粮真实测评！看懂配料表前5位</strong></td>
            <td>专业答疑实测</td>
            <td>3.9万</td>
            <td>1.8万</td>
            <td>16.2%</td>
            <td>98 条</td>
            <td style="color: #16a34a; font-weight: 700;">19.8%</td>
          </tr>
          <tr>
            <td><strong>万象城夏日宠粉节：免费领试吃装</strong></td>
            <td>活动优惠促销</td>
            <td>4.1万</td>
            <td>1.5万</td>
            <td>11.0%</td>
            <td>32 条</td>
            <td style="color: #d97706;">7.2%</td>
          </tr>
        </tbody>
      </table>

      <!-- 转化漏斗 -->
      <h3 style="font-size: 14px; margin: 20px 0 8px;">3.3 笔记全链路转化漏斗与卡点</h3>
      <div class="funnel-step"><span>1. 笔记全网曝光</span><strong>442,000 (100%)</strong></div>
      <div class="funnel-step"><span>2. 深度阅读 / 点击</span><strong>186,000 (42.1%)</strong></div>
      <div class="funnel-step"><span>3. 深度互动 (赞/藏/评)</span><strong>28,240 (15.2%)</strong></div>
      <div class="funnel-step"><span>4. 发起私信咨询</span><strong>1,420 (5.0%)</strong></div>
      <div class="funnel-step critical"><span>5. 有效私信留资 [关键卡点]</span><strong>682 (48.0% · 流失 52.0%)</strong></div>
      <div class="funnel-step"><span>6. 意向潜客建联与承接</span><strong>412 (60.4%)</strong></div>
    </div>

    <!-- 4. 后续迭代建议 -->
    <div class="section">
      <div class="section-title">4. 后续迭代建议与执行落地</div>
      ${task.suggestedActions.map((a, i) => `
        <div class="action-card">
          <span class="action-badge">${a.priority} 优先级 · ${a.category}</span>
          <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 6px;">${i + 1}. ${a.title}</h4>
          <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;"><strong>目标：</strong>${a.target}</p>
          <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;"><strong>预期收益：</strong>${a.expectedGain}</p>
          <div style="font-size: 11.5px; background: #ffffff; padding: 8px 12px; border-radius: 6px; border: 1px solid var(--border); margin-top: 8px;">
            <strong>执行 SOP：</strong>
            <ul style="padding-left: 18px; margin-top: 4px;">
              ${a.recommendedSteps.map(s => `<li>${s}</li>`).join('')}
            </ul>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- 5. 风险与数据说明 -->
    <div class="section">
      <div class="section-title">5. 风险与数据说明</div>
      <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.8;">
        <p><strong>异常说明：</strong>青岛与杭州在 20:00—24:00 时段咨询流失率达 42%，主要由于夜间专人断层导致；7月15日前第三方接口存在延迟已通过加权平滑校准。</p>
        <p><strong>数据范围：</strong>2026-07-01 至 2026-07-31 自然月；覆盖三亚、青岛、杭州 3 家门店矩阵。</p>
        <p><strong>指标口径：</strong>留资率 = 有效留资人数 ÷ 独立私信人数；CPL = 运营总支出 ÷ 有效留资线索数。</p>
      </div>
    </div>
  </div>
</body>
</html>`;
  };

  const safeFileName = task.title.replace(/[\\/:*?"<>|]/g, "-");
  const xmlEscape = (value: unknown) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const workbookCell = (value: unknown) => `<Cell><Data ss:Type="String">${xmlEscape(value)}</Data></Cell>`;
  const workbookSheet = (name: string, rows: unknown[][]) => `<Worksheet ss:Name="${xmlEscape(name)}"><Table>${rows.map(row => `<Row>${row.map(workbookCell).join("")}</Row>`).join("")}</Table></Worksheet>`;

  const generateSourceWorkbook = () => {
    const summaryRows = [
      ["字段", "内容"], ["复盘任务", task.title], ["复盘周期", `${task.dateRange.start} 至 ${task.dateRange.end}`],
      ["方案范围", task.projectNames.join("、")], ["复盘问题", task.goalDescription], ["目标", task.targetObjectiveLabel],
      ["样本笔记", `${task.analysisDetails.summary.sampleNotesCount} 篇`], ["数据来源", task.analysisDetails.summary.dataSource],
      ["综合结论", task.analysisDetails.finalConclusion]
    ];
    const metricRows = [["指标", "上一周期", "本周期", "变化", "方向", "说明"], ...task.analysisDetails.metricShifts.map(item => [item.metric, item.before, item.current, item.change, item.isGood ? "改善" : "下降", item.note])];
    const planRows = [["方案ID", "方案名称", "复盘周期"], ...task.projectNames.map((name, index) => [task.projectIds[index] || `plan-${index + 1}`, name, task.dateRange.label])];
    const actionRows = [["优先级", "类别", "建议动作", "修改目标", "预期收益", "依据", "当前状态"], ...task.suggestedActions.map(action => [action.priority, action.category, action.title, action.target, action.expectedGain, action.reason, action.appliedDestinationLabel || "待人工确认"] )];
    const scopeRows = [["口径项", "内容"], ["数据截止", task.historyVersions[0]?.dataCutoff || task.updatedAt], ["观察窗口", task.observationWindowLabel || "截至当前"], ["复盘方向", (task.reviewDirections || []).join("、") || "完整复盘"], ["说明", "缺失字段保持为空，不用计划值或 AI 估算值补齐"]];
    return `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">${workbookSheet("复盘概览", summaryRows)}${workbookSheet("指标明细", metricRows)}${workbookSheet("方案范围", planRows)}${workbookSheet("优化动作", actionRows)}${workbookSheet("数据口径", scopeRows)}</Workbook>`;
  };

  const downloadFile = (fileName: string, content: string, type: string) => {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const deliverFiles = async (files: { name: string; content: string; type: string }[]) => {
    const directoryPicker = (window as typeof window & { showDirectoryPicker?: (options?: { mode?: string }) => Promise<any> }).showDirectoryPicker;
    if (saveToProjectDirectory && directoryPicker) {
      const directory = await directoryPicker({ mode: "readwrite" });
      for (const file of files) {
        const handle = await directory.getFileHandle(file.name, { create: true });
        const writer = await handle.createWritable();
        await writer.write(new Blob([file.content], { type: file.type }));
        await writer.close();
      }
      return "project";
    }
    files.forEach(file => downloadFile(file.name, file.content, file.type));
    return "download";
  };

  const sourceFile = () => ({ name: `${safeFileName}_源数据.xls`, content: generateSourceWorkbook(), type: "application/vnd.ms-excel;charset=utf-8" });

  const handleExportHTML = async () => {
    setDownloading(true);
    try {
      const files = [{ name: `${safeFileName}_运营复盘报告.html`, content: generateStandaloneHTML(), type: "text/html;charset=utf-8" }];
      if (includeSourceData) files.push(sourceFile());
      const destination = await deliverFiles(files);
      setSuccessMsg(destination === "project" ? `报告${includeSourceData ? "和源数据" : ""}已保存到所选项目目录` : `报告${includeSourceData ? "和源数据 Excel" : ""} 已下载`);
    } catch (error) {
      if ((error as { name?: string }).name !== "AbortError") setSuccessMsg("保存未完成，请重新选择目录或改为下载到本机");
    } finally {
      setDownloading(false);
      window.setTimeout(() => setSuccessMsg(null), 3200);
    }
  };

  const handleExportPDF = async () => {
    setDownloading(true);
    const htmlContent = generateStandaloneHTML();
    try {
      if (includeSourceData || saveToProjectDirectory) {
        const files = saveToProjectDirectory
          ? [{ name: `${safeFileName}_运营复盘报告.html`, content: htmlContent, type: "text/html;charset=utf-8" }, ...(includeSourceData ? [sourceFile()] : [])]
          : includeSourceData ? [sourceFile()] : [];
        if (files.length) await deliverFiles(files);
      }
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        window.setTimeout(() => printWindow.print(), 400);
        setSuccessMsg(`已打开 PDF 打印面板${includeSourceData ? "，源数据 Excel 已同时导出" : ""}`);
      } else {
        downloadFile(`${safeFileName}_运营复盘报告.html`, htmlContent, "text/html;charset=utf-8");
        setSuccessMsg("打印窗口被阻止，已改为导出 HTML 报告");
      }
    } catch (error) {
      if ((error as { name?: string }).name !== "AbortError") setSuccessMsg("导出未完成，请重新选择保存位置");
    } finally {
      setDownloading(false);
      window.setTimeout(() => setSuccessMsg(null), 3200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 font-sans text-text-main">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-surface-1 rounded-2xl shadow-dialog border border-border-default w-full max-w-lg overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-border-default flex items-center justify-between bg-surface-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-subtle border border-border-default flex items-center justify-center text-btn-main">
              <Download size={17} />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-text-main">导出复盘报告</h3>
              <p className="text-[13px] text-text-tertiary">
                仅导出报告主体，适合对外分享与归档
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-hover-bg flex items-center justify-center text-text-tertiary hover:text-text-main"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-[13px] leading-5 text-blue-900">
            <ShieldCheck size={15} className="mt-0.5 shrink-0" />
            <span>包含结论、图表、数据表与行动建议；不包含 AI 分析过程、Agent 日志和内部判断依据。</span>
          </div>
          <div className="space-y-3">
            <label className="text-[13px] font-semibold text-text-secondary block">
              选择导出格式
            </label>

            {/* Option 1: HTML (Default) */}
            <div
              onClick={() => setExportType("html")}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                exportType === "html"
                  ? "bg-surface-subtle border-btn-main shadow-2xs"
                  : "bg-surface-1 border-border-default hover:border-border-strong"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                  exportType === "html"
                    ? "border-btn-main bg-btn-main text-white"
                    : "border-border-strong bg-surface-1"
                }`}
              >
                {exportType === "html" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13.5px] font-bold text-text-main">导出为 HTML 报告</span>
                  <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[13px] font-bold rounded">
                    推荐 · 默认
                  </span>
                </div>
                <p className="text-[13px] text-text-tertiary leading-relaxed">
                  保留完整视觉样式、图表与排版，无需安装特定软件，双击即可在任何浏览器中打开或直接微信/邮件发送分享。
                </p>
              </div>
            </div>

            {/* Option 2: PDF */}
            <div
              onClick={() => setExportType("pdf")}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                exportType === "pdf"
                  ? "bg-surface-subtle border-btn-main shadow-2xs"
                  : "bg-surface-1 border-border-default hover:border-border-strong"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                  exportType === "pdf"
                    ? "border-btn-main bg-btn-main text-white"
                    : "border-border-strong bg-surface-1"
                }`}
              >
                {exportType === "pdf" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13.5px] font-bold text-text-main">下载 PDF 报告</span>
                  <span className="px-1.5 py-0.2 bg-surface-subtle text-text-secondary border border-border-default text-[13px] font-medium rounded">
                    适合打印与归档
                  </span>
                </div>
                <p className="text-[13px] text-text-tertiary leading-relaxed">
                  采用针对 A4 打印优化的固定分页排版，避免图表与卡片跨页截断，适合管理层汇报、团队培训与归档。
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border-default bg-surface-1">
            <label className="flex cursor-pointer items-start gap-3 border-b border-border-subtle p-3.5">
              <input type="checkbox" checked={includeSourceData} onChange={event => setIncludeSourceData(event.target.checked)} className="mt-0.5 h-4 w-4 rounded accent-neutral-950" />
              <Table2 size={15} className="mt-0.5 shrink-0 text-emerald-700" />
              <span className="min-w-0"><span className="block text-[13px] font-semibold text-text-main">同时导出源数据 Excel</span><span className="mt-0.5 block text-[13px] leading-5 text-text-tertiary">包含复盘概览、指标明细、方案范围、优化动作和数据口径，可继续筛选与分析。</span></span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 p-3.5">
              <input type="checkbox" checked={saveToProjectDirectory} onChange={event => setSaveToProjectDirectory(event.target.checked)} className="mt-0.5 h-4 w-4 rounded accent-neutral-950" />
              <FolderOpen size={15} className="mt-0.5 shrink-0 text-blue-700" />
              <span className="min-w-0"><span className="block text-[13px] font-semibold text-text-main">保存到项目目录</span><span className="mt-0.5 block text-[13px] leading-5 text-text-tertiary">首次导出时选择当前项目文件夹；不勾选则使用浏览器下载目录。</span></span>
            </label>
          </div>

          {/* Success Message Banner */}
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[13px] text-emerald-800 flex items-center gap-2">
              <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-default flex items-center justify-between bg-surface-subtle">
          <span className="text-[13px] text-text-tertiary">
            报告主体 · 可附源数据 Excel · 不含 AI 过程
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-[13px] font-medium text-text-secondary hover:bg-hover-bg rounded-xl transition-colors border border-border-default bg-surface-1"
            >
              取消
            </button>
            <button
              onClick={exportType === "html" ? handleExportHTML : handleExportPDF}
              disabled={downloading}
              className="px-4 py-2 text-[13px] font-medium text-white bg-btn-main hover:bg-btn-main-hover rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {downloading ? (
                <span>正在生成...</span>
              ) : (
                <>
                  <Download size={14} />
                  <span>{exportType === "html" ? "导出为 HTML" : "下载 PDF"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
