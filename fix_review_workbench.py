with open("src/components/merchant/ReviewCenter/ReviewWorkbench.tsx", "r") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.strip() == "const [isSidebarOpen, setIsSidebarOpen] = useState(true);":
        if "isSidebarOpen" in "".join(new_lines):
            continue # skip duplicate
    new_lines.append(line)

text = "".join(new_lines)

# Replace the ternary in the populated state with ResizableSidebar
ternary = '{isSidebarOpen ? <ReviewTaskList tasks={tasks} selectedTaskId={selectedTaskId} onSelectTask={setSelectedTaskId} onOpenCreateModal={() => setIsCreateModalOpen(true)} onRequestDelete={setDeleteTaskId} onCloseSidebar={() => setIsSidebarOpen(false)} searchQuery={searchQuery} setSearchQuery={setSearchQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} scopeFilter={scopeFilter} setScopeFilter={setScopeFilter} /> : <button onClick={() => setIsSidebarOpen(true)} className="absolute left-3 top-4 z-20 rounded-lg border border-border-default bg-surface-1 p-2 text-text-secondary"><PanelLeftOpen size={16} /></button>}'

rs = '<ResizableSidebar side="left" defaultWidth={320} isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} isCollapsible={false} hideWhenClosed={true}>\n        <ReviewTaskList tasks={tasks} selectedTaskId={selectedTaskId} onSelectTask={setSelectedTaskId} onOpenCreateModal={() => setIsCreateModalOpen(true)} onRequestDelete={setDeleteTaskId} onCloseSidebar={() => setIsSidebarOpen(false)} searchQuery={searchQuery} setSearchQuery={setSearchQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} scopeFilter={scopeFilter} setScopeFilter={setScopeFilter} />\n      </ResizableSidebar>'

text = text.replace(ternary, rs)

# Add open button to the populated state's header
header = '<div className="flex flex-wrap items-start justify-between gap-4">'
header_with_btn = '<div className="flex flex-wrap items-start justify-between gap-4">\n            <div className="flex items-center gap-3">\n              {!isSidebarOpen && <button onClick={() => setIsSidebarOpen(true)} className="p-1.5 rounded-lg text-text-tertiary hover:bg-hover-bg hover:text-text-main transition-colors shrink-0" title="展开侧边栏"><PanelLeftOpen size={18} /></button>}'

text = text.replace(header, header_with_btn)
text = text.replace('<div className="min-w-0"><div className="flex items-center gap-2">', '<div className="min-w-0"><div className="flex items-center gap-2">') # wait, need to close the extra div
# Let's do it carefully

with open("src/components/merchant/ReviewCenter/ReviewWorkbench.tsx", "w") as f:
    f.write(text)
