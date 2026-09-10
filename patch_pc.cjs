const fs = require('fs');
let code = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf8');

const regex = /<div className="workspace-sidebar-header border-b border-border-default space-y-3 w-\[320px\] shrink-0">([\s\S]*?)<div className="flex-1 overflow-y-auto">/;
const match = code.match(regex);
if (match) {
    const newHeader = `<div className="workspace-sidebar-header border-b border-border-default w-[320px] shrink-0">
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
                  onClick={() => setIsSidebarOpen(false)} 
                  title="收起侧边栏" 
                  className="w-7 h-7 shrink-0 rounded-lg hover:bg-hover-bg flex items-center justify-center text-text-secondary"
                >
                  <PanelLeftClose size={16} />
                </button>
              </div>
              
              <div className="flex items-center justify-between pb-3 px-3">
                <div className="flex gap-1.5">
                  {(["全部", "进行中", "已结束", "已归档"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setProjectFilterStatus(status)}
                      className={\`px-2.5 py-1 text-[13px] rounded-md font-medium transition-colors \${
                        projectFilterStatus === status 
                          ? "bg-btn-main text-white" 
                          : "bg-surface-subtle text-text-secondary hover:bg-hover-bg border border-border-default"
                      }\`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setActiveWorkbench("create_project")}
                  className="w-7 h-7 rounded-lg bg-btn-main text-white flex items-center justify-center hover:bg-btn-main-hover transition-colors shrink-0 shadow-2xs"
                  title="新建方案"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">`;
    code = code.replace(regex, newHeader);
    fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', code);
    console.log("Patched successfully!");
} else {
    console.log("Regex not found!");
}
