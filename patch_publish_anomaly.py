import re

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "r") as f:
    code = f.read()

# 1. Update getAnomalyOptions
new_getAnomalyOptions = """function getAnomalyOptions(task: ExecutionTask) {
  return [
    '人工确认已发布',
    '发送催办',
    '中止发布'
  ];
}"""
code = re.sub(r'function getAnomalyOptions\(task: ExecutionTask\) \{[\s\S]*?\}\n\n', new_getAnomalyOptions + '\n\n', code)


# 2. Update resolveAnomaly
new_resolveAnomaly = """  const resolveAnomaly = () => {
    if (resolution === '人工确认已发布') {
      onUpdateTask({
        ...task,
        status: '执行中',
        actionType: undefined,
        operatorCategory: 'progress',
        categoryLabel: '任务跟进',
        isAnomaly: false,
        anomalyReason: undefined,
        isBlocked: false,
        isMeWaiting: false,
        isTeamExecuting: true,
        publishStage: '已回传',
        currentOccurrence: '操盘手已人工确认发布成功。',
        returnedData: {
           ...task.returnedData,
           publishUrl: task.returnedData?.publishUrl || 'https://xhslink.com/manual-confirm'
        },
        timelineEvents: [
          ...task.timelineEvents,
          { id: `resolved-${Date.now()}`, time: '刚刚', actor: '操盘手', action: '人工确认已发布' }
        ]
      });
      showFeedback('已确认该任务发布成功');
      return;
    }

    const stopped = resolution === '中止发布';
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
        : `已发送催办，等待账号所有者操作。`,
      timelineEvents: [
        ...task.timelineEvents,
        { id: `resolved-${Date.now()}`, time: '刚刚', actor: '操盘手', action: actionMessage }
      ]
    });
    showFeedback(stopped ? '已中止发布并释放笔记名额' : `已发送催办提醒`);
  };"""
code = re.sub(r'  const resolveAnomaly = \(\) => \{[\s\S]*?showFeedback.*?\}\);\n  \};', new_resolveAnomaly, code)


# 3. Update renderAnomaly
new_renderAnomaly = """  const renderAnomaly = () => {
    const finalOptions = getAnomalyOptions(task);
    
    let buttonLabel = '确认操作';
    let hint = '';
    if (resolution === '人工确认已发布') {
      buttonLabel = '确认已发布';
      hint = '人工确认后将直接进入已回传状态并流转至下一步。';
    } else if (resolution === '发送催办') {
      buttonLabel = '确认发送催办';
      hint = '系统将通过已绑定的微信或企微向账号所有者下发催办指令。';
    } else if (resolution === '中止发布') {
      buttonLabel = '确认中止并释放';
      hint = '中止后，该用户已领取的任务将被回收，释放后供其他人再次领取。';
    }

    return (
    <div className="space-y-4 max-w-2xl">
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
        hint={hint}
        onClick={resolveAnomaly}
      />
    </div>
  );
  };"""
code = re.sub(r'  const renderAnomaly = \(\) => \{[\s\S]*?  const renderProgress = \(\)', new_renderAnomaly + '\n\n  const renderProgress = ()', code)


with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "w") as f:
    f.write(code)

print("Patched publish anomaly logic successfully")
