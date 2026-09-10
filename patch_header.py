import re

with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    code = f.read()

# Using regex to find the block from {/* Header Bar */} to </div> end of tabs

start_marker = r'\{\/\* Header Bar \*\/\}\s*<div className="workspace-header'
end_marker = r'<span>更新时间：\{lastUpdatedText\}</span>\s*</div>\s*</div>'

match = re.search(start_marker + r'.*?' + end_marker, code, re.DOTALL)

if match:
    old_block = match.group(0)
    new_block = """{/* Workspace Header & Tabs */}
        <div className="px-6 bg-surface-1 border-b border-border-default flex items-center justify-between shrink-0">
          <div className="flex items-center gap-7">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                title="展开方案列表"
                className="w-7 h-7 flex items-center justify-center border border-border-default rounded-lg text-text-secondary hover:text-text-main hover:bg-surface-subtle transition-colors -ml-2"
              >
                <PanelLeftOpen size={15} />
              </button>
            )}
            
            <div className="flex gap-7 text-[13px] font-medium">
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
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              className="px-3 py-1.5 rounded-lg border border-border-default bg-surface-1 hover:bg-surface-subtle flex items-center gap-1.5 text-[12px] text-text-secondary hover:text-text-main transition-colors"
              onClick={() => {
                setFeedbackContentPackage(allNotes.find(note => note.isNotePackage) || null);
                setShowProjectQuestionnaire(true);
              }}
            >
              <FileText size={13} />
              <span>体验反馈问卷</span>
            </button>

            <button 
              className="px-3 py-1.5 rounded-lg border border-border-default bg-surface-1 hover:bg-surface-subtle flex items-center gap-1.5 text-[12px] text-text-secondary hover:text-text-main transition-colors"
              onClick={() => setShowLandingPage(true)}
            >
              <QrCode size={13} />
              <span>落地页设置</span>
            </button>

            {/* Actions in More Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                title="更多操作"
                className="w-8 h-8 border border-border-default text-text-secondary hover:text-text-main rounded-lg hover:bg-surface-subtle transition-colors flex items-center justify-center bg-surface-1"
              >
                <MoreHorizontal size={15} />
              </button>
              {showMoreMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
                  <div className="absolute right-0 top-full mt-1.5 w-36 bg-surface-1 border border-border-default rounded-xl shadow-lg z-50 py-1.5 text-[13px]">
                    <button 
                      className="w-full text-left px-3.5 py-2 hover:bg-surface-subtle flex items-center gap-2 text-text-main font-medium"
                      onClick={() => { setShowMoreMenu(false); setShowOperationLogs(true); }}
                    >
                      <History size={14} className="text-text-tertiary" />
                      <span>操作记录</span>
                    </button>
                    <div className="my-1 border-t border-border-default" />
                    <button 
                      onClick={() => { setShowMoreMenu(false); setShowArchiveConfirm(true); }}
                      className="w-full text-left px-3.5 py-2 hover:bg-danger-light text-danger flex items-center gap-2 font-medium"
                    >
                      <Trash2 size={14} />
                      <span>归档项目</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>"""
    
    code = code.replace(old_block, new_block)
    
    with open("src/components/merchant/ProjectCenter.tsx", "w") as f:
        f.write(code)
    print("Replaced successfully")
else:
    print("Match not found")

