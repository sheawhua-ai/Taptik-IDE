import re
with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "r") as f:
    code = f.read()

code = code.replace(
    "import { formatChineseDate } from '../../../utils/formatDate';",
    "import { formatChineseDate } from '../../../utils/formatDate';\nimport { ResizableSidebar } from './ResizableSidebar';"
)

old_left = '''      <div className="flex min-h-0 flex-1">
        <aside className="workspace-sidebar hidden w-[320px] shrink-0 overflow-hidden border-r border-border-default bg-surface-1 lg:flex lg:flex-col">
          <div className="workspace-sidebar-header space-y-3 border-b border-border-default">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-semibold text-text-main">{mode === 'progress' ? '执行进展' : isMaterialFollowUp ? '待跟进素材任务' : '待处理发布任务'}</h2>
              <span className="text-[13px] text-text-tertiary">{filteredQueue.length} 项</span>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input value={queueQuery} onChange={(event) => setQueueQuery(event.target.value)} placeholder="搜索笔记或账号..." className="w-full pl-8 pr-3 py-1.5 bg-surface-subtle border border-border-default rounded-lg text-[13px] outline-none focus:bg-surface-1 focus:border-border-strong transition-colors" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar w-[320px]">'''

new_left = '''      <div className="flex min-h-0 flex-1">
        <ResizableSidebar side="left" defaultWidth={320} className="hidden lg:flex lg:flex-col">
          <div className="workspace-sidebar-header space-y-3 border-b border-border-default px-4 pt-4 pb-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-semibold text-text-main">{mode === 'progress' ? '执行进展' : isMaterialFollowUp ? '待跟进素材任务' : '待处理发布任务'}</h2>
              <span className="text-[13px] text-text-tertiary mr-8">{filteredQueue.length} 项</span>
            </div>
            <div className="relative mt-2">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input value={queueQuery} onChange={(event) => setQueueQuery(event.target.value)} placeholder="搜索笔记或账号..." className="w-full pl-8 pr-3 py-1.5 bg-surface-subtle border border-border-default rounded-lg text-[13px] outline-none focus:bg-surface-1 focus:border-border-strong transition-colors" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar w-full">'''

code = code.replace(old_left, new_left)

code = re.sub(
    r'          </div>\n        </aside>\n\n        <main className="workspace-stage flex flex-1 flex-col overflow-y-auto bg-canvas p-6">',
    r'          </div>\n        </ResizableSidebar>\n\n        <main className="workspace-stage flex flex-1 flex-col overflow-y-auto bg-canvas p-6">',
    code
)

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "w") as f:
    f.write(code)
