with open("src/components/merchant/ReviewCenter/ReviewTaskList.tsx", "r") as f:
    text = f.read()

text = text.replace(
    'className="workspace-sidebar-header border-b border-border-default space-y-3 shrink-0 py-3 pl-3 pr-12"',
    'className="workspace-sidebar-header border-b border-border-default space-y-3 shrink-0 p-3"'
)

search_block = """        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" size={13} />
          <input
            type="text"
            placeholder="搜索复盘任务..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-surface-subtle border border-border-default rounded-lg text-[13px] outline-none focus:bg-surface-1 focus:border-border-strong transition-colors"
          />
        </div>"""

replacement_block = """        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" size={13} />
            <input
              type="text"
              placeholder="搜索复盘任务..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-surface-subtle border border-border-default rounded-lg text-[13px] outline-none focus:bg-surface-1 focus:border-border-strong transition-colors"
            />
          </div>
          <button 
            onClick={onCloseSidebar} 
            title="收起侧边栏" 
            className="w-7 h-7 shrink-0 rounded-lg hover:bg-hover-bg flex items-center justify-center text-text-secondary"
          >
            <PanelLeftClose size={16} />
          </button>
        </div>"""

text = text.replace(search_block, replacement_block)

with open("src/components/merchant/ReviewCenter/ReviewTaskList.tsx", "w") as f:
    f.write(text)
