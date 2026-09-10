const fs = require('fs');
let code = fs.readFileSync('src/components/merchant/ReviewCenter/ReviewTaskList.tsx', 'utf8');

const regex = /<div className="workspace-sidebar h-full w-full bg-surface-1 flex flex-col shrink-0 z-10 overflow-hidden font-sans">[\s\S]*?{([^}]*?) \/\* Task List \*\//;
const match = code.match(regex);
if (match) {
    const newBlock = `<div className="workspace-sidebar h-full w-full bg-surface-1 flex flex-col shrink-0 z-10 overflow-hidden font-sans">
      {/* Header & Actions */}
      <div className="workspace-sidebar-header border-b border-border-default space-y-3 shrink-0 p-3 pr-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" size={13} />
          <input
            type="text"
            placeholder="搜索复盘任务..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-surface-subtle border border-border-default rounded-lg text-[13px] outline-none focus:bg-surface-1 focus:border-border-strong transition-colors"
          />
        </div>
        {/* Filters */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex flex-wrap items-center gap-1.5 flex-1">
            {["全部", "分析中", "已完成"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={\`px-2 py-1 text-[13px] rounded-md font-medium transition-colors \${
                  statusFilter === st
                    ? "bg-btn-main text-white"
                    : "bg-surface-subtle text-text-secondary hover:bg-hover-bg border border-border-default"
                }\`}
              >
                {st}
              </button>
            ))}
            
            <div className="w-px h-4 bg-border-default mx-0.5"></div>
            
            {["全部范围", "单方案", "多方案"].map((sc) => {
              const active = (sc === "全部范围" && scopeFilter === "全部") || scopeFilter === sc;
              return (
                <button
                  key={sc}
                  onClick={() => setScopeFilter(sc === "全部范围" ? "全部" : sc)}
                  className={\`px-2 py-1 text-[13px] rounded-md font-medium transition-colors \${
                    active
                      ? "bg-surface-1 text-text-primary shadow-sm border border-border-default"
                      : "text-text-tertiary hover:text-text-main hover:bg-surface-subtle"
                  }\`}
                >
                  {sc}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-btn-main text-white text-[13px] font-medium hover:bg-btn-main-hover transition-colors shadow-2xs shrink-0 ml-2"
            title="新建复盘任务"
          >
            <Plus size={13} strokeWidth={2.5} />
            <span>新建复盘</span>
          </button>
        </div>
      </div>
      {/* Task List */`;
      
    code = code.replace(regex, newBlock);
    fs.writeFileSync('src/components/merchant/ReviewCenter/ReviewTaskList.tsx', code);
    console.log("Patched ReviewTaskList successfully!");
} else {
    console.log("Regex not found!");
}
