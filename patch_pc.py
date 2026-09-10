import re

with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    text = f.read()

# 1. Remove the early `if (!currentProject)` check
lines = text.split('\n')
start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if "if (!currentProject) {" in line:
        start_idx = i
        break

if start_idx != -1:
    # it spans 5 lines
    del lines[start_idx:start_idx+7]
    print(f"Removed if(!currentProject) at {start_idx}")

text = "\n".join(lines)

# 2. Inside the main flex-1 div, add the header and the `!currentProject` check
main_content_start = re.search(r'<div className="h-full flex-1 overflow-y-auto bg-page-bg">', text)
if main_content_start:
    insertion_idx = main_content_start.end()
    
    header_html = """
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-default bg-surface-1 shrink-0">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 rounded-lg text-text-tertiary hover:bg-hover-bg hover:text-text-main transition-colors"
                title="展开侧边栏"
              >
                <PanelLeftOpen size={18} />
              </button>
            )}
            {currentProject && <h2 className="text-[16px] font-semibold text-text-main">{currentProject.name}</h2>}
          </div>
          
          {currentProject && (
            <div className="flex items-center bg-surface-subtle p-1 rounded-lg border border-border-default">
              {(["概览", "内容与素材"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition-all ${
                    activeTab === tab
                      ? "bg-surface-1 text-text-main shadow-xs border border-border-default"
                      : "text-text-secondary hover:text-text-main"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </div>
        {!currentProject ? (
          <div className="h-full flex items-center justify-center text-text-tertiary text-[14px]">
            请选择左侧方案或新建方案
          </div>
        ) : (
          <div className="max-w-[1100px] mx-auto p-6 space-y-5">
"""
    
    # Replace `<div className="max-w-[1100px] mx-auto p-6 space-y-5">` with our header and conditional
    text = text.replace(
        '<div className="h-full flex-1 overflow-y-auto bg-page-bg">\n        <div className="max-w-[1100px] mx-auto p-6 space-y-5">',
        '<div className="h-full flex-1 overflow-y-auto bg-page-bg flex flex-col">\n' + header_html
    )

    # We must also close the `) : (` block. Where does `<div className="max-w-[1100px] mx-auto p-6 space-y-5">` close?
    # It closes right before `</div>` which is before `{/* Project Strategy Drawer */}`.
    # Let's find `{/* Project Strategy Drawer */}`
    drawer_start = text.find('{/* Project Strategy Drawer */}')
    if drawer_start != -1:
        # Find the </div> that closes the max-w div.
        # Looking backwards from drawer_start
        before_drawer = text[:drawer_start]
        # replace the last `</div>\n      </div>` with `</div>\n        )}\n      </div>`
        text = text[:drawer_start-20] + text[drawer_start-20:drawer_start].replace(
            '</div>\n      </div>',
            '</div>\n        )}\n      </div>'
        ) + text[drawer_start:]

with open("src/components/merchant/ProjectCenter.tsx", "w") as f:
    f.write(text)
