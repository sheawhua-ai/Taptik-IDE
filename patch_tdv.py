with open("src/components/merchant/ExecutionCenter/TaskDetailView.tsx", "r") as f:
    text = f.read()

# Add state
text = text.replace(
    "const [queueQuery, setQueueQuery] = useState('');",
    "const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);\n  const [queueQuery, setQueueQuery] = useState('');"
)

# Update ResizableSidebar
text = text.replace(
    '<ResizableSidebar side="left" defaultWidth={320} className="workspace-sidebar">',
    '<ResizableSidebar side="left" defaultWidth={320} className="workspace-sidebar" isOpen={isLeftSidebarOpen} onOpenChange={setIsLeftSidebarOpen} isCollapsible={false}>'
)

# Replace header
header_old = """          <div className="workspace-sidebar-header border-b border-border-subtle bg-surface py-3 pl-3 pr-12">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                value={queueQuery}
                onChange={(event) => setQueueQuery(event.target.value)}
                placeholder="搜索笔记或账号..."
                className="w-full pl-8 pr-3 py-1.5 bg-surface-subtle border border-border-default rounded-lg text-[13px] outline-none focus:bg-surface-1 focus:border-border-strong transition-colors"
              />
            </div>
          </div>"""

header_new = """          <div className="workspace-sidebar-header border-b border-border-subtle bg-surface p-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  value={queueQuery}
                  onChange={(event) => setQueueQuery(event.target.value)}
                  placeholder="搜索笔记或账号..."
                  className="w-full pl-8 pr-3 py-1.5 bg-surface-subtle border border-border-default rounded-lg text-[13px] outline-none focus:bg-surface-1 focus:border-border-strong transition-colors"
                />
              </div>
              <button onClick={() => setIsLeftSidebarOpen(false)} title="收起侧边栏" className="w-7 h-7 shrink-0 rounded-lg hover:bg-hover-bg flex items-center justify-center text-text-secondary"><PanelLeftClose size={16} /></button>
            </div>
          </div>"""

text = text.replace(header_old, header_new)

# Find main content wrapper to add open button
# <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">
#    <div className="mx-auto w-full max-w-4xl px-8 py-8">
# Let's add it to the top bar:
# <header className="workspace-header sticky top-0 z-20 flex shrink-0 items-center justify-between border-b border-border-default bg-surface/90 px-6 py-4 backdrop-blur-md">
#   <div className="flex min-w-0 items-center gap-4">

# Need to check imports for PanelLeftClose, PanelLeftOpen
if "PanelLeftClose" not in text:
    text = text.replace("Search,", "Search, PanelLeftClose, PanelLeftOpen,")
elif "PanelLeftOpen" not in text:
    text = text.replace("PanelLeftClose", "PanelLeftClose, PanelLeftOpen")

with open("src/components/merchant/ExecutionCenter/TaskDetailView.tsx", "w") as f:
    f.write(text)

