import re

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "r") as f:
    code = f.read()

# Restore missing functions that I accidentally overwrote:
# showFeedback, completeTask, toggleMaterial, resolveAnomaly, materialItems (derived from task.materialSubItems)
# updateMaterialStatus

missing_methods = """
  const isComplete = task.status === '已完成';

  const showFeedback = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(''), 2400);
  };

  const completeTask = (updates: Partial<ExecutionTask>, message: string) => {
    const completedAction = ['edit_content', 'replace_material', 'create_material_task', 'view_material_task', 'review_material', 'handle_publish_error'].includes(mode)
      ? mode as ExecutionAction
      : task.actionType;
    onUpdateTask({
      ...task,
      ...updates,
      actionType: completedAction,
      status: '已完成',
      isMeWaiting: false,
      waitingRole: 'completed',
      waitingParty: '已完成',
      timelineEvents: [
        ...task.timelineEvents,
        { id: `finish-${Date.now()}`, time: '刚刚', actor: '操盘手', action: message }
      ]
    });
    if (onNextTask) {
      showFeedback(`${message}，准备进入下一个任务`);
      window.setTimeout(onNextTask, 600);
    } else {
      showFeedback(`${message}，全部处理完毕`);
    }
  };

  const toggleMaterial = (material: LibraryMaterialItem) => {
    setSelectedMaterials(previous => previous.some(item => item.id === material.id)
      ? previous.filter(item => item.id !== material.id)
      : [...previous, material]
    );
  };

  const [materialItems, setMaterialItems] = useState(task.materialSubItems || []);
  const updateMaterialStatus = (id: string, newStatus: MaterialSubItem['manualStatus'], reason?: string) => {
    setMaterialItems(prev => prev.map(item => item.id === id ? { ...item, manualStatus: newStatus, reshootReason: reason } : item));
  };
  
  const resolveAnomaly = () => {
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
  };

  const filteredQueue = queue.filter(item => {
    const query = queueQuery.trim().toLowerCase();
    return !query || [item.noteTitle, item.targetAccount, item.projectName]
      .filter(Boolean)
      .some(value => value!.toLowerCase().includes(query));
  }).sort((a, b) => {
    const score = (label: string | undefined) => {
      if (label === '已逾期') return 4;
      if (label === '今日到期') return 3;
      if (label === '即将到期') return 2;
      return 1;
    };
    return score(b.deadlineLabel) - score(a.deadlineLabel);
  });
  
  const isPublishWorkbench = mode === 'publish_confirm' || mode === 'handle_publish_error';
"""

code = re.sub(r'  useEffect\(\(\) => \{\n    setMode.*?\}\, \[task\, initialAction\]\)\;\n', '  useEffect(() => {\n    setMode(getWorkbenchMode(task, initialAction));\n    setResolution(getAnomalyOptions(task)[0]);\n    setResolutionNote(\'\');\n  }, [task, initialAction]);\n\n' + missing_methods, code, flags=re.DOTALL)

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "w") as f:
    f.write(code)

print("Restored missing methods")
