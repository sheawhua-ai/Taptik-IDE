import re
with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    code = f.read()

old_block = '''            <div className="workspace-sidebar-header border-b border-border-default space-y-3 w-[320px] shrink-0">
              <div className="flex justify-between items-center">
                <h2 className="text-[15px] font-semibold text-text-main">方案列表</h2>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setActiveWorkbench("create_project")}
                    className="w-7 h-7 rounded-lg bg-btn-main text-white flex items-center justify-center hover:bg-btn-main-hover transition-colors"
                    title="新建方案"
                  >
                    <Plus size={14} />
                  </button>
                  <button 
                    onClick={() => setIsSidebarOpen(false)} 
                    title="收起方案列表" 
                    className="w-7 h-7 rounded-lg hover:bg-hover-bg flex items-center justify-center text-text-secondary"
                  >
                    <PanelLeftClose size={16} />
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" size={14} />
                <input 
                  type="text" 
                  placeholder="搜索方案..." 
                  value={projectSearchQuery}
                  onChange={(e) => setProjectSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-surface-subtle border border-border-default rounded-lg text-[13px] outline-none focus:bg-surface-1 focus:border-border-strong transition-colors"
                />
              </div>
              <div className="flex gap-1.5 pt-1">'''

new_block = '''            <div className="workspace-sidebar-header border-b border-border-default w-[320px] shrink-0">
              <div className="flex items-center gap-2 p-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" size={14} />
                  <input 
                    type="text" 
                    placeholder="搜索方案..." 
                    value={projectSearchQuery}
                    onChange={(e) => setProjectSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-surface-subtle border border-border-default rounded-lg text-[13px] outline-none focus:bg-surface-1 focus:border-border-strong transition-colors"
                  />
                </div>
                <button 
                  onClick={() => setActiveWorkbench("create_project")}
                  className="w-7 h-7 shrink-0 rounded-lg bg-btn-main text-white flex items-center justify-center hover:bg-btn-main-hover transition-colors"
                  title="新建方案"
                >
                  <Plus size={14} />
                </button>
                <button 
                  onClick={() => setIsSidebarOpen(false)} 
                  title="收起侧边栏" 
                  className="w-7 h-7 shrink-0 rounded-lg hover:bg-hover-bg flex items-center justify-center text-text-secondary"
                >
                  <PanelLeftClose size={16} />
                </button>
              </div>
              
              <div className="flex gap-1.5 pb-3 px-3">'''

code = code.replace(old_block, new_block)

with open("src/components/merchant/ProjectCenter.tsx", "w") as f:
    f.write(code)
