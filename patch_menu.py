import re

with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    code = f.read()

start_marker = r'<div className="flex items-center gap-2">'
end_marker = r'</div>\s*</div>\s*</div>\s*\{\/\* Main View Area \*\/\}'

match = re.search(start_marker + r'.*?' + end_marker, code, re.DOTALL)

if match:
    old_block = match.group(0)
    new_block = """<div className="flex items-center gap-2">
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
                  <div className="absolute right-0 top-full mt-1.5 w-40 bg-surface-1 border border-border-default rounded-xl shadow-lg z-50 py-1.5 text-[13px]">
                    {(currentProject.status === "已结束" || currentProject.status === "已归档") ? (
                      <button 
                        className="w-full text-left px-3.5 py-2 hover:bg-surface-subtle flex items-center gap-2 text-text-main font-medium"
                        onClick={() => { setShowMoreMenu(false); /* Add restart logic here */ }}
                      >
                        <RefreshCw size={14} className="text-brand-600" />
                        <span className="text-brand-600">重启方案</span>
                      </button>
                    ) : (
                      <>
                        <button 
                          className="w-full text-left px-3.5 py-2 hover:bg-surface-subtle flex items-center gap-2 text-text-main font-medium"
                          onClick={() => {
                            setShowMoreMenu(false);
                            setFeedbackContentPackage(allNotes.find(note => note.isNotePackage) || null);
                            setShowProjectQuestionnaire(true);
                          }}
                        >
                          <FileText size={14} className="text-text-tertiary" />
                          <span>体验反馈问卷</span>
                        </button>
                        <button 
                          className="w-full text-left px-3.5 py-2 hover:bg-surface-subtle flex items-center gap-2 text-text-main font-medium"
                          onClick={() => { setShowMoreMenu(false); setShowOperationLogs(true); }}
                        >
                          <History size={14} className="text-text-tertiary" />
                          <span>操作记录</span>
                        </button>
                        <div className="my-1 border-t border-border-default" />
                        <button 
                          onClick={() => { setShowMoreMenu(false); /* Add end project logic */ }}
                          className="w-full text-left px-3.5 py-2 hover:bg-surface-subtle flex items-center gap-2 text-text-main font-medium"
                        >
                          <CheckCircle2 size={14} className="text-text-tertiary" />
                          <span>结束方案</span>
                        </button>
                      </>
                    )}
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
        </div>
      </div>

      {/* Main View Area */}"""
    code = code.replace(old_block, new_block)
    
    with open("src/components/merchant/ProjectCenter.tsx", "w") as f:
        f.write(code)
    print("Replaced successfully")
else:
    print("Match not found")
