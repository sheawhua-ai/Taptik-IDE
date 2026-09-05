import re

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "r") as f:
    code = f.read()

# 1. Update getAnomalyOptions
new_get_anomaly_options = """function getAnomalyOptions(task: ExecutionTask) {
  if (task.anomalyType === 'claim_stalled') {
    return ['催办提醒', '释放额度并重新开放领取', '更换领取人'];
  }
  if (task.anomalyType === 'task_package_stalled') {
    return ['催拍照/催完成', '释放额度并重新开放领取', '更换领取人'];
  }
  if (task.anomalyType === 'publish_overdue') {
    return ['再次提醒', '更换发布人或账号', '调整发布时间', '本轮不再继续'];
  }
  if (task.anomalyType === 'executor_account_unavailable') {
    return ['更换发布人或账号', '等待账号恢复并调整排期', '重新发送登录与发布指引'];
  }
  if (task.anomalyType === 'data_sync_auth_expired') {
    return ['重新扫码授权', '仅保留本地记录'];
  }
  if (task.anomalyType === 'material_reshoot_overdue') {
    return ['再次通知执行人', '更换执行人', '调整补拍截止', '本轮不再继续'];
  }
  return ['再次通知执行人', '释放额度并重新开放领取', '更换执行人', '本轮不再继续'];
}"""
code = re.sub(r'function getAnomalyOptions\(task: ExecutionTask\) \{[\s\S]*?\}\n', new_get_anomaly_options + '\n', code)

# 2. Clean up resolveAnomaly to remove '补录已发布链接' logic
new_resolve_anomaly = """  const resolveAnomaly = () => {
    const isPublishAnomaly = task.anomalyType === 'publish_overdue' || task.anomalyType === 'executor_account_unavailable';
    
    if (!isPublishAnomaly) {
      completeTask({ anomalyReason: `${resolution}${resolutionNote ? `：${resolutionNote}` : ''}`, isAnomaly: false, isBlocked: false }, '已确认异常处理方案');
      return;
    }
    const stopped = resolution === '本轮不再继续';
    const changedPublisher = resolution.includes('更换');
    const nextPublisher = changedPublisher ? replacementPublisher : task.targetAccount;
    const actionMessage = changedPublisher
      ? `已更换发布人：${nextPublisher}`
      : resolution === '再次通知发布人'
      ? `已再次通知发布人：${task.targetAccount}`
      : resolution;
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
      waitingParty: stopped ? '本轮已停止' : nextPublisher,
      publishStage: stopped ? task.publishStage : '待发布',
      currentOccurrence: stopped
        ? '操盘手已决定本轮不再继续发布。'
        : `${actionMessage}，任务已恢复到执行动态，等待手动发布与链接回传。`,
      timelineEvents: [
        ...task.timelineEvents,
        { id: `resolved-${Date.now()}`, time: '刚刚', actor: '操盘手', action: actionMessage }
      ]
    });
    showFeedback(stopped ? '本轮发布任务已停止' : `${actionMessage}，已恢复执行`);
  };"""

code = re.sub(r'  const resolveAnomaly = \(\) => \{[\s\S]*?showFeedback.*?\}\);\n  \};', new_resolve_anomaly, code)

# 3. Clean up renderAnomaly to remove the link input and use dynamic button text
new_render_anomaly = """  const renderAnomaly = () => {
    // Determine context string for quota if applicable
    let contextStr = '';
    if (task.quota) {
      contextStr = `当前占用额度：${task.quota.claimed}/${task.quota.total}。`;
    }
    
    // Filter options based on task format
    let finalOptions = getAnomalyOptions(task);
    if (task.taskFormat === '自有指定') {
      finalOptions = finalOptions.map(opt => opt === '释放额度并重新开放领取' || opt.includes('更换领取人') || opt.includes('更换发布人') ? '改派给其他员工' : opt);
      // Remove duplicates that might arise from the mapping
      finalOptions = [...new Set(finalOptions)];
    }

    // Dynamic button label
    const buttonLabel = resolution.includes('释放额度') ? '确认释放额度' : resolution.includes('改派') ? '确认改派' : '确认处理方案';

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
      {resolution.includes('更换') && (task.anomalyType === 'publish_overdue' || task.anomalyType === 'executor_account_unavailable') && (
        <label className="block space-y-1.5 rounded-xl border border-border-default bg-surface-1 p-3">
          <span className="text-[13px] font-medium text-text-secondary">选择新的发布人</span>
          <select value={replacementPublisher} onChange={event => setReplacementPublisher(event.target.value)} className="w-full rounded-lg border border-border-default bg-surface-1 px-3 py-2 text-[13px] outline-none focus:border-border-strong">
            <option value="备用KOC_小丸子">备用KOC_小丸子</option>
            <option value="静安店李店长">静安店李店长</option>
            <option value="操盘手代发">操盘手代发</option>
          </select>
        </label>
      )}
      <textarea value={resolutionNote} onChange={event => setResolutionNote(event.target.value)} rows={4} placeholder="补充处理说明（选填）" className="w-full rounded-xl border border-border-default bg-surface-1 px-3.5 py-3 text-[13px] outline-none" />
      <PrimaryAction
        label={buttonLabel}
        hint="操作会写入任务进程并触发后续自动化。"
        onClick={resolveAnomaly}
      />
    </div>
  );
  };"""

code = re.sub(r'  const renderAnomaly = \(\) => \([\s\S]*?  const renderProgress = \(\)', new_render_anomaly + '\n\n  const renderProgress = ()', code)


with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "w") as f:
    f.write(code)

print("Patched render anomaly")
