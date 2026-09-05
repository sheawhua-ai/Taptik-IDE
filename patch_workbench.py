import re

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "r") as f:
    code = f.read()

# 1. Update filteredQueue logic to hide "pending claim" and filter exactly what we need
new_filteredQueue = """  const filteredQueue = queue.filter(item => {
    // 隐藏未领取的任务（例如待领取且没有 assignee 的情况）
    if (item.publishStage === '待领取' || !item.assignee?.name) {
      return false;
    }
    const query = queueQuery.trim().toLowerCase();
    return !query || [item.noteTitle, item.targetAccount, item.projectName]
      .filter(Boolean)
      .some(value => value!.toLowerCase().includes(query));
  }).sort((a, b) => {"""
code = re.sub(r'  const filteredQueue = queue\.filter\(item => \{\n    const query = queueQuery\.trim\(\)\.toLowerCase\(\);\n    return !query[\s\S]*?\}\)\.sort\(\(a\, b\) => \{', new_filteredQueue, code)


# 2. Sidebar task item logic: Update to display Account Type instead of Task Format
new_sidebar_item = """                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[12px] text-text-tertiary">
                      <span className={`shrink-0 rounded px-1.5 py-0.5 font-medium ${item.accountType === '品牌主号' ? 'bg-blue-50 text-blue-700' : item.accountType === 'KOC' ? 'bg-amber-50 text-amber-700' : 'bg-purple-50 text-purple-700'}`}>
                        {item.accountType || '未知账号'}
                      </span>
                      <span className="truncate">
                        领取人：{item.assignee?.name || '未知'}
                      </span>
                    </div>"""
code = re.sub(r'                  <div className="mt-2 space-y-1\.5">\n                    <div className="flex items-center gap-1\.5 text-\[12px\] text-text-tertiary">\n                      <span className="shrink-0 rounded bg-surface-subtle px-1\.5 py-0\.5 font-medium">\{item\.taskFormat \|\| \'未定形态\'\}</span>\n                      <span className="truncate">\n                        \{item\.taskFormat === \'自有指定\' \? `指派给：\$\{item\.assignee\?\.name \|\| \'未知员工\'\}` : \(item\.assignee\?\.name \? `领取人：\$\{item\.assignee\.name\}` : \'待领取（未占坑）\'\)\}\n                      </span>\n                    </div>', new_sidebar_item, code)

# 3. getAnomalyOptions logic
new_getAnomalyOptions = """function getAnomalyOptions(task: ExecutionTask) {
  return [
    '发送微信/企微催办通知',
    '中止本轮发布，释放回笔记池'
  ];
}"""
code = re.sub(r'function getAnomalyOptions\(task: ExecutionTask\) \{[\s\S]*?\}\n\n', new_getAnomalyOptions + '\n\n', code)

# 4. resolveAnomaly logic
new_resolveAnomaly = """  const resolveAnomaly = () => {
    const stopped = resolution.includes('中止');
    const actionMessage = resolution;
    
    onUpdateTask({
      ...task,
      actionType: undefined,
      operatorCategory: stopped ? task.operatorCategory : 'publish',
      categoryLabel: stopped ? task.categoryLabel : '发布与回传',
      status: stopped ? '已取消' : '执行中',
      isAnomaly: false,
      anomalyReason: `${actionMessage}${resolutionNote ? `：${resolutionNote}` : ''}`,
      isBlocked: false,
      isMeWaiting: false,
      isTeamExecuting: !stopped,
      isSystemProcessing: false,
      waitingRole: stopped ? 'completed' : 'team',
      waitingParty: stopped ? '本轮已停止' : task.targetAccount,
      publishStage: stopped ? task.publishStage : '待发布',
      currentOccurrence: stopped
        ? '已中止该发布任务，该笔记重新释放回待领取笔记池。'
        : `${actionMessage}，已通过微信/企微下发提醒，等待账号所有者操作。`,
      timelineEvents: [
        ...task.timelineEvents,
        { id: `resolved-${Date.now()}`, time: '刚刚', actor: '操盘手', action: actionMessage }
      ]
    });
    showFeedback(stopped ? '已中止发布并释放笔记名额' : `已发送催办提醒`);
  };"""
code = re.sub(r'  const resolveAnomaly = \(\) => \{[\s\S]*?showFeedback.*?\}\);\n  \};', new_resolveAnomaly, code)


# 5. renderAnomaly logic
new_renderAnomaly = """  const renderAnomaly = () => {
    let contextStr = '';
    if (task.quota) {
      contextStr = `当前占用任务包名额：${task.quota.claimed}/${task.quota.total}。`;
    }
    
    const finalOptions = getAnomalyOptions(task);
    const buttonLabel = resolution.includes('中止') ? '确认中止并释放' : '确认发送通知';

    return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-[13px] text-rose-800">
        <AlertTriangle size={15} className="mt-0.5 shrink-0" />
        <div className="space-y-1">
           <div className="font-medium">{task.anomalyReason || task.currentOccurrence}</div>
           {contextStr && <div className="text-rose-700/80">{contextStr}</div>}
        </div>
      </div>
      <div className="space-y-2">
        {finalOptions.map(option => (
          <button key={option} onClick={() => setResolution(option)} className={`w-full rounded-xl border p-3 text-left text-[13px] ${resolution === option ? 'border-neutral-900 bg-surface-subtle' : 'border-border-default bg-surface-1'}`}>
            <span className={`mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full border ${resolution === option ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-border-strong'}`}>{resolution === option && <Check size={10} />}</span>
            {option}
          </button>
        ))}
      </div>
      
      <textarea value={resolutionNote} onChange={event => setResolutionNote(event.target.value)} rows={4} placeholder="补充处理说明（选填）" className="w-full rounded-xl border border-border-default bg-surface-1 px-3.5 py-3 text-[13px] outline-none" />
      <PrimaryAction
        label={buttonLabel}
        hint={resolution.includes('中止') ? "中止后，该用户已领取的任务将被回收，释放后供其他人再次领取。" : "系统将通过已绑定的微信或企微向账号所有者下发催办指令。"}
        onClick={resolveAnomaly}
      />
    </div>
  );
  };"""
code = re.sub(r'  const renderAnomaly = \(\) => \{[\s\S]*?  const renderProgress = \(\)', new_renderAnomaly + '\n\n  const renderProgress = ()', code)

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "w") as f:
    f.write(code)

print("Updated workbench logic for publishing exception")
