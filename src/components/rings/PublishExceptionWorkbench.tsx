import React, { useState } from 'react';
import { 
  X, Clock, ChevronRight, User, CheckCircle2,
  Check, Send, ChevronDown, Info, Smartphone, FileText, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onClose: () => void;
  initialSelectedId?: string;
}

interface Task {
  id: string;
  group: '需要决策' | '需要联系发布人' | '需要人工确认';
  project: string;
  packageId: string;
  publishType: '员工发布' | '消费者发布';
  publisher: string;
  account: string;
  stayTime: string;
  problemSummary: string;
  
  // Stage 1
  stage1Ready: boolean;
  
  // Stage 2
  stage2State: 'pending' | 'active' | 'warning' | 'error' | 'done';
  mobileProgress: string[];
  activeMobileStep: number;
  mobileLastAction: string;
  lastActionTime: string;
  mobileWaitingFor: string;
  systemExpected: string;
  contentExposed: boolean;
  
  // Stage 3
  stage3State: 'pending' | 'active' | 'warning' | 'error' | 'done';
  stage3Progress: string[];
  activeStage3Step: number;
  stage3Details?: {
    noteId: string;
    retrieveTime: string;
    publisher: string;
    recentResult: string;
  };

  // Right Panel
  currentJudgement: string;
  evidence: string[];
  autoActionNext: string;
  manualCondition: string;
  mainAction: string | null;
  moreActions: string[];
  aiUpdateTime: string;
}

export function PublishExceptionWorkbench({ onClose, initialSelectedId }: Props) {
  const [activeTaskId, setActiveTaskId] = useState(initialSelectedId || 't1');
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);
  const [showMobileProgress, setShowMobileProgress] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);

  const tasks: Task[] = [
    {
      id: 't1',
      group: '需要决策',
      project: '幼犬换粮搜索卡位',
      packageId: '内容包 #45',
      publishType: '员工发布',
      publisher: '张三',
      account: '小红书-A02',
      stayTime: '2小时',
      problemSummary: '已识别到笔记，但系统连续多次无法打开该笔记。',
      
      stage1Ready: true,
      
      stage2State: 'done',
      mobileProgress: ['已收到任务', '已查看内容', '已复制正文', '已保存图片', '已进入小红书'],
      activeMobileStep: 4,
      mobileLastAction: '已进入小红书',
      lastActionTime: '2026-07-15 14:20',
      mobileWaitingFor: '-',
      systemExpected: '-',
      contentExposed: true,
      
      stage3State: 'error',
      stage3Progress: ['等待识别小红书笔记', '确认发布账号', '确认笔记可打开', '绑定内容包', '加入持续观察'],
      activeStage3Step: 2,
      stage3Details: {
        noteId: 'xhs_9921k',
        retrieveTime: '2026-07-15 14:30',
        publisher: '小红书-A02',
        recentResult: '无法打开 (疑似被删除或审核中)'
      },

      currentJudgement: '系统已成功识别到小红书笔记，但连续 3 次尝试打开均失败，可能笔记已被平台删除或正在人工审核中。',
      evidence: [
        '最后一次手机操作：已进入小红书 (14:20)',
        '系统识别次数：4次',
        '是否获得小红书笔记编号：是 (xhs_9921k)',
        '笔记是否可以打开：否'
      ],
      autoActionNext: '系统已暂停对该笔记的检查。',
      manualCondition: '需要人工确认笔记真实状态，如果被删，需要通知发布人。',
      mainAction: '重新核验笔记',
      moreActions: ['通知发布人确认', '确认平台审核中，稍后再查', '确认未发布或已删除，退回发布'],
      aiUpdateTime: '智能判断于 14:35 更新'
    },
    {
      id: 't2',
      group: '需要联系发布人',
      project: '日常种草',
      packageId: '内容包 #82',
      publishType: '消费者发布',
      publisher: '消费者 U8372',
      account: '小红书账号将在发布后识别',
      stayTime: '45分钟',
      problemSummary: '已复制正文并保存图片，但长时间未进入小红书。',
      
      stage1Ready: true,
      
      stage2State: 'warning',
      mobileProgress: ['已领取', '已完成问卷', '已生成内容包', '图片已通过检查', '已进入小红书'],
      activeMobileStep: 3, // Stucked before entering XHS
      mobileLastAction: '图片已通过检查 (已保存)',
      lastActionTime: '2026-07-15 15:45',
      mobileWaitingFor: '进入小红书',
      systemExpected: '系统将在 15 分钟后标记为超时。',
      contentExposed: true,
      
      stage3State: 'pending',
      stage3Progress: ['等待识别小红书笔记', '确认发布账号', '确认笔记可打开', '绑定内容包', '加入持续观察'],
      activeStage3Step: -1,

      currentJudgement: '消费者已获取并保存了图片及正文，但超过 45 分钟未进行下一步“进入小红书”，可能遇到操作困难或遗忘。该内容包已被获取，不能直接再次派发。',
      evidence: [
        '最后一次手机操作：图片已通过检查 (15:45)',
        '已停留在该进度：45分钟',
        '内容是否已暴露：是 (已复制/保存)'
      ],
      autoActionNext: '系统将在倒计时结束后，自动结束本次领取。原内容包将标记为“已放弃”。',
      manualCondition: '若倒计时结束前仍无动作，可联系发布人协助，或提前结束领取。',
      mainAction: '提醒已领取用户',
      moreActions: ['查看手机操作轨迹', '结束领取 (作废原包并补充名额)'],
      aiUpdateTime: '智能判断于 16:30 更新'
    },
    {
      id: 't3',
      group: '需要人工确认',
      project: '双11大促',
      packageId: '内容包 #12',
      publishType: '员工发布',
      publisher: '李四',
      account: '小红书-A05',
      stayTime: '2小时15分钟',
      problemSummary: '发布人已进入小红书超过 2 小时，系统仍未识别到对应笔记。',
      
      stage1Ready: true,
      
      stage2State: 'done',
      mobileProgress: ['已收到任务', '已查看内容', '已复制正文', '已保存图片', '已进入小红书'],
      activeMobileStep: 4,
      mobileLastAction: '已进入小红书',
      lastActionTime: '2026-07-15 14:12',
      mobileWaitingFor: '-',
      systemExpected: '-',
      contentExposed: true,
      
      stage3State: 'warning',
      stage3Progress: ['等待识别小红书笔记', '确认发布账号', '确认笔记可打开', '绑定内容包', '加入持续观察'],
      activeStage3Step: 0,

      currentJudgement: '发布人已经进入小红书超过 2 小时，但系统仍未识别到对应笔记。可能是发布被平台拦截，或是发布人忘记完成发布。',
      evidence: [
        '最后一次手机操作：已进入小红书 (14:12)',
        '系统识别次数：12次',
        '是否获得小红书笔记编号：否'
      ],
      autoActionNext: '系统将在 10 分钟后再次识别发布结果，期间不需要运营处理。',
      manualCondition: '如果超过 2 小时仍未识别到笔记，需要联系发布人确认是否完成发布。',
      mainAction: '联系发布人确认',
      moreActions: ['延长识别时间', '重新发送手机任务入口', '补录小红书笔记链接', '确认未发布', '结束本次任务'],
      aiUpdateTime: '智能判断于 16:27 更新'
    }
  ];

  const activeTask = tasks.find(t => t.id === activeTaskId) || tasks[0];

  const taskGroups = [
    { title: '需要决策', tasks: tasks.filter(t => t.group === '需要决策') },
    { title: '需要联系发布人', tasks: tasks.filter(t => t.group === '需要联系发布人') },
    { title: '需要人工确认', tasks: tasks.filter(t => t.group === '需要人工确认') },
  ];

  const handleAction = (message: string) => {
    setShowSuccessToast(message);
    setTimeout(() => {
      setShowSuccessToast(null);
    }, 3000);
  };

  const getStageStyles = (state: string) => {
    switch (state) {
      case 'active':
        return {
          wrapper: 'bg-white border-2 border-blue-200',
          iconBg: 'bg-blue-100 text-blue-600',
          title: 'text-blue-700',
        };
      case 'warning':
        return {
          wrapper: 'bg-white border-2 border-amber-200',
          iconBg: 'bg-amber-100 text-amber-600',
          title: 'text-amber-700',
        };
      case 'error':
        return {
          wrapper: 'bg-white border-2 border-rose-200',
          iconBg: 'bg-rose-100 text-rose-600',
          title: 'text-rose-700',
        };
      case 'done':
        return {
          wrapper: 'bg-white border border-neutral-200 opacity-60',
          iconBg: 'bg-emerald-100 text-emerald-600',
          title: 'text-neutral-900',
        };
      case 'pending':
      default:
        return {
          wrapper: 'bg-white border border-neutral-200 opacity-50',
          iconBg: 'bg-neutral-100 text-neutral-400',
          title: 'text-neutral-500',
        };
    }
  };

  const renderStage2 = () => {
    const styles = getStageStyles(activeTask.stage2State);
    const isDone = activeTask.stage2State === 'done';

    return (
      <div className={`${styles.wrapper} rounded-xl p-5 shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${styles.iconBg}`}>
              {isDone ? <Check size={14} /> : <span className="font-bold text-[12px]">2</span>}
            </div>
            <div className={`font-bold text-[14px] ${styles.title}`}>
              发布人手机操作
            </div>
          </div>
          <button 
            onClick={() => setShowMobileProgress(true)}
            className="text-[12px] font-bold text-neutral-500 hover:text-neutral-900 transition-colors bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200"
          >
            查看手机操作进度
          </button>
        </div>

        <div className="flex items-center mb-6 pl-9 overflow-x-auto custom-scrollbar pb-2">
          {activeTask.mobileProgress.map((step, i) => (
            <React.Fragment key={i}>
              <div className={`text-[12px] font-bold whitespace-nowrap ${i <= activeTask.activeMobileStep ? 'text-primary-600' : 'text-neutral-400'}`}>
                {step}
              </div>
              {i < activeTask.mobileProgress.length - 1 && (
                <ChevronRight size={14} className={`mx-2 shrink-0 ${i < activeTask.activeMobileStep ? 'text-primary-300' : 'text-neutral-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="pl-9 grid grid-cols-2 gap-4 text-[13px]">
          <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
            <div className="text-neutral-500 mb-1 flex justify-between">最近一次手机操作 <span className="text-[11px] font-medium">{activeTask.lastActionTime}</span></div>
            <div className="font-bold text-neutral-900">{activeTask.mobileLastAction}</div>
          </div>
          {activeTask.stage2State !== 'done' && (
            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
              <div className="text-neutral-500 mb-1">当前等待事项</div>
              <div className="font-bold text-neutral-900">{activeTask.mobileWaitingFor}</div>
            </div>
          )}
          {activeTask.stage2State !== 'done' && activeTask.systemExpected !== '-' && (
            <div className="col-span-2 bg-neutral-50 p-3 rounded-lg border border-neutral-100 flex items-start gap-2">
              <Info size={14} className="text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-neutral-500 mb-0.5 text-[12px]">系统预计下一步</div>
                <div className="font-medium text-neutral-800">{activeTask.systemExpected}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStage3 = () => {
    const styles = getStageStyles(activeTask.stage3State);
    const isPending = activeTask.stage3State === 'pending';
    const isDone = activeTask.stage3State === 'done';

    return (
      <div className={`${styles.wrapper} rounded-xl p-5 shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${styles.iconBg}`}>
              {isDone ? <Check size={14} /> : <span className="font-bold text-[12px]">3</span>}
            </div>
            <div className={`font-bold text-[14px] ${styles.title}`}>发布确认</div>
          </div>
        </div>
        
        {isPending ? (
          <div className="pl-9 text-[12px] text-neutral-500 font-medium">等待上游节点完成</div>
        ) : (
          <>
            <div className="flex items-center mb-6 pl-9 overflow-x-auto custom-scrollbar pb-2">
              {activeTask.stage3Progress.map((step, i) => (
                <React.Fragment key={i}>
                  <div className={`text-[12px] font-bold whitespace-nowrap ${i <= activeTask.activeStage3Step ? 'text-primary-600' : 'text-neutral-400'} ${i === activeTask.activeStage3Step && activeTask.stage3State === 'error' ? 'text-rose-600' : ''} ${i === activeTask.activeStage3Step && activeTask.stage3State === 'warning' ? 'text-amber-600' : ''}`}>
                    {step}
                  </div>
                  {i < activeTask.stage3Progress.length - 1 && (
                    <ChevronRight size={14} className={`mx-2 shrink-0 ${i < activeTask.activeStage3Step ? 'text-primary-300' : 'text-neutral-200'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {activeTask.stage3Details && (
              <div className="pl-9 grid grid-cols-2 gap-4 text-[13px]">
                 <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                    <div className="text-neutral-500 mb-1">小红书笔记编号</div>
                    <div className="font-bold text-neutral-900 font-mono">{activeTask.stage3Details.noteId || '-'}</div>
                 </div>
                 <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                    <div className="text-neutral-500 mb-1">获取时间</div>
                    <div className="font-bold text-neutral-900">{activeTask.stage3Details.retrieveTime || '-'}</div>
                 </div>
                 <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                    <div className="text-neutral-500 mb-1">发布人</div>
                    <div className="font-bold text-neutral-900">{activeTask.stage3Details.publisher || '-'}</div>
                 </div>
                 <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                    <div className="text-neutral-500 mb-1">最近检查结果</div>
                    <div className={`font-bold ${activeTask.stage3Details.recentResult.includes('无法') ? 'text-rose-600' : 'text-neutral-900'}`}>{activeTask.stage3Details.recentResult || '-'}</div>
                 </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-neutral-100 flex flex-col h-screen overflow-hidden">
      <div className="w-full bg-white h-full flex flex-col shadow-2xl animate-in fade-in duration-300">
        
        {/* ================= Header ================= */}
        <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-6">
            <h2 className="text-[18px] font-bold text-neutral-900 flex items-center gap-2">
              <Send className="text-primary-600" size={20} />
              发布调度
            </h2>
            <div className="text-[13px] text-neutral-500 font-medium">
               系统正在跟进发布进度，以下仅展示需要运营联系、核对或决策的事项。
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-4 text-[13px] font-bold text-neutral-700">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span>系统跟进中 12</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span>需要运营处理 3</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>已发布并持续观察 15</div>
            </div>
            <div className="h-6 w-px bg-neutral-200"></div>
            <div className="flex items-center gap-3">
              <button className="text-[13px] font-bold text-neutral-600 hover:text-neutral-900 px-4 py-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors">
                全部发布任务档案
              </button>
              <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* ================= Body ================= */}
        <div className="flex-1 overflow-hidden flex bg-[#fcfcfc]">
          
          {/* Left Column: Task List Groups */}
          <div className="w-[340px] bg-white border-r border-neutral-200 flex flex-col shrink-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
              {taskGroups.map(group => {
                if (group.tasks.length === 0) return null;
                return (
                  <div key={group.title} className="space-y-3">
                     <h3 className="text-[13px] font-bold text-neutral-900 flex items-center gap-2">
                       {group.title} <span className="text-neutral-400 font-normal">({group.tasks.length})</span>
                     </h3>
                     {group.tasks.map(task => (
                       <div 
                         key={task.id}
                         onClick={() => setActiveTaskId(task.id)}
                         className={`p-4 rounded-xl border cursor-pointer transition-all ${
                           activeTaskId === task.id 
                             ? 'bg-neutral-50 border-neutral-300 shadow-sm' 
                             : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'
                         }`}
                       >
                         <div className="flex justify-between items-start mb-2">
                            <div className="text-[13px] font-bold text-neutral-900 line-clamp-1">{task.project} - {task.packageId}</div>
                         </div>
                         <div className="text-[11px] text-neutral-500 mb-2 flex flex-col gap-1">
                           <span className="flex items-center gap-1"><User size={12}/> {task.publisher}</span>
                           <span className="flex items-center gap-1"><Clock size={12}/> 已停留 {task.stayTime}</span>
                         </div>
                         <div className={`text-[12px] p-2 rounded-lg leading-relaxed mt-2 font-medium ${task.group === '需要决策' ? 'text-rose-700 bg-rose-50' : 'text-amber-700 bg-amber-50'}`}>
                           {task.problemSummary}
                         </div>
                       </div>
                     ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Middle Column: Desktop & Mobile Stages */}
          <div className="flex-1 bg-[#fcfcfc] flex flex-col overflow-hidden relative">
            
            {showSuccessToast && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-6 left-1/2 -translate-x-1/2 bg-neutral-900 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-2 z-50 font-medium text-[14px]"
              >
                <CheckCircle2 size={18} className="text-emerald-400" />
                {showSuccessToast}
              </motion.div>
            )}

            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-3xl mx-auto space-y-6">
                
                {/* Three Stages Timeline */}
                <div className="space-y-4">
                   
                   {/* Stage 1: Desktop */}
                   <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm opacity-60">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                           <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                              <Check size={14} />
                           </div>
                           <div className="font-bold text-[14px] text-neutral-900">发布内容已准备</div>
                        </div>
                      </div>
                      <div className="pl-9 text-[13px] text-neutral-600 space-y-3">
                        <div>
                          <span className="text-neutral-400">项目：</span><span className="font-bold text-neutral-900">{activeTask.project}</span>
                          <span className="text-neutral-300 mx-3">|</span> 
                          <span className="text-neutral-400">内容包：</span><span className="font-bold text-neutral-900">{activeTask.packageId}</span>
                        </div>
                        {activeTask.publishType === '员工发布' ? (
                          <div>
                            <span className="text-neutral-400">发布人：</span><span className="font-bold text-neutral-900">{activeTask.publisher}</span>
                            <span className="text-neutral-300 mx-3">|</span> 
                            <span className="text-neutral-400">账号：</span><span className="font-bold text-neutral-900">{activeTask.account}</span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-neutral-400">参与者：</span><span className="font-bold text-neutral-900">{activeTask.publisher}</span>
                            <span className="text-neutral-300 mx-3">|</span> 
                            <span className="text-neutral-500 font-medium">小红书账号将在发布后识别</span>
                          </div>
                        )}
                        <div className="text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg inline-block font-medium border border-emerald-100">
                          内容、图片和发布对象均已准备，手机任务通知已发送。
                        </div>
                      </div>
                   </div>

                   {/* Stage 2: Mobile */}
                   {renderStage2()}

                   {/* Stage 3: Verification */}
                   {renderStage3()}

                </div>
              </div>
            </div>

            {/* Mobile Progress Drawer/Modal */}
            <AnimatePresence>
              {showMobileProgress && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute right-0 top-0 bottom-0 w-[400px] bg-white shadow-2xl border-l border-neutral-200 z-50 flex flex-col"
                >
                   <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
                     <h3 className="font-bold text-[16px] flex items-center gap-2">
                       <Smartphone size={18} className="text-neutral-500" /> 手机操作进度
                     </h3>
                     <button onClick={() => setShowMobileProgress(false)} className="p-1.5 hover:bg-neutral-200 rounded-lg text-neutral-500 transition-colors"><X size={18}/></button>
                   </div>
                   <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[13px]">
                          <span className="text-neutral-500">发布人</span>
                          <span className="font-bold">{activeTask.publisher}</span>
                        </div>
                        <div className="flex justify-between text-[13px]">
                          <span className="text-neutral-500">通知方式</span>
                          <span className="font-bold">企业微信 / 站内信</span>
                        </div>
                        <div className="flex justify-between text-[13px]">
                          <span className="text-neutral-500">领取时间</span>
                          <span className="font-bold">2026-07-15 13:00</span>
                        </div>
                        <div className="flex justify-between text-[13px]">
                          <span className="text-neutral-500">已发送提醒</span>
                          <span className="font-bold">1 次</span>
                        </div>
                      </div>

                      <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                        <div className="text-[13px] font-bold mb-3">内容暴露状态</div>
                        <div className="flex items-center gap-2 text-[13px] text-neutral-700">
                           {activeTask.contentExposed ? (
                             <><AlertCircle size={14} className="text-amber-500"/> 内容已被查看、复制或保存，不可直接重新派发。</>
                           ) : (
                             <><CheckCircle2 size={14} className="text-emerald-500"/> 内容尚未被查看，可随时结束并重新派发。</>
                           )}
                        </div>
                      </div>

                      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-200 before:to-transparent">
                         {activeTask.mobileProgress.map((step, idx) => (
                            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 bg-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${idx <= activeTask.activeMobileStep ? 'border-primary-500 text-primary-500' : 'border-neutral-300 text-neutral-300'}`}>
                                  {idx <= activeTask.activeMobileStep ? <Check size={12}/> : <div className="w-1.5 h-1.5 rounded-full bg-neutral-300"/>}
                                </div>
                                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-3 rounded-lg border border-neutral-100 bg-white shadow-sm">
                                    <div className={`font-bold text-[13px] ${idx <= activeTask.activeMobileStep ? 'text-neutral-900' : 'text-neutral-400'}`}>{step}</div>
                                </div>
                            </div>
                         ))}
                      </div>
                   </div>
                   <div className="p-5 border-t border-neutral-100 bg-white space-y-3">
                     <button onClick={() => { handleAction('已提醒发布人'); setShowMobileProgress(false); }} className="w-full py-2.5 rounded-xl text-[13px] font-bold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-sm">
                       提醒发布人
                     </button>
                     <button className="w-full py-2.5 rounded-xl text-[13px] font-bold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors">
                       重新发送手机任务入口
                     </button>
                     <button className="w-full py-2.5 rounded-xl text-[13px] font-bold text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-colors">
                       结束本次领取
                     </button>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Right Column: Processing Plan */}
          <div className="w-[360px] bg-white border-l border-neutral-200 flex flex-col shrink-0">
            <div className="p-6 border-b border-neutral-100 bg-white flex justify-between items-center">
              <h3 className="font-bold text-[16px] text-neutral-900 flex items-center gap-2">
                智能分析与决策
              </h3>
              <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                <CheckCircle2 size={12}/> {activeTask.aiUpdateTime.replace('智能判断于 ', '')}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
              
              <div>
                <div className="text-[13px] font-bold text-neutral-500 mb-3">当前判断</div>
                <div className={`text-[14px] leading-relaxed font-bold text-neutral-900`}>
                  {activeTask.currentJudgement}
                </div>
              </div>

              <div>
                <div className="text-[13px] font-bold text-neutral-500 mb-3">判断依据</div>
                <ul className="text-[13px] text-neutral-700 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-100 space-y-2 font-medium">
                  {activeTask.evidence.map((line, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-neutral-400 mt-1">•</span> {line}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-[13px] font-bold text-neutral-500 mb-3">系统接下来会做什么</div>
                <div className="text-[13px] text-neutral-700 leading-relaxed font-medium">
                  {activeTask.autoActionNext}
                </div>
              </div>

              <div>
                <div className="text-[13px] font-bold text-neutral-500 mb-3">什么时候需要运营介入</div>
                <div className="text-[13px] leading-relaxed bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-900 font-bold">
                  {activeTask.manualCondition}
                </div>
              </div>

            </div>

            {/* 3. 执行操作 */}
            <div className="p-6 border-t border-neutral-200 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.02)] relative">
               
               {activeTask.mainAction ? (
                 <button onClick={() => handleAction(`已执行操作：${activeTask.mainAction}`)} className="w-full py-3.5 rounded-xl text-[14px] font-bold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-sm mb-3">
                   {activeTask.mainAction}
                 </button>
               ) : (
                 <div className="w-full py-3.5 rounded-xl text-[14px] font-bold text-neutral-500 bg-neutral-50 border border-neutral-100 text-center mb-3">
                   暂不需要运营处理
                 </div>
               )}

               <div className="relative">
                  <button 
                    onClick={() => setShowMoreActions(!showMoreActions)}
                    className="w-full py-3 rounded-xl text-[13px] font-bold text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2 border border-neutral-200"
                  >
                    更多操作 <ChevronDown size={14} className={showMoreActions ? 'rotate-180' : ''} />
                  </button>
                  
                  <AnimatePresence>
                    {showMoreActions && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-neutral-200 rounded-xl shadow-lg p-2 z-10"
                      >
                         {activeTask.moreActions.map((action, index) => (
                           <button 
                             key={index}
                             onClick={() => {
                               handleAction(`已执行: ${action}`);
                               setShowMoreActions(false);
                             }}
                             className="w-full text-left px-3 py-2.5 text-[13px] font-bold text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
                           >
                             {action}
                           </button>
                         ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

