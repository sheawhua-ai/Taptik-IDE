import re

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "r") as f:
    code = f.read()

new_queue_item = """                <button key={item.id} onClick={() => onSelectTask(item)} className={`w-full text-left px-4 py-3.5 transition-colors border-b border-border-subtle relative ${selected ? 'bg-surface-subtle' : 'bg-transparent hover:bg-hover-bg text-text-main'}`}>
                  {selected && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-logo" />}
                  <div className={`text-[13px] line-clamp-1 ${selected ? 'font-semibold text-text-main' : 'font-medium text-text-main'}`}>{item.noteTitle}</div>
                  <div className="mt-1.5 flex items-center justify-between gap-2 text-[13px] text-text-tertiary tabular-nums">
                    <span className="truncate">{item.targetAccount}</span>
                    <span className={`shrink-0 flex items-center gap-1 ${item.deadlineLabel === '已逾期' ? 'text-red-600' : item.deadlineLabel === '今日到期' ? 'text-amber-600' : ''}`}>
                      {item.deadlineLabel === '已逾期' && <AlertTriangle size={12} />}
                      {item.deadlineLabel === '今日到期' && <Clock size={12} />}
                      {formatChineseDate(item.deadline, true) || item.deadline || '待排期'}
                    </span>
                  </div>
                </button>"""

code = re.sub(r'                <button key=\{item\.id\}.*?</button>', new_queue_item, code, flags=re.DOTALL)

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "w") as f:
    f.write(code)

print("Updated queue items")
