import React, { useState } from 'react';
import { 
  X, Clock, ChevronRight, User, CheckCircle2,
  Check, Send, ChevronDown, Info, Smartphone, FileText, AlertCircle,
  Eye, RefreshCw, Layers, ArrowLeft, ExternalLink, ShieldAlert, Sparkles, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PublishExceptionWorkbenchProps {
  taskId?: string;
  onBack?: () => void;
  onClose?: () => void;
  initialSelectedId?: string;
  fromSource?: 'project' | 'execution';
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
  
  // Right Diagnosis Panel
  diagnosisJudgement: string;
  diagnosisEvidence: string[];
  diagnosisNextStep: string;
  
  // Actions
  primaryActionLabel: string | null;
  secondaryActions: string[];
  
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
      statusBadge: '页面打开失败',
      
      currentStatusTitle: '识别到笔记但无法打开发布页面',
      currentOccurrence: '系统已通过平台接口成功捕获发布关联链接，但在后续自动复验阶段连续 3 次打开笔记页面均返回异常（404/页面不可见）。',
      confirmedFacts: [
        '14:20 手机端已执行下发并完成小红书内容提交',
        '已提取到小红书笔记 ID: xhs_9921k',
        '页面公开浏览访问校验：当前连续失败 3 次'
      ],
      blockReason: '笔记链接可被识别，但公网无法访问，怀疑处于平台内部审核状态或被作者设为私密。',
      systemNextAction: '暂停自动轮询检查，等待人工核实真实上线状态。',
      nextAutoCheckTime: '无（等待人工判定）',
      manualJudgement: '需人工确认笔记在客户端是否真实公开发布，或要求发布人解密/重发。',
      
      currentStepIndex: 3, // "等待自动识别"

      diagnosisJudgement: '系统已成功识别到小红书笔记编号，但无法抓取页面快照，判定为平台审核拦截或可见性设置异常。',
      diagnosisEvidence: [
        '小红书笔记 ID：xhs_9921k',
        '下发时间：14:20，首次识别时间：14:30',
        '自动检查重试次数：3 次均失败',
        '当前公网可达性：否'
      ],
      diagnosisNextStep: '维持现有识别进度，不重复下发，等待运营人员人工确认或联系发布人。',
      
      primaryActionLabel: '联系发布人核实',
      secondaryActions: ['重新触发系统识别', '人工确认已发布', '标记为发布失败'],
      
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

      diagnosisJudgement: '消费者领取流程与素材准备已全部通过，处于最后的自主发文临门一脚。',
      diagnosisEvidence: [
        '领券打卡问卷：已完成 (15:10)',
        'AI 图像合规校验：100% 通过',
        '停留时长：45 分钟 (预警阈值 30 分钟)'
      ],
      diagnosisNextStep: '若 16:15 仍未识别到发布，系统将自动标记该体验包为“超时未发文”。',
      
      primaryActionLabel: '发送发文提醒消息',
      secondaryActions: ['人工确认已发布', '结束领取并作废'],
      
      noteSnapshot: {
        title: '金毛肠胃护理分享体验',
        body: '之前我家狗子一直挑食换粮难，试了这个益生菌试用包，适口性超级棒...',
        images: ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop&q=80'],
        materialStatus: 'AI自动校验通过'
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
      statusBadge: '识别进行中',
      
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
      
      currentStepIndex: 3, // "等待自动识别"

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
  const [manualNoteUrl, setManualNoteUrl] = useState('');
  const [manualConfirmReason, setManualConfirmReason] = useState('手机端已展示且公网可访问');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeTask = tasks.find(t => t.id === activeTaskId) || tasks[0];
  const filteredTasks = tasks.filter(t => t.category === activeCategoryTab);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Flow Node Definitions
  const OWN_ACCOUNT_NODES = [
    '内容已准备',
    '已下发手机任务',
    '发布人操作中',
    '等待自动识别',
    '已识别发布',
    '观察中',
    '完成'
  ];

  const CONSUMER_COLLAB_NODES = [
    '待领取',
    '已领取',
    '待填写问卷',
    '待生成内容',
    '待拍摄/上传',
    'AI检查',
    '待发布',
    '等待自动识别',
    '待结算',
    '完成'
  ];

  const currentFlowNodes = activeTask.publishType === '自有账号发布' ? OWN_ACCOUNT_NODES : CONSUMER_COLLAB_NODES;

  const handleManualConfirmSubmit = () => {
    if (!manualNoteUrl && manualConfirmReason === '补充笔记URL') {
      triggerToast('请输入合规的小红书笔记链接');
      return;
    }
    // Update task status
    setTasks(prev => prev.map(t => {
      if (t.id === activeTask.id) {
        return {
          ...t,
          category: '已完成',
          statusBadge: '人工确认发布',
          currentStatusTitle: '已人工确认发布并进入数据观察',
          blockReason: '无',
          systemNextAction: '开启 7 天观察周期',
          currentStepIndex: currentFlowNodes.length - 2, // 观察中
          confirmedFacts: [
            ...t.confirmedFacts,
            `运营人工确认发布，依据：${manualConfirmReason} (${new Date().toLocaleTimeString()})`
          ]
        };
      }
      return t;
    }));
    setShowManualConfirmModal(false);
    triggerToast('已成功人工确认发布，笔记状态同步更新为【观察中】');
  };

  const handleExecutePrimaryAction = () => {
    if (activeTask.primaryActionLabel === '联系发布人核实' || activeTask.primaryActionLabel === '发送发文提醒消息') {
      triggerToast(`已成功向 ${activeTask.publisherName} 发送加急催发提醒`);
    } else {
      triggerToast('操作指令已下发，系统将更新任务状态');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#f8f9fa] flex flex-col text-neutral-900 overflow-hidden">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-[200] bg-neutral-900 text-white text-[13px] font-bold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2"
          >
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. TOP HEADER (Matching Content Review Workbench style + Top Right X) */}
      <div className="bg-white border-b border-neutral-200 px-6 py-3.5 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neutral-100 text-neutral-600 border border-neutral-200">
            <FileText size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[16px] font-extrabold text-neutral-900">发布任务处理</h1>
              <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                activeTask.publishType === '自有账号发布' ? 'bg-neutral-100 text-neutral-700 border border-neutral-200' : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
              }`}>
                {activeTask.publishType}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                {activeTask.statusBadge}
              </span>
            </div>
            
            <div className="text-[12px] text-neutral-500 flex items-center gap-3 mt-0.5">
              <span className="font-medium text-neutral-700">笔记：{activeTask.noteTitle}</span>
              <span>·</span>
              <span>账号：{activeTask.targetAccount}</span>
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
            className="px-3.5 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-[12.5px] font-bold transition-all shadow-2xs flex items-center gap-1.5"
          >
            <Eye size={14} className="text-neutral-500" />
            <span>查看笔记/素材</span>
          </button>
          
          <div className="h-4 w-[1px] bg-neutral-200" />

          {/* Top Right Close X Button */}
          <button 
            onClick={handleReturn}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            title="关闭页面"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* MAIN BODY: 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT COLUMN: Queue List (Selected State Re-styled, Light Accent, No Black Box) */}
        <div className="w-[300px] bg-white border-r border-neutral-200 flex flex-col shrink-0">
          {/* Category Tabs */}
          <div className="p-3 border-b border-neutral-200 flex items-center justify-between gap-1 bg-neutral-50/50">
            {(['待我处理', '系统跟进中', '已完成'] as const).map(cat => {
              const count = tasks.filter(t => t.category === cat).length;
              const isActive = activeCategoryTab === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryTab(cat)}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-[12px] font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${
                    isActive 
                      ? 'bg-neutral-900 text-white shadow-2xs' 
                      : 'text-neutral-600 hover:bg-neutral-200/60'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.1 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-600'}`}>
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
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                      isSelected 
                        ? 'bg-neutral-50/80 border-neutral-300 border-l-4 border-l-neutral-900 shadow-2xs' 
                        : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/80 text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        item.publishType === '自有账号发布' ? 'bg-neutral-100 text-neutral-700 border border-neutral-200' : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                      }`}>
                        {item.publishType}
                      </span>
                      <span className="text-neutral-500 font-medium">
                        停留 {item.stayTime}
                      </span>
                    </div>

                    <div className="text-[13px] font-bold line-clamp-1 mb-1 text-neutral-900">
                      {item.noteTitle}
                    </div>

                    <div className="text-[11.5px] truncate mb-2 text-neutral-500">
                      账号：{item.targetAccount}
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-dashed border-neutral-200">
                      <span className="text-neutral-600">
                        {item.publisherName}
                      </span>
                      <span className="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                        {item.statusBadge}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-neutral-400 text-[13px]">
                暂无{activeCategoryTab}任务
              </div>
            )}
          </div>
        </div>

        {/* CENTER COLUMN: Top Action Summary + Top-to-Bottom Vertical Status Flow */}
        <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-6">
          
          {/* Top Quick Decision & Action Banner */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                <ShieldAlert size={20} />
              </div>
              <div>
                <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">处理判定建议</div>
                <div className="text-[13.5px] font-bold text-neutral-900 mt-0.5">{activeTask.manualJudgement}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {activeTask.primaryActionLabel ? (
                <button
                  onClick={handleExecutePrimaryAction}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[12.5px] font-bold transition-all shadow-2xs flex items-center gap-1.5"
                >
                  <span>{activeTask.primaryActionLabel}</span>
                  <ChevronRight size={14} />
                </button>
              ) : (
                <div className="px-3.5 py-1.5 bg-neutral-100 text-neutral-500 rounded-xl text-[12px] font-bold flex items-center gap-1.5">
                  <RefreshCw size={13} className="animate-spin text-neutral-600" />
                  <span>系统自动跟进中</span>
                </div>
              )}

              <button
                onClick={() => setShowManualConfirmModal(true)}
                className="px-4 py-2 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-300 rounded-xl text-[12.5px] font-bold transition-all shadow-2xs"
              >
                人工确认已发布
              </button>
              <button
                onClick={() => setShowDiagnosisDrawer(true)}
                className="px-4 py-2 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-300 rounded-xl text-[12.5px] font-bold transition-all shadow-2xs flex items-center gap-1.5"
              >
                <Sparkles size={14} className="text-amber-500" />
                <span>诊断与操作</span>
              </button>
            </div>
          </div>

          {/* VERTICAL STATUS FLOW (自上而下的流程，简洁明了) */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-neutral-700" />
                <h3 className="text-[15px] font-bold text-neutral-900">
                  发布全流程进度 ({currentFlowNodes.length} 个节点)
                </h3>
              </div>
              <span className="text-[12px] text-neutral-500 font-medium">
                当前停留在第 <span className="text-neutral-900 font-bold">{activeTask.currentStepIndex + 1}</span> 节点：
                <span className="text-neutral-900 font-bold ml-1">{currentFlowNodes[activeTask.currentStepIndex]}</span>
              </span>
            </div>

            {/* Vertical Flow Timeline Container */}
            <div className="pt-2 pb-2 pl-2">
              {currentFlowNodes.map((nodeName, idx) => {
                const isDone = idx < activeTask.currentStepIndex;
                const isCurrent = idx === activeTask.currentStepIndex;
                const isPending = idx > activeTask.currentStepIndex;

                return (
                  <div key={idx} className="relative pl-9 pb-7 last:pb-1">
                    {/* Vertical Connecting Line */}
                    {idx < currentFlowNodes.length - 1 && (
                      <div className={`absolute left-[15px] top-7 bottom-0 w-[2px] transition-colors ${
                        isDone ? 'bg-emerald-500' : 'bg-neutral-200'
                      }`} />
                    )}

                    {/* Node Circle Icon */}
                    <div className={`absolute left-0 top-0.5 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      isDone 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-600' 
                        : isCurrent 
                          ? 'bg-neutral-900 border-neutral-900 text-white shadow-md shadow-neutral-900/20 ring-4 ring-neutral-100' 
                          : 'bg-white border-neutral-300 text-neutral-400'
                    }`}>
                      {isDone ? (
                        <Check size={16} strokeWidth={2.5} />
                      ) : isCurrent ? (
                        <RefreshCw size={14} className="animate-spin" />
                      ) : (
                        <span className="text-[12px] font-bold">{idx + 1}</span>
                      )}
                    </div>

                    {/* Node Header & Detail */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-[14px] font-bold ${
                            isCurrent ? 'text-neutral-900' : isDone ? 'text-neutral-800' : 'text-neutral-400'
                          }`}>
                            {nodeName}
                          </h4>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800 text-[11px] font-extrabold">
                              当前节点
                            </span>
                          )}
                          {isDone && (
                            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-0.5">
                              已完成
                            </span>
                          )}
                        </div>

                        {isDone && (
                          <span className="text-[11px] text-neutral-400 font-mono">14:20 节点已通过</span>
                        )}
                      </div>

                      {/* Expanded Details Card ONLY for Current Active Node */}
                      {isCurrent && (
                        <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-4 mt-2">
                          <div className="text-[14.5px] font-extrabold text-neutral-900 flex items-center gap-2">
                            <ShieldAlert size={18} className="text-amber-600 shrink-0" />
                            <span>{activeTask.currentStatusTitle}</span>
                          </div>

                          <p className="text-[13px] text-neutral-700 leading-relaxed bg-white p-3.5 rounded-xl border border-neutral-200/80">
                            {activeTask.currentOccurrence}
                          </p>

                          {/* Confirmed facts */}
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">已确认事实</div>
                            <div className="space-y-1 bg-white p-3 rounded-xl border border-neutral-200/80">
                              {activeTask.confirmedFacts.map((fact, fIdx) => (
                                <div key={fIdx} className="text-[12px] text-neutral-800 flex items-start gap-1.5">
                                  <span className="text-neutral-900 font-bold shrink-0">•</span>
                                  <span>{fact}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Block reason & Next System action */}
                          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-200/60 text-[12px]">
                            <div>
                              <span className="text-neutral-400 font-bold block mb-0.5">阻塞原因</span>
                              <span className={`font-bold ${activeTask.blockReason === '无' ? 'text-emerald-700' : 'text-rose-700'}`}>
                                {activeTask.blockReason}
                              </span>
                            </div>
                            <div>
                              <span className="text-neutral-400 font-bold block mb-0.5">下一步自动检查</span>
                              <span className="font-bold text-neutral-900 flex items-center gap-1">
                                <Clock size={12} />
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
              className="absolute inset-0 bg-neutral-900/30 backdrop-blur-xs"
              onClick={() => setShowNoteDrawer(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="relative w-[480px] bg-white h-full shadow-2xl flex flex-col z-10"
            >
              <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
                <div>
                  <h3 className="text-[16px] font-extrabold text-neutral-900">关联笔记与素材详情</h3>
                  <p className="text-[12px] text-neutral-500">用于跟进和比对的小红书图文信息</p>
                </div>
                <button 
                  onClick={() => setShowNoteDrawer(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5 text-neutral-900">
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-neutral-400">笔记标题</div>
                  <div className="text-[15px] font-bold text-neutral-900">{activeTask.noteSnapshot.title}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-neutral-400">正文文案</div>
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-[13px] leading-relaxed text-neutral-800 whitespace-pre-wrap">
                    {activeTask.noteSnapshot.body}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-neutral-400">关联素材图册</div>
                  <div className="grid grid-cols-2 gap-3">
                    {activeTask.noteSnapshot.images.map((img, i) => (
                      <div key={i} className="aspect-square rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100">
                        <img src={img} alt="素材" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-neutral-700 font-bold">素材审核状态</div>
                    <div className="text-[13px] font-bold text-neutral-900">{activeTask.noteSnapshot.materialStatus}</div>
                  </div>
                  <span className="px-2.5 py-1 bg-neutral-900 text-white text-[11px] font-bold rounded-lg">已校验</span>
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
              className="absolute inset-0 bg-neutral-900/30 backdrop-blur-xs"
              onClick={() => setShowLogsDrawer(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="relative w-[500px] bg-white h-full shadow-2xl flex flex-col z-10"
            >
              <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
                <div>
                  <h3 className="text-[16px] font-extrabold text-neutral-900">完整自动化与操作日志</h3>
                  <p className="text-[12px] text-neutral-500">用于排查与追溯系统重试过程</p>
                </div>
                <button 
                  onClick={() => setShowLogsDrawer(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-[12px]">
                <div className="p-3 bg-neutral-900 text-neutral-200 rounded-xl space-y-2">
                  <div className="text-emerald-400 font-bold">[15:30:12] SYSTEM_POLL</div>
                  <div>发起小红书平台 API 接口轮询...</div>
                  <div className="text-neutral-400">Response: Status 200, Found matched note ID xhs_9921k</div>
                </div>

                <div className="p-3 bg-neutral-900 text-neutral-200 rounded-xl space-y-2">
                  <div className="text-amber-400 font-bold">[15:30:15] VISIBILITY_CHECK</div>
                  <div>尝试抓取小红书 Web 页面快照...</div>
                  <div className="text-rose-400">Error: Page not found or require login session</div>
                </div>

                <div className="p-3 bg-neutral-100 text-neutral-800 rounded-xl space-y-1 border border-neutral-200">
                  <div className="text-neutral-900 font-bold">[14:20:00] MOBILE_ASSISTANT</div>
                  <div>手机端自动同步剪贴板正文与图片相册，提醒用户在小红书 App 中点击“发布”</div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Manual Confirmation Modal */}
      <AnimatePresence>
        {showManualConfirmModal && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs"
              onClick={() => setShowManualConfirmModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-5 z-10 text-neutral-900"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="text-[16px] font-extrabold text-neutral-900">人工确认已发布</h3>
                <button 
                  onClick={() => setShowManualConfirmModal(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-900 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-[13px] text-neutral-600 leading-relaxed">
                  请选择或补充人工确认该笔记已成功发布的判定依据。确认后系统将跳过自动识别并立即将该笔记切换至【观察中】。
                </p>

                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-neutral-700">判定依据选项</label>
                  <select
                    value={manualConfirmReason}
                    onChange={e => setManualConfirmReason(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-[13px] font-medium outline-none focus:border-neutral-900"
                  >
                    <option value="手机端已展示且公网可访问">手机端已展示且公网可访问</option>
                    <option value="已人工抽检上线小红书列表">已人工抽检上线小红书列表</option>
                    <option value="发布人已截图提交凭证">发布人已截图提交凭证</option>
                    <option value="补充笔记URL">补充笔记URL链接</option>
                  </select>
                </div>

                {manualConfirmReason === '补充笔记URL' && (
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-neutral-700">小红书笔记链接 (URL)</label>
                    <input
                      type="text"
                      placeholder="https://www.xiaohongshu.com/explore/..."
                      value={manualNoteUrl}
                      onChange={e => setManualNoteUrl(e.target.value)}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-[13px] outline-none focus:border-neutral-900"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  onClick={() => setShowManualConfirmModal(false)}
                  className="px-4 py-2 rounded-xl text-[13px] font-bold border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                >
                  取消
                </button>
                <button
                  onClick={handleManualConfirmSubmit}
                  className="px-5 py-2 rounded-xl text-[13px] font-bold bg-neutral-900 hover:bg-neutral-800 text-white transition-all shadow-2xs"
                >
                  确认同步为【已发布】
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* 4. Diagnosis & Secondary Actions Drawer */}
      <AnimatePresence>
        {showDiagnosisDrawer && (
          <div className="fixed inset-0 z-[150] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-900/30 backdrop-blur-xs"
              onClick={() => setShowDiagnosisDrawer(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="relative w-[360px] bg-white h-full shadow-2xl flex flex-col z-10"
            >
              <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-500" />
                  <h3 className="text-[16px] font-extrabold text-neutral-900">决策与诊断分析</h3>
                </div>
                <button 
                  onClick={() => setShowDiagnosisDrawer(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Block 1: Current Judgement */}
                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 space-y-1.5">
                  <div className="text-[11px] font-bold text-neutral-400 uppercase">1. 当前判断</div>
                  <div className="text-[13px] text-neutral-900 font-medium leading-relaxed">
                    {activeTask.diagnosisJudgement}
                  </div>
                </div>

                {/* Block 2: Evidence List */}
                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 space-y-2">
                  <div className="text-[11px] font-bold text-neutral-400 uppercase">2. 判断依据</div>
                  <div className="space-y-1.5">
                    {activeTask.diagnosisEvidence.map((ev, i) => (
                      <div key={i} className="text-[12.5px] text-neutral-700 flex items-start gap-2">
                        <span className="text-neutral-400">•</span>
                        <span>{ev}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Block 3: System Next Step */}
                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 space-y-1.5">
                  <div className="text-[11px] font-bold text-neutral-400 uppercase">3. 系统下一步及预计时间</div>
                  <div className="text-[13px] text-neutral-900 font-medium leading-relaxed">
                    {activeTask.diagnosisNextStep}
                  </div>
                </div>

                {/* Block 4: Executable Actions */}
                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 space-y-2.5">
                  <div className="text-[11px] font-bold text-neutral-400 uppercase">4. 可执行快捷操作</div>
                  <div className="space-y-2">
                    {activeTask.secondaryActions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (act === '人工确认已发布') {
                            setShowManualConfirmModal(true);
                          } else {
                            triggerToast(`已执行操作：${act}`);
                          }
                        }}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl bg-white border border-neutral-200 hover:border-neutral-400 text-[12.5px] font-bold text-neutral-800 transition-all flex items-center justify-between shadow-2xs"
                      >
                        <span>{act}</span>
                        <ChevronRight size={14} className="text-neutral-400" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Drawer Trigger for Full Operation Logs */}
              <div className="p-4 border-t border-neutral-200 bg-neutral-50/30">
                <button
                  onClick={() => { setShowDiagnosisDrawer(false); setShowLogsDrawer(true); }}
                  className="w-full py-2.5 bg-white border border-neutral-200 hover:border-neutral-400 rounded-xl text-[12.5px] font-bold text-neutral-700 transition-all shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <FileText size={15} className="text-neutral-500" />
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
