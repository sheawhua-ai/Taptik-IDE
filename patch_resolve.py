import re

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "r") as f:
    code = f.read()


new_resolve = """  const resolveAnomaly = () => {
    const isPublishAnomaly = task.anomalyType === 'publish_overdue' || task.anomalyType === 'executor_account_unavailable';
    
    if (!isPublishAnomaly) {
      completeTask({ anomalyReason: `${resolution}${resolutionNote ? `：${resolutionNote}` : ''}`, isAnomaly: false, isBlocked: false }, '已确认异常处理方案');
      return;
    }
    
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

code = re.sub(r'  const resolveAnomaly = \(\) => \{[\s\S]*?    showFeedback.*?;\n  \};', new_resolve, code)

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "w") as f:
    f.write(code)

print("Patched resolveAnomaly")
