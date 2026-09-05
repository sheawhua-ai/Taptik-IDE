import re

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "r") as f:
    code = f.read()

new_queue_item = """                <button key={item.id} onClick={() => onSelectTask(item)} className={`w-full text-left px-4 py-3.5 transition-colors border-b border-border-subtle relative ${selected ? 'bg-surface-subtle' : 'bg-transparent hover:bg-hover-bg text-text-main'}`}>
                  {selected && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-logo" />}
                  <div className={`text-[13px] line-clamp-1 ${selected ? 'font-semibold text-text-main' : 'font-medium text-text-main'}`}>{item.noteTitle}</div>
                  
                  {/* METADATA LINE: Task Format, Assignee, Anomaly, Stalled Duration */}
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[12px] text-text-tertiary">
                      <span className="shrink-0 rounded bg-surface-subtle px-1.5 py-0.5 font-medium">{item.taskFormat || '未定形态'}</span>
                      <span className="truncate">
                        {item.taskFormat === '自有指定' ? `指派给：${item.assignee?.name || '未知员工'}` : (item.assignee?.name ? `领取人：${item.assignee.name}` : '待领取（未占坑）')}
                      </span>
                    </div>
                    {item.isAnomaly && (
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="flex items-center gap-1 font-medium text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                          <AlertTriangle size={10} />
                          {item.operatorActionSummary}
                        </span>
                        {item.stalledDurationText && <span className="text-text-tertiary shrink-0">{item.stalledDurationText}</span>}
                      </div>
                    )}
                  </div>
                </button>"""

code = re.sub(r'                <button key=\{item\.id\}.*?</button>', new_queue_item, code, flags=re.DOTALL)

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "w") as f:
    f.write(code)

print("Patched render queue in workbench")
