import re

with open("src/components/merchant/ExecutionCenter/mockData.ts", "r") as f:
    code = f.read()

# I will replace the MOCK_EXECUTION_TASKS completely with focused anomaly tasks
# and empty the healthy ones as requested by the "health tasks shouldn't appear" rule.

new_mock_data = """export const MOCK_EXECUTION_TASKS: ExecutionTask[] = [
  {
    id: 't-anom-1',
    title: '换季上新KOC矩阵-异常跟进',
    operatorCategory: 'anomaly',
    categoryLabel: '异常处理',
    status: '执行中',
    isAnomaly: true,
    anomalyType: 'claim_stalled',
    anomalyReason: 'KOC 扫码领取后超过 3 天未开始任何动作',
    taskFormat: '笔记包',
    assignee: { name: '体验官-元气小草莓', claimTime: '3天前 (09-01)' },
    stalledDurationText: '领取后 3 天无动作',
    quota: { claimed: 45, total: 50 },
    projectId: 'p3',
    projectName: '秋季新品防风冲锋衣KOC种草',
    noteId: 'n3-anom',
    noteTitle: '秋日山系穿搭，这件冲锋衣绝绝子',
    targetAccount: '元气小草莓',
    accountType: 'KOC',
    operatorActionSummary: '领取无动作',
    reasonForIntervention: '该坑位被领取后已停滞 3 天，可能导致预算资源浪费或排期延误。',
    isMeWaiting: true,
    waitingRole: 'operator',
    waitingParty: '操盘手决策',
    isTeamExecuting: false,
    isSystemProcessing: false,
    createdAt: '2026-08-25',
    primaryActionLabel: '处理异常',
    currentOccurrence: '系统检测到领取后长期未活跃，已将其拦截进异常队列。',
    confirmedFacts: ['该体验官在 9月1日 扫码领取', '至今未打开笔记或进行任何操作'],
    nextStepAfterAction: '释放额度或重新通知后，系统将自动调整队列状态',
    timelineEvents: [
      { id: 'ev1', time: '09-01 10:00', actor: '系统', action: '分配名额给 体验官-元气小草莓' },
      { id: 'ev2', time: '09-04 10:00', actor: '系统监控', action: '触发 [领取无动作] 异常规则' }
    ]
  },
  {
    id: 't-anom-2',
    title: '品牌主理人日常-异常跟进',
    operatorCategory: 'anomaly',
    categoryLabel: '异常处理',
    status: '执行中',
    isAnomaly: true,
    anomalyType: 'publish_overdue',
    anomalyReason: '超过约定发布时间仍未发布',
    taskFormat: '自有指定',
    assignee: { name: '静安店李店长', assignedTime: '2天前 (09-02)' },
    stalledDurationText: '已超时 1 天',
    projectId: 'p2',
    projectName: '主理人Vlog连载第二期',
    noteId: 'n2-anom',
    noteTitle: '从设计图纸到第一件成衣，这三个月的真实记录',
    targetAccount: '极宠家·官方账号',
    accountType: '品牌主号',
    operatorActionSummary: '超时未发布',
    reasonForIntervention: '约定的发布时间为昨天，但系统监控到小红书端仍未产生内容。',
    isMeWaiting: true,
    waitingRole: 'operator',
    waitingParty: '操盘手决策',
    isTeamExecuting: false,
    isSystemProcessing: false,
    createdAt: '2026-09-01',
    primaryActionLabel: '处理异常',
    currentOccurrence: '发布动作由人工执行，需跟进具体情况。',
    confirmedFacts: ['李店长已于 9月2日 查看任务', '原定发布时间：9月3日 18:00', '至今系统未拉取到发布成功数据'],
    nextStepAfterAction: '选择改派或催促，任务将更新相应状态',
    timelineEvents: [
      { id: 'ev3', time: '09-02 09:30', actor: '静安店李店长', action: '打开了任务并获取了内容' },
      { id: 'ev4', time: '09-03 18:30', actor: '系统监控', action: '触发 [超时未发布] 异常规则' }
    ]
  },
  {
    id: 't-anom-3',
    title: '幼犬换粮搜索卡位-异常跟进',
    operatorCategory: 'anomaly',
    categoryLabel: '异常处理',
    status: '执行中',
    isAnomaly: true,
    anomalyType: 'task_package_stalled',
    anomalyReason: '问卷已填，但素材拍摄停滞超过 5 天',
    taskFormat: '任务包',
    assignee: { name: '体验官-家有两只喵', claimTime: '08-28' },
    milestones: {
      questionnaire: { status: '已完成', time: '08-29' },
      photo: { status: '待上传' },
      noteFinalized: false
    },
    stalledDurationText: '填表后 5 天未拍照',
    quota: { claimed: 12, total: 20 },
    projectId: 'p1',
    projectName: '幼犬换粮搜索卡位第三轮',
    noteId: 'n1-anom',
    noteTitle: '我家金毛幼犬换粮体验，记录七天便便变化',
    targetAccount: '体验官-家有两只喵',
    accountType: 'KOC',
    operatorActionSummary: '任务包停滞',
    reasonForIntervention: '该协作任务在中途素材环节卡住，无法生成最终 AI 笔记。',
    isMeWaiting: true,
    waitingRole: 'operator',
    waitingParty: '操盘手决策',
    isTeamExecuting: false,
    isSystemProcessing: false,
    createdAt: '2026-08-28',
    primaryActionLabel: '处理异常',
    currentOccurrence: '需决定是继续催促拍摄还是直接终止其参与资格。',
    confirmedFacts: ['体验官已完成产品体验问卷', '素材要求：3组实拍图', '尚未提交任何照片'],
    nextStepAfterAction: '处理后，该节点的状态将重置或释放',
    timelineEvents: [
      { id: 'ev5', time: '08-29 14:00', actor: '体验官-家有两只喵', action: '提交了产品问卷' },
      { id: 'ev6', time: '09-03 10:00', actor: '系统监控', action: '触发 [任务包拍摄停滞] 异常规则' }
    ]
  }
];"""

code = re.sub(r'export const MOCK_EXECUTION_TASKS: ExecutionTask\[\] = \[[\s\S]*?\];', new_mock_data, code)

with open("src/components/merchant/ExecutionCenter/mockData.ts", "w") as f:
    f.write(code)

print("Patched mockData.ts")
