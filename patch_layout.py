import re

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "r") as f:
    code = f.read()

# 1. Remove left list anomaly block
old_anomaly_block = """                    {item.isAnomaly && (
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-text-secondary">
                          {item.operatorActionSummary}
                        </span>
                        {item.stalledDurationText && <span className="text-text-tertiary shrink-0">{item.stalledDurationText}</span>}
                      </div>
                    )}"""
code = code.replace(old_anomaly_block, "")

# 2. Replace the top section when not in progress mode
old_section_regex = re.compile(r'            \) : \(\n              <section className="workspace-surface workspace-context rounded-xl border border-border-default bg-surface-1 px-4 py-3">[\s\S]*?              </section>\n            \)}')

new_section = """            ) : (
              <section className="workspace-surface workspace-context rounded-xl border border-border-default bg-surface-1 p-4 mb-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[16px] font-bold text-text-main truncate">{task.noteTitle}</h3>
                    <div className="mt-1 flex items-center gap-2 text-[13px] text-text-tertiary">
                      <span>所属项目：{task.projectName}</span>
                    </div>
                  </div>
                  <button className="shrink-0 rounded bg-brand-logo px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-brand-logo/90">查看笔记详情</button>
                </div>
                <div className="mt-4 rounded-lg bg-surface-subtle p-3">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                      <div className="text-[12px] text-text-tertiary">账号/领取人</div>
                      <div className="mt-1 text-[13px] font-medium text-text-main">{task.assignee?.name || task.targetAccount || '未知'}</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-text-tertiary">认领/分配时间</div>
                      <div className="mt-1 text-[13px] font-medium text-text-main">{task.assignee?.claimTime || task.assignee?.assignedTime || '未知'}</div>
                    </div>
                    {task.deadline && (
                      <div>
                        <div className="text-[12px] text-text-tertiary">最晚发布时间</div>
                        <div className="mt-1 text-[13px] font-medium text-text-main">{task.deadline}</div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}"""

code = old_section_regex.sub(new_section, code)


with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "w") as f:
    f.write(code)

print("Patched layout")
