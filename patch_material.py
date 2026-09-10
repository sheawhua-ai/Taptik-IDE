import re
with open("src/components/merchant/ExecutionCenter/MaterialBatchReviewWorkbench.tsx", "r") as f:
    code = f.read()

code = code.replace(
    "import { formatChineseDate } from '../../../utils/formatDate';",
    "import { formatChineseDate } from '../../../utils/formatDate';\nimport { ResizableSidebar } from './ResizableSidebar';"
)

old_left = '''      <div className="flex min-h-0 flex-1">
        <aside className="workspace-sidebar w-[320px] shrink-0 overflow-hidden border-r border-border-default bg-surface-1 flex flex-col">
          <div className="workspace-sidebar-header space-y-3 border-b border-border-default">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-semibold text-text-main">素材任务</h2>
              <span className="text-[13px] text-text-tertiary">{visibleTasks.length} 项</span>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input value={taskQuery} onChange={(event) => setTaskQuery(event.target.value)} placeholder="搜索任务或账号..." className="w-full pl-8 pr-3 py-1.5 bg-surface-subtle border border-border-default rounded-lg text-[13px] outline-none focus:bg-surface-1 focus:border-border-strong transition-colors" />
            </div>
            <div className="grid grid-cols-3 rounded-lg bg-surface-subtle p-0.5" aria-label="素材任务状态筛选">
              {(['全部', '待执行', '待审核'] as TaskQueue[]).map(queue => (
                <button key={queue} type="button" onClick={() => setTaskQueue(queue)} className={`rounded-md px-2 py-1.5 text-[12px] font-medium ${taskQueue === queue ? 'bg-surface-1 text-text-main shadow-sm' : 'text-text-tertiary hover:text-text-main'}`}>
                  {queue}{queue === '待执行' ? ` ${queueCounts.pending}` : queue === '待审核' ? ` ${queueCounts.review}` : ''}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar w-[320px]">'''

new_left = '''      <div className="flex min-h-0 flex-1">
        <ResizableSidebar side="left" defaultWidth={320}>
          <div className="workspace-sidebar-header space-y-3 border-b border-border-default px-4 pt-4 pb-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-semibold text-text-main">素材任务</h2>
              <span className="text-[13px] text-text-tertiary mr-8">{visibleTasks.length} 项</span>
            </div>
            <div className="relative mt-2">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input value={taskQuery} onChange={(event) => setTaskQuery(event.target.value)} placeholder="搜索任务或账号..." className="w-full pl-8 pr-3 py-1.5 bg-surface-subtle border border-border-default rounded-lg text-[13px] outline-none focus:bg-surface-1 focus:border-border-strong transition-colors" />
            </div>
            <div className="grid grid-cols-3 rounded-lg bg-surface-subtle p-0.5" aria-label="素材任务状态筛选">
              {(['全部', '待执行', '待审核'] as TaskQueue[]).map(queue => (
                <button key={queue} type="button" onClick={() => setTaskQueue(queue)} className={`rounded-md px-2 py-1.5 text-[12px] font-medium ${taskQueue === queue ? 'bg-surface-1 text-text-main shadow-sm' : 'text-text-tertiary hover:text-text-main'}`}>
                  {queue}{queue === '待执行' ? ` ${queueCounts.pending}` : queue === '待审核' ? ` ${queueCounts.review}` : ''}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar w-full">'''

code = code.replace(old_left, new_left)

code = re.sub(
    r'          </div>\n        </aside>\n\n        <main className="workspace-stage flex-1 overflow-y-auto bg-canvas p-6">',
    r'          </div>\n        </ResizableSidebar>\n\n        <main className="workspace-stage flex-1 overflow-y-auto bg-canvas p-6">',
    code
)

with open("src/components/merchant/ExecutionCenter/MaterialBatchReviewWorkbench.tsx", "w") as f:
    f.write(code)
