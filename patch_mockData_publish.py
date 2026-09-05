import re

with open("src/components/merchant/ExecutionCenter/mockData.ts", "r") as f:
    code = f.read()

new_mock = """export const MOCK_EXECUTION_TASKS: ExecutionTask[] = [
  {
    id: 't-anom-1',
    title: '换季上新KOC矩阵-异常发布',
    operatorCategory: 'anomaly',
    categoryLabel: '异常处理',
    status: '执行中',
    isAnomaly: true,
    anomalyType: 'publish_overdue',
    anomalyReason: 'KOC 领取笔记后，超过 48 小时未发布',
    taskFormat: '笔记包',
    assignee: { name: '体验官-元气小草莓', claimTime: '2天前 (09-02)' },
    stalledDurationText: '领取后 2 天未发',
    quota: { claimed: 45, total: 50 },
    projectId: 'p3',
    projectName: '秋季新品防风冲锋衣KOC种草',
    noteId: 'n3-anom',
    noteTitle: '秋日山系穿搭，这件冲锋衣绝绝子',
    targetAccount: '元气小草莓',
    accountType: 'KOC',
    operatorActionSummary: '领取后未发布',
    reasonForIntervention: '已领取笔记内容但迟迟未在小红书发布，可能跑单占用名额。',
    isMeWaiting: true,
    waitingRole: 'operator',
    waitingParty: '操盘手决策',
    isTeamExecuting: false,
    isSystemProcessing: false,
    publishStage: '待发布',
    createdAt: '2026-09-01',
    primaryActionLabel: '处理异常',
    currentOccurrence: '系统检测到领取后迟迟未发布。',
    confirmedFacts: ['该体验官在 9月2日 扫码领取笔记', '未检测到发布回传数据'],
    nextStepAfterAction: '发送微信催办或直接中止释放额度',
    timelineEvents: [
      { id: 'ev1', time: '09-02 10:00', actor: '系统', action: '分配名额给 体验官-元气小草莓' },
      { id: 'ev2', time: '09-04 10:00', actor: '系统监控', action: '触发 [超时未发布] 异常规则' }
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
    assignee: { name: '运营-张三', assignedTime: '2天前 (09-02)' },
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
    publishStage: '待发布',
    createdAt: '2026-09-01',
    primaryActionLabel: '处理异常',
    currentOccurrence: '发布动作由人工执行，需跟进具体情况。',
    confirmedFacts: ['已分配给 运营-张三', '原定发布时间：9月3日 18:00', '至今系统未拉取到发布成功数据'],
    nextStepAfterAction: '发送企微提醒或取消发布',
    timelineEvents: [
      { id: 'ev3', time: '09-02 09:30', actor: '运营-张三', action: '打开了任务并获取了内容' },
      { id: 'ev4', time: '09-03 18:30', actor: '系统监控', action: '触发 [超时未发布] 异常规则' }
    ]
  },
  {
    id: 't-anom-3',
    title: '幼犬换粮搜索卡位-店长任务异常',
    operatorCategory: 'anomaly',
    categoryLabel: '异常处理',
    status: '执行中',
    isAnomaly: true,
    anomalyType: 'publish_overdue',
    anomalyReason: '店长领取任务后未在规定时间内发布',
    taskFormat: '任务包',
    assignee: { name: '静安店李店长', claimTime: '08-28' },
    stalledDurationText: '领取后 3 天未发',
    quota: { claimed: 12, total: 20 },
    projectId: 'p1',
    projectName: '幼犬换粮门店KOS引流',
    noteId: 'n1-anom',
    noteTitle: '静安区养宠人的福音，这家门店绝了',
    targetAccount: '静安店李店长',
    accountType: '店长号/KOS',
    operatorActionSummary: '超时未发布',
    reasonForIntervention: '店长已领取内容包，但小红书账号无动作。',
    isMeWaiting: true,
    waitingRole: 'operator',
    waitingParty: '操盘手决策',
    isTeamExecuting: false,
    isSystemProcessing: false,
    publishStage: '待发布',
    createdAt: '2026-08-28',
    primaryActionLabel: '处理异常',
    currentOccurrence: '需决定是继续通过企微催促还是收回该店任务指标。',
    confirmedFacts: ['李店长已于 8月28日 确认领取', '尚未检测到门店账号更新'],
    nextStepAfterAction: '企微提醒或中止并释放',
    timelineEvents: [
      { id: 'ev5', time: '08-28 14:00', actor: '静安店李店长', action: '确认领取了KOS发布任务' },
      { id: 'ev6', time: '09-01 10:00', actor: '系统监控', action: '触发 [超时未发布] 异常规则' }
    ]
  }
];"""
code = re.sub(r'export const MOCK_EXECUTION_TASKS: ExecutionTask\[\] = \[[\s\S]*?\];', new_mock, code)

with open("src/components/merchant/ExecutionCenter/mockData.ts", "w") as f:
    f.write(code)

print("Updated mockData.ts with specific publish anomaly cases")
