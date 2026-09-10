import re

with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    code = f.read()

old_tabs = """            <div className="flex gap-7 text-[13px] font-medium">
              {(["概览", "内容与素材"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 relative font-medium ${activeTab === tab ? "text-text-main" : "text-text-secondary hover:text-text-main"}`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="projectCenterTabIndicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-logo" />
                  )}
                </button>
              ))}
            </div>"""

new_tabs = """            <div className="flex gap-6">
              {(["概览", "内容与素材"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 relative text-[16px] font-semibold transition-colors ${activeTab === tab ? "text-text-primary" : "text-text-tertiary hover:text-text-secondary"}`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="projectCenterTabIndicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-900 rounded-t-sm" />
                  )}
                </button>
              ))}
            </div>"""

code = code.replace(old_tabs, new_tabs)

with open("src/components/merchant/ProjectCenter.tsx", "w") as f:
    f.write(code)
