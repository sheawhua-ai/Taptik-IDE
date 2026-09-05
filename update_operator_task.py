import re

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "r") as f:
    code = f.read()

# Replace renderPublish
new_render_publish = """  const renderPublish = () => (
    <div className="space-y-4 max-w-2xl">
      <div className="rounded-xl border border-border-default bg-surface-1 p-4 space-y-2 text-[13px]">
        <div className="flex justify-between"><span className="text-text-tertiary">发布账号</span><strong>{task.publisherName || task.targetAccount}</strong></div>
        <div className="flex justify-between"><span className="text-text-tertiary">发布方式</span><strong>{task.publishType || '账号手动发布'}</strong></div>
        <div className="flex justify-between"><span className="text-text-tertiary">发布计划</span><strong>{task.publishContent?.scheduleTime || task.deadline || '待确认'}</strong></div>
      </div>
      <PrimaryAction
        label="推送通知提醒执行"
        hint="系统将向发布账号发送执行通知提醒，任务继续处于执行中，等待其最终操作回传。"
        disabled={false}
        onClick={() => {
            onUpdateTask({
                ...task,
                timelineEvents: [
                    ...task.timelineEvents,
                    { id: `remind-${Date.now()}`, time: '刚刚', actor: '操盘手', action: `催促 ${task.publisherName || task.targetAccount} 尽快执行发布` }
                ]
            });
            showFeedback(`已向 ${task.publisherName || task.targetAccount} 推送提醒`);
        }}
      />
    </div>
  );"""

code = re.sub(r'  const renderPublish = \(\) => \([\s\S]*?\}\)\n      />\n    </div>\n  \);', new_render_publish, code)

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "w") as f:
    f.write(code)

print("Updated renderPublish")
