import React, { useState } from 'react';
import { 
  X, Clock, ChevronRight, CheckCircle2,
  Check, ChevronDown, Smartphone, FileText, AlertCircle,
  Eye, RefreshCw, Layers, ArrowLeft, ExternalLink, ShieldAlert, Filter,
  Activity, Wrench, SearchCheck, CheckSquare, Upload, RotateCcw, Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PublishExceptionWorkbenchProps {
  taskId?: string;
  onBack?: () => void;
  onClose?: () => void;
  initialSelectedId?: string;
  fromSource?: 'project' | 'execution';
}

export interface ManualAuditLog {
  operator: string;
  timestamp: string;
  basis: string;
  explanation: string;
  screenshotUrl?: string;
  noteUrl?: string;
}

export interface PublishTaskItem {
  id: string;
  category: '待我处理' | '系统跟进中' | '已完成';
  projectName: string;
  noteTitle: string;
  packageId: string;
  publishType: '自有账号发布' | '消费者协作发布';
  publisherName: string;
  targetAccount: string;
  assignee: string;
  deadline: string;
  stayTime: string;
  statusBadge: string;
  
  // Core Information
  currentStatusTitle: string;
  currentOccurrence: string;
  confirmedFacts: string[];
  blockReason: string;
  systemNextAction: string;
  nextAutoCheckTime: string;
  manualJudgement: string;

  // Timeline & Flow mode
  currentStepIndex: number;
  flowState: 'auto_detecting' | 'manual_verification_required' | 'retrying' | 'manual_confirmed' | 'observing' | 'completed' | 'failed';
  
  // Right Diagnosis Panel
  diagnosisJudgement: string;
  diagnosisEvidence: string[];
  diagnosisNextStep: string;
  
  // Actions
  primaryActionLabel: string | null;
  secondaryActions: string[];

  // Audit history for manual confirmation
  auditLog?: ManualAuditLog;
  
  // Note/Material Drawer Data
  noteSnapshot: {
    title: string;
    body: string;
    images: string[];
    materialStatus: string;
  };
}

export const PublishExceptionWorkbench: React.FC<PublishExceptionWorkbenchProps> = ({
  taskId: propsTaskId,
  onBack,
  onClose,
  initialSelectedId,
  fromSource = 'execution'
}) => {
  const handleReturn = onClose || onBack || (() => {});

  // Tasks reflecting both Own Account & Consumer Collab
  const [tasks, setTasks] = useState<PublishTaskItem[]>([
    {
      id: 't1',
      category: '待我处理',
      projectName: '幼犬换粮搜索卡位',
      noteTitle: '幼犬换粮避坑指南与七日过渡法',
      packageId: '内容包 #45',
      publishType: '自有账号发布',
      publisherName: '张三 (店长号A)',
      targetAccount: '小红书-宠粮精选店长',
      assignee: '运营主管-王强',
      deadline: '2026-08-13 18:00',
      stayTime: '2小时15分',
      statusBadge: '等待人工核实',
      
      currentStatusTitle: '自动识别重试失败，已转入等待人工核实',
      currentOccurrence: '系统已捕获发布关联链接并尝试自动复验，但连续 3 次打开笔记公网页面均返回异常（404/页面不可见），已停止自动轮询，需人工核验小红书端真实上线状态。',
      confirmedFacts: [
        '14:20 手机端已执行下发并完成小红书内容提交',
        '已提取到小红书笔记 ID: xhs_9921k',
        '公网访问自动校验：连续 3 次重试失败',
        '自动轮询检查已停止，等待人工核查或补充凭证'
      ],
      blockReason: '笔记链接可被识别，但公网无法访问，怀疑处于平台内部审核状态或被作者设为私密。',
      systemNextAction: '暂停自动轮询，由运营人员人工核验或联系发布人。',
      nextAutoCheckTime: '无（等待人工核实）',
      manualJudgement: '需人工核实笔记在客户端是否真实公开发布，或要求发布人解密/重新发布。',
      
      currentStepIndex: 4, // "等待人工核实"
      flowState: 'manual_verification_required',

      diagnosisJudgement: '系统已成功识别到小红书笔记编号，但无法抓取页面快照，判定为平台审核拦截或可见性设置异常。',
      diagnosisEvidence: [
        '小红书笔记 ID：xhs_9921k',
        '下发时间：14:20，首次识别时间：14:30',
        '自动检查重试次数：3 次均失败',
        '当前公网可达性：否（已暂停自动检查）'
      ],
      diagnosisNextStep: '维持现有进度，不重复下发，由运营人员人工判定或联系发布人。',
      
      primaryActionLabel: '联系发布人核实',
      secondaryActions: ['重新触发自动识别', '人工确认已发布', '标记为发布失败'],
      
      noteSnapshot: {
        title: '幼犬换粮避坑指南与七日过渡法',
        body: '我家小狗刚换粮的时候也经历过拉肚子，后来才知道必须严格遵循七日换粮法！第一天1/4新粮，逐步递增...',
        images: ['https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop&q=80'],
        materialStatus: '已审核通过'
      }
    },
    {
      id: 't2',
      category: '待我处理',
      projectName: 'KOC新客体验包活动',
      noteTitle: '金毛肠胃护理分享体验',
      packageId: '内容包 #82',
      publishType: '消费者协作发布',
      publisherName: '消费者 @小红薯_抹茶狗',
      targetAccount: '消费者个人小红书账号',
      assignee: '社群运营-李莉',
      deadline: '2026-08-13 20:00',
      stayTime: '45分钟',
      statusBadge: '待进入APP发布',
      
      currentStatusTitle: '消费者已下载素材但超 45 分钟未发布',
      currentOccurrence: '消费者在 H5 页面中已成功提交问卷、生成内容并保存了合规图片，但在“进入小红书发布”环节停留超时。',
      confirmedFacts: [
        '15:10 消费者完成试用问卷填写',
        '15:20 AI 检查合成图文合格并保存至手机相册',
        '等待消费者打卡上线并抓取笔记链接'
      ],
      blockReason: '用户未能在预计时间内完成小红书发文，可能忘记或遇到操作卡顿。',
      systemNextAction: '系统将在 15 分钟后向用户推送微信通知提醒。',
      nextAutoCheckTime: '15 分钟后 (16:15)',
      manualJudgement: '可手动推送短信/社群提醒，或提前结束该任务并回收名额。',
      
      currentStepIndex: 6, // "待发布"
      flowState: 'auto_detecting',

      diagnosisJudgement: '消费者领取流程与素材准备已全部通过，处于最后的自主发文临门一脚。',
      diagnosisEvidence: [
        '领券打卡问卷：已完成 (15:10)',
        '图像合规校验：100% 通过',
        '停留时长：45 分钟 (预警阈值 30 分钟)'
      ],
      diagnosisNextStep: '若 16:15 仍未识别到发布，系统将自动标记该体验包为“超时未发文”。',
      
      primaryActionLabel: '发送发文提醒消息',
      secondaryActions: ['人工确认已发布', '结束领取并作废'],
      
      noteSnapshot: {
        title: '金毛肠胃护理分享体验',
        body: '之前我家狗子一直挑食换粮难，试了这个益生菌试用包，适口性超级棒...',
        images: ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop&q=80'],
        materialStatus: '自动校验通过'
      }
    },
    {
      id: 't3',
      category: '系统跟进中',
      projectName: '品牌官方宣发季',
      noteTitle: '主打款无谷主粮大促销',
      packageId: '内容包 #12',
      publishType: '自有账号发布',
      publisherName: '李四 (店长号B)',
      targetAccount: '小红书-官方旗舰店店长',
      assignee: '运营主管-王强',
      deadline: '2026-08-14 12:00',
      stayTime: '10分钟',
      statusBadge: '自动识别中',
      
      currentStatusTitle: '发布任务已下发，系统正每 5 分钟轮询识别',
      currentOccurrence: '手机端已自动完成剪切板与图册注入，系统正通过平台 Api 与爬虫接口持续检索目标账号的最新发布。',
      confirmedFacts: [
        '内容包生成并下发成功',
        '手机终端提示成功跳转小红书',
        '匹配标题关键字与图片哈希值中'
      ],
      blockReason: '无',
      systemNextAction: '系统自动跟踪轮询中，预计 10 分钟内完成自动绑定。',
      nextAutoCheckTime: '5 分钟后 (15:55)',
      manualJudgement: '系统正常跟进，无需人工干预。',
      
      currentStepIndex: 3, // "自动识别中"
      flowState: 'auto_detecting',

      diagnosisJudgement: '自动化推进状态良好，发文流水线正常，数据流无阻塞。',
      diagnosisEvidence: [
        '手机助手客户端：连接正常',
        '接口检索频次：每 5 分钟 1 次',
        '累计识别尝试：2 次'
      ],
      diagnosisNextStep: '识别成功后自动切换至“观察中”并开启 7 天效果数据追踪。',
      
      primaryActionLabel: null,
      secondaryActions: ['人工确认已发布', '查看设备操作日志'],
      
      noteSnapshot: {
        title: '主打款无谷主粮大促销',
        body: '官方旗舰店限时优惠来啦！下单即赠试吃装...',
        images: ['https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&auto=format&fit=crop&q=80'],
        materialStatus: '无需审核'
      }
    }
  ]);

  const [activeTaskId, setActiveTaskId] = useState<string>(
    propsTaskId || initialSelectedId || 't1'
  );
  const [activeCategoryTab, setActiveCategoryTab] = useState<'待我处理' | '系统跟进中' | '已完成'>('待我处理');
  const [showDiagnosisDrawer, setShowDiagnosisDrawer] = useState(false);

  // Drawers & Modals
  const [showNoteDrawer, setShowNoteDrawer] = useState(false);
  const [showLogsDrawer, setShowLogsDrawer] = useState(false);
  const [showManualConfirmModal, setShowManualConfirmModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);

  // Manual Confirmation Form State
  const [manualConfirmBasis, setManualConfirmBasis] = useState('手机端已展示且公网可访问');
  const [manualExplanation, setManualExplanation] = useState('');
  const [manualNoteUrl, setManualNoteUrl] = useState('');
  const [manualScreenshotAttached, setManualScreenshotAttached] = useState(false);
  const [hasDoubleConfirmed, setHasDoubleConfirmed] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeTask = tasks.find(t => t.id === activeTaskId) || tasks[0];
  const filteredTasks = tasks.filter(t => t.category === activeCategoryTab);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Flow Node Definitions - Distinguishing Auto Detection, Manual Verification, Manual Confirmed, Observing, Completed
  const OWN_ACCOUNT_NODES = [
    '内容已准备',
    '已下发手机任务',
    '发布人操作中',
    '自动识别中',
    '等待人工核实',
    '人工确认/已识别',
    '数据观察中',
    '完成'
  ];

  const CONSUMER_COLLAB_NODES = [
    '待领取',
    '已领取',
    '待填写问卷',
    '待生成内容',
    '待拍摄/上传',
    '合规检查',
    '待发布',
    '自动识别中',
    '等待人工核实',
    '人工确认/已识别',
    '数据观察中',
    '完成'
  ];

  const currentFlowNodes = activeTask.publishType === '自有账号发布' ? OWN_ACCOUNT_NODES : CONSUMER_COLLAB_NODES;

  // Handle Manual Confirm Submit with full audit trail
  const handleManualConfirmSubmit = () => {
    if (!hasDoubleConfirmed) {
      triggerToast('请勾选二次确认复选框以继续');
      return;
    }
    if (manualConfirmBasis === '补充小红书笔记URL' && !manualNoteUrl.trim()) {
      triggerToast('请输入合规的小红书笔记链接');
      return;
    }

    const auditLog: ManualAuditLog = {
      operator: '运营主管-王强',
      timestamp: new Date().toLocaleString('zh-CN', { hour12: false }),
      basis: manualConfirmBasis,
      explanation: manualExplanation || '核实客户端公网已可正常访问并完成内容上线。',
      screenshotUrl: manualScreenshotAttached ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600' : undefined,
      noteUrl: manualNoteUrl || 'https://www.xiaohongshu.com/explore/xhs_9921k'
    };

    setTasks(prev => prev.map(t => {
      if (t.id === activeTask.id) {
        const obsStepIndex = currentFlowNodes.indexOf('数据观察中');
        return {
          ...t,
          category: '已完成',
          statusBadge: '已人工确认发布',
          currentStatusTitle: '已人工确认发布，已进入 7 天效果数据观察',
          currentOccurrence: `运营人员已于 ${auditLog.timestamp} 完成人工核实验收，依据：${manualConfirmBasis}。系统已同步开启数据归集并计入发文完成率。`,
          blockReason: '无',
          systemNextAction: '开启 7 天效果数据追踪（浏览量、互动率、搜索卡位）。',
          nextAutoCheckTime: '数据归集中 (每 2 小时更新)',
          currentStepIndex: obsStepIndex >= 0 ? obsStepIndex : currentFlowNodes.length - 2,
          flowState: 'manual_confirmed',
          auditLog,
          confirmedFacts: [
            ...t.confirmedFacts,
            `[人工确认记录] 操作人: ${auditLog.operator} · 依据: ${auditLog.basis} (${auditLog.timestamp})`
          ],
          secondaryActions: ['撤销人工确认', '修正笔记URL链接', '查看操作日志']
        };
      }
      return t;
    }));

    setShowManualConfirmModal(false);
    setHasDoubleConfirmed(false);
    setManualExplanation('');
    triggerToast('已人工确认发布，状态同步更新为【数据观察中】');
  };

  // Handle Revoke Manual Confirm
  const handleRevokeConfirm = () => {
    setTasks(prev => prev.map(t => {
      if (t.id === activeTask.id) {
        const verifyStepIndex = currentFlowNodes.indexOf('等待人工核实');
        return {
          ...t,
          category: '待我处理',
          statusBadge: '等待人工核实',
          currentStatusTitle: '已撤销人工确认，恢复等待人工核实状态',
          currentOccurrence: '运营人员撤销了此前的人工确认记录，任务已重新退回待处理队列。',
          blockReason: '笔记链接仍需重新核验公网可见性。',
          systemNextAction: '等待运营人员重新核实或联系发布人。',
          nextAutoCheckTime: '无（等待人工判定）',
          currentStepIndex: verifyStepIndex >= 0 ? verifyStepIndex : 4,
          flowState: 'manual_verification_required',
          confirmedFacts: [
            ...t.confirmedFacts,
            `[撤销记录] 操作人: 运营主管-王强 · 撤销人工确认 (${new Date().toLocaleTimeString()})`
          ],
          secondaryActions: ['重新触发自动识别', '人工确认已发布', '标记为发布失败']
        };
      }
      return t;
    }));

    setShowRevokeModal(false);
    triggerToast('已撤销人工确认，任务已恢复至【待我处理】');
  };

  const handleExecutePrimaryAction = () => {
    if (activeTask.primaryActionLabel === '联系发布人核实' || activeTask.primaryActionLabel === '发送发文提醒消息') {
      triggerToast(`已成功向 ${activeTask.publisherName} 发送加急催发提醒`);
    } else {
      triggerToast('操作指令已下发，系统将更新任务状态');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-page-bg flex flex-col text-text-main overflow-hidden">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-[200] bg-btn-main text-white text-[13px] font-medium px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2"
          >
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. TOP HEADER */}
      <div className="bg-surface-1 border-b border-border-default px-6 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-hover-bg text-text-secondary border border-border-default">
            <FileText size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[16px] font-semibold text-text-main">发布任务处理</h1>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-hover-bg text-text-secondary border border-border-default">
                {activeTask.publishType}
              </span>
              <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium border ${
                activeTask.statusBadge.includes('已人工确认')
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : activeTask.statusBadge.includes('等待人工')
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-hover-bg text-text-secondary border-border-default'
              }`}>
                {activeTask.statusBadge}
              </span>
            </div>
            
            <div className="text-[12px] text-text-tertiary flex items-center gap-3 mt-0.5 font-normal">
              <span className="font-medium text-text-secondary truncate max-w-[280px]">笔记：{activeTask.noteTitle}</span>
              <span>·</span>
              <span className="truncate max-w-[180px]">账号：{activeTask.targetAccount}</span>
              <span>·</span>
              <span>包：{activeTask.packageId}</span>
              <span>·</span>
              <span>负责人：{activeTask.assignee}</span>
              <span>·</span>
              <span>截止：{activeTask.deadline}</span>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowNoteDrawer(true)}
            className="px-3.5 py-1.5 rounded-lg border border-border-default bg-surface-1 hover:bg-hover-bg text-text-secondary text-[12.5px] font-medium transition-colors flex items-center gap-1.5"
          >
            <Eye size={14} className="text-text-tertiary" />
            <span>查看笔记/素材</span>
          </button>
          
          <div className="h-4 w-[1px] bg-border-default" />

          {/* Top Right Close X Button */}
          <button 
            onClick={handleReturn}
            className="p-1.5 rounded-lg text-text-tertiary hover:text-text-main hover:bg-hover-bg transition-colors"
            title="关闭页面"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* MAIN BODY: 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT COLUMN: Queue List */}
        <div className="w-[300px] bg-surface-1 border-r border-border-default flex flex-col shrink-0">
          {/* Category Tabs */}
          <div className="p-3 border-b border-border-default flex items-center justify-between gap-1 bg-surface-2">
            {(['待我处理', '系统跟进中', '已完成'] as const).map(cat => {
              const count = tasks.filter(t => t.category === cat).length;
              const isActive = activeCategoryTab === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryTab(cat)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[12px] font-medium transition-colors flex flex-col items-center justify-center gap-0.5 ${
                    isActive 
                      ? 'bg-btn-main text-white' 
                      : 'text-text-secondary hover:bg-hover-bg'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 rounded-full ${isActive ? 'bg-surface-1/20 text-white' : 'bg-surface-1 text-text-tertiary border border-border-default'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Task Queue Items */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(item => {
                const isSelected = item.id === activeTaskId;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveTaskId(item.id)}
                    className={`p-3.5 rounded-xl border transition-colors cursor-pointer relative ${
                      isSelected 
                        ? 'bg-selected-bg/60 border-neutral-400 border-l-4 border-l-brand-logo' 
                        : 'bg-surface-1 border-border-default hover:border-neutral-300 hover:bg-hover-bg text-text-main'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="px-2 py-0.5 rounded font-medium bg-hover-bg text-text-secondary border border-border-default">
                        {item.publishType}
                      </span>
                      <span className="text-text-tertiary font-normal">
                        停留 {item.stayTime}
                      </span>
                    </div>

                    <div className="text-[13px] font-medium line-clamp-1 mb-1 text-text-main">
                      {item.noteTitle}
                    </div>

                    <div className="text-[11.5px] truncate mb-2 text-text-tertiary font-normal">
                      账号：{item.targetAccount}
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-dashed border-border-default">
                      <span className="text-text-secondary font-normal">
                        {item.publisherName}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded font-medium ${
                        item.statusBadge.includes('已人工确认')
                          ? 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                          : 'text-amber-800 bg-amber-50 border border-amber-200'
                      }`}>
                        {item.statusBadge}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-text-tertiary text-[13px] font-normal">
                暂无{activeCategoryTab}任务
              </div>
            )}
          </div>
        </div>

        {/* CENTER COLUMN: Top Action Summary + Vertical Status Flow */}
        <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-6">
          
          {/* Top Quick Decision & Action Banner */}
          <div className="bg-surface-1 rounded-xl border border-border-default p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                <ShieldAlert size={20} />
              </div>
              <div>
                <div className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">处理判定建议</div>
                <div className="text-[13.5px] font-medium text-text-main mt-0.5">{activeTask.manualJudgement}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {activeTask.primaryActionLabel && (
                <button
                  onClick={handleExecutePrimaryAction}
                  className="px-4 py-2 bg-btn-main hover:bg-btn-main-hover text-white rounded-lg text-[12.5px] font-medium transition-colors flex items-center gap-1.5"
                >
                  <span>{activeTask.primaryActionLabel}</span>
                  <ChevronRight size={14} />
                </button>
              )}

              {activeTask.category !== '已完成' ? (
                <button
                  onClick={() => setShowManualConfirmModal(true)}
                  className="px-4 py-2 bg-surface-1 hover:bg-hover-bg text-text-main border border-border-default rounded-lg text-[12.5px] font-medium transition-colors flex items-center gap-1.5"
                >
                  <CheckSquare size={14} className="text-text-secondary" />
                  <span>人工确认已发布</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowRevokeModal(true)}
                  className="px-4 py-2 bg-surface-1 hover:bg-hover-bg text-danger border border-danger/30 rounded-lg text-[12.5px] font-medium transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw size={14} />
                  <span>撤销人工确认</span>
                </button>
              )}

              <button
                onClick={() => setShowDiagnosisDrawer(true)}
                className="px-4 py-2 bg-surface-1 hover:bg-hover-bg text-text-secondary border border-border-default rounded-lg text-[12.5px] font-medium transition-colors flex items-center gap-1.5"
              >
                <Activity size={14} className="text-text-secondary" />
                <span>诊断与操作</span>
              </button>
            </div>
          </div>

          {/* If there is an existing Manual Audit Log, display audit summary */}
          {activeTask.auditLog && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-700" />
                  <span className="text-[13.5px] font-medium text-emerald-900">人工确认审核记录</span>
                </div>
                <span className="text-[11.5px] text-emerald-800 font-normal">{activeTask.auditLog.timestamp}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12px] pt-1">
                <div>
                  <span className="text-emerald-800/80 font-normal">审核人：</span>
                  <span className="text-emerald-950 font-medium">{activeTask.auditLog.operator}</span>
                </div>
                <div>
                  <span className="text-emerald-800/80 font-normal">判定依据：</span>
                  <span className="text-emerald-950 font-medium">{activeTask.auditLog.basis}</span>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <span className="text-emerald-800/80 font-normal">操作说明：</span>
                  <span className="text-emerald-950 font-normal">{activeTask.auditLog.explanation}</span>
                </div>
                {activeTask.auditLog.noteUrl && (
                  <div className="col-span-1 md:col-span-2 flex items-center gap-2">
                    <span className="text-emerald-800/80 font-normal">关联URL：</span>
                    <a href={activeTask.auditLog.noteUrl} target="_blank" rel="noreferrer" className="text-indigo-700 underline flex items-center gap-1 font-mono">
                      {activeTask.auditLog.noteUrl}
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VERTICAL STATUS FLOW */}
          <div className="bg-surface-1 rounded-xl border border-border-default p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border-default pb-4">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-text-secondary" />
                <h3 className="text-[15px] font-medium text-text-main">
                  发布全流程进度 ({currentFlowNodes.length} 个节点)
                </h3>
              </div>
              <span className="text-[12px] text-text-tertiary font-normal">
                当前停留在第 <span className="text-text-main font-medium">{activeTask.currentStepIndex + 1}</span> 节点：
                <span className="text-text-main font-medium ml-1">{currentFlowNodes[activeTask.currentStepIndex]}</span>
              </span>
            </div>

            {/* Vertical Flow Timeline Container */}
            <div className="pt-2 pb-2 pl-2">
              {currentFlowNodes.map((nodeName, idx) => {
                const isDone = idx < activeTask.currentStepIndex;
                const isCurrent = idx === activeTask.currentStepIndex;
                const isPending = idx > activeTask.currentStepIndex;

                const isFailedVerificationNode = isCurrent && nodeName === '等待人工核实';

                return (
                  <div key={idx} className="relative pl-9 pb-7 last:pb-1">
                    {/* Vertical Connecting Line */}
                    {idx < currentFlowNodes.length - 1 && (
                      <div className={`absolute left-[15px] top-7 bottom-0 w-[2px] transition-colors ${
                        isDone ? 'bg-emerald-500' : 'bg-border-default'
                      }`} />
                    )}

                    {/* Node Circle Icon */}
                    <div className={`absolute left-0 top-0.5 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isDone 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                        : isCurrent 
                          ? isFailedVerificationNode
                            ? 'bg-amber-50 border-amber-500 text-amber-700'
                            : 'bg-btn-main border-btn-main text-white' 
                          : 'bg-surface-1 border-border-default text-text-tertiary'
                    }`}>
                      {isDone ? (
                        <Check size={16} strokeWidth={2} />
                      ) : isCurrent ? (
                        isFailedVerificationNode ? (
                          <AlertCircle size={15} />
                        ) : (
                          <RefreshCw size={13} className="animate-spin" />
                        )
                      ) : (
                        <span className="text-[12px] font-normal">{idx + 1}</span>
                      )}
                    </div>

                    {/* Node Header & Detail */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-[14px] ${
                            isCurrent ? 'font-semibold text-text-main' : isDone ? 'font-medium text-text-main' : 'font-normal text-text-tertiary'
                          }`}>
                            {nodeName}
                          </h4>
                          {isCurrent && (
                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              isFailedVerificationNode 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-hover-bg text-text-main border border-border-default'
                            }`}>
                              {isFailedVerificationNode ? '自动失败·等待人工核实' : '当前节点'}
                            </span>
                          )}
                          {isDone && (
                            <span className="text-[11px] text-emerald-700 font-normal flex items-center gap-0.5">
                              已完成
                            </span>
                          )}
                        </div>

                        {isDone && (
                          <span className="text-[11px] text-text-tertiary font-normal">节点已通过</span>
                        )}
                      </div>

                      {/* Expanded Details Card ONLY for Current Active Node */}
                      {isCurrent && (
                        <div className="bg-surface-2 rounded-xl border border-border-default p-5 space-y-4 mt-2">
                          <div className="text-[14px] font-medium text-text-main flex items-center gap-2">
                            <ShieldAlert size={17} className="text-amber-600 shrink-0" />
                            <span>{activeTask.currentStatusTitle}</span>
                          </div>

                          <p className="text-[13px] text-text-secondary leading-relaxed bg-surface-1 p-3.5 rounded-lg border border-border-default font-normal">
                            {activeTask.currentOccurrence}
                          </p>

                          {/* Confirmed facts */}
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">已确认事实</div>
                            <div className="space-y-1 bg-surface-1 p-3 rounded-lg border border-border-default">
                              {activeTask.confirmedFacts.map((fact, fIdx) => (
                                <div key={fIdx} className="text-[12px] text-text-main flex items-start gap-1.5 font-normal">
                                  <span className="text-text-tertiary shrink-0">•</span>
                                  <span>{fact}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Block reason & Next System action */}
                          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border-default text-[12px]">
                            <div>
                              <span className="text-text-tertiary font-normal block mb-0.5">阻塞原因</span>
                              <span className={`font-medium ${activeTask.blockReason === '无' ? 'text-emerald-700' : 'text-danger'}`}>
                                {activeTask.blockReason}
                              </span>
                            </div>
                            <div>
                              <span className="text-text-tertiary font-normal block mb-0.5">下一步状态处理</span>
                              <span className="font-medium text-text-main flex items-center gap-1">
                                <Clock size={12} className="text-text-tertiary" />
                                {activeTask.nextAutoCheckTime}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* DRAWERS & MODALS */}

      {/* 1. Note / Material Drawer */}
      <AnimatePresence>
        {showNoteDrawer && (
          <div className="fixed inset-0 z-[150] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-btn-main/30 backdrop-blur-xs"
              onClick={() => setShowNoteDrawer(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="relative w-[480px] bg-surface-1 h-full shadow-2xl flex flex-col z-10 border-l border-border-default"
            >
              <div className="p-5 border-b border-border-default flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] font-semibold text-text-main">关联笔记与素材详情</h3>
                  <p className="text-[12px] text-text-tertiary font-normal">用于跟进和比对的小红书图文信息</p>
                </div>
                <button 
                  onClick={() => setShowNoteDrawer(false)}
                  className="p-1.5 text-text-tertiary hover:text-text-main rounded-lg hover:bg-hover-bg"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5 text-text-main">
                <div className="space-y-1">
                  <div className="text-[11px] font-medium text-text-tertiary">笔记标题</div>
                  <div className="text-[14.5px] font-medium text-text-main">{activeTask.noteSnapshot.title}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-medium text-text-tertiary">正文文案</div>
                  <div className="p-4 bg-surface-2 border border-border-default rounded-xl text-[13px] leading-relaxed text-text-main whitespace-pre-wrap font-normal">
                    {activeTask.noteSnapshot.body}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] font-medium text-text-tertiary">关联素材图册</div>
                  <div className="grid grid-cols-2 gap-3">
                    {activeTask.noteSnapshot.images.map((img, i) => (
                      <div key={i} className="aspect-square rounded-xl overflow-hidden border border-border-default bg-hover-bg">
                        <img src={img} alt="素材" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-surface-2 border border-border-default rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-text-secondary font-medium">素材审核状态</div>
                    <div className="text-[13px] font-medium text-text-main">{activeTask.noteSnapshot.materialStatus}</div>
                  </div>
                  <span className="px-2.5 py-1 bg-surface-1 border border-border-default text-text-main text-[11px] font-medium rounded">已校验</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Full Operation Logs Drawer */}
      <AnimatePresence>
        {showLogsDrawer && (
          <div className="fixed inset-0 z-[150] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-btn-main/30 backdrop-blur-xs"
              onClick={() => setShowLogsDrawer(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="relative w-[500px] bg-surface-1 h-full shadow-2xl flex flex-col z-10 border-l border-border-default"
            >
              <div className="p-5 border-b border-border-default flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] font-semibold text-text-main">完整自动化与操作日志</h3>
                  <p className="text-[12px] text-text-tertiary font-normal">用于排查与追溯系统重试过程</p>
                </div>
                <button 
                  onClick={() => setShowLogsDrawer(false)}
                  className="p-1.5 text-text-tertiary hover:text-text-main rounded-lg hover:bg-hover-bg"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-[12px]">
                <div className="p-3.5 bg-surface-2 text-text-main rounded-xl space-y-1.5 border border-border-default">
                  <div className="text-emerald-700 font-semibold">[15:30:12] SYSTEM_POLL</div>
                  <div>发起小红书平台 API 接口轮询...</div>
                  <div className="text-text-tertiary">Response: Status 200, Found matched note ID xhs_9921k</div>
                </div>

                <div className="p-3.5 bg-surface-2 text-text-main rounded-xl space-y-1.5 border border-border-default">
                  <div className="text-amber-700 font-semibold">[15:30:15] VISIBILITY_CHECK</div>
                  <div>尝试抓取小红书 Web 页面快照 (第3次)...</div>
                  <div className="text-danger">Error: 404 Page not accessible or require login session</div>
                  <div className="text-text-secondary text-[11px]">Action: 达到最大重试次数 (3)，停止自动轮询，流转至等待人工核实</div>
                </div>

                <div className="p-3.5 bg-surface-2 text-text-main rounded-xl space-y-1 border border-border-default">
                  <div className="text-text-main font-semibold">[14:20:00] MOBILE_ASSISTANT</div>
                  <div>手机端自动同步剪贴板正文与图片相册，提醒用户在小红书 App 中点击“发布”</div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Manual Confirmation Modal with Audit Fields & Scope of Impact */}
      <AnimatePresence>
        {showManualConfirmModal && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-btn-main/40 backdrop-blur-xs"
              onClick={() => setShowManualConfirmModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-surface-1 rounded-xl shadow-2xl p-6 space-y-5 z-10 text-text-main border border-border-default max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-border-default pb-3">
                <div className="flex items-center gap-2">
                  <CheckSquare size={18} className="text-text-secondary" />
                  <h3 className="text-[16px] font-semibold text-text-main">人工确认已发布</h3>
                </div>
                <button 
                  onClick={() => setShowManualConfirmModal(false)}
                  className="p-1 text-text-tertiary hover:text-text-main rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 text-[13px]">
                {/* 1. 确认依据 */}
                <div className="space-y-1.5">
                  <label className="text-[12.5px] font-medium text-text-main block">
                    1. 确认依据 <span className="text-danger">*</span>
                  </label>
                  <select
                    value={manualConfirmBasis}
                    onChange={e => setManualConfirmBasis(e.target.value)}
                    className="w-full p-2.5 bg-surface-2 border border-border-default rounded-lg text-[13px] font-medium outline-none focus:border-neutral-900"
                  >
                    <option value="手机端已展示且公网可访问">手机端已展示且公网可访问</option>
                    <option value="已人工抽检上线小红书列表">已人工抽检上线小红书列表</option>
                    <option value="发布人已提供截图凭证">发布人已提供截图凭证</option>
                    <option value="补充小红书笔记URL">补充小红书笔记URL</option>
                  </select>
                </div>

                {/* 2. 补充URL (条件展示) */}
                {manualConfirmBasis === '补充小红书笔记URL' && (
                  <div className="space-y-1.5">
                    <label className="text-[12.5px] font-medium text-text-main block">
                      小红书笔记真实链接 (URL) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://www.xiaohongshu.com/explore/..."
                      value={manualNoteUrl}
                      onChange={e => setManualNoteUrl(e.target.value)}
                      className="w-full p-2.5 bg-surface-2 border border-border-default rounded-lg text-[13px] outline-none focus:border-neutral-900 font-mono"
                    />
                  </div>
                )}

                {/* 3. 操作说明 */}
                <div className="space-y-1.5">
                  <label className="text-[12.5px] font-medium text-text-main block">
                    2. 操作说明与判定理由
                  </label>
                  <textarea
                    rows={2}
                    placeholder="请输入操作说明（如：已在小红书 App 端搜索确认该笔记已公开展示并可互动）..."
                    value={manualExplanation}
                    onChange={e => setManualExplanation(e.target.value)}
                    className="w-full p-2.5 bg-surface-2 border border-border-default rounded-lg text-[12.5px] outline-none focus:border-neutral-900"
                  />
                </div>

                {/* 4. 可选截图凭证 */}
                <div className="space-y-1.5">
                  <label className="text-[12.5px] font-medium text-text-main block">
                    3. 截图凭据（可选）
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setManualScreenshotAttached(!manualScreenshotAttached)}
                      className={`px-3 py-2 rounded-lg border text-[12px] font-medium flex items-center gap-1.5 transition-colors ${
                        manualScreenshotAttached
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-surface-2 hover:bg-hover-bg text-text-secondary border-border-default'
                      }`}
                    >
                      <Upload size={13} />
                      <span>{manualScreenshotAttached ? '已上传小红书发布截图凭证.png' : '上传/附带抽检截图凭证'}</span>
                    </button>
                    {manualScreenshotAttached && (
                      <button
                        type="button"
                        onClick={() => setManualScreenshotAttached(false)}
                        className="text-[12px] text-danger hover:underline"
                      >
                        移除
                      </button>
                    )}
                  </div>
                </div>

                {/* 5. 影响范围说明 */}
                <div className="p-3.5 bg-surface-2 rounded-lg border border-border-default space-y-1.5">
                  <div className="text-[11.5px] font-medium text-text-tertiary">操作影响范围与后续流转：</div>
                  <ul className="text-[12px] text-text-secondary space-y-1 list-disc pl-4 font-normal">
                    <li>将跳过后续自动识别轮询，把该笔记状态直接更新为【数据观察中】；</li>
                    <li>系统自动触发 7 天数据归集与搜索卡位追踪（每 2 小时更新）；</li>
                    <li>计入项目整体发布完成率，并记录本次操作人与判定依据进入审计流；</li>
                    <li>若后续发现链接有误，可在已完成列表中执行【撤销人工确认】或【修正笔记URL】。</li>
                  </ul>
                </div>

                {/* 6. 二次确认复选框 */}
                <div className="pt-2">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={hasDoubleConfirmed}
                      onChange={e => setHasDoubleConfirmed(e.target.checked)}
                      className="mt-0.5 accent-neutral-900"
                    />
                    <span className="text-[12.5px] text-text-main font-medium">
                      我已核对上述发布凭据与公网可见性，确认此判定并记录审计流
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-default">
                <button
                  onClick={() => setShowManualConfirmModal(false)}
                  className="px-4 py-2 rounded-lg text-[13px] font-medium border border-border-default text-text-secondary hover:bg-hover-bg"
                >
                  取消
                </button>
                <button
                  onClick={handleManualConfirmSubmit}
                  disabled={!hasDoubleConfirmed}
                  className="px-5 py-2 rounded-lg text-[13px] font-medium bg-btn-main hover:bg-btn-main-hover text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  确认同步为【已发布】
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Revoke Confirm Modal */}
      <AnimatePresence>
        {showRevokeModal && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-btn-main/40 backdrop-blur-xs"
              onClick={() => setShowRevokeModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-surface-1 rounded-xl shadow-2xl p-6 space-y-4 z-10 text-text-main border border-border-default"
            >
              <div className="flex items-center gap-2 text-danger">
                <RotateCcw size={20} />
                <h3 className="text-[16px] font-semibold text-text-main">撤销人工确认</h3>
              </div>

              <p className="text-[13px] text-text-secondary leading-relaxed font-normal">
                确认撤销对“<span className="text-text-main font-medium">{activeTask.noteTitle}</span>”的人工发布确认吗？
                撤销后该任务将恢复至【待我处理】队列，停止数据观察并等待重新核实。
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-default">
                <button
                  onClick={() => setShowRevokeModal(false)}
                  className="px-4 py-2 rounded-lg text-[13px] font-medium border border-border-default text-text-secondary hover:bg-hover-bg"
                >
                  取消
                </button>
                <button
                  onClick={handleRevokeConfirm}
                  className="px-4 py-2 rounded-lg text-[13px] font-medium bg-danger hover:bg-red-700 text-white transition-colors"
                >
                  确认撤销
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Diagnosis & Secondary Actions Drawer */}
      <AnimatePresence>
        {showDiagnosisDrawer && (
          <div className="fixed inset-0 z-[150] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-btn-main/30 backdrop-blur-xs"
              onClick={() => setShowDiagnosisDrawer(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="relative w-[360px] bg-surface-1 h-full shadow-2xl flex flex-col z-10 border-l border-border-default"
            >
              <div className="p-5 border-b border-border-default flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-text-secondary" />
                  <h3 className="text-[15px] font-semibold text-text-main">决策与诊断分析</h3>
                </div>
                <button 
                  onClick={() => setShowDiagnosisDrawer(false)}
                  className="p-1.5 text-text-tertiary hover:text-text-main rounded-lg hover:bg-hover-bg"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Block 1: Current Judgement */}
                <div className="bg-surface-2 rounded-xl p-4 border border-border-default space-y-1.5">
                  <div className="text-[11px] font-medium text-text-tertiary uppercase">1. 当前判断</div>
                  <div className="text-[13px] text-text-main font-medium leading-relaxed">
                    {activeTask.diagnosisJudgement}
                  </div>
                </div>

                {/* Block 2: Evidence List */}
                <div className="bg-surface-2 rounded-xl p-4 border border-border-default space-y-2">
                  <div className="text-[11px] font-medium text-text-tertiary uppercase">2. 判断依据</div>
                  <div className="space-y-1.5">
                    {activeTask.diagnosisEvidence.map((ev, i) => (
                      <div key={i} className="text-[12.5px] text-text-secondary flex items-start gap-2 font-normal">
                        <span className="text-text-tertiary">•</span>
                        <span>{ev}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Block 3: System Next Step */}
                <div className="bg-surface-2 rounded-xl p-4 border border-border-default space-y-1.5">
                  <div className="text-[11px] font-medium text-text-tertiary uppercase">3. 系统下一步及预计时间</div>
                  <div className="text-[13px] text-text-main font-normal leading-relaxed">
                    {activeTask.diagnosisNextStep}
                  </div>
                </div>

                {/* Block 4: Executable Actions */}
                <div className="bg-surface-2 rounded-xl p-4 border border-border-default space-y-2.5">
                  <div className="text-[11px] font-medium text-text-tertiary uppercase">4. 可执行快捷操作</div>
                  <div className="space-y-2">
                    {activeTask.secondaryActions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (act === '人工确认已发布') {
                            setShowManualConfirmModal(true);
                          } else if (act === '撤销人工确认') {
                            setShowRevokeModal(true);
                          } else {
                            triggerToast(`已执行操作：${act}`);
                          }
                        }}
                        className="w-full text-left px-3.5 py-2.5 rounded-lg bg-surface-1 border border-border-default hover:border-neutral-400 text-[12.5px] font-medium text-text-main transition-colors flex items-center justify-between"
                      >
                        <span>{act}</span>
                        <ChevronRight size={14} className="text-text-tertiary" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Drawer Trigger for Full Operation Logs */}
              <div className="p-4 border-t border-border-default bg-surface-2">
                <button
                  onClick={() => { setShowDiagnosisDrawer(false); setShowLogsDrawer(true); }}
                  className="w-full py-2.5 bg-surface-1 border border-border-default hover:border-neutral-400 rounded-lg text-[12.5px] font-medium text-text-secondary transition-colors flex items-center justify-center gap-1.5"
                >
                  <FileText size={15} className="text-text-tertiary" />
                  <span>查看完整自动化与操作日志</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

